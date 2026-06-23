<script setup lang="ts">
import AppAlert from '@/shared/components/AppAlert.vue'

defineProps<{
  failureCode?: string | null
  failureReason?: string | null
}>()
</script>

<template>
  <AppAlert
    v-if="failureCode || failureReason"
    variant="error"
    title="La orden falló durante el procesamiento"
  >
    <div class="order-failure-alert">
      <p v-if="failureCode">
        <strong>Código:</strong>
        {{ failureCode }}
      </p>

      <p v-if="failureReason">
        <strong>Motivo:</strong>
        {{ failureReason }}
      </p>
    </div>
  </AppAlert>
</template>

<style scoped>
.order-failure-alert {
  display: grid;
  gap: var(--space-050);
}

.order-failure-alert p {
  margin: 0;
}
</style>
