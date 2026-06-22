import { apiClient } from '@/shared/api/api-client'
import { isInventoryItemArray } from '@/shared/types/type-guards'

import type { InventoryItem } from './inventory.types'

export interface InventoryServiceOptions {
  signal?: AbortSignal
}

export async function listInventory(
  options: InventoryServiceOptions = {},
): Promise<InventoryItem[]> {
  return apiClient.get<InventoryItem[]>({
    path: '/inventory',
    signal: options.signal,
    validate: isInventoryItemArray,
  })
}

export async function listLowStockInventory(
  options: InventoryServiceOptions = {},
): Promise<InventoryItem[]> {
  return apiClient.get<InventoryItem[]>({
    path: '/inventory/low-stock',
    signal: options.signal,
    validate: isInventoryItemArray,
  })
}
