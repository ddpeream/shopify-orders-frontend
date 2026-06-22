const DEFAULT_LOCALE = 'es-CO'

function isValidNumber(value: number | null | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function formatInteger(value: number | null | undefined): string {
  if (!isValidNumber(value)) return '0'

  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercentage(value: number | null | undefined): string {
  if (!isValidNumber(value)) return '0 %'

  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    maximumFractionDigits: 1,
  }).format(value / 100)
}
