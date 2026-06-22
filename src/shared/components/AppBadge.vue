<script setup lang="ts">
type BadgeVariant = 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'danger'
type BadgeSize = 'small' | 'medium'

withDefaults(
  defineProps<{
    variant?: BadgeVariant
    size?: BadgeSize
  }>(),
  {
    variant: 'neutral',
    size: 'medium',
  },
)
</script>

<template>
  <span class="app-badge" :class="[`app-badge--${variant}`, `app-badge--${size}`]">
    <slot />
  </span>
</template>

<style scoped>
.app-badge {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  white-space: nowrap;
}

.app-badge--small {
  min-height: 20px;
  padding: 0 var(--space-100);
  font-size: var(--font-size-075);
}

.app-badge--medium {
  min-height: 24px;
  padding: 0 var(--space-150);
  font-size: var(--font-size-075);
}

.app-badge--neutral {
  border-color: var(--color-neutral-border);
  background: var(--color-neutral-subdued);
  color: var(--color-text-subdued);
}

.app-badge--primary {
  border-color: var(--color-primary);
  background: var(--color-primary-subdued);
  color: var(--color-primary-active);
}

.app-badge--info {
  border-color: var(--color-info-border);
  background: var(--color-info-subdued);
  color: var(--color-info);
}

.app-badge--success {
  border-color: var(--color-success-border);
  background: var(--color-success-subdued);
  color: var(--color-success);
}

.app-badge--warning {
  border-color: var(--color-warning-border);
  background: var(--color-warning-subdued);
  color: var(--color-warning);
}

.app-badge--danger {
  border-color: var(--color-critical-border);
  background: var(--color-critical-subdued);
  color: var(--color-critical);
}
</style>
