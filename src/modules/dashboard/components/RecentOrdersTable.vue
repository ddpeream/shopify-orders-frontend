<script setup lang="ts">
import { RouterLink } from 'vue-router'

import AppBadge from '@/shared/components/AppBadge.vue'
import AppCard from '@/shared/components/AppCard.vue'
import AppTable from '@/shared/components/AppTable.vue'
import OrderStatusBadge from '@/modules/orders/components/OrderStatusBadge.vue'
import { formatDateTime } from '@/shared/utils/date-format'

import type { DashboardRecentOrder } from '../dashboard.types'

defineProps<{
  orders: DashboardRecentOrder[]
}>()
</script>

<template>
  <AppCard title="Órdenes recientes" description="Últimas órdenes registradas en el sistema.">
    <AppTable
      :columns="['Orden', 'Tienda', 'Estado', 'Fecha', 'Acciones']"
      :empty="orders.length === 0"
      empty-title="No hay órdenes recientes"
      empty-description="Cuando Shopify envíe órdenes, aparecerán en esta sección."
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

        <td>{{ formatDateTime(order.receivedAt) }}</td>

        <td>
          <RouterLink class="recent-orders-table__link" :to="`/orders/${order.id}`">
            Ver detalle
          </RouterLink>
        </td>
      </tr>
    </AppTable>
  </AppCard>
</template>

<style scoped>
.recent-orders-table__link {
  color: var(--color-primary);
  font-size: var(--font-size-087);
  font-weight: var(--font-weight-semibold);
}

.recent-orders-table__link:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}
</style>
