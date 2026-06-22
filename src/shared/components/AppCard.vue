<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
    compact?: boolean
    borderless?: boolean
  }>(),
  {
    compact: false,
    borderless: false,
  },
)
</script>

<template>
  <section
    class="app-card"
    :class="{
      'app-card--compact': compact,
      'app-card--borderless': borderless,
    }"
  >
    <header v-if="title || description || $slots.actions" class="app-card__header">
      <div>
        <h2 v-if="title" class="app-card__title">{{ title }}</h2>
        <p v-if="description" class="app-card__description">{{ description }}</p>
      </div>

      <div v-if="$slots.actions" class="app-card__actions">
        <slot name="actions" />
      </div>
    </header>

    <div class="app-card__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.app-card {
  border: 1px solid var(--color-border-subdued);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.app-card--borderless {
  border-color: transparent;
  box-shadow: none;
}

.app-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-200);
  padding: var(--space-200) var(--space-200) 0;
}

.app-card__title {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-size-100);
  font-weight: var(--font-weight-semibold);
}

.app-card__description {
  margin: var(--space-050) 0 0;
  color: var(--color-text-subdued);
  font-size: var(--font-size-087);
}

.app-card__actions {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--space-100);
}

.app-card__body {
  padding: var(--space-200);
}

.app-card--compact .app-card__header {
  padding: var(--space-150) var(--space-150) 0;
}

.app-card--compact .app-card__body {
  padding: var(--space-150);
}

@media (max-width: 640px) {
  .app-card__header {
    flex-direction: column;
  }

  .app-card__actions {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
