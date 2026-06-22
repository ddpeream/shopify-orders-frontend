import type { DashboardSummary } from '@/modules/dashboard/dashboard.types'
import type { InventoryItem, MaterialCode } from '@/modules/inventory/inventory.types'
import { ORDER_STATUSES } from '@/modules/orders/order.constants'
import type {
  OrderDetail,
  OrderListItem,
  OrderMaterialsResponse,
  OrderProcessingAttemptStatus,
  PaginatedOrdersResponse,
} from '@/modules/orders/order.types'
import type { ApiErrorResponse, Pagination } from './api.types'

const ATTEMPT_STATUSES = ['PROCESSING', 'SUCCEEDED', 'FAILED'] as const
const MATERIAL_CODES = [
  'BOX_SMALL',
  'BOX_MEDIUM',
  'BOX_LARGE',
  'LABEL',
  'TAPE',
  'FILLER',
] as const satisfies readonly MaterialCode[]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.trim().length > 0
}

function isNullableString(value: unknown): value is string | null {
  return value === null || isString(value)
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

function isNonNegativeInteger(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) >= 0
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) > 0
}

function isIsoDate(value: unknown): value is string {
  return isNonEmptyString(value) && !Number.isNaN(Date.parse(value))
}

function isNullableIsoDate(value: unknown): value is string | null {
  return value === null || isIsoDate(value)
}

function isOrderStatus(value: unknown): value is OrderListItem['status'] {
  return isString(value) && ORDER_STATUSES.some((status) => status === value)
}

function isAttemptStatus(value: unknown): value is OrderProcessingAttemptStatus {
  return isString(value) && ATTEMPT_STATUSES.some((status) => status === value)
}

function isMaterialCode(value: unknown): value is MaterialCode {
  return isString(value) && MATERIAL_CODES.some((code) => code === value)
}

function isPagination(value: unknown): value is Pagination {
  if (!isRecord(value)) return false
  return (
    isPositiveInteger(value.page) &&
    isPositiveInteger(value.limit) &&
    isNonNegativeInteger(value.total) &&
    isNonNegativeInteger(value.totalPages)
  )
}

function isOrderListItem(value: unknown): value is OrderListItem {
  if (!isRecord(value)) return false
  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.shopId) &&
    isNonEmptyString(value.shopDomain) &&
    isNonEmptyString(value.shopifyOrderId) &&
    isOrderStatus(value.status) &&
    isNonNegativeInteger(value.totalItems) &&
    isBoolean(value.containsFragileItems) &&
    isNonNegativeInteger(value.processingAttempts) &&
    isNullableString(value.failureCode) &&
    isNullableString(value.failureReason) &&
    isIsoDate(value.receivedAt) &&
    isNullableIsoDate(value.processedAt) &&
    isIsoDate(value.updatedAt)
  )
}

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (!isRecord(value)) return false
  return (
    isPositiveInteger(value.statusCode) &&
    isNonEmptyString(value.code) &&
    isNonEmptyString(value.message) &&
    isString(value.path) &&
    isIsoDate(value.timestamp)
  )
}

export function isPaginatedOrdersResponse(value: unknown): value is PaginatedOrdersResponse {
  if (!isRecord(value) || !Array.isArray(value.data)) return false
  return value.data.every(isOrderListItem) && isPagination(value.pagination)
}

export function isOrderDetail(value: unknown): value is OrderDetail {
  if (!isOrderListItem(value) || !isRecord(value)) return false
  if (!Array.isArray(value.items) || !Array.isArray(value.statusHistory)) return false
  if (!Array.isArray(value.attempts)) return false

  const itemsAreValid = value.items.every(
    (item) =>
      isRecord(item) &&
      isNonEmptyString(item.id) &&
      isNonEmptyString(item.productId) &&
      isNullableString(item.variantId) &&
      isNullableString(item.sku) &&
      isNonEmptyString(item.name) &&
      isPositiveInteger(item.quantity) &&
      isBoolean(item.isFragile),
  )
  const historyIsValid = value.statusHistory.every(
    (entry) =>
      isRecord(entry) &&
      isNonEmptyString(entry.id) &&
      (entry.previousStatus === null || isOrderStatus(entry.previousStatus)) &&
      isOrderStatus(entry.newStatus) &&
      isNullableString(entry.reason) &&
      isIsoDate(entry.createdAt),
  )
  const attemptsAreValid = value.attempts.every(
    (attempt) =>
      isRecord(attempt) &&
      isNonEmptyString(attempt.id) &&
      isPositiveInteger(attempt.attemptNumber) &&
      isAttemptStatus(attempt.status) &&
      isNullableString(attempt.errorCode) &&
      isNullableString(attempt.errorMessage) &&
      isIsoDate(attempt.startedAt) &&
      isNullableIsoDate(attempt.finishedAt),
  )

  return itemsAreValid && historyIsValid && attemptsAreValid
}

export function isOrderMaterialsResponse(value: unknown): value is OrderMaterialsResponse {
  if (!isRecord(value) || !isNonEmptyString(value.orderId) || !Array.isArray(value.materials)) {
    return false
  }
  return value.materials.every(
    (material) =>
      isRecord(material) &&
      isNonEmptyString(material.id) &&
      isNonEmptyString(material.materialId) &&
      isNonEmptyString(material.code) &&
      isNonEmptyString(material.name) &&
      isPositiveInteger(material.quantity) &&
      isIsoDate(material.createdAt),
  )
}

export function isInventoryItemArray(value: unknown): value is InventoryItem[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        isNonEmptyString(item.id) &&
        isMaterialCode(item.code) &&
        isNonEmptyString(item.name) &&
        isNonNegativeInteger(item.stock) &&
        isNonNegativeInteger(item.lowStockThreshold) &&
        isBoolean(item.lowStock) &&
        isIsoDate(item.updatedAt),
    )
  )
}

export function isDashboardSummary(value: unknown): value is DashboardSummary {
  if (!isRecord(value) || !isRecord(value.orders) || !isRecord(value.inventory)) return false
  if (!Array.isArray(value.recentOrders)) return false

  const orders = value.orders
  const countsAreValid = [
    orders.total,
    orders.received,
    orders.queued,
    orders.pending,
    orders.processing,
    orders.processed,
    orders.failed,
  ].every(isNonNegativeInteger)

  const recentOrdersAreValid = value.recentOrders.every(
    (order) =>
      isRecord(order) &&
      isNonEmptyString(order.id) &&
      isNonEmptyString(order.shopDomain) &&
      isNonEmptyString(order.shopifyOrderId) &&
      isOrderStatus(order.status) &&
      isNonNegativeInteger(order.totalItems) &&
      isIsoDate(order.receivedAt),
  )

  return (
    countsAreValid &&
    isNonNegativeInteger(value.inventory.lowStockMaterials) &&
    recentOrdersAreValid
  )
}
