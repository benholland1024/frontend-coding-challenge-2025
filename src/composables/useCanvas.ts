
import Konva from 'konva'
import { ref, reactive, computed, watch, getCurrentInstance } from 'vue'
import { onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import circuitBg from '@/assets/circuit_bg.png'
import rainbowBg from '@/assets/rainbow_bg.png'
import bigScreen from '@/assets/big_screen.png'
import smallScreen from '@/assets/small_screen.png'

interface Scene {
  id: string
  name: string
  description: string
  lastEdited: Date
  boxes: Konva.RectConfig[]
  texts: Konva.TextConfig[]
  images: Konva.ImageConfig[]
  backgrounds: Konva.ImageConfig[]
}

// Global state
const scenes = ref<Scene[]>([
  {
    id: 'beispielszene',
    name: 'Beispielszene',
    description: 'A sample scene with boxes and text',
    lastEdited: new Date(),
    boxes: [],
    texts: [{
      id: `twitch`,
      x: 540,
      y: 475,
      text: '@twitch_benutzername',
      fontSize: 15,
      fill: '#ffffff',
      draggable: true
    }],
    images: [],
    backgrounds: []
  }, {
    id: 'beispielszene-2',
    name: 'Beispielszene 2',
    description: 'A sample scene with boxes and text',
    lastEdited: new Date(),
    boxes: [{
      id: 'bildschirm-1',
      x: 340,
      y: 75,
      width: 460,
      height: 335,
      fill: `#777799`,
      draggable: true,
      strokeWidth: 0, 
      cornerRadius: 0,
      stroke: '#000000'
    }, {
      id: 'bildschirm-2',
      x: 830,
      y: 80,
      width: 350,
      height: 250,
      fill: `#778899`,
      draggable: true,
      strokeWidth: 0, 
      cornerRadius: 0,
      stroke: '#000000'
    }, {
      id: 'bildschirm-3',
      x: 830,
      y: 340,
      width: 350,
      height: 250,
      fill: `#887799`,
      draggable: true,
      strokeWidth: 0, 
      cornerRadius: 0,
      stroke: '#000000'
    }],
    texts: [],
    images: [],
    backgrounds: []
  }
])

const stage = ref()                //  The canvas
const transformer = ref()          //  The transformer for selected elements
const cursorMode = ref('cursor')   //  Options: 'cursor', 'shape', 'text'
const selectedElement = ref<Konva.Rect | Konva.Text | null>(null)  //  The currently selected element
const showWidgetAdder = ref(false) //  Show/hide the widget adder menu

const toolbarPosition = ref<{x: number, y: number} | null>(null)
const selectedElementType = ref<'rect' | 'text' | 'image' | 'background' | null>(null)
const selectedElementProperty = ref<'color' | 'border' | null>('color')
const selectedElementConfig = ref<any>({})


const stageConfig = reactive({
  width: window.innerWidth,   //  The height will extend past the viewport.
  height: window.innerHeight  //  It doesn't matter, since the parent div has overflow-hidden.
})


const initializeDefaultScene = () => {
  const sampleScene = scenes.value.find(s => s.id === 'beispielszene')
  if (sampleScene && sampleScene.images.length === 0) {
    // Add big screen
    const bigScreenImg = new Image()
    bigScreenImg.onload = () => {
      sampleScene.images.push({
        id: 'bildschirm-1',
        x: 350,
        y: 75,
        width: 460,
        height: 365,
        image: bigScreenImg,
        draggable: true,
      })
    }
    bigScreenImg.src = bigScreen
    
    // Add small screen
    const smallScreenImg = new Image()
    smallScreenImg.onload = () => {
      sampleScene.images.push({
        id: 'bildschirm-2',
        x: 840,
        y: 120,
        width: 350,
        height: 250,
        image: smallScreenImg,
        draggable: true,
      })
      sampleScene.images.push({
        id: 'bildschirm-3',
        x: 840,
        y: 380,
        width: 350,
        height: 250,
        image: smallScreenImg,
        draggable: true,
      })
    }
    smallScreenImg.src = smallScreen

    // Add bg
    const circuitBgImg = new Image()
    circuitBgImg.onload = () => {
      sampleScene.backgrounds.push({
        id: 'schaltung-bg',
        x: 300,
        y: 50,
        width: 900,
        height: 600,
        image: circuitBgImg,
        draggable: true,
      })
    }
    circuitBgImg.src = circuitBg
  }
  const sampleScene2 = scenes.value.find(s => s.id === 'beispielszene-2')
  if (sampleScene2 && sampleScene2.images.length === 0) {
    const colorBgImg = new Image()
    colorBgImg.onload = () => {
      sampleScene2.backgrounds.push({
        id: 'schaltung-bg',
        x: 300,
        y: 50,
        width: 900,
        height: 600,
        image: colorBgImg,
        draggable: true,
      })
    }
    colorBgImg.src = rainbowBg
  }
}
initializeDefaultScene()


export function useCanvas() {
  const route = useRoute()
  const router = useRouter()

  const currentScene = computed(() => {
    const sceneId = route.params.sceneId as string
    return scenes.value.find(scene => scene.id === sceneId)
  })
  
  // Current scene's elements (reactive to route changes)
  const boxes = computed(() => currentScene.value?.boxes || [])
  const texts = computed(() => currentScene.value?.texts || [])
  const images = computed(() => currentScene.value?.images || [])
  const backgrounds = computed(() => currentScene.value?.backgrounds || [])
  
  // Create new scene
  const createScene = (name: string = 'New Scene'): Scene => {
    const newScene: Scene = {
      id: `szene-${Date.now()}`,
      name,
      description: 'A new scene',
      lastEdited: new Date(),
      boxes: [],
      texts: [],
      images: [],
      backgrounds: []
    }
    scenes.value.push(newScene)
    router.push(`/scene/${newScene.id}`)

    return newScene
  }

  watch(
    [() => route.path, () => route.params],
    () => {
      showWidgetAdder.value = false
    selectedElement.value = null
    if (transformer.value) {
      transformer.value.getNode().nodes([])
    }
    
    selectedElementType.value = null
    selectedElementConfig.value = {}
    toolbarPosition.value = null
    },
    { immediate: true, deep: true }
  )

  //  Add a box to the canvas
  const addBox = () => {
    if (!currentScene.value) return

    cursorMode.value = 'shape';
    setTimeout(() => {
      cursorMode.value = 'cursor';
    }, 200);
    currentScene.value.boxes.push({
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

  }

  //  Add editable text to the canvas
  const addText = () => {
    if (!currentScene.value) return

    cursorMode.value = 'text';
    setTimeout(() => {
      cursorMode.value = 'cursor';
    }, 200);
    currentScene.value.texts.push({
      id: `text-${texts.value.length + 1}`,
      x: 350,
      y: 350,
      text: 'Bearbeite mich',
      fontSize: 16,
      fill: '#ffffff',
      draggable: true
    })
  }

  // Add an image to canvas
  const addImage = (url: string, x: number, y: number, w: number, h: number) => {
    if (!currentScene.value) return

    let imageSrc = url
    // Create image element to load the image
    const imageObj = new Image()
    imageObj.onload = () => {
      if (currentScene.value) {
        currentScene.value.images.push({
          id: `image-${currentScene.value.images.length + 1}`,
          x: x,
          y: y,
          width: w,
          height: h,
          image: imageObj,
          draggable: true,
        })
        currentScene.value.lastEdited = new Date()
      }
    }
    imageObj.src = imageSrc
    
    // Close the widget adder after adding
    showWidgetAdder.value = false
  }

  // Add a background image to canvas
  const addBackground = (url: string) => {
    let imageSrc = url
    // Create image element to load the image
    const imageObj = new Image()
    imageObj.onload = () => {
      if (currentScene.value) {
        currentScene.value.backgrounds.push({
          id: `bg-${currentScene.value.backgrounds.length + 1}`,
          x: 300,
          y: 50,
          width: 900,
          height: 600,
          image: imageObj,
          draggable: true,
        })
        currentScene.value.lastEdited = new Date()
      }
    }
    imageObj.src = imageSrc
    
    // Close the widget adder after adding
    showWidgetAdder.value = false
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
    } else if (clickedElement.className === 'Image') {
      // Check if it's a background or regular image
      const imageConfig = images.value.find(img => img.id === clickedElement.id())
      const backgroundConfig = backgrounds.value.find(bg => bg.id === clickedElement.id())
      
      if (imageConfig) {
        selectedElementType.value = 'image'
        selectedElementConfig.value = imageConfig
      } else if (backgroundConfig) {
        selectedElementType.value = 'background'
        selectedElementConfig.value = backgroundConfig
      }
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
    
    if (!selectedElement.value || !selectedElementConfig.value) return
      if (['strokeWidth', 'width', 'height', 'fontSize', 'cornerRadius'].includes(property)) {
      value = Number(value)
      if (isNaN(value)) {
        console.warn('Invalid number for property:', property)
        return
      }
    }

    selectedElement.value.setAttr(property, value)
    selectedElementConfig.value[property] = value
  }

  // Delete selected element
  const deleteSelectedElement = () => {
    if (!selectedElement.value) return
    
    const elementId = selectedElement.value.id()
    
    // Remove from boxes array...
    const boxIndex = boxes.value.findIndex(box => box.id === elementId)
    if (boxIndex !== -1) {
      boxes.value.splice(boxIndex, 1)
    }
    const textIndex = texts.value.findIndex(text => text.id === elementId)
    if (textIndex !== -1) {
      texts.value.splice(textIndex, 1)
    }
    const imgIndex = images.value.findIndex(image => image.id === elementId)
    if (imgIndex !== -1) {
      images.value.splice(imgIndex, 1)
    }
    const bgIndex = images.value.findIndex(image => image.id === elementId)
    if (bgIndex !== -1) {
      backgrounds.value.splice(bgIndex, 1)
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

  const handleWindowResize = () => {
    stageConfig.width = window.innerWidth
    stageConfig.height = window.innerHeight
    
    // Force stage to redraw with new dimensions
    if (stage.value) {
      stage.value.getNode().size({
        width: stageConfig.width,
        height: stageConfig.height
      })
      stage.value.getNode().draw()
    }
  }
  
  // Close widget adder when clicking outside
  const handleClickOutside = () => {
    showWidgetAdder.value = false
  }

  // Load scenes from localStorage on initialization
  const loadScenesFromStorage = () => {
    try {
      const savedScenes = localStorage.getItem('scenes')
      if (savedScenes) {
        const parsedScenes = JSON.parse(savedScenes)
        // Validate the data structure before using it
        if (Array.isArray(parsedScenes)) {
          scenes.value = parsedScenes
        }
      }
    } catch (error) {
      console.error('Failed to load scenes from localStorage:', error)
    }
  }

  
  // Only register lifecycle hooks if we're in a component context
  //  Needed because we use useScene() in the router too
  const instance = getCurrentInstance()
  if (instance) {
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('keydown', handleKeydown)
      window.addEventListener('resize', handleWindowResize) 
      
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('resize', handleWindowResize) 
    })
  }

  return {
    //  Scenes
    scenes,
    currentScene,
    createScene,

    // Canvas
    stage,
    transformer,
    stageConfig,
    showWidgetAdder,
    
    // Elements
    boxes,
    texts,
    images,
    backgrounds,
    addBox,
    addText,
    addImage,
    addBackground,
    
    // Selection
    selectedElement,
    selectedElementType,
    selectedElementConfig,
    toolbarPosition,
    selectedElementProperty,
    selectElementById,
    updateSelectedElement,
    handleElementClick,
    handleStageClick,
    
    // Cursor mode
    cursorMode
  }
}