<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'

import AppSidebar from '@/shared/components/AppSidebar.vue'
import AppTopbar from '@/shared/components/AppTopbar.vue'
import { useOnlineStatus } from '@/shared/composables/useOnlineStatus'

const isMobileMenuOpen = ref(false)
const { isOnline, statusLabel } = useOnlineStatus()

function openMobileMenu(): void {
  isMobileMenuOpen.value = true
}

function closeMobileMenu(): void {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div class="admin-layout">
    <AppSidebar :open="isMobileMenuOpen" @close="closeMobileMenu" />

    <button
      v-if="isMobileMenuOpen"
      class="admin-layout__overlay"
      type="button"
      aria-label="Cerrar menú"
      @click="closeMobileMenu"
    />

    <div class="admin-layout__content">
      <AppTopbar @toggle-menu="openMobileMenu">
        <ConnectionStatus :online="isOnline" :label="statusLabel" />
      </AppTopbar>

      <main id="main-content" class="admin-layout__main" tabindex="-1">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: var(--color-background);
}

.admin-layout__content {
  min-width: 0;
  padding-left: var(--layout-sidebar-width);
}

.admin-layout__main {
  width: min(100%, var(--layout-page-max-width));
  margin: 0 auto;
  padding: var(--space-300);
}

.admin-layout__overlay {
  display: none;
}

@media (max-width: 900px) {
  .admin-layout__content {
    padding-left: 0;
  }

  .admin-layout__main {
    padding: var(--space-200);
  }

  .admin-layout__overlay {
    display: block;
    position: fixed;
    z-index: 30;
    inset: 0;
    border: 0;
    background: rgb(0 0 0 / 35%);
  }
}
</style>
