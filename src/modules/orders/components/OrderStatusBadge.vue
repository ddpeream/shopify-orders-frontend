<script setup lang="ts">
import AppBadge from '@/shared/components/AppBadge.vue'

import type { OrderStatus } from '../order.types'

const statusLabel: Record<OrderStatus, string> = {
  RECEIVED: 'Recibida',
  QUEUED: 'En cola',
  PROCESSING: 'Procesando',
  PROCESSED: 'Procesada',
  FAILED: 'Fallida',
}

const statusVariant: Record<
  OrderStatus,
  'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'danger'
> = {
  RECEIVED: 'info',
  QUEUED: 'warning',
  PROCESSING: 'primary',
  PROCESSED: 'success',
  FAILED: 'danger',
}

defineProps<{
  status: OrderStatus
}>()
</script>

<template>
  <AppBadge :variant="statusVariant[status]">
    {{ statusLabel[status] }}
  </AppBadge>
</template>
