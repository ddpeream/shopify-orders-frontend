<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { LocationQueryValue } from 'vue-router'
import { storeToRefs } from 'pinia'

import AppAlert from '@/shared/components/AppAlert.vue'
import AppButton from '@/shared/components/AppButton.vue'
import AppCard from '@/shared/components/AppCard.vue'
import PageHeader from '@/shared/components/PageHeader.vue'
import { formatDateTime } from '@/shared/utils/date-format'

import OrdersFilters from './components/OrdersFilters.vue'
import OrdersMobileList from './components/OrdersMobileList.vue'
import OrdersPagination from './components/OrdersPagination.vue'
import OrdersTable from './components/OrdersTable.vue'
import { createDefaultOrderFilters, useOrdersStore } from './orders.store'

import type { OrderListFilters, OrderStatus } from './order.types'

// type RouteQueryValue = LocationQueryValue | LocationQueryValue[]

const route = useRoute()
const router = useRouter()
const ordersStore = useOrdersStore()

const { filters, orders, pagination, isLoading, isRefreshing, error, lastUpdatedAt } =
  storeToRefs(ordersStore)

const validStatuses: OrderStatus[] = ['RECEIVED', 'QUEUED', 'PROCESSING', 'PROCESSED', 'FAILED']

const validSortFields: Array<NonNullable<OrderListFilters['sortBy']>> = [
  'receivedAt',
  'updatedAt',
  'status',
  'shopifyOrderId',
]

const validSortDirections: Array<NonNullable<OrderListFilters['sortDirection']>> = ['ASC', 'DESC']

const hasPagination = computed(() => pagination.value !== null)

const currentPage = computed(() => pagination.value?.page ?? filters.value.page ?? 1)
const totalPages = computed(() => pagination.value?.totalPages ?? 1)
const totalItems = computed(() => pagination.value?.total ?? 0)

function getSingleQueryValue(
  value: LocationQueryValue | LocationQueryValue[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    const first = value[0]
    return first && typeof first === 'string' ? first : undefined
  }
  if (value === null || value === undefined) return undefined
  return typeof value === 'string' ? value : undefined
}

function parsePositiveInteger(
  value: LocationQueryValue | LocationQueryValue[] | undefined,
  fallback: number,
): number {
  const rawValue = getSingleQueryValue(value)

  if (!rawValue) return fallback

  const parsed = Number(rawValue)

  if (!Number.isInteger(parsed) || parsed <= 0) return fallback

  return parsed
}

function parseOrderFiltersFromQuery(): Partial<OrderListFilters> {
  const defaults = createDefaultOrderFilters()
  const nextFilters: Partial<OrderListFilters> = {
    page: parsePositiveInteger(route.query.page, defaults.page ?? 1),
    limit: parsePositiveInteger(route.query.limit, defaults.limit ?? 20),
  }

  if (defaults.sortBy) {
    nextFilters.sortBy = defaults.sortBy
  }

  if (defaults.sortDirection) {
    nextFilters.sortDirection = defaults.sortDirection
  }

  const status = getSingleQueryValue(route.query.status)
  const shopId = getSingleQueryValue(route.query.shopId)
  const shopDomain = getSingleQueryValue(route.query.shopDomain)
  const shopifyOrderId = getSingleQueryValue(route.query.shopifyOrderId)
  const dateFrom = getSingleQueryValue(route.query.dateFrom)
  const dateTo = getSingleQueryValue(route.query.dateTo)
  const sortBy = getSingleQueryValue(route.query.sortBy)
  const sortDirection = getSingleQueryValue(route.query.sortDirection)

  if (status && validStatuses.includes(status as OrderStatus)) {
    nextFilters.status = status as OrderStatus
  }

  if (shopId?.trim()) {
    nextFilters.shopId = shopId.trim()
  }

  if (shopDomain?.trim()) {
    nextFilters.shopDomain = shopDomain.trim()
  }

  if (shopifyOrderId?.trim()) {
    nextFilters.shopifyOrderId = shopifyOrderId.trim()
  }

  if (dateFrom) {
    nextFilters.dateFrom = dateFrom
  }

  if (dateTo) {
    nextFilters.dateTo = dateTo
  }

  if (sortBy && validSortFields.includes(sortBy as NonNullable<OrderListFilters['sortBy']>)) {
    nextFilters.sortBy = sortBy as OrderListFilters['sortBy']
  }

  if (
    sortDirection &&
    validSortDirections.includes(sortDirection as NonNullable<OrderListFilters['sortDirection']>)
  ) {
    nextFilters.sortDirection = sortDirection as OrderListFilters['sortDirection']
  }

  return nextFilters
}

