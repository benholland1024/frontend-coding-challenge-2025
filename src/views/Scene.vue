<template>
  <!-- Main content area -->
  <div v-if="sceneExists" class="h-screen bg-[#21272C] relative text-white">

    <scene-builder /> <!-- Left sidebar -->

    <canvas-editor /> <!-- The canvas -->

    <cursor-modes /> <!-- The bottom toolbar -->

    <!-- Element toolbar popup -->
    <toolbar-popup />

  </div> 
  <FourOhFour v-else />
</template>


<script setup lang="ts">
import sceneBuilder from '../components/scene-builder.vue';
import canvasEditor from '../components/canvas-editor.vue';
import cursorModes from '../components/cursor-modes.vue';
import toolbarPopup from '../components/toolbar-popup.vue';
import FourOhFour from './404.vue'
import { computed } from 'vue'
import { useCanvas } from '@/composables/useCanvas'


const props = defineProps<{
  sceneId: string
}>()

const { scenes } = useCanvas()

const sceneExists = computed(() => {
  return scenes.value.some(scene => scene.id === props.sceneId)
})
</script>
