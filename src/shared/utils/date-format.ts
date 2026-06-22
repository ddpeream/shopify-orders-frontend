const DEFAULT_LOCALE = 'es-CO'

function isValidDate(value: Date): boolean {
  return !Number.isNaN(value.getTime())
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null

  const date = new Date(value)

  if (!isValidDate(date)) return null

  return date
}

export function formatDateTime(value: string | null | undefined): string {
  const date = parseDate(value)

  if (!date) return 'Sin fecha'

  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatDate(value: string | null | undefined): string {
  const date = parseDate(value)

  if (!date) return 'Sin fecha'

  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date)
}
