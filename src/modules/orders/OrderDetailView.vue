<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

import AppButton from '@/shared/components/AppButton.vue'
import AppCard from '@/shared/components/AppCard.vue'
import PageHeader from '@/shared/components/PageHeader.vue'

const route = useRoute()

const orderId = computed(() => String(route.params.id ?? ''))
</script>

<template>
  <section class="app-stack">
    <PageHeader title="Detalle de orden" :description="`Orden seleccionada: ${orderId}`">
      <template #actions>
        <RouterLink to="/orders">
          <AppButton variant="secondary">Volver a órdenes</AppButton>
        </RouterLink>
      </template>
    </PageHeader>

    <AppCard
      title="Información de la orden"
      description="El detalle real de productos, historial, intentos y materiales se conectará en la fase de detalle."
    >
      <div class="order-detail-placeholder">
        <p class="order-detail-placeholder__label">ID de orden</p>
        <p class="order-detail-placeholder__value">{{ orderId }}</p>
      </div>
    </AppCard>
  </section>
</template>

<style scoped>
.order-detail-placeholder {
  display: grid;
  gap: var(--space-050);
}

.order-detail-placeholder__label {
  margin: 0;
  color: var(--color-text-subdued);
  font-size: var(--font-size-075);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
}

.order-detail-placeholder__value {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-size-125);
  font-weight: var(--font-weight-bold);
}
</style>
