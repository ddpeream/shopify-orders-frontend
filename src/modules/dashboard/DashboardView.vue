<script setup lang="ts">
import { environment } from '@/shared/config/environment'
</script>

<template>
  <main class="setup-page">
    <section class="setup-card">
      <p class="eyebrow">Shopify Operations</p>
      <h1>Frontend configurado</h1>
      <p>La base Vue está lista para construir el panel administrativo.</p>
      <small>API: {{ environment.apiBaseUrl }}</small>
    </section>
  </main>
</template>
