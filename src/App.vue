<template>
  <div class="font-body h-screen flex flex-col">
    <!-- <h1 class="text-3xl font-bold underline text-blue-500" >
      Welcome to the OWN3D Coding Challenge!
    </h1> -->

    <!--  Top navbar  -->
    <top-navbar />

    <!-- Gradient bar, with tabs -->
    <gradient-navbar />

    <!-- Main content area -->
    <div class="h-screen bg-[#21272C] relative text-white">

      <scene-builder /> <!-- Left sidebar -->

      <canvas-editor /> <!-- The canvas -->

      <cursor-modes /> <!-- The bottom toolbar -->

      <!-- Element toolbar popup -->
      <toolbar-popup />

    </div> <!-- End of main content area -->
  </div>
</template>


<script setup lang="ts">
import TopNavbar from './components/top-navbar.vue'
import GradientNavbar from './components/gradient-navbar.vue'
import sceneBuilder from './components/scene-builder.vue';
import canvasEditor from './components/canvas-editor.vue';
import cursorModes from './components/cursor-modes.vue';
import toolbarPopup from './components/toolbar-popup.vue';

</script>
