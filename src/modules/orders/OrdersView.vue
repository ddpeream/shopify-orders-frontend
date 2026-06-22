<script setup lang="ts">
import AppButton from '@/shared/components/AppButton.vue'
import AppCard from '@/shared/components/AppCard.vue'
import AppTable from '@/shared/components/AppTable.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
import PageHeader from '@/shared/components/PageHeader.vue'
</script>

<template>
  <section class="app-stack">
    <PageHeader
      title="Órdenes"
      description="Consulta, filtra y revisa las órdenes recibidas desde Shopify."
    >
      <template #actions>
        <AppButton variant="secondary">Actualizar</AppButton>
      </template>
    </PageHeader>

    <AppCard
      title="Listado de órdenes"
      description="La conexión con datos reales se implementará en la fase de órdenes."
    >
      <AppTable
        :columns="['Orden', 'Tienda', 'Estado', 'Fecha', 'Acciones']"
        empty
        empty-title="No hay órdenes cargadas"
        empty-description="Cuando se conecte el endpoint administrativo, las órdenes aparecerán en esta tabla."
      />
    </AppCard>

    <EmptyState
      title="Vista preparada"
      description="Esta pantalla ya está lista dentro del layout administrativo. La lógica de filtros, paginación y consumo real llegará en la fase correspondiente."
    />
  </section>
</template>
