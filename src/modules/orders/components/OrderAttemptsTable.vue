<script setup lang="ts">
import AppBadge from '@/shared/components/AppBadge.vue'
import AppCard from '@/shared/components/AppCard.vue'
import AppTable from '@/shared/components/AppTable.vue'
import { formatDateTime } from '@/shared/utils/date-format'
import { formatInteger } from '@/shared/utils/number-format'

defineProps<{
  attempts: Array<{
    id?: string
    attemptNumber: number
    status: string
    errorCode?: string | null
    errorMessage?: string | null
    startedAt?: string | null
    finishedAt?: string | null
  }>
}>()

function getAttemptVariant(status: string): 'neutral' | 'success' | 'warning' | 'danger' | 'info' {
  const normalizedStatus = status.toUpperCase()

  if (normalizedStatus === 'SUCCESS' || normalizedStatus === 'COMPLETED') return 'success'
  if (normalizedStatus === 'FAILED' || normalizedStatus === 'ERROR') return 'danger'
  if (normalizedStatus === 'PROCESSING' || normalizedStatus === 'RUNNING') return 'info'

  return 'neutral'
}
</script>

<template>
  <AppCard
    title="Intentos de procesamiento"
    description="Registro de ejecuciones realizadas por el procesamiento asíncrono."
  >
    <AppTable
      :columns="['Intento', 'Estado', 'Inicio', 'Fin', 'Error']"
      :empty="attempts.length === 0"
      empty-title="Sin intentos registrados"
      empty-description="La orden aún no registra intentos de procesamiento."
    >
      <tr v-for="attempt in attempts" :key="attempt.id ?? attempt.attemptNumber">
        <td>{{ formatInteger(attempt.attemptNumber) }}</td>

        <td>
          <AppBadge :variant="getAttemptVariant(attempt.status)">
            {{ attempt.status }}
          </AppBadge>
        </td>

        <td>{{ formatDateTime(attempt.startedAt) }}</td>

        <td>{{ formatDateTime(attempt.finishedAt) }}</td>

        <td>
          <div v-if="attempt.errorCode || attempt.errorMessage" class="order-attempts-table__error">
            <strong v-if="attempt.errorCode">{{ attempt.errorCode }}</strong>
            <span v-if="attempt.errorMessage">{{ attempt.errorMessage }}</span>
          </div>

          <span v-else class="order-attempts-table__muted">Sin error</span>
        </td>
      </tr>
    </AppTable>
  </AppCard>
</template>

<style scoped>
.order-attempts-table__error {
  display: grid;
  gap: var(--space-025);
  color: var(--color-critical);
  font-size: var(--font-size-087);
}

.order-attempts-table__muted {
  color: var(--color-text-subdued);
  font-size: var(--font-size-087);
}
</style>
