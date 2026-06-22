import type { PaginatedResponse, SortDirection } from '@/shared/types/api.types'

export type OrderStatus = 'RECEIVED' | 'QUEUED' | 'PROCESSING' | 'PROCESSED' | 'FAILED'

export type OrderProcessingAttemptStatus = 'PROCESSING' | 'SUCCEEDED' | 'FAILED'

export type OrderSortField = 'receivedAt' | 'updatedAt' | 'status' | 'shopifyOrderId'

export interface OrderListFilters {
  status?: OrderStatus
  shopId?: string
  shopDomain?: string
  shopifyOrderId?: string
  dateFrom?: string
  dateTo?: string
  page: number
  limit: number
  sortBy: OrderSortField
  sortDirection: SortDirection
}

export interface OrderListItem {
  id: string
  shopId: string
  shopDomain: string
  shopifyOrderId: string
  status: OrderStatus
  totalItems: number
  containsFragileItems: boolean
  processingAttempts: number
  failureCode: string | null
  failureReason: string | null
  receivedAt: string
  processedAt: string | null
  updatedAt: string
}

export type PaginatedOrdersResponse = PaginatedResponse<OrderListItem>

export interface OrderItem {
  id: string
  productId: string
  variantId: string | null
  sku: string | null
  name: string
  quantity: number
  isFragile: boolean
}

export interface OrderStatusHistory {
  id: string
  previousStatus: OrderStatus | null
  newStatus: OrderStatus
  reason: string | null
  createdAt: string
}

export interface OrderProcessingAttempt {
  id: string
  attemptNumber: number
  status: OrderProcessingAttemptStatus
  errorCode: string | null
  errorMessage: string | null
  startedAt: string
  finishedAt: string | null
}

export interface OrderDetail extends OrderListItem {
  items: OrderItem[]
  statusHistory: OrderStatusHistory[]
  attempts: OrderProcessingAttempt[]
}

export interface OrderMaterial {
  id: string
  materialId: string
  code: string
  name: string
  quantity: number
  createdAt: string
}

export interface OrderMaterialsResponse {
  orderId: string
  materials: OrderMaterial[]
}
