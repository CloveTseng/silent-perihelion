<template>
  <div class="p-8 h-full flex flex-col">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Goals & Strategy</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Define your projects and map out your 12-week tactics.</p>
      </div>
      <button 
        @click="showCreateProject = true"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
      >
        <span>+</span> New Project
      </button>
    </div>

    <div class="flex gap-6 flex-1 overflow-hidden">
      <!-- Projects Sidebar -->
      <div class="w-1/3 overflow-y-auto pr-2">
        <draggable 
          v-model="projects" 
          item-key="id"
          @end="onDragEnd"
          ghost-class="opacity-50"
        >
          <template #item="{ element: project }">
            <div 
              @click="selectProject(project)"
              @contextmenu.prevent="(e) => handleContextMenu(e, project)"
              class="p-4 rounded-xl border mb-3 cursor-pointer transition-all group"
              :class="selectedProject?.id === project.id ? 'border-indigo-600 bg-indigo-50 dark:bg-gray-700 shadow-sm' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-500'"
            >
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <div 
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                    :style="{ backgroundColor: project.color || '#4F46E5' }"
                  >
                    <component 
                      :is="getIcon(project.icon)" 
                      weight="bold" 
                      class="w-5 h-5" 
                    />
                  </div>
                  <h3 class="font-bold text-gray-900 dark:text-white">{{ project.title }}</h3>
                </div>
                <button 
                  @click="(e) => openEditProject(project, e)"
                  class="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                >
                  <PhPencil weight="bold" class="w-4 h-4" />
                </button>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{{ project.description }}</p>
            </div>
          </template>
        </draggable>

        <div v-if="projects.length === 0" class="text-center py-10 text-gray-400 dark:text-gray-500">
          No projects yet. Create one to get started!
        </div>
      </div>

      <!-- Planning Area -->
      <div class="w-2/3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden" v-if="selectedProject">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ selectedProject.title }}</h2>
              <button 
                @click="goToProjectNote"
                class="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Open Project Note"
              >
                <PhNotebook weight="bold" class="w-5 h-5" />
              </button>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Tactics Plan</p>
          </div>
          <button 
            @click="deleteProject(selectedProject.id)"
            class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-gray-700"
          >
            Delete Project
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <!-- Backlog Section (Week 0) -->
          <div class="mb-8">
            <div class="flex items-center gap-4 mb-3">
              <div class="px-3 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                Backlog
              </div>
              <div class="h-px bg-indigo-100 dark:bg-indigo-900/30 flex-1"></div>
              <button 
                @click="openAddTask(0)"
                class="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-gray-700"
              >
                + Add Tactic
              </button>
            </div>

            <draggable 
              v-model="tasksByWeek[0]" 
              group="tasks" 
              item-key="id"
              @change="(e: any) => onTaskDrop(0, e)"
              class="pl-12 space-y-2 min-h-[10px]"
              ghost-class="opacity-50"
            >
              <template #item="{ element: task }">
                <div 
                  class="group flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border transition-colors cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  :class="[
                    task.priority === 'high' ? 'border-l-4 border-l-red-500 border-y-gray-100 border-r-gray-100 dark:border-y-gray-600 dark:border-r-gray-600' : 
                    task.priority === 'medium' ? 'border-l-4 border-l-orange-500 border-y-gray-100 border-r-gray-100 dark:border-y-gray-600 dark:border-r-gray-600' : 
                    task.priority === 'low' ? 'border-l-4 border-l-blue-500 border-y-gray-100 border-r-gray-100 dark:border-y-gray-600 dark:border-r-gray-600' : 
                    'border-gray-100 dark:border-gray-600'
                  ]"
                  @click="openEditTask(task)"
                >
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    <input 
                      type="checkbox" 
                      :checked="!!task.is_completed" 
                      @click.stop
                      @change="(e) => toggleTask(task, (e.target as HTMLInputElement).checked)"
                      class="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <span 
                      class="text-gray-700 dark:text-gray-200 text-sm truncate"
                      :class="{ 'line-through text-gray-400 dark:text-gray-500': task.is_completed }"
                    >
                      {{ task.title }}
                    </span>
                  </div>
                  
                  <div class="flex items-center gap-3">
                    <div class="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-100 dark:border-gray-600" v-if="task.due_date">
                      <PhCalendarBlank class="w-3.5 h-3.5" weight="bold" />
                      <span>{{ formatDate(new Date(task.due_date)) }}</span>
                    </div>
                    <button 
                      @click.stop="deleteTask(task.id)"
                      class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </template>
            </draggable>
            <div v-if="tasksByWeek[0]?.length === 0" class="pl-12 text-sm text-gray-400 dark:text-gray-500 italic">
              No backlog items.
            </div>
          </div>

          <div v-for="week in 12" :key="week" class="mb-6">
            <div class="flex items-center gap-4 mb-3">
              <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 text-sm">
                W{{ week }}
              </div>
              <div v-if="currentCycle" class="text-xs text-gray-400 dark:text-gray-600 font-medium whitespace-nowrap">
                {{ getWeekRange(week) }}
              </div>
              <div class="h-px bg-gray-100 dark:bg-gray-700 flex-1"></div>
              <button 
                @click="openAddTask(week)"
                class="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-gray-700"
              >
                + Add Tactic
              </button>
            </div>

            <draggable 
              v-model="tasksByWeek[week]" 
              group="tasks" 
              item-key="id"
              @change="(e: any) => onTaskDrop(week, e)"
              class="pl-12 space-y-2 min-h-[10px]"
              ghost-class="opacity-50"
            >
              <template #item="{ element: task }">
                <div 
                  class="group flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border transition-colors cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  :class="[
                    task.priority === 'high' ? 'border-l-4 border-l-red-500 border-y-gray-100 border-r-gray-100 dark:border-y-gray-600 dark:border-r-gray-600' : 
                    task.priority === 'medium' ? 'border-l-4 border-l-orange-500 border-y-gray-100 border-r-gray-100 dark:border-y-gray-600 dark:border-r-gray-600' : 
                    task.priority === 'low' ? 'border-l-4 border-l-blue-500 border-y-gray-100 border-r-gray-100 dark:border-y-gray-600 dark:border-r-gray-600' : 
                    'border-gray-100 dark:border-gray-600'
                  ]"
                  @click="openEditTask(task)"
                >
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    <input 
                      type="checkbox" 
                      :checked="!!task.is_completed" 
                      @click.stop
                      @change="(e) => toggleTask(task, (e.target as HTMLInputElement).checked)"
                      class="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <span 
                      class="text-gray-700 dark:text-gray-200 text-sm truncate"
                      :class="{ 'line-through text-gray-400 dark:text-gray-500': task.is_completed }"
                    >
                      {{ task.title }}
                    </span>
                  </div>
                  
                  <div class="flex items-center gap-3">
                    <div class="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-100 dark:border-gray-600" v-if="task.due_date">
                      <PhCalendarBlank class="w-3.5 h-3.5" weight="bold" />
                      <span>{{ formatDate(new Date(task.due_date)) }}</span>
                    </div>
                    <button 
                      @click.stop="deleteTask(task.id)"
                      class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </template>
            </draggable>
            <div v-if="tasksByWeek[week]?.length === 0" class="pl-12 text-sm text-gray-400 dark:text-gray-500 italic">
              No tactics planned.
            </div>
          </div>
        </div>
      </div>

      <div v-else class="w-2/3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 border-dashed flex items-center justify-center text-gray-400 dark:text-gray-500">
        Select a project to view its plan
      </div>
    </div>

    <!-- Create Project Modal -->
    <div v-if="showCreateProject" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-96 shadow-xl border border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">{{ editingProjectId ? 'Edit Project' : 'New Project' }}</h2>
        <div class="relative mb-3">
          <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500">
            <button 
              @click="showIconSelector = !showIconSelector"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-r border-gray-300 dark:border-gray-600"
            >
              <component 
                :is="getIcon(newProject.icon)" 
                weight="bold" 
                class="w-5 h-5" 
              />
            </button>
            <input 
              v-model="newProject.title" 
              placeholder="Project Title" 
              class="w-full p-2 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400" 
            />
          </div>

          <!-- Icon Popup -->
          <div v-if="showIconSelector" class="fixed inset-0 z-10" @click="showIconSelector = false"></div>
          <div 
            v-if="showIconSelector" 
            class="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 grid grid-cols-4 gap-2 z-20 w-48 max-h-60 overflow-y-auto"
          >
            <div 
              v-for="icon in icons" 
              :key="icon.name"
              @click="newProject.icon = icon.name; showIconSelector = false"
              class="p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-center items-center transition-colors"
              :class="newProject.icon === icon.name ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-700' : 'text-gray-600 dark:text-gray-400'"
            >
              <component :is="icon.component" weight="bold" class="w-5 h-5" />
            </div>
          </div>
        </div>
        
        <div class="w-full mb-3 h-24 border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
          <MarkdownEditor v-model="newProject.description" theme="dark" placeholder="Description" />
        </div>
        
        <div class="flex gap-2 mb-6">
          <div 
            v-for="color in colors" 
            :key="color"
            @click="newProject.color = color"
            class="w-6 h-6 rounded-full cursor-pointer border-2"
            :class="newProject.color === color ? 'border-gray-600 dark:border-gray-300' : 'border-transparent'"
            :style="{ backgroundColor: color }"
          ></div>
        </div>
        <div class="flex justify-end gap-2">
          <button @click="showCreateProject = false" class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Cancel</button>
          <button @click="createProject" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">{{ editingProjectId ? 'Save' : 'Create' }}</button>
        </div>
      </div>
    </div>

    <!-- Add Task Modal -->
    <div v-if="showAddTask" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="saveAndCloseAddTask">
      <div class="bg-white dark:bg-gray-800 rounded-xl w-[500px] shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
        
        <!-- Top Bar: Date & Priority -->
        <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 rounded-t-xl">
          <!-- Date Picker Trigger -->
          <VueDatePicker 
            v-model="newTask.dueDate" 
            :dark="true"
            :enable-time-picker="false"
            :auto-apply="true"
            :teleport="true"
            :locale="zhTWLocale"
            :week-start="settingsStore.firstDayOfWeek"
            menu-class-name="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700"
          >
            <template #trigger>
              <button class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors text-sm font-medium">
                <PhCalendarBlank class="w-4 h-4" weight="bold" />
                <span>{{ newTask.dueDate ? formatDate(newTask.dueDate) : 'Today' }}</span>
              </button>
            </template>
          </VueDatePicker>

          <!-- Priority Trigger -->
          <div class="relative">
            <button 
              @click="showPriorityMenu = !showPriorityMenu"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <PhFlag 
                :weight="newTask.priority !== 'none' ? 'fill' : 'bold'" 
                class="w-5 h-5" 
                :class="currentPriorityOption.color"
              />
            </button>

            <!-- Priority Dropdown -->
            <div 
              v-if="showPriorityMenu"
              class="absolute top-full right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-20"
            >
              <button
                v-for="option in priorityOptions"
                :key="option.value"
                @click="newTask.priority = option.value; showPriorityMenu = false"
                class="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                :class="newTask.priority === option.value ? 'bg-indigo-50 dark:bg-gray-700/50' : ''"
              >
                <PhFlag 
                  :weight="option.weight as any" 
                  class="w-4 h-4" 
                  :class="option.color"
                />
                <span class="text-gray-700 dark:text-gray-200">{{ option.label }}</span>
              </button>
            </div>
            <div v-if="showPriorityMenu" class="fixed inset-0 z-10" @click="showPriorityMenu = false"></div>
          </div>
        </div>

        <!-- Main Input -->
        <div class="p-4">
          <input 
            v-model="newTask.title" 
            placeholder="What would you like to do?" 
            class="w-full text-lg font-medium bg-transparent border-none focus:ring-0 p-0 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600"
            autofocus
            @keydown.enter="createTask"
          />
          <div class="w-full mt-2 h-24 border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
            <MarkdownEditor 
              v-model="newTask.description" 
              theme="dark" 
              placeholder="Add a description..." 
            />
          </div>
        </div>



      </div>
    </div>

    <!-- Context Menu -->
    <div 
      v-if="showContextMenu" 
      class="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 w-48"
      :style="{ top: `${contextMenuPosition.y}px`, left: `${contextMenuPosition.x}px` }"
    >
      <button 
        @click="deleteProjectFromMenu"
        class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 flex items-center gap-2"
      >
        <span class="font-medium">Delete Project</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import MarkdownEditor from '../components/MarkdownEditor.vue'
