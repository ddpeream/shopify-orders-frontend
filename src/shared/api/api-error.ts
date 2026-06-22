export type ApiErrorType =
  | 'http'
  | 'network'
  | 'timeout'
  | 'aborted'
  | 'invalid-json'
  | 'invalid-contract'
  | 'unknown'

export interface ApiErrorDetails {
  type: ApiErrorType
  message: string
  status?: number | undefined
  statusText?: string | undefined
  path?: string | undefined
  code?: string | undefined
  details?: unknown
  cause?: unknown
}

export class ApiError extends Error {
  public readonly type: ApiErrorType
  public readonly status?: number | undefined
  public readonly statusText?: string | undefined
  public readonly path?: string | undefined
  public readonly code?: string | undefined
  public readonly details?: unknown
  public readonly cause?: unknown

  constructor(details: ApiErrorDetails) {
    super(details.message)

    this.name = 'ApiError'
    this.type = details.type

    if (details.status !== undefined) {
      this.status = details.status
    }

    if (details.statusText !== undefined) {
      this.statusText = details.statusText
    }

    if (details.path !== undefined) {
      this.path = details.path
    }

    if (details.code !== undefined) {
      this.code = details.code
    }

    if (details.details !== undefined) {
      this.details = details.details
    }

    if (details.cause !== undefined) {
      this.cause = details.cause
    }
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
