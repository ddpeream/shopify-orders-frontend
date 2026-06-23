<script setup lang="ts">
import AppBadge from '@/shared/components/AppBadge.vue'
import AppCard from '@/shared/components/AppCard.vue'
import { formatDateTime } from '@/shared/utils/date-format'

import OrderStatusBadge from './OrderStatusBadge.vue'

import type { OrderStatus } from '../order.types'

defineProps<{
  history: Array<{
    id?: string
    previousStatus?: OrderStatus | null
    newStatus: OrderStatus
    reason?: string | null
    createdAt: string
  }>
}>()
</script>

<template>
  <AppCard
    title="Historial de estados"
    description="Cambios cronológicos del ciclo de vida de la orden."
  >
    <div v-if="history.length === 0" class="order-status-timeline__empty">
      No hay historial de estados registrado.
    </div>

    <ol v-else class="order-status-timeline">
      <li
        v-for="event in history"
        :key="event.id ?? `${event.newStatus}-${event.createdAt}`"
        class="order-status-timeline__item"
      >
        <div class="order-status-timeline__marker" aria-hidden="true" />

        <div class="order-status-timeline__content">
          <div class="order-status-timeline__header">
            <OrderStatusBadge :status="event.newStatus" />

            <span class="order-status-timeline__date">
              {{ formatDateTime(event.createdAt) }}
            </span>
          </div>

          <p class="order-status-timeline__description">
            <template v-if="event.previousStatus">
              Cambio desde
              <AppBadge variant="neutral" size="small">
                {{ event.previousStatus }}
              </AppBadge>
              hacia el nuevo estado.
            </template>

            <template v-else> Estado inicial registrado. </template>
          </p>

          <p v-if="event.reason" class="order-status-timeline__reason">
            {{ event.reason }}
          </p>
        </div>
      </li>
    </ol>
  </AppCard>
</template>

<style scoped>
.order-status-timeline {
  display: grid;
  gap: var(--space-200);
  padding: 0;
  margin: 0;
  list-style: none;
}

.order-status-timeline__item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-150);
}

.order-status-timeline__marker {
  width: 12px;
  height: 12px;
  margin-top: 6px;
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  box-shadow: 0 0 0 4px var(--color-primary-subdued);
}

.order-status-timeline__content {
  display: grid;
  gap: var(--space-100);
  padding-bottom: var(--space-200);
  border-bottom: 1px solid var(--color-border-subdued);
}

.order-status-timeline__item:last-child .order-status-timeline__content {
  padding-bottom: 0;
  border-bottom: 0;
}

.order-status-timeline__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-150);
}

.order-status-timeline__date {
  color: var(--color-text-subdued);
  font-size: var(--font-size-075);
  font-weight: var(--font-weight-semibold);
}

.order-status-timeline__description {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-050);
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-size-087);
}

.order-status-timeline__reason {
  margin: 0;
  color: var(--color-text-subdued);
  font-size: var(--font-size-087);
}

.order-status-timeline__empty {
  padding: var(--space-200);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-150);
  color: var(--color-text-subdued);
  font-size: var(--font-size-087);
  text-align: center;
}

@media (max-width: 640px) {
  .order-status-timeline__header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
