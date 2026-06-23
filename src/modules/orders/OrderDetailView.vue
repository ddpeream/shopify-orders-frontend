<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import AppAlert from '@/shared/components/AppAlert.vue'
import AppButton from '@/shared/components/AppButton.vue'
import AppCard from '@/shared/components/AppCard.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
import PageHeader from '@/shared/components/PageHeader.vue'
import SkeletonLoader from '@/shared/components/SkeletonLoader.vue'
import { formatDateTime } from '@/shared/utils/date-format'

import OrderAttemptsTable from './components/OrderAttemptsTable.vue'
import OrderFailureAlert from './components/OrderFailureAlert.vue'
import OrderItemsTable from './components/OrderItemsTable.vue'
import OrderMaterialsTable from './components/OrderMaterialsTable.vue'
import OrderStatusTimeline from './components/OrderStatusTimeline.vue'
import OrderSummary from './components/OrderSummary.vue'
import { useOrderDetailStore } from './order-detail.store'

const route = useRoute()
const router = useRouter()
const orderDetailStore = useOrderDetailStore()

const {
  order,
  materials,
  isLoading,
  isRefreshing,
  detailError,
  materialsError,
  notFound,
  lastUpdatedAt,
} = storeToRefs(orderDetailStore)

const orderId = computed<string>(() => {
  const rawId = route.params.id

  if (Array.isArray(rawId)) {
    return rawId[0] ?? ''
  }

  return typeof rawId === 'string' ? rawId : ''
})

const orderItems = computed(() => order.value?.items ?? [])
const orderMaterials = computed(() => materials.value?.materials ?? [])
const orderHistory = computed(() => order.value?.statusHistory ?? [])
const orderAttempts = computed(() => [])

const showContent = computed(() => order.value !== null && !notFound.value)

async function loadCurrentOrder(): Promise<void> {
  if (!orderId.value) return

  await orderDetailStore.fetchOrderDetail(orderId.value)
}

async function refreshCurrentOrder(): Promise<void> {
  if (!orderId.value) return

  await orderDetailStore.refreshOrderDetail(orderId.value)
}

function goBackToOrders(): void {
  router.push({ name: 'orders' })
}

watch(
  orderId,
  async (nextOrderId) => {
    if (!nextOrderId) return

    await orderDetailStore.fetchOrderDetail(nextOrderId)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  orderDetailStore.cancelActiveRequest()
})
</script>

<template>
  <section class="order-detail-view app-stack">
    <PageHeader
      title="Detalle de orden"
      description="Consulta el estado, productos, materiales e intentos de procesamiento."
    >
      <template #actions>
        <AppButton variant="ghost" @click="goBackToOrders">Volver al listado</AppButton>

        <AppButton variant="secondary" :loading="isRefreshing" @click="refreshCurrentOrder">
          Actualizar
        </AppButton>
      </template>

      <template #meta>
        <span v-if="lastUpdatedAt">Última actualización: {{ formatDateTime(lastUpdatedAt) }}</span>
        <span v-else>Sin actualización reciente</span>
      </template>
    </PageHeader>

    <SkeletonLoader v-if="isLoading" variant="card" :lines="8" />

    <EmptyState
      v-else-if="notFound"
      title="Orden no encontrada"
      description="La orden solicitada no existe o ya no está disponible."
    >
      <template #actions>
        <AppButton variant="secondary" @click="goBackToOrders">Volver al listado</AppButton>
      </template>
    </EmptyState>

    <template v-else>
      <AppAlert v-if="detailError" variant="error" title="No fue posible cargar el detalle">
        {{ detailError }}

        <template #actions>
          <AppButton variant="secondary" size="small" @click="loadCurrentOrder">
            Reintentar
          </AppButton>
        </template>
      </AppAlert>

      <AppAlert v-if="materialsError && order" variant="warning" title="Materiales no disponibles">
        {{ materialsError }}

        <template #actions>
          <AppButton variant="secondary" size="small" @click="refreshCurrentOrder">
            Reintentar materiales
          </AppButton>
        </template>
      </AppAlert>

      <template v-if="showContent && order">
        <OrderFailureAlert
          :failure-code="order.failureCode"
          :failure-reason="order.failureReason"
        />

        <OrderSummary :order="order" />

        <OrderItemsTable :items="orderItems" />

        <OrderMaterialsTable :materials="orderMaterials" />

        <div class="order-detail-view__grid">
          <OrderStatusTimeline :history="orderHistory" />

          <OrderAttemptsTable :attempts="orderAttempts" />
        </div>
      </template>

      <AppCard
        v-else-if="!detailError"
        title="Sin información disponible"
        description="No se encontró información para mostrar en este momento."
      >
        <EmptyState
          title="Detalle vacío"
          description="Intenta actualizar la vista o volver al listado de órdenes."
        >
          <template #actions>
            <AppButton variant="secondary" @click="loadCurrentOrder">Reintentar</AppButton>
          </template>
        </EmptyState>
      </AppCard>
    </template>
  </section>
</template>

<style scoped>
.order-detail-view__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-200);
}
</style>
