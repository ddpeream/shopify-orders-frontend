<script setup lang="ts">
import AppBadge from '@/shared/components/AppBadge.vue'
import AppCard from '@/shared/components/AppCard.vue'
import AppTable from '@/shared/components/AppTable.vue'
import { formatInteger } from '@/shared/utils/number-format'

defineProps<{
  materials: Array<{
    id?: string
    code: string
    name: string
    quantity: number
  }>
}>()
</script>

<template>
  <AppCard
    title="Materiales consumidos"
    description="Material de empaque calculado y descontado para esta orden."
  >
    <AppTable
      :columns="['Material', 'Código', 'Cantidad']"
      :empty="materials.length === 0"
      empty-title="Sin materiales consumidos"
      empty-description="Las órdenes fallidas o no procesadas pueden no tener consumo de inventario."
    >
      <tr v-for="material in materials" :key="material.id ?? material.code">
        <td>
          <strong>{{ material.name }}</strong>
        </td>

        <td>
          <AppBadge variant="neutral">
            {{ material.code }}
          </AppBadge>
        </td>

        <td>{{ formatInteger(material.quantity) }}</td>
      </tr>
    </AppTable>
  </AppCard>
</template>
