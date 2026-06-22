<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="empty-state">
    <div v-if="$slots.icon" class="empty-state__icon" aria-hidden="true">
      <slot name="icon" />
    </div>

    <div v-else class="empty-state__icon" aria-hidden="true">□</div>

    <h2 class="empty-state__title">{{ title }}</h2>

    <p v-if="description" class="empty-state__description">
      {{ description }}
    </p>

    <div v-if="$slots.actions" class="empty-state__actions">
      <slot name="actions" />
    </div>

    <div v-if="$slots.default" class="empty-state__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: grid;
  justify-items: center;
  gap: var(--space-150);
  padding: var(--space-500) var(--space-300);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  color: var(--color-text);
  text-align: center;
}

.empty-state__icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: var(--radius-300);
  background: var(--color-surface-subdued);
  color: var(--color-text-subdued);
  font-size: var(--font-size-150);
  font-weight: var(--font-weight-semibold);
}

.empty-state__title {
  margin: 0;
  font-size: var(--font-size-125);
  font-weight: var(--font-weight-semibold);
}

.empty-state__description {
  max-width: 520px;
  margin: 0;
  color: var(--color-text-subdued);
  font-size: var(--font-size-087);
}

.empty-state__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-100);
  margin-top: var(--space-050);
}

.empty-state__content {
  max-width: 620px;
  color: var(--color-text-subdued);
  font-size: var(--font-size-087);
}
</style>