function buildQueryFromFilters(nextFilters: Partial<OrderListFilters>): Record<string, string> {
  const defaults = createDefaultOrderFilters()
  const query: Record<string, string> = {}

  if (nextFilters.status) query.status = nextFilters.status
  if (nextFilters.shopId) query.shopId = nextFilters.shopId
  if (nextFilters.shopDomain) query.shopDomain = nextFilters.shopDomain
  if (nextFilters.shopifyOrderId) query.shopifyOrderId = nextFilters.shopifyOrderId
  if (nextFilters.dateFrom) query.dateFrom = nextFilters.dateFrom
  if (nextFilters.dateTo) query.dateTo = nextFilters.dateTo

  if (nextFilters.page && nextFilters.page !== defaults.page) {
    query.page = String(nextFilters.page)
  }

  if (nextFilters.limit && nextFilters.limit !== defaults.limit) {
    query.limit = String(nextFilters.limit)
  }

  if (nextFilters.sortBy && nextFilters.sortBy !== defaults.sortBy) {
    query.sortBy = nextFilters.sortBy
  }

  if (nextFilters.sortDirection && nextFilters.sortDirection !== defaults.sortDirection) {
    query.sortDirection = nextFilters.sortDirection
  }

  return query
}

async function replaceRouteFilters(nextFilters: Partial<OrderListFilters>): Promise<void> {
  await router.replace({
    name: 'orders',
    query: buildQueryFromFilters(nextFilters),
  })
}

async function handleFiltersChange(nextFilters: Partial<OrderListFilters>): Promise<void> {
  await replaceRouteFilters({
    ...filters.value,
    ...nextFilters,
    page: 1,
  })
}

async function handleResetFilters(): Promise<void> {
  await replaceRouteFilters(createDefaultOrderFilters())
}

async function handlePageChange(page: number): Promise<void> {
  await replaceRouteFilters({
    ...filters.value,
    page,
  })
}

async function handleRefresh(): Promise<void> {
  await ordersStore.refreshOrders()
}

watch(
  () => route.query,
  async () => {
    await ordersStore.fetchOrders(parseOrderFiltersFromQuery())
  },
  {
    immediate: true,
    deep: true,
  },
)

onBeforeUnmount(() => {
  ordersStore.cancelActiveRequest()
})
</script>

<template>
  <section class="orders-view app-stack">
    <PageHeader
      title="Órdenes"
      description="Consulta, filtra y revisa las órdenes recibidas desde Shopify."
    >
      <template #actions>
        <AppButton variant="secondary" :loading="isRefreshing" @click="handleRefresh">
          Actualizar
        </AppButton>
      </template>

      <template #meta>
        <span v-if="lastUpdatedAt">Última actualización: {{ formatDateTime(lastUpdatedAt) }}</span>
        <span v-else>Sin actualización reciente</span>
      </template>
    </PageHeader>

    <AppAlert v-if="error" variant="error" title="No fue posible cargar las órdenes">
      {{ error }}

      <template #actions>
        <AppButton variant="secondary" size="small" @click="ordersStore.fetchOrders(filters)">
          Reintentar
        </AppButton>
      </template>
    </AppAlert>

    <AppCard
      title="Filtros"
      description="Filtra por estado, tienda, orden Shopify, fechas y criterios de ordenamiento."
    >
      <OrdersFilters
        :filters="filters"
        :disabled="isLoading || isRefreshing"
        @change="handleFiltersChange"
        @reset="handleResetFilters"
      />
    </AppCard>

    <AppCard
      title="Listado de órdenes"
      description="Resultados sincronizados con los parámetros de búsqueda de la URL."
    >
      <OrdersTable :orders="orders" :loading="isLoading" :error="error" />

      <OrdersMobileList :orders="orders" :loading="isLoading" />

      <OrdersPagination
        v-if="hasPagination"
        :page="currentPage"
        :total-pages="totalPages"
        :total-items="totalItems"
        :disabled="isLoading || isRefreshing"
        @change="handlePageChange"
      />
    </AppCard>
  </section>
</template>
