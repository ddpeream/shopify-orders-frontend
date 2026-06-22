<script setup lang="ts">
type AlertVariant = 'info' | 'success' | 'warning' | 'error'

withDefaults(
  defineProps<{
    variant?: AlertVariant
    title?: string
    closable?: boolean
  }>(),
  {
    variant: 'info',
    closable: false,
  },
)

defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="app-alert" :class="`app-alert--${variant}`" role="alert">
    <div class="app-alert__icon" aria-hidden="true">
      <span v-if="variant === 'success'">✓</span>
      <span v-else-if="variant === 'warning'">!</span>
      <span v-else-if="variant === 'error'">×</span>
      <span v-else>i</span>
    </div>

    <div class="app-alert__content">
      <p v-if="title" class="app-alert__title">{{ title }}</p>
      <div class="app-alert__message">
        <slot />
      </div>

      <div v-if="$slots.actions" class="app-alert__actions">
        <slot name="actions" />
      </div>
    </div>

    <button
      v-if="closable"
      class="app-alert__close"
      type="button"
      aria-label="Cerrar alerta"
      @click="$emit('close')"
    >
      ×
    </button>
  </div>
</template>

<style scoped>
.app-alert {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-150);
  padding: var(--space-150);
  border: 1px solid transparent;
  border-radius: var(--radius-150);
  font-size: var(--font-size-087);
}

.app-alert__icon {
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border-radius: var(--radius-pill);
  font-weight: var(--font-weight-bold);
  line-height: 1;
}

.app-alert__title {
  margin: 0 0 var(--space-050);
  font-weight: var(--font-weight-semibold);
}

.app-alert__message {
  color: inherit;
}

.app-alert__message :deep(p) {
  margin: 0;
}

.app-alert__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-100);
  margin-top: var(--space-150);
}

.app-alert__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: var(--radius-100);
  background: transparent;
  color: inherit;
  font-size: var(--font-size-125);
}

.app-alert__close:hover {
  background: rgb(0 0 0 / 6%);
}

.app-alert--info {
  border-color: var(--color-info-border);
  background: var(--color-info-subdued);
  color: var(--color-info);
}

.app-alert--success {
  border-color: var(--color-success-border);
  background: var(--color-success-subdued);
  color: var(--color-success);
}

.app-alert--warning {
  border-color: var(--color-warning-border);
  background: var(--color-warning-subdued);
  color: var(--color-warning);
}

.app-alert--error {
  border-color: var(--color-critical-border);
  background: var(--color-critical-subdued);
  color: var(--color-critical);
}

.app-alert--info .app-alert__icon,
.app-alert--success .app-alert__icon,
.app-alert--warning .app-alert__icon,
.app-alert--error .app-alert__icon {
  background: rgb(255 255 255 / 70%);
}

@media (max-width: 640px) {
  .app-alert {
    grid-template-columns: auto 1fr;
  }

  .app-alert__close {
    grid-column: 2;
    justify-self: end;
  }
}
</style>
