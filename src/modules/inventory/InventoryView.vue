<script setup lang="ts">
import AppButton from '@/shared/components/AppButton.vue'
import AppCard from '@/shared/components/AppCard.vue'
import AppTable from '@/shared/components/AppTable.vue'
import PageHeader from '@/shared/components/PageHeader.vue'
</script>

<template>
  <section class="app-stack">
    <PageHeader
      title="Inventario"
      description="Monitorea el stock de materiales de empaque y sus niveles críticos."
    >
      <template #actions>
        <AppButton variant="secondary">Actualizar</AppButton>
      </template>
    </PageHeader>

    <AppCard
      title="Materiales de empaque"
      description="La información real del inventario se conectará desde el endpoint administrativo."
    >
      <AppTable
        :columns="['Material', 'Código', 'Stock', 'Umbral bajo', 'Estado']"
        empty
        empty-title="Inventario sin cargar"
        empty-description="Cuando se conecte la API, aquí aparecerán cajas, etiquetas, cinta y relleno."
      />
    </AppCard>
  </section>
</template>
