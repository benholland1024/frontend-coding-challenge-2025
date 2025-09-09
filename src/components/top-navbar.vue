<template>
  <div class="w-screen bg-(--header-blue) flex justify-between">
    <img src="@/assets/logo.png" alt="logo" class="h-12 mx-4 my-2"/>
    <div class="w-62 bg-[#2E3438] m-4 rounded text-center 
      flex items-center justify-center border border-[#454E54] text-[#8F9BA3]">
      <Icon icon="material-symbols:folder" class="mr-4"></Icon>
      My scenes
    </div>
    <div class="bg-yellow-400 rounded w-12 h-12 m-2 flex justify-around items-center">
      <Icon icon="mdi:user" color="black" class="text-4xl"></Icon>
    </div>
  </div>
</template>

<script setup lang="ts">  
import { Icon } from "@iconify/vue";

</script>