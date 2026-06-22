import type { OrderListFilters, OrderSortField, OrderStatus } from './order.types'

export const ORDER_STATUSES = [
  'RECEIVED',
  'QUEUED',
  'PROCESSING',
  'PROCESSED',
  'FAILED',
] as const satisfies readonly OrderStatus[]

export const ORDER_SORT_FIELDS = [
  'receivedAt',
  'updatedAt',
  'status',
  'shopifyOrderId',
] as const satisfies readonly OrderSortField[]

export const DEFAULT_ORDER_FILTERS: Readonly<OrderListFilters> = Object.freeze({
  page: 1,
  limit: 20,
  sortBy: 'receivedAt',
  sortDirection: 'DESC',
})
