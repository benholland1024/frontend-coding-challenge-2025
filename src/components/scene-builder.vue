<template>
  <!-- Scene builder (left bar) -->
  <div class="bg-(--header-blue) p-4 rounded-lg absolute left-4 top-8 w-64 text-center z-2">
    <h3 class="font-bold" v-if="!boxes.length && !texts.length">Scene builder</h3>
    <h3 class="font-bold text-(--light-orange) text-sm text-left mb-3" v-else>Foreground</h3>
    <!-- Element list  -->
    <div>
      <div v-for="image in images" class="flex items-center gap-3 cursor-pointer" @click="selectElementById(image.id)">
        <Icon icon="fluent:text-12-filled" class="text-white"></Icon>
        {{ image.id }}
      </div>
      <div v-for="box in boxes" class="flex items-center gap-3 cursor-pointer" @click="selectElementById(box.id)">
        <Icon icon="radix-icons:box" class="text-white"></Icon>
        {{ box.id }}
      </div>
      <div v-for="text in texts" class="flex items-center gap-3 cursor-pointer" @click="selectElementById(text.id)">
        <Icon icon="fluent:text-12-filled" class="text-white"></Icon>
        {{ text.id }}
      </div>
      <div v-for="image in backgrounds" class="flex items-center gap-3 cursor-pointer" @click="selectElementById(image.id)">
        <Icon icon="fluent:text-12-filled" class="text-white"></Icon>
        {{ image.id }}
      </div>
    </div>
    <button class="m-2 mt-4 bg-(--dark-orange) rounded-lg text-(--light-orange) 
      px-2 py-1 flex items-center justify-center
      hover:bg-(--light-orange) hover:text-(--dark-orange) transition-colors
      cursor-pointer" @click.stop="showWidgetAdder = !showWidgetAdder"
    >
      <Icon icon="mingcute:grid-2-line" class="mr-1"></Icon>
      Widget hinzufügen
      <Icon icon="line-md:chevron-right" class="ml-2"></Icon>
    </button>

    <!-- Widget adder -->
    <div v-if="showWidgetAdder" class="absolute -right-55 top-0 bg-(--header-blue) border
     border-gray-600 p-2 w-50 rounded-lg" @click.stop
     :style="{ height: `${windowHeight - 200}px`, overflowY: 'auto' }"
    >
      <div class="text-white/50 text-sm">Hintergründe</div>
      <div class="cursor-pointer hover:[&>img]:scale-105 [&>img]:transition-transform flex 
        flex-col items-center"
      >
        <img src="@/assets/circuit_bg.png" alt="circuit_bg" class="w-40 m-1"
          @click="addBackground(circuitBg)"
        />
        Schaltungshintergrund
      </div>
      <div class="cursor-pointer hover:[&>img]:scale-105 [&>img]:transition-transform flex 
        flex-col items-center"
      >
        <img src="@/assets/rainbow_bg.png" alt="circuit_bg" class="w-40 m-1"
          @click="addBackground(rainbowBg)"
        />
        Bunten Hintergrund
      </div>
      <hr class="my-1 border-gray-600"/>
      <div class="text-white/50 text-sm">Screens</div>
      <div class="cursor-pointer hover:[&>img]:scale-105 [&>img]:transition-transform flex 
        flex-col items-center"
      >
        <img src="@/assets/big_screen.png" alt="circuit_bg" class="w-40 m-1"
          @click="addImage(bigScreen, 350, 75, 460, 365)"
        />
        Großer Schaltkreisbildschirm
      </div>
      <div class="cursor-pointer hover:[&>img]:scale-105 [&>img]:transition-transform flex 
        flex-col items-center"
      >
        <img src="@/assets/small_screen.png" alt="circuit_bg" class="w-40 m-1"
          @click="addImage(smallScreen, 840, 120, 350, 250)"
        />
        Kleiner Bildschirm
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCanvas } from '@/composables/useCanvas'
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import circuitBg from '@/assets/circuit_bg.png'
import rainbowBg from '@/assets/rainbow_bg.png'
import bigScreen from '@/assets/big_screen.png'
import smallScreen from '@/assets/small_screen.png'

const { 
  boxes, 
  texts, 
  images,
  backgrounds,
  addImage,
  addBackground,
  selectElementById, 
  showWidgetAdder
} = useCanvas()
const windowHeight = ref(window.innerHeight)

const handleResize = () => {
  windowHeight.value = window.innerHeight
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

</script>
