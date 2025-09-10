<template>
  <div class="font-body h-screen flex flex-col">
    <!-- <h1 class="text-3xl font-bold underline text-blue-500" >
      Welcome to the OWN3D Coding Challenge!
    </h1> -->

    <!--  Top navbar  -->
    <top-navbar />

    <!-- Gradient bar, with tabs -->
    <gradient-navbar />

    <!-- Main content area -->
    <div class="h-screen bg-[#21272C] relative text-white">

      <!-- Scene builder (left bar) -->
      <div class="bg-(--header-blue) p-4 rounded-lg absolute left-8 top-8 w-48 text-center z-2">
        <h3 class="font-bold" v-if="!boxes.length && !texts.length">Scene builder</h3>
        <h3 class="font-bold text-(--light-orange) text-sm text-left mb-3" v-else>Foreground</h3>
        <!-- Element list  -->
        <div>
          <div v-for="box in boxes" class="flex items-center gap-3 cursor-pointer" @click="selectElementById(box.id)">
            <Icon icon="radix-icons:box" class="text-white"></Icon>
            {{ box.id }}
          </div>
          <div v-for="text in texts" class="flex items-center gap-3 cursor-pointer" @click="selectElementById(text.id)">
            <Icon icon="fluent:text-12-filled" class="text-white"></Icon>
            {{ text.id }}
          </div>
        </div>
        <button class="m-2 mt-4 bg-(--dark-orange) rounded-lg text-(--light-orange) border 
          border-(--light-orange) px-2 py-1 flex items-center justify-center
          hover:bg-(--light-orange) hover:text-(--dark-orange) transition-colors
          cursor-pointer"
        >
          <Icon icon="mingcute:grid-2-line" class="mr-1"></Icon>
          Add widget
          <Icon icon="line-md:chevron-right" class="ml-2"></Icon>
        </button>
      </div>

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
              @transformend="handleTransform"
              @dragend="handleDrag"
              @click="handleElementClick"
            />
            <v-rect
              v-for="box in boxes"
              :key="box.id"
              :config="box"
              @transformend="handleTransform"
              @dragend="handleDrag"
              @click="handleElementClick"
            />
            <v-text
              v-for="text in texts"
              :key="text.id"
              :config="text"
              @transformend="handleTransform"
              @dragend="handleDrag"
              @click="handleElementClick"
            />
            <v-transformer ref="transformer" />
          </v-layer>
        </v-stage>
      </div>

      <!-- Canvas modes (bottom option bar) -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-(--header-blue) 
        text-white/50 rounded-lg p-2 flex items-center space-x-4">
        <div class="cursor-pointer hover:text-white p-2 rounded" 
          :class="cursorMode == 'cursor' ? {
            'text-(--header-blue)': true,
            'bg-(--light-orange)': true,
          } : {
          }" @click="cursorMode = 'cursor'"
        >
          <Icon icon="wpf:cursor" class="text-lg"></Icon>
        </div>
        <div class="cursor-pointer hover:[&>div]:border-white p-2 rounded transition-colors"
          :class="cursorMode == 'shape' ? {
            'hover:[&>div]:border-(--light-orange)': true,
            'bg-(--light-orange)': true,
          } : {
          }" @click="addBox()"
        >
          <div class="w-5 h-5 border-white/50 border-2 rounded"></div>
        </div>
        <div class="cursor-pointer hover:text-white rounded w-8 h-8 text-center" 
        :class="cursorMode == 'text' ? {
            'text-(--header-blue)': true,
            'bg-(--light-orange)': true,
          } : {
          }" @click="addText()"
        >
          <div class="font-serif font-bold text-2xl">T</div>
        </div>
      </div>

      <!-- Element toolbar popup -->
      <div 
        v-if="selectedElement && toolbarPosition"
        class="absolute bg-(--header-blue) rounded-lg p-2 z-50 min-w-48"
        :style="{ 
          left: toolbarPosition.x + 'px', 
          top: toolbarPosition.y + 'px' 
        }"
      >
        <div class="flex flex-col gap-2 text-white text-sm">
          <!-- For rectangles -->
          <div v-if="selectedElementType === 'rect'">
            <h6 class="text-white/50">Colorbox</h6>
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
            <h6 class="text-white/50">Text</h6>
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
        </div>
      </div>

    </div> <!-- End of main content area -->
  </div>
</template>


<script setup lang="ts">
import TopNavbar from './components/top-navbar.vue'
import GradientNavbar from './components/gradient-navbar.vue'
import Konva from 'konva'


import { Icon } from "@iconify/vue";

import { ref, reactive } from 'vue'
import { onMounted, onUnmounted } from 'vue'


const stage = ref()                //  The canvas
const transformer = ref()          //  The transformer for selected elements
const cursorMode = ref('cursor')   //  Options: 'cursor', 'shape', 'text'
const selectedElement = ref<Konva.Rect | Konva.Text | null>(null)  //  The currently selected element

const toolbarPosition = ref<{x: number, y: number} | null>(null)
const selectedElementType = ref<'rect' | 'text' | null>(null)
const selectedElementProperty = ref<'color' | 'border' | null>('color')
const selectedElementConfig = ref<any>({})


