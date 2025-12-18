<template>
  <div class="p-8 h-full flex flex-col">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Documents</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Vision Board and Project Notes.</p>
      </div>
      
      <!-- Document Selector -->
      <div class="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button 
          @click="selectType('vision')"
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
          :class="currentType === 'vision' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
        >
          Vision Board
        </button>
        <button 
          @click="selectType('project_note')"
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
          :class="currentType === 'project_note' ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
        >
          Project Notes
        </button>
      </div>
    </div>

    <div class="flex gap-6 flex-1 overflow-hidden">
      <!-- Sidebar (only for Project Notes) -->
      <div v-if="currentType === 'project_note'" class="w-64 overflow-y-auto pr-2 border-r border-gray-200 dark:border-gray-700">
        <div class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Projects</div>
        <draggable 
          v-model="projects" 
          item-key="id"
          @end="onDragEnd"
          ghost-class="opacity-50"
        >
          <template #item="{ element: project }">
            <div 
              @click="selectProject(project)"
              class="p-3 rounded-lg cursor-pointer mb-1 transition-colors flex items-center gap-2"
              :class="selectedProject?.id === project.id ? 'bg-indigo-50 dark:bg-gray-700 text-indigo-700 dark:text-indigo-400' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'"
            >
              <div 
                class="w-6 h-6 rounded flex items-center justify-center text-white shrink-0" 
                :style="{ backgroundColor: project.color }"
              >
                <component 
                  :is="getIcon(project.icon)" 
                  weight="bold" 
                  class="w-4 h-4" 
                />
              </div>
              <span class="truncate text-sm font-medium">{{ project.title }}</span>
            </div>
          </template>
        </draggable>
      </div>

      <!-- Editor Area -->
      <!-- Main Content Column -->
      <div class="flex-1 flex flex-col overflow-hidden gap-4">
        
        <!-- Project Metadata (Moved outside) -->
        <div v-if="currentType === 'project_note' && canEdit" class="px-1 flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 w-16">Date</label>
              <div class="w-64">
                <VueDatePicker 
                  v-model="dateRange" 
                  range 
                  :dark="true"
                  :enable-time-picker="false"
                  :auto-apply="true"
                  :key="settingsStore.dateFormat"
                  :locale="zhTWLocale"
                  menu-class-name="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700"
                >
                  <template #trigger>
                    <div 
                      class="cursor-pointer flex items-center justify-between border-0 text-gray-700 dark:text-gray-200 text-sm px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                      <div class="flex items-center gap-2">
                        <PhCalendarBlank class="w-4 h-4 text-gray-500" />
                        <span>{{ dateRange ? formatDate(dateRange) : 'Select date range' }}</span>
                      </div>
                      <button v-if="dateRange" @click.stop="dateRange = null" class="text-gray-400 hover:text-gray-600">
                        <PhX class="w-3 h-3" />
                      </button>
                    </div>
                  </template>
                </VueDatePicker>
              </div>
            </div>
            <div class="flex items-center gap-2 relative">
              <label class="text-xs font-medium text-gray-500 dark:text-gray-400 w-16">Priority</label>
              
              <button 
                @click="showPriorityMenu = !showPriorityMenu"
                class="flex items-center gap-2 px-2 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
              >
                <PhFlag 
                  :weight="currentPriorityOption?.weight as any || 'regular'" 
                  class="w-4 h-4" 
                  :class="currentPriorityOption?.color"
                />
                <span>{{ currentPriorityOption?.label }}</span>
              </button>

              <!-- Dropdown Menu -->
              <div 
                v-if="showPriorityMenu"
                class="absolute top-full left-16 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10"
              >
                <button
                  v-for="option in priorityOptions"
                  :key="option.value"
                  @click="selectPriority(option)"
                  class="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  :class="selectedProject.priority === option.value ? 'bg-indigo-50 dark:bg-gray-700/50' : ''"
                >
                  <PhFlag 
                    :weight="option.weight as any" 
                    class="w-4 h-4" 
                    :class="option.color"
                  />
                  <span class="text-gray-700 dark:text-gray-200">{{ option.label }}</span>
                </button>
              </div>

              <!-- Backdrop to close menu -->
              <div 
                v-if="showPriorityMenu" 
                class="fixed inset-0 z-0" 
                @click="showPriorityMenu = false"
              ></div>
            </div>
        </div>

        <!-- Editor Area -->
        <div class="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden">
          <div v-if="!canEdit" class="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
            Select a project to view notes
          </div>
          
          <div v-else class="flex flex-col h-full">
            <!-- Status Bar -->
            <div class="border-b border-gray-100 dark:border-gray-700 p-2 flex gap-2 justify-end">
              <span class="text-xs text-gray-400 dark:text-gray-500 self-center px-2" v-if="isSaving">Saving...</span>
              <span class="text-xs text-green-500 dark:text-green-400 self-center px-2" v-else-if="lastSaved">Saved</span>
            </div>

            <!-- Editor -->
            <MarkdownEditor 
              v-model="content" 
              theme="dark" 
              class="flex-1 overflow-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import MarkdownEditor from '../components/MarkdownEditor.vue'
