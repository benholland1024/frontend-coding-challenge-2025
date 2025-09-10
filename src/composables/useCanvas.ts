
import Konva from 'konva'
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

export function useCanvas() {

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

  }

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


  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    // Canvas
    stage,
    transformer,
    stageConfig,
    
    // Elements
    boxes,
    texts,
    addBox,
    addText,
    
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