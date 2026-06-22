import { environment } from '@/shared/config/environment'

import { ApiError } from './api-error'
import { buildQueryString, type QueryParams } from './query-params'

export type ResponseValidator<T> = (value: unknown) => value is T

export interface ApiClientRequestOptions<T> {
  path: string
  query?: QueryParams | undefined
  signal?: AbortSignal | undefined
  validate: ResponseValidator<T>
}

interface FetchOptions {
  signal: AbortSignal
  headers: HeadersInit
}

function joinUrl(baseUrl: string, path: string): string {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${normalizedBaseUrl}${normalizedPath}`
}

function createTimeoutSignal(timeoutMs: number): {
  controller: AbortController
  timeoutId: ReturnType<typeof setTimeout>
} {
  const controller = new AbortController()

  const timeoutId = setTimeout(() => {
    controller.abort(new DOMException('Request timeout', 'TimeoutError'))
  }, timeoutMs)

  return { controller, timeoutId }
}

function bindExternalSignal(
  externalSignal: AbortSignal | undefined,
  internalController: AbortController,
): void {
  if (!externalSignal) {
    return
  }

  if (externalSignal.aborted) {
    internalController.abort(externalSignal.reason)
    return
  }

  externalSignal.addEventListener(
    'abort',
    () => {
      internalController.abort(externalSignal.reason)
    },
    { once: true },
  )
}

async function parseJsonSafely(response: Response, path: string): Promise<unknown> {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch (error) {
    throw new ApiError({
      type: 'invalid-json',
      message: 'La API respondió con un JSON inválido.',
      status: response.status,
      statusText: response.statusText,
      path,
      cause: error,
    })
  }
}

async function parseHttpError(response: Response, path: string): Promise<ApiError> {
  let responseBody: unknown = null

  try {
    responseBody = await parseJsonSafely(response, path)
  } catch {
    responseBody = null
  }

  const bodyAsRecord =
    typeof responseBody === 'object' && responseBody !== null
      ? (responseBody as Record<string, unknown>)
      : null

  const message =
    bodyAsRecord && typeof bodyAsRecord.message === 'string'
      ? bodyAsRecord.message
      : `La API respondió con error HTTP ${response.status}.`

  const code = bodyAsRecord && typeof bodyAsRecord.code === 'string' ? bodyAsRecord.code : undefined

  const details = bodyAsRecord && 'details' in bodyAsRecord ? bodyAsRecord.details : undefined

  return new ApiError({
    type: 'http',
    message,
    status: response.status,
    statusText: response.statusText,
    path,
    code,
    details,
  })
}

function createFetchOptions(signal: AbortSignal): FetchOptions {
  return {
    signal,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }
}

function mapFetchError(error: unknown, path: string): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof DOMException && error.name === 'TimeoutError') {
    return new ApiError({
      type: 'timeout',
      message: 'La solicitud tardó demasiado tiempo.',
      path,
      cause: error,
    })
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return new ApiError({
      type: 'aborted',
      message: 'La solicitud fue cancelada.',
      path,
      cause: error,
    })
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'AbortError'
  ) {
    return new ApiError({
      type: 'aborted',
      message: 'La solicitud fue cancelada.',
      path,
      cause: error,
    })
  }

  if (error instanceof TypeError) {
    return new ApiError({
      type: 'network',
      message: 'No fue posible conectarse con la API.',
      path,
      cause: error,
    })
  }

  return new ApiError({
    type: 'unknown',
    message: 'Ocurrió un error inesperado al consumir la API.',
    path,
    cause: error,
  })
}

export class ApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly timeoutMs: number,
  ) {}

  async get<T>(options: ApiClientRequestOptions<T>): Promise<T> {
    const { path, query, signal, validate } = options

    const { controller, timeoutId } = createTimeoutSignal(this.timeoutMs)
    bindExternalSignal(signal, controller)

    const queryString = buildQueryString(query)
    const url = `${joinUrl(this.baseUrl, path)}${queryString}`

    try {
      const response = await fetch(url, createFetchOptions(controller.signal))

      if (!response.ok) {
        throw await parseHttpError(response, path)
      }

      const json = await parseJsonSafely(response, path)

      if (!validate(json)) {
        throw new ApiError({
          type: 'invalid-contract',
          message: 'La respuesta de la API no coincide con el contrato esperado.',
          status: response.status,
          statusText: response.statusText,
          path,
        })
      }

      return json
    } catch (error) {
      throw mapFetchError(error, path)
    } finally {
      clearTimeout(timeoutId)
    }
  }
}

export const apiClient = new ApiClient(environment.apiBaseUrl, environment.requestTimeoutMs)
