import { isApiError } from './api-error'

export function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (isApiError(error)) {
    const status = error.status

    if (status === 0) {
      return 'No fue posible conectar con el servidor. Revisa tu conexión e intenta nuevamente.'
    }

    if (status === 404) {
      return 'El recurso solicitado no existe o ya no está disponible.'
    }

    if (typeof status === 'number' && status >= 500) {
      return 'El servidor presentó un problema. Intenta nuevamente en unos segundos.'
    }

    if (typeof status === 'number' && status >= 400) {
      return error.message || 'La solicitud no pudo ser procesada.'
    }

    return error.message || fallbackMessage
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return 'La solicitud fue cancelada.'
  }

  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return 'La solicitud fue cancelada.'
    }

    if (error.name === 'TimeoutError') {
      return 'La solicitud tardó demasiado tiempo. Intenta nuevamente.'
    }

    return error.message || fallbackMessage
  }

  return fallbackMessage
}

export function isIntentionalCancel(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') return true

  if (error instanceof Error && error.name === 'AbortError') return true

  return false
}
