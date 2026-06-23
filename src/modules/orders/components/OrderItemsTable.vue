<script setup lang="ts">
import AppBadge from '@/shared/components/AppBadge.vue'
import AppCard from '@/shared/components/AppCard.vue'
import AppTable from '@/shared/components/AppTable.vue'
import { formatInteger } from '@/shared/utils/number-format'

defineProps<{
  items: Array<{
    id?: string
    shopifyProductId?: string | null
    shopifyVariantId?: string | null
    sku?: string | null
    name: string
    quantity: number
    isFragile: boolean
  }>
}>()
</script>

<template>
  <AppCard title="Productos" description="Productos incluidos en la orden recibida desde Shopify.">
    <AppTable
      :columns="['Producto', 'SKU', 'Producto Shopify', 'Variante', 'Cantidad', 'Fragilidad']"
      :empty="items.length === 0"
      empty-title="No hay productos registrados"
      empty-description="La orden no tiene productos asociados o no pudieron ser cargados."
    >
      <tr v-for="item in items" :key="item.id ?? `${item.name}-${item.sku ?? 'sin-sku'}`">
        <td>
          <strong>{{ item.name }}</strong>
        </td>

        <td>{{ item.sku ?? 'Sin SKU' }}</td>

        <td>{{ item.shopifyProductId ?? 'No disponible' }}</td>

        <td>{{ item.shopifyVariantId ?? 'No disponible' }}</td>

        <td>{{ formatInteger(item.quantity) }}</td>

        <td>
          <AppBadge :variant="item.isFragile ? 'warning' : 'neutral'">
            {{ item.isFragile ? 'Frágil' : 'No frágil' }}
          </AppBadge>
        </td>
      </tr>
    </AppTable>
  </AppCard>
</template>