import { useSettingsStore } from '../stores/settings'
import { 
  PhRocketLaunch, PhSneaker, PhCode, PhBook, PhBriefcase, PhHeart, PhStar, PhLightning,
  PhMoney, PhChartLineUp, PhPaintBrush, PhCamera, PhVideo, PhMusicNotes, 
  PhGlobe, PhHouse, PhUsers, PhGraduationCap, PhAirplane, PhGameController,
  PhList, PhFlag, PhCalendarBlank, PhX,
  PhCoffee, PhDesktop, PhEnvelope, PhFolder, PhGear, PhGift, PhHeadphones, PhImage, PhKey, PhTrophy, PhTarget
} from '@phosphor-icons/vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { zhTW } from 'date-fns/locale'
const zhTWLocale = zhTW
import draggable from 'vuedraggable'

const settingsStore = useSettingsStore()

const icons = [
  { name: 'PhRocketLaunch', component: PhRocketLaunch },
  { name: 'PhSneaker', component: PhSneaker },
  { name: 'PhCode', component: PhCode },
  { name: 'PhBook', component: PhBook },
  { name: 'PhBriefcase', component: PhBriefcase },
  { name: 'PhHeart', component: PhHeart },
  { name: 'PhStar', component: PhStar },
  { name: 'PhLightning', component: PhLightning },
  { name: 'PhMoney', component: PhMoney },
  { name: 'PhChartLineUp', component: PhChartLineUp },
  { name: 'PhPaintBrush', component: PhPaintBrush },
  { name: 'PhCamera', component: PhCamera },
  { name: 'PhVideo', component: PhVideo },
  { name: 'PhMusicNotes', component: PhMusicNotes },
  { name: 'PhGlobe', component: PhGlobe },
  { name: 'PhHouse', component: PhHouse },
  { name: 'PhUsers', component: PhUsers },
  { name: 'PhGraduationCap', component: PhGraduationCap },
  { name: 'PhAirplane', component: PhAirplane },
  { name: 'PhGameController', component: PhGameController },
  { name: 'PhList', component: PhList },
  { name: 'PhCoffee', component: PhCoffee },
  { name: 'PhDesktop', component: PhDesktop },
  { name: 'PhEnvelope', component: PhEnvelope },
  { name: 'PhFolder', component: PhFolder },
  { name: 'PhGear', component: PhGear },
  { name: 'PhGift', component: PhGift },
  { name: 'PhHeadphones', component: PhHeadphones },
  { name: 'PhImage', component: PhImage },
  { name: 'PhKey', component: PhKey },
  { name: 'PhTrophy', component: PhTrophy },
  { name: 'PhTarget', component: PhTarget }
]

function getIcon(iconName: string) {
  const found = icons.find(i => i.name === iconName)
  return found ? found.component : (icons[0]?.component || PhRocketLaunch)
}


const currentType = ref('vision')
const projects = ref<any[]>([])
const selectedProject = ref<any>(null)
const isSaving = ref(false)
const lastSaved = ref(false)
const canEdit = ref(true)
const showPriorityMenu = ref(false)

