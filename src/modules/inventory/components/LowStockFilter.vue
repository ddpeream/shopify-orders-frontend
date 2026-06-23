<script setup lang="ts">
import AppButton from '@/shared/components/AppButton.vue'

defineProps<{
  modelValue: boolean
  lowStockCount: number
  disabled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <div class="low-stock-filter" aria-label="Filtro de inventario">
    <AppButton
      type="button"
      :variant="!modelValue ? 'primary' : 'secondary'"
      :disabled="disabled"
      @click="$emit('update:modelValue', false)"
    >
      Todos los materiales
    </AppButton>

    <AppButton
      type="button"
      :variant="modelValue ? 'primary' : 'secondary'"
      :disabled="disabled"
      @click="$emit('update:modelValue', true)"
    >
      Solo stock bajo
      <span class="low-stock-filter__count">{{ lowStockCount }}</span>
    </AppButton>
  </div>
</template>

<style scoped>
.low-stock-filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-100);
}

.low-stock-filter__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  min-height: 1.5rem;
  padding: 0 var(--space-050);
  border-radius: var(--radius-pill);
  background: rgb(255 255 255 / 20%);
  font-size: var(--font-size-075);
  font-weight: var(--font-weight-bold);
}
</style>
