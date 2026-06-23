<script setup lang="ts">
import AppBadge from '@/shared/components/AppBadge.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
import SkeletonLoader from '@/shared/components/SkeletonLoader.vue'
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
  <div class="inventory-mobile-list">
    <SkeletonLoader v-if="loading" variant="card" :lines="5" />

    <EmptyState
      v-else-if="materials.length === 0"
      :title="emptyTitle ?? 'No hay materiales para mostrar'"
      :description="emptyDescription ?? 'No se encontraron materiales con los filtros actuales.'"
    />

    <article
      v-for="material in materials"
      v-else
      :key="material.id ?? material.code"
      class="inventory-mobile-list__card"
    >
      <div class="inventory-mobile-list__header">
        <div>
          <p class="inventory-mobile-list__label">Material</p>
          <h2 class="inventory-mobile-list__title">{{ material.name }}</h2>
        </div>

        <AppBadge :variant="material.lowStock ? 'danger' : 'success'">
          {{ material.lowStock ? 'Crítico' : 'Normal' }}
        </AppBadge>
      </div>

      <AppBadge variant="neutral">
        {{ material.code }}
      </AppBadge>

      <StockLevel
        :current-stock="material.stock ? material.stock : 0"
        :low-stock-threshold="material.lowStockThreshold"
        :low-stock="material.lowStock"
      />

      <p class="inventory-mobile-list__updated">
        Actualizado: {{ formatDateTime(material.updatedAt) }}
      </p>
    </article>
  </div>
</template>

<style scoped>
.inventory-mobile-list {
  display: none;
}

.inventory-mobile-list__card {
  display: grid;
  gap: var(--space-150);
  padding: var(--space-200);
  border: 1px solid var(--color-border-subdued);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.inventory-mobile-list__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-150);
}

.inventory-mobile-list__label {
  margin: 0;
  color: var(--color-text-subdued);
  font-size: var(--font-size-075);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.inventory-mobile-list__title {
  margin: var(--space-050) 0 0;
  color: var(--color-text);
  font-size: var(--font-size-125);
  font-weight: var(--font-weight-bold);
}

.inventory-mobile-list__updated {
  margin: 0;
  color: var(--color-text-subdued);
  font-size: var(--font-size-075);
}

@media (max-width: 760px) {
  .inventory-mobile-list {
    display: grid;
    gap: var(--space-150);
  }
}
</style>
