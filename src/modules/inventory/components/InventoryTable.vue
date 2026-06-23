<script setup lang="ts">
import AppBadge from '@/shared/components/AppBadge.vue'
import AppTable from '@/shared/components/AppTable.vue'
import { formatDateTime } from '@/shared/utils/date-format'

import StockLevel from './StockLevel.vue'

import type { InventoryItem } from '../inventory.types'

defineProps<{
  materials: InventoryItem[]
  loading?: boolean
  emptyTitle?: string
  emptyDescription?: string
}>()
</script>

<template>
  <div class="inventory-table">
    <AppTable
      :columns="['Código', 'Material', 'Stock actual', 'Umbral', 'Estado', 'Actualización']"
      :loading="loading"
      :empty="materials.length === 0"
      :empty-title="emptyTitle ?? 'No hay materiales para mostrar'"
      :empty-description="
        emptyDescription ?? 'No se encontraron materiales con los filtros actuales.'
      "
    >
      <tr v-for="material in materials" :key="material.id ?? material.code">
        <td>
          <AppBadge variant="neutral">
            {{ material.code }}
          </AppBadge>
        </td>

        <td>
          <strong>{{ material.name }}</strong>
        </td>

        <td>
          <StockLevel
            :current-stock="material.stock ? material.stock : 0"
            :low-stock-threshold="material.lowStockThreshold"
            :low-stock="material.lowStock"
          />
        </td>

        <td>{{ material.lowStockThreshold }}</td>

        <td>
          <AppBadge :variant="material.lowStock ? 'danger' : 'success'">
            {{ material.lowStock ? 'Crítico' : 'Normal' }}
          </AppBadge>
        </td>

        <td>{{ formatDateTime(material.updatedAt) }}</td>
      </tr>
    </AppTable>
  </div>
</template>

<style scoped>
.inventory-table {
  display: block;
}

@media (max-width: 760px) {
  .inventory-table {
    display: none;
  }
}
</style>
