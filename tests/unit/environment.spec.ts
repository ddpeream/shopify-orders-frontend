import { describe, expect, it } from 'vitest'
import { createEnvironment } from '@/shared/config/environment'

describe('createEnvironment', () => {
  it('normalizes valid values', () => {
    expect(
      createEnvironment({
        VITE_API_BASE_URL: 'https://api.example.com/api/',
        VITE_POLLING_INTERVAL_MS: '2500',
        VITE_REQUEST_TIMEOUT_MS: '8000',
      }),
    ).toEqual({
      apiBaseUrl: 'https://api.example.com/api',
      pollingIntervalMs: 2500,
      requestTimeoutMs: 8000,
    })
  })

  it('uses local defaults when optional values are absent', () => {
    expect(createEnvironment({})).toEqual({
      apiBaseUrl: 'http://localhost:3000/api',
      pollingIntervalMs: 5000,
      requestTimeoutMs: 10000,
    })
  })

  it.each([
    [{ VITE_API_BASE_URL: 'not-a-url' }, 'valid absolute URL'],
    [{ VITE_API_BASE_URL: 'ftp://example.com/api' }, 'HTTP or HTTPS'],
    [{ VITE_POLLING_INTERVAL_MS: '0' }, 'VITE_POLLING_INTERVAL_MS'],
    [{ VITE_REQUEST_TIMEOUT_MS: '1.5' }, 'VITE_REQUEST_TIMEOUT_MS'],
  ])('rejects invalid configuration %#', (source, message) => {
    expect(() => createEnvironment(source)).toThrow(message)
  })
})