const priorityOptions = [
  { label: 'High', value: 'High', color: 'text-red-500', weight: 'fill' },
  { label: 'Medium', value: 'Medium', color: 'text-green-500', weight: 'fill' },
  { label: 'Low', value: 'Low', color: 'text-indigo-500', weight: 'fill' },
  { label: 'None', value: 'None', color: 'text-gray-400 dark:text-gray-500', weight: 'regular' }
]

const currentPriorityOption = computed(() => {
  return priorityOptions.find(o => o.value === selectedProject.value?.priority) || priorityOptions[3]
})

function selectPriority(option: any) {
  if (selectedProject.value) {
    selectedProject.value.priority = option.value
    updateProjectMetadata()
    showPriorityMenu.value = false
  }
}

// Dark mode is forced for now as the app is dark-themed
// const isDark = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)

const formatDate = (date: Date | Date[]) => {
  const formatOne = (d: Date) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return settingsStore.dateFormat
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
  }

  if (Array.isArray(date)) {
    if (!date[0] || !date[1]) return ''
    return `${formatOne(date[0])} - ${formatOne(date[1])}`
  }
  return formatOne(date)
}

const dateRange = computed({
  get() {
    if (!selectedProject.value?.start_date || !selectedProject.value?.end_date) return null
    
    const parseDate = (dateStr: string) => {
      // Handle legacy YYYY-MM-DD format (treat as local 00:00)
      if (dateStr.length === 10 && dateStr.indexOf('T') === -1) {
        const parts = dateStr.split('-')
        if (parts.length === 3) {
          return new Date(parseInt(parts[0]!, 10), parseInt(parts[1]!, 10) - 1, parseInt(parts[2]!, 10))
        }
      }
      // Handle ISO string
      return new Date(dateStr)
    }

    const start = parseDate(selectedProject.value!.start_date!)
    const end = parseDate(selectedProject.value!.end_date!)
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null
    return [start, end]
  },
  set(newRange: any) {
    if (newRange && Array.isArray(newRange) && newRange.length === 2 && selectedProject.value && newRange[0] && newRange[1]) {
       selectedProject.value.start_date = newRange[0].toISOString()
       selectedProject.value.end_date = newRange[1].toISOString()
       updateProjectMetadata()
    } else if (!newRange && selectedProject.value) {
       selectedProject.value.start_date = null
       selectedProject.value.end_date = null
       updateProjectMetadata()
    }
  }
})

const content = ref('')

watch(content, () => {
  debouncedSave()
})

// Simple debounce implementation
let timeout: any
function debouncedSave() {
  isSaving.value = true
  lastSaved.value = false
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    saveContent()
  }, 1000)
}

onMounted(async () => {
  projects.value = await window.ipcRenderer.getProjects()
  await loadContent()
})



watch(currentType, async (newType) => {
  if (newType === 'vision') {
    selectedProject.value = null
    canEdit.value = true
    await loadContent()
  } else {
    canEdit.value = false
    if (projects.value.length > 0) {
      selectProject(projects.value[0])
    }
  }
})

function selectType(type: string) {
  currentType.value = type
}

async function selectProject(project: any) {
  selectedProject.value = project
  canEdit.value = true
  await loadContent()
}

async function loadContent() {
  const relatedId = selectedProject.value?.id
  const doc = await window.ipcRenderer.getDocument(currentType.value, relatedId)
  
  if (content.value !== doc?.content) {
    content.value = doc?.content || ''
  }
}

async function saveContent() {
  const currentContent = content.value
  const relatedId = selectedProject.value?.id
  
  await window.ipcRenderer.saveDocument(currentType.value, currentContent, relatedId)
  isSaving.value = false
  lastSaved.value = true
}

async function updateProjectMetadata() {
  if (!selectedProject.value) return
  try {
    await window.ipcRenderer.updateProject(JSON.parse(JSON.stringify(selectedProject.value)))
  } catch (error) {
    console.error('Failed to update project metadata:', error)
  }
}

async function onDragEnd() {
  try {
    // Optimistic update is already handled by v-model
    await window.ipcRenderer.updateProjectOrder(JSON.parse(JSON.stringify(projects.value)))
  } catch (error) {
    console.error('Failed to update project order:', error)
  }
}
</script>


