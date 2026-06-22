import { describe, expect, it } from 'vitest'
import {
  isApiErrorResponse,
  isDashboardSummary,
  isInventoryItemArray,
  isOrderDetail,
  isOrderMaterialsResponse,
  isPaginatedOrdersResponse,
} from '@/shared/types/type-guards'

const timestamp = '2026-06-22T10:00:00.000Z'

const order = {
  id: 'order-id',
  shopId: 'shop-id',
  shopDomain: 'test-store.myshopify.com',
  shopifyOrderId: 'shopify-order-1',
  status: 'PROCESSED',
  totalItems: 2,
  containsFragileItems: false,
  processingAttempts: 1,
  failureCode: null,
  failureReason: null,
  receivedAt: timestamp,
  processedAt: timestamp,
  updatedAt: timestamp,
}

describe('API contract guards', () => {
  it('recognizes the global API error contract', () => {
    expect(
      isApiErrorResponse({
        statusCode: 404,
        code: 'ORDER_NOT_FOUND',
        message: 'Order not found',
        path: '/api/orders/missing',
        timestamp,
      }),
    ).toBe(true)
    expect(isApiErrorResponse({ statusCode: 404, message: 'Missing code' })).toBe(false)
  })

  it('validates paginated orders and rejects unsupported states', () => {
    const response = {
      data: [order],
      pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
    }
    expect(isPaginatedOrdersResponse(response)).toBe(true)
    expect(
      isPaginatedOrdersResponse({
        ...response,
        data: [{ ...order, status: 'UNKNOWN' }],
      }),
    ).toBe(false)
  })

  it('validates a complete order detail', () => {
    expect(
      isOrderDetail({
        ...order,
        items: [
          {
            id: 'item-id',
            productId: 'product-id',
            variantId: null,
            sku: null,
            name: 'Producto',
            quantity: 2,
            isFragile: false,
          },
        ],
        statusHistory: [
          {
            id: 'history-id',
            previousStatus: 'PROCESSING',
            newStatus: 'PROCESSED',
            reason: 'Order processed successfully',
            createdAt: timestamp,
          },
        ],
        attempts: [
          {
            id: 'attempt-id',
            attemptNumber: 1,
            status: 'SUCCEEDED',
            errorCode: null,
            errorMessage: null,
            startedAt: timestamp,
            finishedAt: timestamp,
          },
        ],
      }),
    ).toBe(true)
    expect(isOrderDetail({ ...order, items: [], statusHistory: [], attempts: 'invalid' })).toBe(
      false,
    )
  })

  it('validates consumed materials', () => {
    expect(
      isOrderMaterialsResponse({
        orderId: 'order-id',
        materials: [
          {
            id: 'consumption-id',
            materialId: 'material-id',
            code: 'LABEL',
            name: 'Etiqueta',
            quantity: 1,
            createdAt: timestamp,
          },
        ],
      }),
    ).toBe(true)
    expect(isOrderMaterialsResponse({ orderId: 'order-id', materials: [{ quantity: 0 }] })).toBe(
      false,
    )
  })

  it('validates inventory and known material codes', () => {
    const inventory = [
      {
        id: 'material-id',
        code: 'BOX_SMALL',
        name: 'Caja pequeña',
        stock: 100,
        lowStockThreshold: 20,
        lowStock: false,
        updatedAt: timestamp,
      },
    ]
    expect(isInventoryItemArray(inventory)).toBe(true)
    expect(isInventoryItemArray([{ ...inventory[0], code: 'UNKNOWN' }])).toBe(false)
  })

  it('validates dashboard counts and recent orders', () => {
    const dashboard = {
      orders: {
        total: 1,
        received: 0,
        queued: 0,
        pending: 0,
        processing: 0,
        processed: 1,
        failed: 0,
      },
      inventory: { lowStockMaterials: 0 },
      recentOrders: [
        {
          id: order.id,
          shopDomain: order.shopDomain,
          shopifyOrderId: order.shopifyOrderId,
          status: order.status,
          totalItems: order.totalItems,
          receivedAt: order.receivedAt,
        },
      ],
    }
    expect(isDashboardSummary(dashboard)).toBe(true)
    expect(
      isDashboardSummary({
        ...dashboard,
        orders: { ...dashboard.orders, failed: -1 },
      }),
    ).toBe(false)
  })
})
