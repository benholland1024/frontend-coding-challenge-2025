<template>
  <div class="font-body h-screen flex flex-col">
    <!-- <h1 class="text-3xl font-bold underline text-blue-500" >
      Welcome to the OWN3D Coding Challenge!
    </h1> -->

    <!--  Top navbar  -->
    <top-navbar />

    <!-- Gradient bar, with tabs -->
    <div class="bg-linear-[90deg,#21272C_0%,#254954_30%,#254954_60%,#21272C_100%] h-16 flex">
      <!-- The first tab (transparent bg) -->
      <div class="w-64 h-12 mt-4 flex justify-center items-center text-white/50">
        <Icon icon="material-symbols:folder-outline" class="mr-4 text-white/50 text-3xl"></Icon>
        Scenes overview
      </div>

      <!-- The second tab (colored bg)-->
      <div class="w-64 bg-[#21272C] h-12 mt-4 flex justify-center items-center text-white/50
        rounded-t-lg relative">
        <div class="absolute bottom-0 -left-4 rounded-br-xl bg-transparent w-4 h-4
          shadow-[0.5rem_0_0_0] shadow-[#21272C]"></div>
        <Icon icon="material-symbols:folder-outline" class="mr-4 text-white text-3xl"></Icon>
        My Scene
        <div class="absolute bottom-0 -right-4 rounded-bl-xl bg-transparent w-4 h-4
          shadow-[-0.5rem_0_0_0] shadow-[#21272C]"></div>
      </div>
    </div>

    <!-- Main content area -->
    <div class="h-screen bg-[#21272C]">

    </div>
  </div>
</template>


<script setup lang="ts">
import { useScenes } from './composables/useScenes'
import TopNavbar from './components/top-navbar.vue'
import { Icon } from "@iconify/vue";


const { scenes } = useScenes()
</script>
