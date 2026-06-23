<script setup lang="ts">
import AppBadge from '@/shared/components/AppBadge.vue'
import AppCard from '@/shared/components/AppCard.vue'

import type { OrderStatus } from '@/modules/orders/order.types'

const props = defineProps<{
  countsByStatus: Record<OrderStatus, number>
}>()

const statusItems: Array<{
  status: OrderStatus
  label: string
  variant: 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'danger'
}> = [
  {
    status: 'RECEIVED',
    label: 'Recibidas',
    variant: 'info',
  },
  {
    status: 'QUEUED',
    label: 'En cola',
    variant: 'warning',
  },
  {
    status: 'PROCESSING',
    label: 'Procesando',
    variant: 'primary',
  },
  {
    status: 'PROCESSED',
    label: 'Procesadas',
    variant: 'success',
  },
  {
    status: 'FAILED',
    label: 'Fallidas',
    variant: 'danger',
  },
]
</script>

<template>
  <AppCard title="Distribución por estado" description="Resumen operativo de órdenes por etapa.">
    <div class="order-status-summary">
      <div v-for="item in statusItems" :key="item.status" class="order-status-summary__item">
        <div class="order-status-summary__label">
          <AppBadge :variant="item.variant">
            {{ item.label }}
          </AppBadge>
        </div>

        <strong class="order-status-summary__value">
          {{ props.countsByStatus[item.status] ?? 0 }}
        </strong>
      </div>
    </div>
  </AppCard>
</template>

<style scoped>
.order-status-summary {
  display: grid;
  gap: var(--space-150);
}

.order-status-summary__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-150);
  padding: var(--space-100) 0;
  border-bottom: 1px solid var(--color-border-subdued);
}

.order-status-summary__item:last-child {
  border-bottom: 0;
}

.order-status-summary__label {
  display: inline-flex;
  align-items: center;
}

.order-status-summary__value {
  color: var(--color-text);
  font-size: var(--font-size-125);
  font-weight: var(--font-weight-bold);
}
</style>
