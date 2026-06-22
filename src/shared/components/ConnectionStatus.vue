<script setup lang="ts">
type ConnectionState = 'connected' | 'checking' | 'offline'

const props = withDefaults(
  defineProps<{
    status?: ConnectionState
  }>(),
  {
    status: 'connected',
  },
)

const statusLabel: Record<ConnectionState, string> = {
  connected: 'Conectado',
  checking: 'Verificando',
  offline: 'Sin conexión',
}
</script>

<template>
  <span class="connection-status" :class="`connection-status--${props.status}`">
    <span class="connection-status__dot" aria-hidden="true" />
    <span>{{ statusLabel[props.status] }}</span>
  </span>
</template>

<style scoped>
.connection-status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-100);
  min-height: 32px;
  padding: 0 var(--space-150);
  border: 1px solid var(--color-border-subdued);
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  color: var(--color-text-subdued);
  font-size: var(--font-size-075);
  font-weight: var(--font-weight-semibold);
}

.connection-status__dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-pill);
}

.connection-status--connected .connection-status__dot {
  background: var(--color-success);
}

.connection-status--checking .connection-status__dot {
  background: var(--color-warning);
}

.connection-status--offline .connection-status__dot {
  background: var(--color-critical);
}
</style>
