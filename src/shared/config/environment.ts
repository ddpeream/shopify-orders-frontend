function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value ?? fallback)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

export const environment = Object.freeze({
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api').replace(
    /\/+$/,
    '',
  ),
  pollingIntervalMs: positiveInteger(import.meta.env.VITE_POLLING_INTERVAL_MS, 5000),
  requestTimeoutMs: positiveInteger(import.meta.env.VITE_REQUEST_TIMEOUT_MS, 10000),
})
