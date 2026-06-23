import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { isApiError } from '@/shared/api/api-error'
import { getApiErrorMessage } from '@/shared/api/api-error-message'

import { getOrderDetail, getOrderMaterials } from './orders.service'

import type { OrderDetail, OrderMaterialsResponse } from './order.types'

function isNotFoundError(error: unknown): boolean {
  return isApiError(error) && error.status === 404
}

export const useOrderDetailStore = defineStore('order-detail', () => {
  const order = ref<OrderDetail | null>(null)
  const materials = ref<OrderMaterialsResponse | null>(null)

  const isLoading = ref(false)
  const isRefreshing = ref(false)

  const detailError = ref<string | null>(null)
  const materialsError = ref<string | null>(null)

  const notFound = ref(false)
  const lastUpdatedAt = ref<string | null>(null)

  let activeController: AbortController | null = null
  let requestSequence = 0

  const hasOrder = computed(() => order.value !== null)
  const hasMaterials = computed(() => materials.value !== null)
  const hasError = computed(() => detailError.value !== null || materialsError.value !== null)

  async function fetchOrderDetail(id: string, options: { silent?: boolean } = {}): Promise<void> {
    if (!id.trim()) {
      detailError.value = 'No se recibió un identificador válido para la orden.'
      return
    }

    const currentRequest = requestSequence + 1
    requestSequence = currentRequest

    const isSilentRefresh = options.silent === true && order.value !== null

    activeController?.abort()

    const controller = new AbortController()
    activeController = controller

    if (isSilentRefresh) {
      isRefreshing.value = true
    } else {
      isLoading.value = true
    }

    detailError.value = null
    materialsError.value = null
    notFound.value = false

    try {
      const [orderResponse, materialsResponse] = await Promise.allSettled([
        getOrderDetail(id, { signal: controller.signal }),
        getOrderMaterials(id, { signal: controller.signal }),
      ])

      if (controller.signal.aborted) return
      if (currentRequest !== requestSequence) return

      if (orderResponse.status === 'fulfilled') {
        order.value = orderResponse.value
      } else {
        if (isNotFoundError(orderResponse.reason)) {
          notFound.value = true
          order.value = null
          materials.value = null
        }

        detailError.value = getApiErrorMessage(
          orderResponse.reason,
          'No fue posible cargar el detalle de la orden.',
        )
      }

      if (materialsResponse.status === 'fulfilled') {
        materials.value = materialsResponse.value
      } else {
        materials.value = null
        materialsError.value = getApiErrorMessage(
          materialsResponse.reason,
          'No fue posible cargar los materiales de la orden.',
        )
      }

      if (orderResponse.status === 'fulfilled') {
        lastUpdatedAt.value = new Date().toISOString()
      }
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

  async function refreshOrderDetail(id: string): Promise<void> {
    await fetchOrderDetail(id, { silent: true })
  }

  function cancelActiveRequest(): void {
    activeController?.abort()
    activeController = null
    isLoading.value = false
    isRefreshing.value = false
  }

  function resetState(): void {
    cancelActiveRequest()
    order.value = null
    materials.value = null
    detailError.value = null
    materialsError.value = null
    notFound.value = false
    lastUpdatedAt.value = null
  }

  return {
    order,
    materials,
    isLoading,
    isRefreshing,
    detailError,
    materialsError,
    notFound,
    lastUpdatedAt,
    hasOrder,
    hasMaterials,
    hasError,
    fetchOrderDetail,
    refreshOrderDetail,
    cancelActiveRequest,
    resetState,
  }
})
