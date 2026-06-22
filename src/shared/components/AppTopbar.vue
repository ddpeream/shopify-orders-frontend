<script setup lang="ts">
import ConnectionStatus from './ConnectionStatus.vue'

defineEmits<{
  'toggle-menu': []
}>()
</script>

<template>
  <header class="app-topbar">
    <div class="app-topbar__left">
      <button
        class="app-topbar__menu"
        type="button"
        aria-label="Abrir menú"
        @click="$emit('toggle-menu')"
      >
        ☰
      </button>

      <a class="app-topbar__skip" href="#main-content">Saltar al contenido</a>
    </div>

    <div class="app-topbar__right">
      <ConnectionStatus status="connected" />
    </div>
  </header>
</template>

<style scoped>
.app-topbar {
  position: sticky;
  z-index: 20;
  top: 0;
  display: flex;
  min-height: var(--layout-header-height);
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
  padding: 0 var(--space-300);
  border-bottom: 1px solid var(--color-border-subdued);
  background: rgb(255 255 255 / 88%);
  backdrop-filter: blur(12px);
}

.app-topbar__left,
.app-topbar__right {
  display: inline-flex;
  align-items: center;
  gap: var(--space-150);
}

.app-topbar__menu {
  display: none;
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-100);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-125);
}

.app-topbar__menu:hover {
  background: var(--color-surface-hover);
}

.app-topbar__skip {
  position: absolute;
  left: var(--space-200);
  top: -120px;
  padding: var(--space-100) var(--space-150);
  border-radius: var(--radius-100);
  background: var(--color-primary);
  color: var(--color-text-inverse);
  font-size: var(--font-size-087);
  font-weight: var(--font-weight-semibold);
}

.app-topbar__skip:focus {
  top: var(--space-100);
}

@media (max-width: 900px) {
  .app-topbar {
    padding: 0 var(--space-200);
  }

  .app-topbar__menu {
    display: inline-grid;
    place-items: center;
  }
}
</style>
