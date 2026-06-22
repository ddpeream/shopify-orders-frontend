export type QueryParamValue = string | number | boolean | Date | null | undefined

export type QueryParams = Record<string, QueryParamValue>

function serializeQueryParam(value: Exclude<QueryParamValue, null | undefined>): string {
  if (value instanceof Date) {
    return value.toISOString()
  }

  return String(value)
}

export function buildQueryString(params?: QueryParams): string {
  if (!params) {
    return ''
  }

  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      continue
    }

    searchParams.set(key, serializeQueryParam(value))
  }

  const queryString = searchParams.toString()

  return queryString ? `?${queryString}` : ''
}
