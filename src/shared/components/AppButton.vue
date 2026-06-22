<script setup lang="ts">
import AppSpinner from './AppSpinner.vue'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'small' | 'medium' | 'large'
type ButtonType = 'button' | 'submit' | 'reset'

withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    type?: ButtonType
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'medium',
    type: 'button',
    loading: false,
    disabled: false,
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="app-button"
    :class="[`app-button--${variant}`, `app-button--${size}`]"
    :type="type"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <AppSpinner v-if="loading" size="small" />
    <span class="app-button__content" :class="{ 'app-button__content--hidden': loading }">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  position: relative;
  align-items: center;
  justify-content: center;
  gap: var(--space-100);
  border: 1px solid transparent;
  border-radius: var(--radius-100);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  transition:
    background 120ms ease,
    border-color 120ms ease,
    color 120ms ease,
    box-shadow 120ms ease,
    transform 80ms ease;
}

.app-button:not(:disabled):active {
  transform: translateY(1px);
}

.app-button:focus-visible {
  box-shadow: var(--shadow-focus);
}

.app-button:disabled {
  opacity: 0.6;
}

.app-button--small {
  min-height: 32px;
  padding: 0 var(--space-150);
  font-size: var(--font-size-075);
}

.app-button--medium {
  min-height: 40px;
  padding: 0 var(--space-200);
  font-size: var(--font-size-087);
}

.app-button--large {
  min-height: 48px;
  padding: 0 var(--space-300);
  font-size: var(--font-size-100);
}

.app-button--primary {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

.app-button--primary:not(:disabled):hover {
  border-color: var(--color-primary-hover);
  background: var(--color-primary-hover);
}

.app-button--secondary {
  border-color: var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
}

.app-button--secondary:not(:disabled):hover {
  background: var(--color-surface-hover);
}

.app-button--ghost {
  border-color: transparent;
  background: transparent;
  color: var(--color-text);
}

.app-button--ghost:not(:disabled):hover {
  background: var(--color-surface-hover);
}

.app-button--danger {
  border-color: var(--color-critical);
  background: var(--color-critical);
  color: var(--color-text-inverse);
}

.app-button--danger:not(:disabled):hover {
  border-color: #b42318;
  background: #b42318;
}

.app-button__content {
  display: inline-flex;
  align-items: center;
  gap: var(--space-100);
}

.app-button__content--hidden {
  opacity: 0.35;
}
</style>
