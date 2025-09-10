<template>
  <!-- The canvas -->
  <div class="absolute inset-0 overflow-hidden z-0">
    <v-stage 
      ref="stage"
      :config="stageConfig"
      @mousedown="handleStageClick"
    >
      <v-layer>
        <v-rect
          :config="{
            x: 300,
            y: 50,
            width: 900,
            height: 600,
            fill: '#0A0E12',
            listening: false
          }"
          @click="handleElementClick"
        />
        <v-image
          v-for="bg in backgrounds"
          :key="bg.id"
          :config="bg"
          @click="handleElementClick"
        />
        <v-image
          v-for="image in images"
          :key="image.id"
          :config="image"
          @click="handleElementClick"
        />
        <v-rect
          v-for="box in boxes"
          :key="box.id"
          :config="box"
          @click="handleElementClick"
        />
        <v-text
          v-for="text in texts"
          :key="text.id"
          :config="text"
          @click="handleElementClick"
        />
        
        <v-transformer ref="transformer" />
      </v-layer>
    </v-stage>
  </div>
</template>

<script setup lang="ts">
import { useCanvas } from '@/composables/useCanvas'
import { Icon } from '@iconify/vue';
const { 
  stage, 
  transformer, 
  stageConfig, 
  boxes, 
  texts, 
  images,
  backgrounds,
  handleElementClick, 
  handleStageClick
} = useCanvas()

</script>