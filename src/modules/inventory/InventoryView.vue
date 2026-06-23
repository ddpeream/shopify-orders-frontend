<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import AppAlert from '@/shared/components/AppAlert.vue'
import AppButton from '@/shared/components/AppButton.vue'
import AppCard from '@/shared/components/AppCard.vue'
import PageHeader from '@/shared/components/PageHeader.vue'
import { usePolling } from '@/shared/composables/usePolling'
import { environment } from '@/shared/config/environment'
import { formatDateTime } from '@/shared/utils/date-format'

import InventoryMobileList from './components/InventoryMobileList.vue'
import InventoryTable from './components/InventoryTable.vue'
import LowStockFilter from './components/LowStockFilter.vue'
import { useInventoryStore } from './inventory.store'

const inventoryStore = useInventoryStore()

const {
  visibleMaterials,
  lowStockMaterials,
  showOnlyLowStock,
  isLoading,
  isRefreshing,
  error,
  lastUpdatedAt,
} = storeToRefs(inventoryStore)

const emptyTitle = computed(() =>
  showOnlyLowStock.value ? 'No hay materiales en stock bajo' : 'No hay materiales registrados',
)

const emptyDescription = computed(() =>
  showOnlyLowStock.value
    ? 'Todos los materiales están por encima del umbral configurado.'
    : 'El inventario aún no tiene materiales disponibles para mostrar.',
)

async function handleRefresh(): Promise<void> {
  await inventoryStore.refreshInventory()
}

function handleLowStockFilterChange(value: boolean): void {
  inventoryStore.setShowOnlyLowStock(value)
}

const inventoryPolling = usePolling({
  intervalMs: environment.pollingIntervalMs,
  callback: () => inventoryStore.refreshInventory(),
})

onMounted(async () => {
  await inventoryStore.fetchInventory()
  inventoryPolling.start()
})

onBeforeUnmount(() => {
  inventoryPolling.stop()
  inventoryStore.cancelActiveRequest()
})
</script>

<template>
  <section class="inventory-view app-stack">
    <PageHeader
      title="Inventario de materiales"
      description="Consulta el stock disponible para cajas, etiquetas, cinta y materiales de relleno."
    >
      <template #actions>
        <AppButton variant="secondary" :loading="isRefreshing" @click="handleRefresh">
          Actualizar
        </AppButton>
      </template>

      <template #meta>
        <span v-if="lastUpdatedAt">Última actualización: {{ formatDateTime(lastUpdatedAt) }}</span>
        <span v-else>Sin actualización reciente</span>
      </template>
    </PageHeader>

    <AppAlert v-if="error" variant="error" title="No fue posible cargar el inventario">
      {{ error }}

      <template #actions>
        <AppButton variant="secondary" size="small" @click="inventoryStore.fetchInventory()">
          Reintentar
        </AppButton>
      </template>
    </AppAlert>

    <AppAlert
      v-if="lowStockMaterials.length > 0"
      variant="warning"
      title="Hay materiales con stock bajo"
    >
      {{ lowStockMaterials.length }} material(es) están por debajo o cerca del umbral configurado.
    </AppAlert>

    <AppCard
      title="Filtros"
      description="Alterna entre el inventario completo y los materiales con alerta de stock bajo."
    >
      <LowStockFilter
        :model-value="showOnlyLowStock"
        :low-stock-count="lowStockMaterials.length"
        :disabled="isLoading || isRefreshing"
        @update:model-value="handleLowStockFilterChange"
      />
    </AppCard>

    <AppCard
      title="Materiales"
      description="Inventario de solo lectura sincronizado con el backend operativo."
    >
      <InventoryTable
        :materials="visibleMaterials"
        :loading="isLoading"
        :empty-title="emptyTitle"
        :empty-description="emptyDescription"
      />

      <InventoryMobileList
        :materials="visibleMaterials"
        :loading="isLoading"
        :empty-title="emptyTitle"
        :empty-description="emptyDescription"
      />
    </AppCard>
  </section>
</template>
