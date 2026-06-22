import type { OrderStatus } from '@/modules/orders/order.types'

export interface DashboardOrderCounts {
  total: number
  received: number
  queued: number
  pending: number
  processing: number
  processed: number
  failed: number
}

export interface DashboardInventorySummary {
  lowStockMaterials: number
}

export interface DashboardRecentOrder {
  id: string
  shopDomain: string
  shopifyOrderId: string
  status: OrderStatus
  totalItems: number
  receivedAt: string
}

export interface DashboardSummary {
  orders: DashboardOrderCounts
  inventory: DashboardInventorySummary
  recentOrders: DashboardRecentOrder[]
}
