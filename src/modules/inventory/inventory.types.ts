export type MaterialCode = 'BOX_SMALL' | 'BOX_MEDIUM' | 'BOX_LARGE' | 'LABEL' | 'TAPE' | 'FILLER'

export interface InventoryItem {
  id: string
  code: MaterialCode
  name: string
  stock: number
  lowStockThreshold: number
  lowStock: boolean
  updatedAt: string
}
