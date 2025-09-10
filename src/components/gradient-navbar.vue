<template>
  <div class="bg-linear-[90deg,#21272C_0%,#254954_30%,#254954_60%,#21272C_100%] h-12 flex
    text-sm"
  >
    <!-- The first tab (transparent bg) -->
    <div class="w-48 h-10 mt-2 flex justify-center items-center text-white/50
      cursor-pointer hover:text-white transition-colors"
    >
      <Icon icon="material-symbols:folder-outline" class="mr-4 text-lg"></Icon>
      Scenes overview
    </div>

    <!-- The second tab (colored bg)-->
    <div class="w-48 bg-[#21272C] h-10 mt-2 flex justify-center items-center text-white
      rounded-t-lg relative">
      <div class="absolute bottom-0 -left-4 rounded-br-xl bg-transparent w-4 h-4
        shadow-[0.5rem_0_0_0] shadow-[#21272C]">
      </div>
      <Icon icon="material-symbols:check" class="mr-4 text-lg"></Icon>
      My Scene
      <div class="absolute bottom-0 -right-4 rounded-bl-xl bg-transparent w-4 h-4
        shadow-[-0.5rem_0_0_0] shadow-[#21272C]">
      </div>
    </div>

    <!-- The save button  -->
    <div class="flex-1"></div>
    <button class="w-30 h-8 m-2 bg-[#55F37F] text-white flex items-center rounded
      cursor-pointer" @click="save">
      <Icon icon="mdi:content-save" class="mx-4 text-white text-lg" v-if="savingState == 'idle'"></Icon>
      <Icon icon="mdi:loading" class="mx-4 text-white text-lg animate-spin" v-else-if="savingState == 'saving'"></Icon>
      <Icon icon="mdi:check" class="mx-4 text-white text-lg" v-else-if="savingState == 'just-saved'"></Icon>
      <span v-if="savingState != 'just-saved'">Save</span>
      <span v-else>Saved!</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";
const savingState = ref<'saving' | 'just-saved' | 'idle'>('idle')

function save() {
  savingState.value = 'saving'
  setTimeout(() => {
    savingState.value = 'just-saved'
    setTimeout(() => {
      savingState.value = 'idle'
    }, 1000)
  }, 1000)
}
</script>