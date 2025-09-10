
import Konva from 'konva'
import { ref, reactive, computed } from 'vue'
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

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
    id: 'my-scene',
    name: 'My Scene',
    description: 'A sample scene with boxes and text',
    lastEdited: new Date(),
    boxes: [],
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

//  Define arrays of boxes and texts, using Konva's config types.
const boxes = ref<Konva.RectConfig[]>([])
const texts = ref<Konva.TextConfig[]>([])
const images = ref<Konva.ImageConfig[]>([])
const backgrounds = ref<Konva.ImageConfig[]>([])



export function useCanvas() {
  const route = useRoute()

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
      id: `scene-${Date.now()}`,
      name,
      description: 'A new scene',
      lastEdited: new Date(),
      boxes: [],
      texts: [],
      images: [],
      backgrounds: []
    }
    scenes.value.push(newScene)
    return newScene
  }

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
      text: 'Edit me',
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
  console.log('Element clicked:', clickedElement.className, 'ID:', clickedElement.id())
  
    
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
  
  // Close widget adder when clicking outside
  const handleClickOutside = () => {
    showWidgetAdder.value = false
  }
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
  })

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