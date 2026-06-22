import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  DEFAULT_ORDER_FILTERS,
  ORDER_SORT_FIELDS,
  ORDER_STATUSES,
} from '@/modules/orders/order.constants'
import type {
  OrderDetail,
  OrderListFilters,
  OrderListItem,
  OrderMaterialsResponse,
  OrderStatus,
  PaginatedOrdersResponse,
} from '@/modules/orders/order.types'

describe('order contracts', () => {
  it('defines every backend order status and sort field', () => {
    expect(ORDER_STATUSES).toEqual(['RECEIVED', 'QUEUED', 'PROCESSING', 'PROCESSED', 'FAILED'])
    expect(ORDER_SORT_FIELDS).toEqual(['receivedAt', 'updatedAt', 'status', 'shopifyOrderId'])
  })

  it('provides immutable defaults aligned with the backend', () => {
    expect(DEFAULT_ORDER_FILTERS).toEqual({
      page: 1,
      limit: 20,
      sortBy: 'receivedAt',
      sortDirection: 'DESC',
    })
    expect(Object.isFrozen(DEFAULT_ORDER_FILTERS)).toBe(true)
  })

  it('keeps HTTP dates represented as strings', () => {
    expectTypeOf<OrderListItem['receivedAt']>().toEqualTypeOf<string>()
    expectTypeOf<OrderListItem['processedAt']>().toEqualTypeOf<string | null>()
    expectTypeOf<OrderDetail>().toExtend<OrderListItem>()
    expectTypeOf<PaginatedOrdersResponse['data']>().toEqualTypeOf<OrderListItem[]>()
    expectTypeOf<OrderMaterialsResponse['orderId']>().toEqualTypeOf<string>()
    expectTypeOf<OrderListFilters['status']>().toEqualTypeOf<OrderStatus | undefined>()
  })
})