import { 
  PhRocketLaunch, PhSneaker, PhCode, PhBook, PhBriefcase, PhHeart, PhStar, PhLightning,
  PhMoney, PhChartLineUp, PhPaintBrush, PhCamera, PhVideo, PhMusicNotes, 
  PhGlobe, PhHouse, PhUsers, PhGraduationCap, PhAirplane, PhGameController,
  PhList, PhFlag, PhCalendarBlank,
  PhCoffee, PhDesktop, PhEnvelope, PhFolder, PhGear, PhGift, PhHeadphones, PhImage, PhKey, PhTrophy, PhTarget,
  PhPencil, PhNotebook
} from '@phosphor-icons/vue'
import { zhTW } from 'date-fns/locale'
const zhTWLocale = zhTW
import { useSettingsStore } from '../stores/settings'
const settingsStore = useSettingsStore()
const router = useRouter()
import draggable from 'vuedraggable'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const projects = ref<any[]>([])
const selectedProject = ref<any>(null)
const projectTasks = ref<any[]>([])
const tasksByWeek = ref<Record<number, any[]>>({})
const currentCycle = ref<any>(null)

// Initialize tasksByWeek structure
for (let i = 0; i <= 12; i++) {
  tasksByWeek.value[i] = []
}

const showCreateProject = ref(false)
const showIconSelector = ref(false)
const editingProjectId = ref<string | null>(null)
const newProject = ref({ title: '', description: '', color: '#5e7a91', icon: 'PhList' })
const colors = ['#5e7a91', '#8da399', '#d9c88c', '#c48a8a', '#d1a68c', '#a69cc4']
const showContextMenu = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const contextMenuProject = ref<any>(null)

