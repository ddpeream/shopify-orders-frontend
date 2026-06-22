<script setup lang="ts">
withDefaults(
  defineProps<{
    lines?: number
    height?: string
    width?: string
    variant?: 'text' | 'card' | 'table'
  }>(),
  {
    lines: 3,
    height: '14px',
    width: '100%',
    variant: 'text',
  },
)
</script>

<template>
  <div class="skeleton-loader" :class="`skeleton-loader--${variant}`" aria-hidden="true">
    <template v-if="variant === 'table'">
      <div class="skeleton-loader__table-header" />
      <div v-for="line in lines" :key="line" class="skeleton-loader__table-row" />
    </template>

    <template v-else-if="variant === 'card'">
      <div class="skeleton-loader__card">
        <div class="skeleton-loader__line skeleton-loader__line--title" />
        <div v-for="line in lines" :key="line" class="skeleton-loader__line" />
      </div>
    </template>

    <template v-else>
      <div
        v-for="line in lines"
        :key="line"
        class="skeleton-loader__line"
        :style="{
          height,
          width: line === lines ? '72%' : width,
        }"
      />
    </template>
  </div>
</template>

<style scoped>
.skeleton-loader {
  display: grid;
  gap: var(--space-100);
  width: 100%;
}

.skeleton-loader__line,
.skeleton-loader__table-header,
.skeleton-loader__table-row {
  border-radius: var(--radius-100);
  background: linear-gradient(
    90deg,
    var(--color-surface-subdued) 0%,
    var(--color-border-subdued) 50%,
    var(--color-surface-subdued) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.2s ease-in-out infinite;
}

.skeleton-loader__line {
  min-height: 14px;
}

.skeleton-loader__line--title {
  width: 44%;
  height: 20px;
  margin-bottom: var(--space-050);
}

.skeleton-loader__card {
  display: grid;
  gap: var(--space-100);
  padding: var(--space-200);
  border: 1px solid var(--color-border-subdued);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.skeleton-loader__table-header {
  height: 44px;
  border-radius: var(--radius-150) var(--radius-150) var(--radius-050) var(--radius-050);
}

.skeleton-loader__table-row {
  height: 52px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 0;
  }

  100% {
    background-position: -100% 0;
  }
}
</style>
