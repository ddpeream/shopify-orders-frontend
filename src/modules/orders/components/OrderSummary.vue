<script setup lang="ts">
import AppBadge from '@/shared/components/AppBadge.vue'
import AppCard from '@/shared/components/AppCard.vue'
import { formatDateTime } from '@/shared/utils/date-format'
import { formatInteger } from '@/shared/utils/number-format'

import OrderStatusBadge from './OrderStatusBadge.vue'

import type { OrderStatus } from '../order.types'

defineProps<{
  order: {
    id: string
    shopDomain: string
    shopifyOrderId: string
    status: OrderStatus
    totalItems: number
    containsFragileItems: boolean
    processingAttempts?: number
    failureCode?: string | null
    failureReason?: string | null
    receivedAt: string
    processedAt?: string | null
    updatedAt: string
  }
}>()
</script>

<template>
  <AppCard
    title="Resumen de la orden"
    description="Información general de la orden y su estado actual."
  >
    <div class="order-summary">
      <div class="order-summary__header">
        <div>
          <p class="order-summary__label">Orden Shopify</p>
          <h2 class="order-summary__title">{{ order.shopifyOrderId }}</h2>
        </div>

        <OrderStatusBadge :status="order.status" />
      </div>

      <dl class="order-summary__grid">
        <div>
          <dt>Tienda</dt>
          <dd>{{ order.shopDomain }}</dd>
        </div>

        <div>
          <dt>Total productos</dt>
          <dd>{{ formatInteger(order.totalItems) }}</dd>
        </div>

        <div>
          <dt>Fragilidad</dt>
          <dd>
            <AppBadge :variant="order.containsFragileItems ? 'warning' : 'neutral'">
              {{ order.containsFragileItems ? 'Contiene frágiles' : 'Sin frágiles' }}
            </AppBadge>
          </dd>
        </div>

        <div>
          <dt>Intentos</dt>
          <dd>{{ formatInteger(order.processingAttempts ?? 0) }}</dd>
        </div>

        <div>
          <dt>Recibida</dt>
          <dd>{{ formatDateTime(order.receivedAt) }}</dd>
        </div>

        <div>
          <dt>Procesada</dt>
          <dd>{{ formatDateTime(order.processedAt) }}</dd>
        </div>

        <div>
          <dt>Actualizada</dt>
          <dd>{{ formatDateTime(order.updatedAt) }}</dd>
        </div>
      </dl>
    </div>
  </AppCard>
</template>

<style scoped>
.order-summary {
  display: grid;
  gap: var(--space-200);
}

.order-summary__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-200);
}

.order-summary__label {
  margin: 0;
  color: var(--color-text-subdued);
  font-size: var(--font-size-075);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.order-summary__title {
  margin: var(--space-050) 0 0;
  color: var(--color-text);
  font-size: var(--font-size-150);
  font-weight: var(--font-weight-bold);
}

.order-summary__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-150);
  margin: 0;
}

.order-summary__grid div {
  display: grid;
  gap: var(--space-050);
  padding: var(--space-150);
  border: 1px solid var(--color-border-subdued);
  border-radius: var(--radius-150);
  background: var(--color-surface-subdued);
}

.order-summary__grid dt {
  color: var(--color-text-subdued);
  font-size: var(--font-size-075);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.order-summary__grid dd {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-size-087);
  font-weight: var(--font-weight-semibold);
}

@media (max-width: 900px) {
  .order-summary__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .order-summary__header {
    flex-direction: column;
  }

  .order-summary__grid {
    grid-template-columns: 1fr;
  }
}
</style>
