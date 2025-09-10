<!-- src/views/ScenesOverview.vue -->
<template>
  <div class="font-body h-screen flex flex-col">    
    <div class="flex-1 bg-(--scene-overview-bg) p-8 text-white">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="scene in scenes" 
          :key="scene.id"
          class="bg-(--header-blue) p-6 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
          @click="openScene(scene.id)"
        >
          <h3 class="text-xl font-semibold mb-2">{{ scene.name }}</h3>
        </div>
        
        <!-- Add new scene card -->
        <div 
          class="bg-gray-700 p-6 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors border-2 border-dashed border-gray-500"
          @click="createNewScene"
        >
          <div class="text-center">
            <Icon icon="material-symbols:add" class="text-4xl mb-2" />
            <p>Create New Scene</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TopNavbar from '@/components/top-navbar.vue'
import { Icon } from '@iconify/vue'
import { useCanvas } from '@/composables/useCanvas'

const { scenes, createScene } = useCanvas();

const router = useRouter()

const openScene = (sceneId: string) => {
  router.push(`/scene/${sceneId}`)
}

const createNewScene = () => {
  const newScene = createScene()
  const newSceneId = `scene-${Date.now()}`

  router.push(`/scene/${newSceneId}`)
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString()
}
</script>