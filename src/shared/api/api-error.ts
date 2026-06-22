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
  status?: number
  statusText?: string
  path?: string
  cause?: unknown
}

export class ApiError extends Error {
  public readonly type: ApiErrorType
  public readonly status?: number
  public readonly statusText?: string
  public readonly path?: string
  public readonly cause?: unknown

  constructor(details: ApiErrorDetails) {
    super(details.message)

    this.name = 'ApiError'
    this.type = details.type
    this.status = details.status
    this.statusText = details.statusText
    this.path = details.path
    this.cause = details.cause
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
