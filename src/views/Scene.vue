<template>
  <!-- Main content area -->
  <div class="h-screen bg-[#21272C] relative text-white">

    <scene-builder /> <!-- Left sidebar -->

    <canvas-editor /> <!-- The canvas -->

    <cursor-modes /> <!-- The bottom toolbar -->

    <!-- Element toolbar popup -->
    <toolbar-popup />

  </div> 
</template>


<script setup lang="ts">
import sceneBuilder from '../components/scene-builder.vue';
import canvasEditor from '../components/canvas-editor.vue';
import cursorModes from '../components/cursor-modes.vue';
import toolbarPopup from '../components/toolbar-popup.vue';

const props = defineProps<{
  sceneId: string
}>()
</script>
