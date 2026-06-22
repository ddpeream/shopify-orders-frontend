export interface ApiErrorResponse {
  statusCode: number
  code: string
  message: string
  details?: unknown
  path: string
  timestamp: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

export type SortDirection = 'ASC' | 'DESC'
