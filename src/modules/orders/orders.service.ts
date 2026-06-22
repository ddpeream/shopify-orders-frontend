import { apiClient } from '@/shared/api/api-client'
import type { QueryParams } from '@/shared/api/query-params'
import {
  isOrderDetail,
  isOrderMaterialsResponse,
  isPaginatedOrdersResponse,
} from '@/shared/types/type-guards'
import type { PaginatedResponse } from '@/shared/types/api.types'

import type {
  OrderDetail,
  OrderListFilters,
  OrderListItem,
  OrderMaterialsResponse,
} from './order.types'

export interface OrdersServiceOptions {
  signal?: AbortSignal
}

function toOrderListQuery(filters: Partial<OrderListFilters> = {}): QueryParams {
  return {
    status: filters.status,
    shopId: filters.shopId,
    shopDomain: filters.shopDomain,
    shopifyOrderId: filters.shopifyOrderId,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    page: filters.page,
    limit: filters.limit,
    sortBy: filters.sortBy,
    sortDirection: filters.sortDirection,
  }
}

export async function listOrders(
  filters: Partial<OrderListFilters> = {},
  options: OrdersServiceOptions = {},
): Promise<PaginatedResponse<OrderListItem>> {
  return apiClient.get<PaginatedResponse<OrderListItem>>({
    path: '/orders',
    query: toOrderListQuery(filters),
    signal: options.signal,
    validate: isPaginatedOrdersResponse,
  })
}

export async function getOrderDetail(
  id: string,
  options: OrdersServiceOptions = {},
): Promise<OrderDetail> {
  return apiClient.get<OrderDetail>({
    path: `/orders/${encodeURIComponent(id)}`,
    signal: options.signal,
    validate: isOrderDetail,
  })
}

export async function getOrderMaterials(
  id: string,
  options: OrdersServiceOptions = {},
): Promise<OrderMaterialsResponse> {
  return apiClient.get<OrderMaterialsResponse>({
    path: `/orders/${encodeURIComponent(id)}/materials`,
    signal: options.signal,
    validate: isOrderMaterialsResponse,
  })
}
