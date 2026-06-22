<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    page: number
    totalPages: number
    totalItems?: number
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)

const emit = defineEmits<{
  change: [page: number]
}>()

function goToPreviousPage(): void {
  if (props.disabled || props.page <= 1) return

  emit('change', props.page - 1)
}

function goToNextPage(): void {
  if (props.disabled || props.page >= props.totalPages) return

  emit('change', props.page + 1)
}
</script>

<template>
  <nav class="app-pagination" aria-label="Paginación">
    <p class="app-pagination__summary">
      Página <strong>{{ page }}</strong> de <strong>{{ totalPages }}</strong>
      <span v-if="totalItems !== undefined"> · {{ totalItems }} registros</span>
    </p>

    <div class="app-pagination__actions">
      <button
        class="app-pagination__button"
        type="button"
        :disabled="disabled || page <= 1"
        @click="goToPreviousPage"
      >
        Anterior
      </button>

      <button
        class="app-pagination__button"
        type="button"
        :disabled="disabled || page >= totalPages"
        @click="goToNextPage"
      >
        Siguiente
      </button>
    </div>
  </nav>
</template>

<style scoped>
.app-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
  padding: var(--space-150) 0;
}

.app-pagination__summary {
  margin: 0;
  color: var(--color-text-subdued);
  font-size: var(--font-size-087);
}

.app-pagination__summary strong {
  color: var(--color-text);
  font-weight: var(--font-weight-semibold);
}

.app-pagination__actions {
  display: inline-flex;
  align-items: center;
  gap: var(--space-100);
}

.app-pagination__button {
  min-height: 36px;
  padding: 0 var(--space-150);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-100);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-087);
  font-weight: var(--font-weight-semibold);
  transition:
    background 120ms ease,
    border-color 120ms ease,
    box-shadow 120ms ease;
}

.app-pagination__button:not(:disabled):hover {
  background: var(--color-surface-hover);
}

.app-pagination__button:focus-visible {
  box-shadow: var(--shadow-focus);
}

.app-pagination__button:disabled {
  color: var(--color-text-muted);
  opacity: 0.65;
}

@media (max-width: 640px) {
  .app-pagination {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
