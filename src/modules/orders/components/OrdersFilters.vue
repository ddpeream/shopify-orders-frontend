<script setup lang="ts">
import { reactive, watch } from 'vue'

import AppButton from '@/shared/components/AppButton.vue'
import { useDebounce } from '@/shared/composables/useDebounce'

import type { OrderListFilters, OrderStatus } from '../order.types'

type SortDirection = 'ASC' | 'DESC'

const props = defineProps<{
  filters: Partial<OrderListFilters>
  disabled?: boolean
}>()

const emit = defineEmits<{
  change: [filters: Partial<OrderListFilters>]
  reset: []
}>()

const localFilters = reactive({
  status: props.filters.status ?? '',
  shopId: props.filters.shopId ?? '',
  shopDomain: props.filters.shopDomain ?? '',
  shopifyOrderId: props.filters.shopifyOrderId ?? '',
  dateFrom: props.filters.dateFrom ?? '',
  dateTo: props.filters.dateTo ?? '',
  limit: props.filters.limit ?? 20,
  sortBy: props.filters.sortBy ?? 'receivedAt',
  sortDirection: (props.filters.sortDirection ?? 'DESC') as SortDirection,
})

const debouncedEmitSearchChange = useDebounce(() => {
  emitFilters()
}, 350)

function emitFilters(): void {
  const filters: Partial<OrderListFilters> = {}

  if (localFilters.status) {
    filters.status = localFilters.status as OrderStatus
  }

  if (localFilters.shopId.trim()) {
    filters.shopId = localFilters.shopId.trim()
  }

  if (localFilters.shopDomain.trim()) {
    filters.shopDomain = localFilters.shopDomain.trim()
  }

  if (localFilters.shopifyOrderId.trim()) {
    filters.shopifyOrderId = localFilters.shopifyOrderId.trim()
  }

  if (localFilters.dateFrom) {
    filters.dateFrom = localFilters.dateFrom
  }

  if (localFilters.dateTo) {
    filters.dateTo = localFilters.dateTo
  }

  filters.limit = Number(localFilters.limit)
  filters.sortBy = localFilters.sortBy as OrderListFilters['sortBy']
  filters.sortDirection = localFilters.sortDirection

  emit('change', filters)
}

function handleImmediateChange(): void {
  emitFilters()
}

function handleSearchChange(): void {
  debouncedEmitSearchChange()
}

function handleReset(): void {
  localFilters.status = ''
  localFilters.shopId = ''
  localFilters.shopDomain = ''
  localFilters.shopifyOrderId = ''
  localFilters.dateFrom = ''
  localFilters.dateTo = ''
  localFilters.limit = 20
  localFilters.sortBy = 'receivedAt'
  localFilters.sortDirection = 'DESC'

  emit('reset')
}

watch(
  () => props.filters,
  (nextFilters) => {
    localFilters.status = nextFilters.status ?? ''
    localFilters.shopId = nextFilters.shopId ?? ''
    localFilters.shopDomain = nextFilters.shopDomain ?? ''
    localFilters.shopifyOrderId = nextFilters.shopifyOrderId ?? ''
    localFilters.dateFrom = nextFilters.dateFrom ?? ''
    localFilters.dateTo = nextFilters.dateTo ?? ''
    localFilters.limit = nextFilters.limit ?? 20
    localFilters.sortBy = nextFilters.sortBy ?? 'receivedAt'
    localFilters.sortDirection = (nextFilters.sortDirection ?? 'DESC') as SortDirection
  },
  { deep: true },
)
</script>

<template>
  <form class="orders-filters" @submit.prevent="emitFilters">
    <div class="orders-filters__grid">
      <label class="orders-filters__field">
        <span>Estado</span>
        <select
          v-model="localFilters.status"
          class="app-select"
          :disabled="disabled"
          @change="handleImmediateChange"
        >
          <option value="">Todos</option>
          <option value="RECEIVED">Recibida</option>
          <option value="QUEUED">En cola</option>
          <option value="PROCESSING">Procesando</option>
          <option value="PROCESSED">Procesada</option>
          <option value="FAILED">Fallida</option>
        </select>
      </label>

      <label class="orders-filters__field">
        <span>ID tienda</span>
        <input
          v-model="localFilters.shopId"
          class="app-input"
          type="text"
          placeholder="UUID o identificador"
          :disabled="disabled"
          @input="handleSearchChange"
        />
      </label>

      <label class="orders-filters__field">
        <span>Dominio tienda</span>
        <input
          v-model="localFilters.shopDomain"
          class="app-input"
          type="text"
          placeholder="tienda.myshopify.com"
          :disabled="disabled"
          @input="handleSearchChange"
        />
      </label>

      <label class="orders-filters__field">
        <span>Orden Shopify</span>
        <input
          v-model="localFilters.shopifyOrderId"
          class="app-input"
          type="text"
          placeholder="Ej: 1001"
          :disabled="disabled"
          @input="handleSearchChange"
        />
      </label>

      <label class="orders-filters__field">
        <span>Desde</span>
        <input
          v-model="localFilters.dateFrom"
          class="app-input"
          type="date"
          :disabled="disabled"
          @change="handleImmediateChange"
        />
      </label>

      <label class="orders-filters__field">
        <span>Hasta</span>
        <input
          v-model="localFilters.dateTo"
          class="app-input"
          type="date"
          :disabled="disabled"
          @change="handleImmediateChange"
        />
      </label>

      <label class="orders-filters__field">
        <span>Cantidad</span>
        <select
          v-model.number="localFilters.limit"
          class="app-select"
          :disabled="disabled"
          @change="handleImmediateChange"
        >
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </label>

      <label class="orders-filters__field">
        <span>Ordenar por</span>
        <select
          v-model="localFilters.sortBy"
          class="app-select"
          :disabled="disabled"
          @change="handleImmediateChange"
        >
          <option value="receivedAt">Fecha recepción</option>
          <option value="updatedAt">Última actualización</option>
          <option value="status">Estado</option>
          <option value="shopifyOrderId">Orden Shopify</option>
        </select>
      </label>

      <label class="orders-filters__field">
        <span>Dirección</span>
        <select
          v-model="localFilters.sortDirection"
          class="app-select"
          :disabled="disabled"
          @change="handleImmediateChange"
        >
          <option value="DESC">Descendente</option>
          <option value="ASC">Ascendente</option>
        </select>
      </label>
    </div>

    <div class="orders-filters__actions">
      <AppButton type="submit" variant="secondary" :disabled="disabled">Aplicar filtros</AppButton>
      <AppButton type="button" variant="ghost" :disabled="disabled" @click="handleReset">
        Limpiar filtros
      </AppButton>
    </div>
  </form>
</template>

<style scoped>
.orders-filters {
  display: grid;
  gap: var(--space-200);
}

.orders-filters__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-150);
}

.orders-filters__field {
  display: grid;
  gap: var(--space-050);
}

.orders-filters__field span {
  color: var(--color-text-subdued);
  font-size: var(--font-size-075);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.orders-filters__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-100);
}

@media (max-width: 960px) {
  .orders-filters__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .orders-filters__grid {
    grid-template-columns: 1fr;
  }
}
</style>
