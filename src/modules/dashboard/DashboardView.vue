<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import AppAlert from '@/shared/components/AppAlert.vue'
import AppButton from '@/shared/components/AppButton.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
import PageHeader from '@/shared/components/PageHeader.vue'
import SkeletonLoader from '@/shared/components/SkeletonLoader.vue'
import { environment } from '@/shared/config/environment'
import { formatDateTime } from '@/shared/utils/date-format'
import { formatInteger } from '@/shared/utils/number-format'

import LowStockSummary from './components/LowStockSummary.vue'
import MetricCard from './components/MetricCard.vue'
import OrderStatusSummary from './components/OrderStatusSummary.vue'
import RecentOrdersTable from './components/RecentOrdersTable.vue'
import { useDashboardStore } from './dashboard.store'

const dashboardStore = useDashboardStore()

const { summary, isLoading, isRefreshing, error, lastUpdatedAt } = storeToRefs(dashboardStore)

let pollingTimer: number | null = null

const hasOrders = computed(() => (summary.value?.orders.total ?? 0) > 0)

const pendingOrders = computed(() => {
  if (!summary.value) return 0

  return summary.value.orders.received + summary.value.orders.queued
})

const orderStatusCounts = computed(() => {
  if (!summary.value) {
    return {
      RECEIVED: 0,
      QUEUED: 0,
      PROCESSING: 0,
      PROCESSED: 0,
      FAILED: 0,
    }
  }

  return {
    RECEIVED: summary.value.orders.received,
    QUEUED: summary.value.orders.queued,
    PROCESSING: summary.value.orders.processing,
    PROCESSED: summary.value.orders.processed,
    FAILED: summary.value.orders.failed,
  }
})

function startPolling(): void {
  stopPolling()

  pollingTimer = window.setInterval(() => {
    if (document.hidden) return

    void dashboardStore.refreshSummary()
  }, environment.pollingIntervalMs)
}

function stopPolling(): void {
  if (pollingTimer === null) return

  window.clearInterval(pollingTimer)
  pollingTimer = null
}

async function handleRefresh(): Promise<void> {
  await dashboardStore.refreshSummary()
}

onMounted(() => {
  void dashboardStore.loadSummary()
  startPolling()
})

onBeforeUnmount(() => {
  stopPolling()
  dashboardStore.cancelActiveRequest()
})
</script>

<template>
  <section class="dashboard-view app-stack">
    <PageHeader
      title="Dashboard operativo"
      description="Monitorea el estado general de órdenes, procesamiento e inventario de empaque."
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

    <AppAlert v-if="error" variant="error" title="No fue posible cargar el dashboard">
      {{ error }}

      <template #actions>
        <AppButton variant="secondary" size="small" @click="dashboardStore.loadSummary()">
          Reintentar
        </AppButton>
      </template>
    </AppAlert>

    <SkeletonLoader v-if="isLoading && !summary" variant="card" :lines="6" />

    <template v-else-if="summary">
      <div class="dashboard-view__metrics">
        <MetricCard
          title="Total de órdenes"
          :value="formatInteger(summary.orders.total)"
          tone="info"
        />
        <MetricCard title="Pendientes" :value="formatInteger(pendingOrders)" tone="warning" />
        <MetricCard
          title="Procesando"
          :value="formatInteger(summary.orders.processing)"
          tone="info"
        />
        <MetricCard
          title="Procesadas"
          :value="formatInteger(summary.orders.processed)"
          tone="success"
        />
        <MetricCard title="Fallidas" :value="formatInteger(summary.orders.failed)" tone="danger" />
        <MetricCard
          title="Inventario bajo"
          :value="formatInteger(summary.inventory.lowStockMaterials)"
          :tone="summary.inventory.lowStockMaterials > 0 ? 'warning' : 'success'"
        />
      </div>

      <EmptyState
        v-if="!hasOrders"
        title="Todavía no hay órdenes"
        description="Cuando Shopify envíe órdenes al webhook, el dashboard mostrará el resumen operativo."
      />

      <div v-else class="dashboard-view__content-grid">
        <OrderStatusSummary :counts-by-status="orderStatusCounts" />
        <LowStockSummary :low-stock-count="summary.inventory.lowStockMaterials" />
      </div>

      <RecentOrdersTable :orders="summary.recentOrders" />
    </template>
  </section>
</template>

<style scoped>
.dashboard-view__metrics {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: var(--space-200);
}

.dashboard-view__content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.8fr);
  gap: var(--space-200);
}

@media (max-width: 1180px) {
  .dashboard-view__metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .dashboard-view__metrics,
  .dashboard-view__content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
