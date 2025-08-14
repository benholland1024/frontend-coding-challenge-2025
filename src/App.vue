<template>
  <div class="font-body">
    <h1 class="text-3xl font-bold underline text-blue-500">
      Welcome to the OWN3D Coding Challenge!
    </h1>
  </div>
</template>


<script setup lang="ts">
import { useScenes } from './composables/useScenes'

const { scenes } = useScenes()
</script>
