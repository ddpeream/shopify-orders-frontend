<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const props = withDefaults(
  defineProps<{
    open?: boolean
  }>(),
  {
    open: false,
  },
)

const emit = defineEmits<{
  close: []
}>()

const route = useRoute()

const navigationItems = [
  {
    label: 'Dashboard',
    to: '/',
    icon: '⌂',
  },
  {
    label: 'Órdenes',
    to: '/orders',
    icon: '▦',
  },
  {
    label: 'Inventario',
    to: '/inventory',
    icon: '◫',
  },
]

const sidebarClasses = computed(() => ({
  'app-sidebar--open': props.open,
}))

function isActivePath(path: string): boolean {
  if (path === '/') return route.path === '/'

  return route.path.startsWith(path)
}

function handleNavigation(): void {
  emit('close')
}
</script>

<template>
  <aside class="app-sidebar" :class="sidebarClasses" aria-label="Navegación principal">
    <div class="app-sidebar__brand">
      <div class="app-sidebar__logo">S</div>

      <div>
        <p class="app-sidebar__eyebrow">Shopify Ops</p>
        <p class="app-sidebar__title">Panel operativo</p>
      </div>

      <button
        class="app-sidebar__close"
        type="button"
        aria-label="Cerrar menú"
        @click="$emit('close')"
      >
        ×
      </button>
    </div>

    <nav class="app-sidebar__nav" aria-label="Secciones">
      <RouterLink
        v-for="item in navigationItems"
        :key="item.to"
        class="app-sidebar__link"
        :class="{ 'app-sidebar__link--active': isActivePath(item.to) }"
        :to="item.to"
        @click="handleNavigation"
      >
        <span class="app-sidebar__icon" aria-hidden="true">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="app-sidebar__footer">
      <p>Gestión de órdenes e inventario de empaque.</p>
    </div>
  </aside>
</template>

<style scoped>
.app-sidebar {
  position: fixed;
  z-index: 40;
  inset: 0 auto 0 0;
  display: flex;
  width: var(--layout-sidebar-width);
  flex-direction: column;
  border-right: 1px solid var(--color-border-subdued);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.app-sidebar__brand {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-150);
  padding: var(--space-200);
  border-bottom: 1px solid var(--color-border-subdued);
}

.app-sidebar__logo {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: var(--radius-150);
  background: var(--color-primary);
  color: var(--color-text-inverse);
  font-weight: var(--font-weight-bold);
}

.app-sidebar__eyebrow {
  margin: 0;
  color: var(--color-text-subdued);
  font-size: var(--font-size-075);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
}

.app-sidebar__title {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-size-087);
  font-weight: var(--font-weight-bold);
}

.app-sidebar__close {
  display: none;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: var(--radius-100);
  background: transparent;
  color: var(--color-text-subdued);
  font-size: var(--font-size-150);
}

.app-sidebar__close:hover {
  background: var(--color-surface-hover);
}

.app-sidebar__nav {
  display: grid;
  gap: var(--space-050);
  padding: var(--space-150);
}

.app-sidebar__link {
  display: flex;
  align-items: center;
  gap: var(--space-150);
  padding: var(--space-150);
  border-radius: var(--radius-150);
  color: var(--color-text-subdued);
  font-size: var(--font-size-087);
  font-weight: var(--font-weight-semibold);
}

.app-sidebar__link:hover {
  background: var(--color-surface-hover);
  color: var(--color-text);
}

.app-sidebar__link--active {
  background: var(--color-primary-subdued);
  color: var(--color-primary-active);
}

.app-sidebar__icon {
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border-radius: var(--radius-100);
  background: rgb(0 0 0 / 4%);
}

.app-sidebar__footer {
  margin-top: auto;
  padding: var(--space-200);
  border-top: 1px solid var(--color-border-subdued);
  color: var(--color-text-subdued);
  font-size: var(--font-size-075);
}

.app-sidebar__footer p {
  margin: 0;
}

@media (max-width: 900px) {
  .app-sidebar {
    transform: translateX(-100%);
    transition: transform 160ms ease;
  }

  .app-sidebar--open {
    transform: translateX(0);
  }

  .app-sidebar__close {
    display: inline-grid;
    place-items: center;
  }
}
</style>
