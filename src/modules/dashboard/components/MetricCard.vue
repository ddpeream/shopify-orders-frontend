<script setup lang="ts">
import AppCard from '@/shared/components/AppCard.vue'

defineProps<{
  title: string
  value: string | number
  description?: string
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
}>()
</script>

<template>
  <AppCard compact>
    <div class="metric-card" :class="tone ? `metric-card--${tone}` : 'metric-card--neutral'">
      <p class="metric-card__title">{{ title }}</p>
      <p class="metric-card__value">{{ value }}</p>
      <p v-if="description" class="metric-card__description">{{ description }}</p>
    </div>
  </AppCard>
</template>

<style scoped>
.metric-card {
  display: grid;
  gap: var(--space-050);
}

.metric-card__title {
  margin: 0;
  color: var(--color-text-subdued);
  font-size: var(--font-size-075);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.metric-card__value {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-size-200);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.metric-card__description {
  margin: 0;
  color: var(--color-text-subdued);
  font-size: var(--font-size-087);
}

.metric-card--success .metric-card__value {
  color: var(--color-success);
}

.metric-card--warning .metric-card__value {
  color: var(--color-warning);
}

.metric-card--danger .metric-card__value {
  color: var(--color-critical);
}

.metric-card--info .metric-card__value {
  color: var(--color-info);
}
</style>