const icons = [
  { name: 'PhList', component: PhList },
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
  return icons.find(i => i.name === iconName)?.component || icons[0]!.component
}

const showAddTask = ref(false)
const activeWeek = ref(1)
const newTask = ref<{ title: string; description: string; dueDate: Date | null; priority: string }>({ title: '', description: '', dueDate: null, priority: 'low' })
const editingTaskId = ref<string | null>(null)

interface PriorityOption {
  label: string;
  value: string;
  color: string;
  weight: string;
}

const priorityOptions: PriorityOption[] = [
  { label: 'High', value: 'high', color: 'text-red-500', weight: 'fill' },
  { label: 'Medium', value: 'medium', color: 'text-orange-500', weight: 'fill' },
  { label: 'Low', value: 'low', color: 'text-blue-500', weight: 'fill' },
  { label: 'None', value: 'none', color: 'text-gray-400', weight: 'regular' }
]

const showPriorityMenu = ref(false)
const currentPriorityOption = computed(() => 
  priorityOptions.find(o => o.value === newTask.value.priority) || priorityOptions[3]! as PriorityOption
)

function formatDate(date: Date) {
  return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`
}

onMounted(() => {
  loadProjects()
  loadCycle()
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('click', closeContextMenu)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('click', closeContextMenu)
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (showIconSelector.value) {
      showIconSelector.value = false
      return
    }
    if (showCreateProject.value) {
      showCreateProject.value = false
      return
    }
    if (showAddTask.value) {
      saveAndCloseAddTask()
      return
    }
  }
}

async function saveAndCloseAddTask() {
  if (editingTaskId.value) {
    if (debounceTimer) clearTimeout(debounceTimer)
    await saveCurrentTask()
  }
  closeAddTask()
}

function closeAddTask() {
  if (debounceTimer) clearTimeout(debounceTimer)
  showAddTask.value = false
  editingTaskId.value = null
}

async function loadCycle() {
  const data = await window.ipcRenderer.getDashboardData()
  if (data.cycle) {
    currentCycle.value = data.cycle
  }
}

function getWeekRange(weekNum: number) {
  if (!currentCycle.value?.start_date) return ''
  const start = new Date(currentCycle.value.start_date)
  const weekStart = new Date(start)
  weekStart.setDate(start.getDate() + (weekNum - 1) * 7)
  
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  
  return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`
}

