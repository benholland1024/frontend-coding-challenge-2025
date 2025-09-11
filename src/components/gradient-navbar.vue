<template>
  <div class="bg-linear-[90deg,#21272C_0%,#254954_30%,#254954_60%,#21272C_100%] h-12 flex
    text-sm"
  >
    <!-- The first tab, for the scene overview -->
    <router-link to="/" 
      class="w-48 h-10 mt-2 ml-2 flex justify-center items-center text-white/50
      cursor-pointer hover:text-white rounded-t-lg relative"
      active-class="bg-(--scene-overview-bg) !text-white': $route.path === '/"
      
    >
      <div class="absolute bottom-0 -left-4 rounded-br-xl bg-transparent w-4 h-4
        shadow-[0.5rem_0_0_0] shadow-[#0D1114]" 
        v-if="$route.path === '/'  "
      ></div>
      <Icon icon="material-symbols:folder-outline" class="mr-4 text-lg"></Icon>
      Scenes overview
      <div class="absolute bottom-0 -right-4 rounded-bl-xl bg-transparent w-4 h-4
        shadow-[-0.5rem_0_0_0] shadow-[#0D1114]"
        v-if="$route.path === `/` "
      >
      </div>
    </router-link>

    <!-- The scene tabs-->
    <router-link v-for="scene in scenes" :key="scene.id" :to="`/scene/${scene.id}`"
      class="w-48 h-10 mt-2 flex justify-center items-center text-white/50 
      hover:text-white rounded-t-lg relative"
      active-class="bg-[#21272C] text-white': $route.path === `/scene/${scene.id}"
    >
      <div class="absolute bottom-0 -left-4 rounded-br-xl bg-transparent w-4 h-4
        shadow-[0.5rem_0_0_0] shadow-[#21272C] transition-colors" 
        v-if="$route.path === `/scene/${scene.id}` "
      >
      </div>
      <Icon icon="material-symbols:check" class="mr-4 text-lg"></Icon>
      <input type="text" class="bg-none text-white w-24 focus:outline-none 
      focus:ring-0 focus:border-white border-b-1 border-white/50 " spellcheck="false" 
        v-model="scene.name" v-if="$route.path === `/scene/${scene.id}` "
      />
      <span v-else>{{scene.name}}</span>
      <div class="absolute bottom-0 -right-4 rounded-bl-xl bg-transparent w-4 h-4
        shadow-[-0.5rem_0_0_0] shadow-[#21272C] transition-colors"
        v-if="$route.path === `/scene/${scene.id}` "
      >
      </div>
    </router-link>

    <!-- The 'add a new scene' button -->
    <div class="bg-[#726333] text-(--light-orange) border border-[#a56300] rounded-lg
      w-8 h-8 flex items-center justify-center text-lg mt-2 ml-4 cursor-pointer hover:bg-[#827343]"
      @click="createNewScene" v-if="scenes.length < 8"
    >
      +
    </div>

    <!-- The save button  -->
    <div class="flex-1"></div>
    <button class="w-30 h-8 m-2 bg-[#55F37F] text-white flex items-center rounded
      cursor-pointer" @click="save">
      <Icon icon="mdi:content-save" class="mx-4 text-white text-lg" v-if="savingState == 'idle'"></Icon>
      <Icon icon="mdi:loading" class="mx-4 text-white text-lg animate-spin" v-else-if="savingState == 'saving'"></Icon>
      <Icon icon="mdi:check" class="mx-4 text-white text-lg" v-else-if="savingState == 'just-saved'"></Icon>
      <span >Speichern</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useCanvas } from '@/composables/useCanvas'
const savingState = ref<'saving' | 'just-saved' | 'idle'>('idle')

const { 
  scenes, createScene
} = useCanvas()

function save() {
  savingState.value = 'saving'
  setTimeout(() => {
    savingState.value = 'just-saved'
    setTimeout(() => {
      savingState.value = 'idle'
    }, 1000)
  }, 1000)
}

const createNewScene = () => {
  createScene()
}
</script>