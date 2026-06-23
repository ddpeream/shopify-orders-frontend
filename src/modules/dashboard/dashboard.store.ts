import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { isApiError } from '@/shared/api/api-error'

import { getDashboardSummary } from './dashboard.service'

import type { DashboardSummary } from './dashboard.types'

function getErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message

  if (error instanceof Error) return error.message

  return 'No fue posible cargar el resumen del dashboard.'
}

export const useDashboardStore = defineStore('dashboard', () => {
  const summary = ref<DashboardSummary | null>(null)
  const isLoading = ref(false)
  const isRefreshing = ref(false)
  const error = ref<string | null>(null)
  const lastUpdatedAt = ref<string | null>(null)

  let activeController: AbortController | null = null

  const hasSummary = computed(() => summary.value !== null)
  const hasError = computed(() => error.value !== null)

  async function loadSummary(options: { silent?: boolean } = {}): Promise<void> {
    if (isLoading.value || isRefreshing.value) return

    const isSilentRefresh = options.silent === true && summary.value !== null

    activeController?.abort()

    const controller = new AbortController()
    activeController = controller

    if (isSilentRefresh) {
      isRefreshing.value = true
    } else {
      isLoading.value = true
    }

    error.value = null

    try {
      const response = await getDashboardSummary({
        signal: controller.signal,
      })

      summary.value = response
      lastUpdatedAt.value = new Date().toISOString()
    } catch (requestError) {
      if (controller.signal.aborted) return

      error.value = getErrorMessage(requestError)

      if (!summary.value) {
        lastUpdatedAt.value = null
      }
    } finally {
      if (activeController === controller) {
        activeController = null
      }

      isLoading.value = false
      isRefreshing.value = false
    }
  }

  async function refreshSummary(): Promise<void> {
    await loadSummary({ silent: true })
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

  return {
    summary,
    isLoading,
    isRefreshing,
    error,
    lastUpdatedAt,
    hasSummary,
    hasError,
    loadSummary,
    refreshSummary,
    cancelActiveRequest,
    clearError,
  }
})
