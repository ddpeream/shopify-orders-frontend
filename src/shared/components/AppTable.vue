<script setup lang="ts">
withDefaults(
  defineProps<{
    columns: string[]
    loading?: boolean
    empty?: boolean
    error?: string
    emptyTitle?: string
    emptyDescription?: string
  }>(),
  {
    loading: false,
    empty: false,
    emptyTitle: 'No hay información disponible',
    emptyDescription: 'Cuando existan datos, aparecerán en esta tabla.',
  },
)
</script>

<template>
  <div class="app-table-block">
    <div v-if="error" class="app-table-block__message app-table-block__message--error">
      {{ error }}
    </div>

    <div v-else-if="loading" class="app-table-block__loading">
      <div class="app-table-block__skeleton-header" />
      <div v-for="row in 4" :key="row" class="app-table-block__skeleton-row" />
    </div>

    <div v-else-if="empty" class="app-table-block__empty">
      <p class="app-table-block__empty-title">{{ emptyTitle }}</p>
      <p class="app-table-block__empty-description">{{ emptyDescription }}</p>
    </div>

    <div v-else class="app-table-wrapper">
      <table class="app-table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column" scope="col">
              {{ column }}
            </th>
          </tr>
        </thead>

        <tbody>
          <slot />
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.app-table-block {
  display: grid;
  gap: var(--space-150);
}

.app-table-block__message,
.app-table-block__empty,
.app-table-block__loading {
  border: 1px solid var(--color-border-subdued);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.app-table-block__message {
  padding: var(--space-200);
  color: var(--color-critical);
  font-size: var(--font-size-087);
}

.app-table-block__message--error {
  border-color: var(--color-critical-border);
  background: var(--color-critical-subdued);
}

.app-table-block__empty {
  display: grid;
  justify-items: center;
  gap: var(--space-050);
  padding: var(--space-400) var(--space-300);
  text-align: center;
}

.app-table-block__empty-title {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-size-100);
  font-weight: var(--font-weight-semibold);
}

.app-table-block__empty-description {
  max-width: 460px;
  margin: 0;
  color: var(--color-text-subdued);
  font-size: var(--font-size-087);
}

.app-table-block__loading {
  display: grid;
  gap: var(--space-100);
  padding: var(--space-150);
}

.app-table-block__skeleton-header,
.app-table-block__skeleton-row {
  border-radius: var(--radius-100);
  background: linear-gradient(
    90deg,
    var(--color-surface-subdued) 0%,
    var(--color-border-subdued) 50%,
    var(--color-surface-subdued) 100%
  );
  background-size: 200% 100%;
  animation: table-skeleton-loading 1.2s ease-in-out infinite;
}

.app-table-block__skeleton-header {
  height: 36px;
}

.app-table-block__skeleton-row {
  height: 44px;
}

@keyframes table-skeleton-loading {
  0% {
    background-position: 100% 0;
  }

  100% {
    background-position: -100% 0;
  }
}
</style>
