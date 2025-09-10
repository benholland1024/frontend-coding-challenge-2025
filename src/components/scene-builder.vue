<template>
  <!-- Scene builder (left bar) -->
  <div class="bg-(--header-blue) p-4 rounded-lg absolute left-8 top-8 w-48 text-center z-2">
    <h3 class="font-bold" v-if="!boxes.length && !texts.length">Scene builder</h3>
    <h3 class="font-bold text-(--light-orange) text-sm text-left mb-3" v-else>Foreground</h3>
    <!-- Element list  -->
    <div>
      <div v-for="box in boxes" class="flex items-center gap-3 cursor-pointer" @click="selectElementById(box.id)">
        <Icon icon="radix-icons:box" class="text-white"></Icon>
        {{ box.id }}
      </div>
      <div v-for="text in texts" class="flex items-center gap-3 cursor-pointer" @click="selectElementById(text.id)">
        <Icon icon="fluent:text-12-filled" class="text-white"></Icon>
        {{ text.id }}
      </div>
    </div>
    <button class="m-2 mt-4 bg-(--dark-orange) rounded-lg text-(--light-orange) border 
      border-(--light-orange) px-2 py-1 flex items-center justify-center
      hover:bg-(--light-orange) hover:text-(--dark-orange) transition-colors
      cursor-pointer"
    >
      <Icon icon="mingcute:grid-2-line" class="mr-1"></Icon>
      Add widget
      <Icon icon="line-md:chevron-right" class="ml-2"></Icon>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useCanvas } from '@/composables/useCanvas'
import { Icon } from '@iconify/vue'
const { boxes, texts, selectElementById } = useCanvas()
</script>