const stageConfig = reactive({
  width: window.innerWidth,   //  The height will extend past the viewport.
  height: window.innerHeight  //  It doesn't matter, since the parent div has overflow-hidden.
})

//  Define arrays of boxes and texts, using Konva's config types.
const boxes = ref<Konva.RectConfig[]>([])
const texts = ref<Konva.TextConfig[]>([])

//  Add a box to the canvas
const addBox = () => {
  cursorMode.value = 'shape';
  setTimeout(() => {
    cursorMode.value = 'cursor';
  }, 200);
  boxes.value.push({
    id: `box-${boxes.value.length + 1}`,
    x: 320,
    y: 300,
    width: 100,
    height: 100,
    fill: `#` + (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6),
    draggable: true,
    strokeWidth: 0, 
    cornerRadius: 0,
    stroke: '#000000'
  })
  console.log(`#` + (Math.random() * 0xfffff * 1000000).toString(16).slice(0, 6))
}
addBox()

//  Add editable text to the canvas
const addText = () => {
  cursorMode.value = 'text';
  setTimeout(() => {
    cursorMode.value = 'cursor';
  }, 200);
  texts.value.push({
    id: `text-${texts.value.length + 1}`,
    x: 350,
    y: 350,
    text: 'Edit me',
    fontSize: 16,
    fill: '#ffffff',
    draggable: true
  })
}

// Handle element selection
function handleElementClick(e: any) {
  const clickedElement = e.target
  selectedElement.value = clickedElement
  
  // Determine element type and get config
  if (clickedElement.className === 'Rect') {
    selectedElementType.value = 'rect'
    selectedElementConfig.value = boxes.value.find(box => box.id === clickedElement.id())
  } else if (clickedElement.className === 'Text') {
    selectedElementType.value = 'text'
    selectedElementConfig.value = texts.value.find(text => text.id === clickedElement.id())
  }
  
  // Position toolbar near element
  const elementPos = clickedElement.getAbsolutePosition()
  toolbarPosition.value = {
    x: elementPos.x + 120, // Offset to the right
    y: elementPos.y - 10   // Slightly above
  }
  
  // Attach transformer
  if (transformer.value) {
    transformer.value.getNode().nodes([clickedElement])
  }
}

function selectElementById(elementId: string | undefined) {
  if (!stage.value) return
  
  // Find the Konva element by ID
  const konvaElement = stage.value.getNode().findOne(`#${elementId}`)
  
  if (konvaElement) {
    selectedElement.value = konvaElement
    
    if (konvaElement.className === 'Rect') {
      selectedElementType.value = 'rect'
      selectedElementConfig.value = boxes.value.find(box => box.id === elementId)
    } else if (konvaElement.className === 'Text') {
      selectedElementType.value = 'text'
      selectedElementConfig.value = texts.value.find(text => text.id === elementId)
    }
    
    const elementPos = konvaElement.getAbsolutePosition()
    toolbarPosition.value = {
      x: elementPos.x + 120,
      y: elementPos.y - 10
    }
    
    if (transformer.value) {
      transformer.value.getNode().nodes([konvaElement])
    }
  }
}

// Update selected element properties
function updateSelectedElement(property: string, value: any) {
  console.log('Updating:', property, 'to:', value, 'type:', typeof value)
  
  if (!selectedElement.value || !selectedElementConfig.value) return
    if (['strokeWidth', 'width', 'height', 'fontSize', 'cornerRadius'].includes(property)) {
    value = Number(value)
    if (isNaN(value)) {
      console.warn('Invalid number for property:', property)
      return
    }
  }
  selectedElementConfig.value[property] = value
  selectedElement.value.setAttr(property, value)
}

// Delete selected element
const deleteSelectedElement = () => {
  if (!selectedElement.value) return
  
  const elementId = selectedElement.value.id()
  
  // Remove from boxes array
  const boxIndex = boxes.value.findIndex(box => box.id === elementId)
  if (boxIndex !== -1) {
    boxes.value.splice(boxIndex, 1)
  }
  
  // Remove from texts array
  const textIndex = texts.value.findIndex(text => text.id === elementId)
  if (textIndex !== -1) {
    texts.value.splice(textIndex, 1)
  }
  
  // Clear selection
  selectedElement.value = null
  if (transformer.value) {
    transformer.value.getNode().nodes([])
  }
}

// Listen for delete/backspace key
const handleKeydown = (e: KeyboardEvent) => {
  if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement.value) {
    e.preventDefault()
    deleteSelectedElement()
  }
}

// Clear selection
function handleStageClick(e: any) {
  if (e.target === e.target.getStage()) {
    selectedElement.value = null
    selectedElementType.value = null
    toolbarPosition.value = null
    if (transformer.value) {
      transformer.value.getNode().nodes([])
    }
  }
}

function handleTransform(e: any) {
  // console.log("Transform ended", e.target)
}

function handleDrag(e: any) {
  // console.log("Drag ended", e.target)
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

</script>
