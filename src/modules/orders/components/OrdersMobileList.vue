<script setup lang="ts">
import { RouterLink } from 'vue-router'

import AppBadge from '@/shared/components/AppBadge.vue'
import AppButton from '@/shared/components/AppButton.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
import SkeletonLoader from '@/shared/components/SkeletonLoader.vue'
import { formatDateTime } from '@/shared/utils/date-format'

import OrderStatusBadge from './OrderStatusBadge.vue'

import type { OrderListItem } from '../order.types'

defineProps<{
  orders: OrderListItem[]
  loading?: boolean
}>()
</script>

<template>
  <div class="orders-mobile-list">
    <SkeletonLoader v-if="loading" variant="card" :lines="5" />

    <EmptyState
      v-else-if="orders.length === 0"
      title="No se encontraron órdenes"
      description="Ajusta los filtros o espera a que Shopify envíe nuevas órdenes."
    />

    <article v-for="order in orders" v-else :key="order.id" class="orders-mobile-list__card">
      <div class="orders-mobile-list__header">
        <div>
          <p class="orders-mobile-list__label">Orden Shopify</p>
          <h2 class="orders-mobile-list__title">{{ order.shopifyOrderId }}</h2>
        </div>

        <OrderStatusBadge :status="order.status" />
      </div>

      <div class="orders-mobile-list__meta">
        <div>
          <span>Tienda</span>
          <strong>{{ order.shopDomain }}</strong>
        </div>

        <div>
          <span>Productos</span>
          <strong>{{ order.totalItems }}</strong>
        </div>

        <div>
          <span>Intentos</span>
          <strong>{{ order.processingAttempts }}</strong>
        </div>

        <div>
          <span>Recepción</span>
          <strong>{{ formatDateTime(order.receivedAt) }}</strong>
        </div>
      </div>

      <div class="orders-mobile-list__footer">
        <AppBadge :variant="order.containsFragileItems ? 'warning' : 'neutral'">
          {{ order.containsFragileItems ? 'Contiene frágiles' : 'Sin frágiles' }}
        </AppBadge>

        <RouterLink :to="`/orders/${order.id}`">
          <AppButton size="small" variant="secondary">Ver detalle</AppButton>
        </RouterLink>
      </div>
    </article>
  </div>
</template>

<style scoped>
.orders-mobile-list {
  display: none;
}

.orders-mobile-list__card {
  display: grid;
  gap: var(--space-150);
  padding: var(--space-200);
  border: 1px solid var(--color-border-subdued);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.orders-mobile-list__header,
.orders-mobile-list__footer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-150);
}

.orders-mobile-list__label {
  margin: 0;
  color: var(--color-text-subdued);
  font-size: var(--font-size-075);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.orders-mobile-list__title {
  margin: var(--space-050) 0 0;
  color: var(--color-text);
  font-size: var(--font-size-125);
  font-weight: var(--font-weight-bold);
}

.orders-mobile-list__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-150);
}

.orders-mobile-list__meta div {
  display: grid;
  gap: var(--space-025);
}

.orders-mobile-list__meta span {
  color: var(--color-text-subdued);
  font-size: var(--font-size-075);
  font-weight: var(--font-weight-semibold);
}

.orders-mobile-list__meta strong {
  color: var(--color-text);
  font-size: var(--font-size-087);
  font-weight: var(--font-weight-semibold);
}

@media (max-width: 760px) {
  .orders-mobile-list {
    display: grid;
    gap: var(--space-150);
  }
}
</style>
