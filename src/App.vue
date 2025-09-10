<template>
  <div class="font-body h-screen md:flex flex-col hidden relative overflow-hidden">
    <!-- <h1 class="text-3xl font-bold underline text-blue-500" >
      Welcome to the OWN3D Coding Challenge!
    </h1> -->

    <!--  Top navbar  -->
    <top-navbar />

    <!-- Gradient bar, with tabs -->
    <gradient-navbar />

    <router-view />

    <a href="https://github.com/benholland1024/frontend-coding-challenge-2025" target="_blank" 
      class="text-white/50 hover:text-white text-3xl absolute bottom-4 right-4 z-100">
      <Icon icon="mdi:github" />
    </a>
  </div>

  <!-- Mobile layout -->
  <div class="font-body h-screen flex flex-col items-center justify-center 
    md:hidden bg-black text-white"
  >
    <div class="p-4 text-center flex flex-col items-center justify-center">
      <img src="@/assets/mobile_image.png" alt="mobile_device" class="w-32 mx-auto mb-4" />
      <h1 class="text-2xl font-bold mb-4">Mouse first, mobile later</h1>
      <p class="text-white mb-6">
        You get the best Ben's demo experience on a desktop or tablet with a larger screen.
      </p>
      <p class="text-white">
        Or, check out the source code on 
        <a href="https://github.com/benholland1024/frontend-coding-challenge-2025" class="underlined text-blue-400">
          github
        </a>!
      </p>
      <p class="text-sm text-gray-400 mt-2">
        Psst... Please hire me :)
      </p>
    </div>
  </div>
</template>


<script setup lang="ts">
import { Icon } from '@iconify/vue';
import TopNavbar from './components/top-navbar.vue'
import GradientNavbar from './components/gradient-navbar.vue'

</script>
