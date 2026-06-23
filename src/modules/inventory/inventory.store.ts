import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { isApiError } from '@/shared/api/api-error'

import { listInventory, listLowStockInventory } from './inventory.service'

import type { InventoryItem } from './inventory.types'

function getErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message

  if (error instanceof Error) return error.message

  return 'No fue posible cargar el inventario.'
}

function sortItemsByRisk(items: InventoryItem[]): InventoryItem[] {
  return [...items].sort((first, second) => {
    if (first.lowStock !== second.lowStock) {
      return first.lowStock ? -1 : 1
    }

    return first.code.localeCompare(second.code)
  })
}

export const useInventoryStore = defineStore('inventory', () => {
  const allMaterials = ref<InventoryItem[]>([])
  const lowStockMaterials = ref<InventoryItem[]>([])

  const showOnlyLowStock = ref(false)
  const isLoading = ref(false)
  const isRefreshing = ref(false)
  const error = ref<string | null>(null)
  const lastUpdatedAt = ref<string | null>(null)

  let activeController: AbortController | null = null
  let requestSequence = 0

  const visibleMaterials = computed(() => {
    const source = showOnlyLowStock.value ? lowStockMaterials.value : allMaterials.value

    return sortItemsByRisk(source)
  })

  const hasMaterials = computed(() => visibleMaterials.value.length > 0)
  const hasLowStock = computed(() => lowStockMaterials.value.length > 0)
  const hasError = computed(() => error.value !== null)

  async function fetchInventory(options: { silent?: boolean } = {}): Promise<void> {
    if (isLoading.value || isRefreshing.value) return

    const currentRequest = requestSequence + 1
    requestSequence = currentRequest

    const isSilentRefresh = options.silent === true && allMaterials.value.length > 0

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
      const [inventoryResponse, lowStockResponse] = await Promise.all([
        listInventory({ signal: controller.signal }),
        listLowStockInventory({ signal: controller.signal }),
      ])

      if (controller.signal.aborted) return
      if (currentRequest !== requestSequence) return

      allMaterials.value = inventoryResponse
      lowStockMaterials.value = lowStockResponse
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

  async function refreshInventory(): Promise<void> {
    await fetchInventory({ silent: true })
  }

  function setShowOnlyLowStock(value: boolean): void {
    showOnlyLowStock.value = value
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
    allMaterials.value = []
    lowStockMaterials.value = []
    showOnlyLowStock.value = false
    error.value = null
    lastUpdatedAt.value = null
  }

  return {
    allMaterials,
    lowStockMaterials,
    visibleMaterials,
    showOnlyLowStock,
    isLoading,
    isRefreshing,
    error,
    lastUpdatedAt,
    hasMaterials,
    hasLowStock,
    hasError,
    fetchInventory,
    refreshInventory,
    setShowOnlyLowStock,
    cancelActiveRequest,
    clearError,
    resetState,
  }
})
