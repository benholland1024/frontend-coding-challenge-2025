<template>
  <div 
    v-if="selectedElement && toolbarPosition"
    class="absolute bg-(--header-blue)/70 backdrop-blur-md rounded-lg p-2 z-50 min-w-48"
    :style="{ 
      left: finalPosition.x + 'px', 
      top: finalPosition.y + 'px' 
    }"
  >
    <div class="flex flex-col gap-2 text-white text-sm">
      <!-- For rectangles -->
      <div v-if="selectedElementType === 'rect'">
        <div class="flex text-white/50">
          <Icon icon="icon-park-outline:drag" class="text-lg mr-2 cursor-grab active:cursor-grabbing"
            @mousedown="startDrag"
          ></Icon>
          <h6 >Colorbox</h6>
        </div>
        
        <div class="flex [&>div]:p-2 [&>div]:cursor-pointer text-white/50">
          <div :class="selectedElementProperty == 'color' ? {
              'border-b-2 border-(--light-orange)': true,
              'text-white': true,
            } : {
            }" @click="selectedElementProperty = 'color'"
          >Color</div>
          <div :class="selectedElementProperty === 'border' ? {
              'border-b-2 border-(--light-orange)': true,
              'text-white': true,
            } : {
            }" @click="selectedElementProperty = 'border'"
          >Border</div>
        </div>
        <div v-if="selectedElementProperty == 'color'">
          <div class="p-2 m-2 bg-[#21272C]">
            <label class="block mb-1">Fill Color:</label>
            <input 
              type="color" 
              :value="selectedElementConfig.fill" 
              @input="updateSelectedElement('fill', $event.target?.value || '')"
              class="w-full h-8 rounded"
            >
          </div>
        </div>
        <div v-else-if="selectedElementProperty === 'border'">
          <div class="p-2 m-2 bg-[#21272C]">
            <label class="block mb-1">Border width:</label>
            <input 
              type="number" 
              :value="selectedElementConfig.strokeWidth || 1"
              @input="updateSelectedElement('strokeWidth', $event.target?.value)"
              class="w-full h-8 rounded"
              min="0"
              step="1"
            >
          </div>
          <div class="p-2 m-2 bg-[#21272C]">
            <label class="block mb-1">Border Color:</label>
            <input 
              type="color" 
              :value="selectedElementConfig.stroke" 
              @input="updateSelectedElement('stroke', $event.target?.value)"
              class="w-full h-8 rounded"
            >
          </div>
          <div class="p-2 m-2 bg-[#21272C]">
            <label class="block mb-1">Border radius:</label>
            <input 
              type="number" 
              :value="selectedElementConfig.cornerRadius || 1"
              @input="updateSelectedElement('cornerRadius', $event.target?.value)"
              class="w-full h-8 rounded"
              min="0"
              step="1"
            >
          </div>
        </div>
        
      </div>
      
      <!-- For text -->
      <div v-if="selectedElementType === 'text'">
        <div class="flex text-white/50">
          <Icon icon="icon-park-outline:drag" class="text-lg mr-2 cursor-grab active:cursor-grabbing"
            @mousedown="startDrag"
          ></Icon>
          <h6 >Text</h6>
        </div>
        <div class="p-2 m-2 bg-[#21272C]">
          <label class="block mb-1">Text:</label>
          <input 
            type="text" 
            :value="selectedElementConfig.text" 
            @input="updateSelectedElement('text', $event.target?.value)"
            class="w-full px-2 py-1 rounded bg-gray-700 text-white"
          >
        </div>
        <div class="p-2 m-2 bg-[#21272C]">
          <label class="block mb-1 mt-2">Font Size:</label>
          <input 
            type="number" 
            :value="selectedElementConfig.fontSize" 
            @input="updateSelectedElement('fontSize', Number($event.target?.value))"
            class="w-full px-2 py-1 rounded bg-gray-700 text-white"
          >
        </div>
      </div>

      <!-- For images -->
      <div v-else-if="selectedElementType === 'image' || selectedElementType === 'background'">
        <div class="flex text-white/50">
          <Icon icon="icon-park-outline:drag" class="text-lg mr-2 cursor-grab active:cursor-grabbing"
            @mousedown="startDrag"
          ></Icon>
          <h6 >Image</h6>
        </div>
        <div class="p-2 m-2 bg-[#21272C]">
          <label class="block mb-1">Opacity:</label>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1"
            :value="selectedElementConfig.opacity || 1"
            @input="updateSelectedElement('opacity', Number($event.target?.value))"
            class="w-full"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCanvas } from '@/composables/useCanvas'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Icon } from '@iconify/vue';
const {
  selectedElement,
  toolbarPosition,
  selectedElementType,
  selectedElementProperty,
  selectedElementConfig,
  updateSelectedElement
} = useCanvas()

const toolbarRef = ref<HTMLElement>()
const dragPosition = ref({ x: 0, y: 0 })


const finalPosition = computed(() => {
  if (!toolbarPosition.value) return { x: 0, y: 0 }
  
  const result = {
    x: toolbarPosition.value.x + dragPosition.value.x,
    y: toolbarPosition.value.y + dragPosition.value.y
  }
  return result
})

const startDrag = (e: MouseEvent) => {
  e.preventDefault()
  
  const startX = e.clientX
  const startY = e.clientY
  const startDragX = dragPosition.value.x
  const startDragY = dragPosition.value.y
  
  const handleMouseMove = (moveEvent: MouseEvent) => {
    const deltaX = moveEvent.clientX - startX
    const deltaY = moveEvent.clientY - startY
    
    dragPosition.value = {
      x: startDragX + deltaX,
      y: startDragY + deltaY
    }
  }
  
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// Reset drag position when new element is selected
watch(toolbarPosition, () => {
  dragPosition.value = { x: 0, y: 0 }
})
</script>