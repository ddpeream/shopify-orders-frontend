<script setup lang="ts">
import AppBadge from '@/shared/components/AppBadge.vue'
import AppCard from '@/shared/components/AppCard.vue'

defineProps<{
  lowStockCount: number
}>()
</script>

<template>
  <AppCard title="Inventario bajo" description="Materiales que requieren revisión o reposición.">
    <div class="low-stock-summary">
      <div>
        <p class="low-stock-summary__value">{{ lowStockCount }}</p>
        <p class="low-stock-summary__label">Materiales bajo umbral</p>
      </div>

      <AppBadge :variant="lowStockCount > 0 ? 'warning' : 'success'">
        {{ lowStockCount > 0 ? 'Requiere atención' : 'Inventario estable' }}
      </AppBadge>
    </div>
  </AppCard>
</template>

<style scoped>
.low-stock-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
}

.low-stock-summary__value {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-size-200);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.low-stock-summary__label {
  margin: var(--space-050) 0 0;
  color: var(--color-text-subdued);
  font-size: var(--font-size-087);
}

@media (max-width: 640px) {
  .low-stock-summary {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
