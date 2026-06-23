import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { isApiError } from '@/shared/api/api-error'
import type { PaginatedResponse } from '@/shared/types/api.types'

import { listOrders } from './orders.service'

import type { OrderListFilters, OrderListItem } from './order.types'

function getErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message

  if (error instanceof Error) return error.message

  return 'No fue posible cargar el listado de órdenes.'
}

export function createDefaultOrderFilters(): Partial<OrderListFilters> {
  return {
    page: 1,
    limit: 20,
    sortBy: 'receivedAt',
    sortDirection: 'DESC',
  }
}

export const useOrdersStore = defineStore('orders', () => {
  const response = ref<PaginatedResponse<OrderListItem> | null>(null)
  const filters = ref<Partial<OrderListFilters>>(createDefaultOrderFilters())
  const isLoading = ref(false)
  const isRefreshing = ref(false)
  const error = ref<string | null>(null)
  const lastUpdatedAt = ref<string | null>(null)

  let activeController: AbortController | null = null
  let requestSequence = 0

  const orders = computed(() => response.value?.data ?? [])
  const pagination = computed(() => response.value?.pagination ?? null)
  const hasOrders = computed(() => orders.value.length > 0)
  const hasError = computed(() => error.value !== null)

  async function fetchOrders(
    nextFilters?: Partial<OrderListFilters>,
    options: { silent?: boolean } = {},
  ): Promise<void> {
    const mergedFilters = {
      ...filters.value,
      ...nextFilters,
    }

    filters.value = mergedFilters

    const currentRequest = requestSequence + 1
    requestSequence = currentRequest

    const isSilentRefresh = options.silent === true && response.value !== null

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
      const result = await listOrders(mergedFilters, {
        signal: controller.signal,
      })

      if (currentRequest !== requestSequence) return

      response.value = result
      lastUpdatedAt.value = new Date().toISOString()
    } catch (requestError) {
      if (controller.signal.aborted) return

      if (currentRequest !== requestSequence) return

      error.value = getErrorMessage(requestError)
    } finally {
      if (activeController === controller) {
        activeController = null
      }

      if (currentRequest === requestSequence) {
        isLoading.value = false
        isRefreshing.value = false
      }
    }
  }

  async function refreshOrders(): Promise<void> {
    await fetchOrders(filters.value, { silent: true })
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

  function resetState(): void {
    cancelActiveRequest()
    response.value = null
    filters.value = createDefaultOrderFilters()
    error.value = null
    lastUpdatedAt.value = null
  }

  return {
    response,
    filters,
    orders,
    pagination,
    isLoading,
    isRefreshing,
    error,
    lastUpdatedAt,
    hasOrders,
    hasError,
    fetchOrders,
    refreshOrders,
    cancelActiveRequest,
    clearError,
    resetState,
  }
})
