<script setup lang="ts">
import AppPagination from '@/shared/components/AppPagination.vue'

defineProps<{
  page: number
  totalPages: number
  totalItems: number
  disabled?: boolean
}>()

defineEmits<{
  change: [page: number]
}>()
</script>

<template>
  <AppPagination
    :page="page"
    :total-pages="totalPages"
    :total-items="totalItems"
    :disabled="disabled"
    @change="$emit('change', $event)"
  />
</template>
