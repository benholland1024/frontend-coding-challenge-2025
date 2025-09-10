<template>
  <div class="font-body h-screen flex flex-col">
    <!-- <h1 class="text-3xl font-bold underline text-blue-500" >
      Welcome to the OWN3D Coding Challenge!
    </h1> -->

    <!--  Top navbar  -->
    <top-navbar />

    <!-- Gradient bar, with tabs -->
    <gradient-navbar />

    <router-view />
  </div>
</template>


<script setup lang="ts">
import TopNavbar from './components/top-navbar.vue'
import GradientNavbar from './components/gradient-navbar.vue'

</script>
