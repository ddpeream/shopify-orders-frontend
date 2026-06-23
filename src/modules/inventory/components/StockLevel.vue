<script setup lang="ts">
import { computed } from 'vue'

import AppBadge from '@/shared/components/AppBadge.vue'
import { formatInteger } from '@/shared/utils/number-format'

const props = defineProps<{
  currentStock: number
  lowStockThreshold: number
  lowStock: boolean
}>()

const percentage = computed(() => {
  const safeThreshold = Math.max(props.lowStockThreshold, 1)
  const base = safeThreshold * 2
  const value = Math.round((props.currentStock / base) * 100)

  return Math.min(Math.max(value, 0), 100)
})
</script>

<template>
  <div class="stock-level">
    <div class="stock-level__header">
      <strong>{{ formatInteger(currentStock) }}</strong>

      <AppBadge :variant="lowStock ? 'danger' : 'success'">
        {{ lowStock ? 'Stock bajo' : 'Disponible' }}
      </AppBadge>
    </div>

    <div
      class="stock-level__bar"
      role="progressbar"
      :aria-valuenow="percentage"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <span class="stock-level__fill" :style="{ width: `${percentage}%` }" />
    </div>

    <p class="stock-level__threshold">Umbral: {{ formatInteger(lowStockThreshold) }}</p>
  </div>
</template>

<style scoped>
.stock-level {
  display: grid;
  gap: var(--space-075);
}

.stock-level__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-100);
}

.stock-level__header strong {
  color: var(--color-text);
  font-size: var(--font-size-100);
  font-weight: var(--font-weight-bold);
}

.stock-level__bar {
  height: 8px;
  overflow: hidden;
  border-radius: var(--radius-pill);
  background: var(--color-surface-subdued);
}

.stock-level__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: currentColor;
}

.stock-level__threshold {
  margin: 0;
  color: var(--color-text-subdued);
  font-size: var(--font-size-075);
}
</style>
