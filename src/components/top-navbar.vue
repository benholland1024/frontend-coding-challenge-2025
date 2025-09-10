<template>
  <div class="w-screen bg-(--header-blue) flex justify-between">
    <img src="@/assets/logo.png" alt="logo" class="h-12 mx-4 my-2 cursor-pointer absolute" @click="ping" />
    <img src="@/assets/logo.png" alt="logo" class="h-12 mx-4 my-2 cursor-pointer" 
      :class="pingLogo ? 'animate-ping' : ''"
    />
    <div class="w-62 bg-[#2E3438] m-4 rounded text-center 
      flex items-center justify-center border border-[#454E54] text-[#8F9BA3]">
      <Icon icon="material-symbols:folder" class="mr-4"></Icon>
      My scenes
    </div>
    <div class="bg-yellow-400 rounded w-12 h-12 m-2 flex justify-around items-center cursor-pointer relative" 
      @click="say_hi()"
    >
      <Icon icon="mdi:user" color="black" class="text-4xl"></Icon>
      <div v-if="hi" class="absolute top-0 -left-20 bg-black text-white text-sm rounded p-2 z-100">
        Hi there!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">  
import { Icon } from "@iconify/vue";
import { ref } from "vue";
const hi = ref(false);
const pingLogo = ref(false);

function say_hi() {
  hi.value = true;
  setTimeout(() => {
    hi.value = false;
  }, 1000);
}

function ping() {
  pingLogo.value = true;
  setTimeout(() => {
    pingLogo.value = false;
  }, 500);
}
</script>