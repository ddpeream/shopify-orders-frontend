<script setup lang="ts">
type SpinnerSize = 'small' | 'medium' | 'large'

withDefaults(
  defineProps<{
    size?: SpinnerSize
    label?: string
  }>(),
  {
    size: 'medium',
  },
)
</script>

<template>
  <span class="app-spinner" :class="`app-spinner--${size}`" role="status" aria-live="polite">
    <span class="app-spinner__circle" aria-hidden="true" />
    <span v-if="label" class="app-spinner__label">{{ label }}</span>
    <span v-else class="sr-only">Cargando</span>
  </span>
</template>

<style scoped>
.app-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-100);
  color: currentcolor;
}

.app-spinner__circle {
  display: inline-block;
  border: 2px solid currentcolor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: app-spinner-rotate 700ms linear infinite;
}

.app-spinner--small .app-spinner__circle {
  width: 14px;
  height: 14px;
}

.app-spinner--medium .app-spinner__circle {
  width: 20px;
  height: 20px;
}

.app-spinner--large .app-spinner__circle {
  width: 32px;
  height: 32px;
}

.app-spinner__label {
  color: var(--color-text-subdued);
  font-size: var(--font-size-087);
}

@keyframes app-spinner-rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
