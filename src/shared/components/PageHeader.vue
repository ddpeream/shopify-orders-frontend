<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <header class="page-header">
    <div class="page-header__main">
      <div>
        <p v-if="$slots.eyebrow" class="eyebrow">
          <slot name="eyebrow" />
        </p>

        <h1 class="page-header__title">{{ title }}</h1>

        <p v-if="description" class="page-header__description">
          {{ description }}
        </p>
      </div>

      <div v-if="$slots.actions" class="page-header__actions">
        <slot name="actions" />
      </div>
    </div>

    <div v-if="$slots.meta" class="page-header__meta">
      <slot name="meta" />
    </div>
  </header>
</template>

<style scoped>
.page-header {
  display: grid;
  gap: var(--space-150);
}

.page-header__main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-200);
}

.page-header__title {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-size-150);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.page-header__description {
  max-width: 760px;
  margin: var(--space-050) 0 0;
  color: var(--color-text-subdued);
  font-size: var(--font-size-087);
}

.page-header__actions {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--space-100);
}

.page-header__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-100);
  color: var(--color-text-subdued);
  font-size: var(--font-size-087);
}

@media (max-width: 640px) {
  .page-header__main {
    flex-direction: column;
  }

  .page-header__actions {
    width: 100%;
    justify-content: flex-start;
  }

  .page-header__title {
    font-size: var(--font-size-125);
  }
}
</style>
