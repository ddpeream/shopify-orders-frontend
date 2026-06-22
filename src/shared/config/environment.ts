export interface FrontendEnvironment {
  apiBaseUrl: string
  pollingIntervalMs: number
  requestTimeoutMs: number
}

interface EnvironmentSource {
  VITE_API_BASE_URL?: string
  VITE_POLLING_INTERVAL_MS?: string
  VITE_REQUEST_TIMEOUT_MS?: string
}

function parsePositiveInteger(value: string | undefined, fallback: number, name: string): number {
  if (value === undefined || value.trim() === '') return fallback
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer`)
  }
  return parsed
}

function parseApiBaseUrl(value: string | undefined): string {
  const candidate = value?.trim() || 'http://localhost:3000/api'
  let url: URL
  try {
    url = new URL(candidate)
  } catch {
    throw new Error('VITE_API_BASE_URL must be a valid absolute URL')
  }
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('VITE_API_BASE_URL must use HTTP or HTTPS')
  }
  return candidate.replace(/\/+$/, '')
}

export function createEnvironment(source: EnvironmentSource): FrontendEnvironment {
  return Object.freeze({
    apiBaseUrl: parseApiBaseUrl(source.VITE_API_BASE_URL),
    pollingIntervalMs: parsePositiveInteger(
      source.VITE_POLLING_INTERVAL_MS,
      5000,
      'VITE_POLLING_INTERVAL_MS',
    ),
    requestTimeoutMs: parsePositiveInteger(
      source.VITE_REQUEST_TIMEOUT_MS,
      10000,
      'VITE_REQUEST_TIMEOUT_MS',
    ),
  })
}

export const environment = createEnvironment(import.meta.env)
