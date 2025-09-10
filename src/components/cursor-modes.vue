<template>
  <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-(--header-blue) 
    text-white/50 rounded-lg p-2 flex items-center space-x-4">
    <div class="cursor-pointer hover:text-white p-2 rounded" 
      :class="cursorMode == 'cursor' ? {
        'text-(--header-blue)': true,
        'bg-(--light-orange)': true,
      } : {
      }" @click="cursorMode = 'cursor'"
    >
      <Icon icon="wpf:cursor" class="text-lg"></Icon>
    </div>
    <div class="cursor-pointer hover:[&>div]:border-white p-2 rounded transition-colors"
      :class="cursorMode == 'shape' ? {
        'hover:[&>div]:border-(--light-orange)': true,
        'bg-(--light-orange)': true,
      } : {
      }" @click="addBox()"
    >
      <div class="w-5 h-5 border-white/50 border-2 rounded"></div>
    </div>
    <div class="cursor-pointer hover:text-white rounded w-8 h-8 text-center" 
    :class="cursorMode == 'text' ? {
        'text-(--header-blue)': true,
        'bg-(--light-orange)': true,
      } : {
      }" @click="addText()"
    >
      <div class="font-serif font-bold text-2xl">T</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCanvas } from '@/composables/useCanvas'
import { Icon } from '@iconify/vue';

const { cursorMode, addBox, addText } = useCanvas()
</script>