async function loadProjects() {
  projects.value = await window.ipcRenderer.getProjects()
}

async function selectProject(project: any) {
  selectedProject.value = project
  await loadProjectTasks(project.id)
}

async function loadProjectTasks(projectId: string) {
  const tasks = await window.ipcRenderer.getProjectTasks(projectId)
  projectTasks.value = tasks
  
  // Reset and populate tasksByWeek
  for (let i = 0; i <= 12; i++) {
    tasksByWeek.value[i] = []
  }
  
  tasks.forEach(task => {
    const week = task.week_number || 0
    if (tasksByWeek.value[week]) {
      tasksByWeek.value[week].push(task)
    }
  })
}

async function createProject() {
  if (!newProject.value.title) {
    alert('Please enter a project title')
    return
  }
  try {
    if (editingProjectId.value) {
      console.log('Updating project:', newProject.value)
      await window.ipcRenderer.updateProject({ ...newProject.value, id: editingProjectId.value })
    } else {
      console.log('Creating project:', newProject.value)
      await window.ipcRenderer.createProject({ ...newProject.value })
    }
    showCreateProject.value = false
    editingProjectId.value = null
    newProject.value = { title: '', description: '', color: '#5e7a91', icon: 'PhList' }
    await loadProjects()
  } catch (error) {
    console.error('Failed to save project:', error)
    alert('Failed to save project: ' + error)
  }
}

