<script setup lang="ts">
import { RouterLink } from 'vue-router'

import AppButton from '@/shared/components/AppButton.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
</script>

<template>
  <section class="app-stack">
    <EmptyState
      title="Página no encontrada"
      description="La ruta que intentas abrir no existe dentro del panel operativo."
    >
      <template #actions>
        <RouterLink to="/">
          <AppButton>Volver al dashboard</AppButton>
        </RouterLink>
      </template>
    </EmptyState>
  </section>
</template>
