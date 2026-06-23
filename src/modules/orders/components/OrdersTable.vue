<script setup lang="ts">
import { RouterLink } from 'vue-router'

import AppBadge from '@/shared/components/AppBadge.vue'
import AppTable from '@/shared/components/AppTable.vue'
import { formatDateTime } from '@/shared/utils/date-format'

import OrderStatusBadge from './OrderStatusBadge.vue'

import type { OrderListItem } from '../order.types'

defineProps<{
  orders: OrderListItem[]
  loading?: boolean
  error?: string | null
}>()
</script>

<template>
  <div class="orders-table">
    <AppTable
      :columns="[
        'Orden Shopify',
        'Tienda',
        'Estado',
        'Productos',
        'Fragilidad',
        'Intentos',
        'Recepción',
        'Actualización',
        'Acción',
      ]"
      :loading="loading"
      :error="error ?? ''"
      :empty="orders.length === 0"
      empty-title="No se encontraron órdenes"
      empty-description="Ajusta los filtros o espera a que Shopify envíe nuevas órdenes."
    >
      <tr v-for="order in orders" :key="order.id">
        <td>
          <strong>{{ order.shopifyOrderId }}</strong>
        </td>

        <td>
          <AppBadge variant="neutral">
            {{ order.shopDomain }}
          </AppBadge>
        </td>

        <td>
          <OrderStatusBadge :status="order.status" />
        </td>

        <td>{{ order.totalItems }}</td>

        <td>
          <AppBadge :variant="order.containsFragileItems ? 'warning' : 'neutral'">
            {{ order.containsFragileItems ? 'Frágil' : 'No frágil' }}
          </AppBadge>
        </td>

        <td>{{ order.processingAttempts }}</td>

        <td>{{ formatDateTime(order.receivedAt) }}</td>

        <td>{{ formatDateTime(order.updatedAt) }}</td>

        <td>
          <RouterLink class="orders-table__link" :to="`/orders/${order.id}`">
            Ver detalle
          </RouterLink>
        </td>
      </tr>
    </AppTable>
  </div>
</template>

<style scoped>
.orders-table {
  display: block;
}

.orders-table__link {
  color: var(--color-primary);
  font-size: var(--font-size-087);
  font-weight: var(--font-weight-semibold);
}

.orders-table__link:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

@media (max-width: 760px) {
  .orders-table {
    display: none;
  }
}
</style>