function openEditProject(project: any, e: Event) {
  e.stopPropagation()
  editingProjectId.value = project.id
  newProject.value = { 
    title: project.title, 
    description: project.description, 
    color: project.color, 
    icon: project.icon 
  }
  showCreateProject.value = true
}

async function deleteProject(id: string) {
  if (settingsStore.confirmDelete && !confirm('Are you sure? This will delete all tasks associated with this project.')) return
  await window.ipcRenderer.deleteProject(id)
  selectedProject.value = null
  await loadProjects()
}

function goToProjectNote() {
  if (selectedProject.value) {
    router.push({ 
      name: 'Documents', 
      query: { 
        type: 'project_note', 
        projectId: selectedProject.value.id 
      } 
    })
  }
}

function openAddTask(week: number) {
  activeWeek.value = week
  newTask.value = { title: '', description: '', dueDate: null, priority: 'low' }
  editingTaskId.value = null
  showAddTask.value = true
}

function openEditTask(task: any) {
  console.log('Opening edit task:', task)
  editingTaskId.value = null // Reset first to avoid watcher trigger
  activeWeek.value = task.week_number
  newTask.value = { 
    title: task.title, 
    description: task.description || '',
    dueDate: task.due_date ? new Date(task.due_date) : null, 
    priority: task.priority || 'low' 
  }
  editingTaskId.value = task.id
  showAddTask.value = true
}

let debounceTimer: any = null

import { watch } from 'vue'

watch(newTask, () => {
  if (editingTaskId.value) {
    debouncedSave()
  }
}, { deep: true })

function debouncedSave() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    saveCurrentTask()
  }, 500)
}

async function saveCurrentTask() {
  if (!editingTaskId.value || !newTask.value.title) return
  
  console.log('Auto-saving task:', newTask.value)
  await window.ipcRenderer.updateTask({
    id: editingTaskId.value,
    title: newTask.value.title,
    description: newTask.value.description,
    due_date: newTask.value.dueDate ? newTask.value.dueDate.toISOString() : null,
    priority: newTask.value.priority
  })
  
  // Refresh tasks
  if (selectedProject.value) {
    await loadProjectTasks(selectedProject.value.id)
  }
}

async function createTask() {
  if (!newTask.value.title || !selectedProject.value) return
  
  if (editingTaskId.value) {
    // Just ensure it's saved and close
    if (debounceTimer) clearTimeout(debounceTimer)
    await saveCurrentTask()
  } else {
    console.log('Creating task with due date:', newTask.value.dueDate)
    await window.ipcRenderer.createTask({
      project_id: selectedProject.value.id,
      week_number: activeWeek.value,
      title: newTask.value.title,
      description: newTask.value.description,
      due_date: newTask.value.dueDate ? newTask.value.dueDate.toISOString() : null,
      priority: newTask.value.priority
    })
    
    const tasks = await window.ipcRenderer.getProjectTasks(selectedProject.value.id)
    console.log('Fetched tasks:', tasks)
    projectTasks.value = tasks
  }
  
  closeAddTask()
  if (selectedProject.value) {
    await loadProjectTasks(selectedProject.value.id)
  }
}

async function deleteTask(id: string) {
  if (settingsStore.confirmDelete && !confirm('Are you sure you want to delete this task?')) return
  await window.ipcRenderer.deleteTask(id)
  if (selectedProject.value) {
    await loadProjectTasks(selectedProject.value.id)
  }
}

async function toggleTask(task: any, isCompleted: boolean) {
  await window.ipcRenderer.toggleTaskComplete(task.id, isCompleted)
  // Optimistic update or refresh
  task.is_completed = isCompleted ? 1 : 0
}

async function onTaskDrop(week: number, event: any) {
  if (event.added) {
    const task = event.added.element
    console.log(`Moved task ${task.title} to week ${week}`)
    task.week_number = week
    await window.ipcRenderer.updateTask({ id: task.id, week_number: week })
  }
}

async function onDragEnd() {
  try {
    await window.ipcRenderer.updateProjectOrder(JSON.parse(JSON.stringify(projects.value)))
  } catch (error) {
    console.error('Failed to update project order:', error)
  }
}

function handleContextMenu(e: MouseEvent, project: any) {
  contextMenuProject.value = project
  contextMenuPosition.value = { x: e.clientX, y: e.clientY }
  showContextMenu.value = true
}

function closeContextMenu() {
  showContextMenu.value = false
}

async function deleteProjectFromMenu() {
  if (contextMenuProject.value) {
    await deleteProject(contextMenuProject.value.id)
    closeContextMenu()
  }
}
</script>
