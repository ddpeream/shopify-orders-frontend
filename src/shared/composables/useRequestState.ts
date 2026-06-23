import { computed, ref } from 'vue'

import { getApiErrorMessage, isIntentionalCancel } from '@/shared/api/api-error-message'

interface RequestStateOptions {
  fallbackErrorMessage: string
}

export function useRequestState(options: RequestStateOptions) {
  const isLoading = ref(false)
  const isRefreshing = ref(false)
  const error = ref<string | null>(null)
  const lastUpdatedAt = ref<string | null>(null)

  let activeController: AbortController | null = null
  let requestSequence = 0

  const hasError = computed(() => error.value !== null)

  function createRequestController(): {
    controller: AbortController
    requestId: number
  } {
    activeController?.abort()

    const controller = new AbortController()
    activeController = controller

    const requestId = requestSequence + 1
    requestSequence = requestId

    error.value = null

    return {
      controller,
      requestId,
    }
  }

  function isCurrentRequest(controller: AbortController, requestId: number): boolean {
    return activeController === controller && requestSequence === requestId
  }

  function startLoading(silent: boolean): void {
    if (silent) {
      isRefreshing.value = true
    } else {
      isLoading.value = true
    }
  }

  function finishLoading(controller: AbortController, requestId: number): void {
    if (activeController === controller) {
      activeController = null
    }

    if (requestSequence === requestId) {
      isLoading.value = false
      isRefreshing.value = false
    }
  }

  function setRequestError(errorValue: unknown): void {
    if (isIntentionalCancel(errorValue)) return

    error.value = getApiErrorMessage(errorValue, options.fallbackErrorMessage)
  }

  function markUpdated(): void {
    lastUpdatedAt.value = new Date().toISOString()
  }

  function cancelActiveRequest(): void {
    activeController?.abort()
    activeController = null
    isLoading.value = false
    isRefreshing.value = false
  }

  function clearError(): void {
    error.value = null
  }

  function resetRequestState(): void {
    cancelActiveRequest()
    error.value = null
    lastUpdatedAt.value = null
  }

  return {
    isLoading,
    isRefreshing,
    error,
    lastUpdatedAt,
    hasError,
    createRequestController,
    isCurrentRequest,
    startLoading,
    finishLoading,
    setRequestError,
    markUpdated,
    cancelActiveRequest,
    clearError,
    resetRequestState,
  }
}
