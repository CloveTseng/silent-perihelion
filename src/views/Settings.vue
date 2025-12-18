<template>
  <div class="p-8 h-full flex flex-col">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Manage application preferences.</p>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 max-w-2xl">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Cycle Management</h2>

      <div v-if="currentCycle" class="space-y-4 mb-8">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cycle Title</label>
          <input 
            v-model="currentCycle.title"
            type="text"
            class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 p-2.5"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
            <VueDatePicker 
              v-model="currentCycle.start_date" 
              :dark="true"
              :enable-time-picker="false"
              :auto-apply="true"
              model-type="iso"
              :locale="zhTW"
              menu-class-name="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700"
            >
              <template #trigger>
                <div class="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white flex items-center gap-2 cursor-pointer">
                  <PhCalendarBlank class="w-5 h-5 text-gray-500" />
                  <span>{{ currentCycle.start_date ? new Date(currentCycle.start_date).toLocaleDateString() : 'Select Date' }}</span>
                </div>
              </template>
            </VueDatePicker>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date (Calculated)</label>
            <div class="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              {{ cycleEndDate }}
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button 
            @click="updateCycle"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Save Changes
          </button>
          <button 
            @click="openNewCycleModal"
            class="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <PhArrowsClockwise class="w-4 h-4" />
            Start New Cycle
          </button>
        </div>
      </div>

      <div v-else class="text-center py-8 text-gray-500">
        Loading cycle data...
      </div>

      <div class="border-t border-gray-100 dark:border-gray-700 my-6"></div>

      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">General</h2>
      
      <div class="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white">Show Menu Bar</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Toggle the visibility of the top menu bar (File, Edit, etc.).</p>
        </div>
        <button 
          @click="toggleMenuBar"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          :class="isMenuBarVisible ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'"
        >
          <span 
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            :class="isMenuBarVisible ? 'translate-x-6' : 'translate-x-1'"
          />
        </button>
      </div>

      <div class="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white">Show Markdown Toolbar</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Show the formatting toolbar in the document editor.</p>
        </div>
        <button 
          @click="settingsStore.toggleMarkdownToolbar"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          :class="settingsStore.showMarkdownToolbar ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'"
        >
          <span 
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            :class="settingsStore.showMarkdownToolbar ? 'translate-x-6' : 'translate-x-1'"
          />
        </button>
      </div>

      <div class="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white">Date Format</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Choose how dates are displayed across the application.</p>
        </div>
        <select 
          v-model="settingsStore.dateFormat"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
        >
          <option value="YYYY/MM/DD">YYYY/MM/DD</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>

      <div class="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white">First Day of Week</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Choose the first day of the week for calendars.</p>
        </div>
        <select 
          v-model="settingsStore.firstDayOfWeek"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
        >
          <option :value="0">Sunday</option>
          <option :value="1">Monday</option>
        </select>
      </div>

      <div class="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white">Confirm Deletion</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Ask for confirmation before deleting items.</p>
        </div>
        <button 
          @click="settingsStore.confirmDelete = !settingsStore.confirmDelete"
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          :class="settingsStore.confirmDelete ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'"
        >
          <span 
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            :class="settingsStore.confirmDelete ? 'translate-x-6' : 'translate-x-1'"
          />
        </button>
      </div>
    </div>

    <!-- New Cycle Modal -->
    <div v-if="showNewCycleModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Start New Cycle</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          This will archive the current cycle and start a fresh 12-week plan.
        </p>
        
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Cycle Title</label>
            <input 
              v-model="newCycle.title"
              type="text"
              placeholder="e.g., 2025 Q1"
              class="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 p-2.5"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
            <VueDatePicker 
              v-model="newCycle.startDate" 
              :dark="true"
              :enable-time-picker="false"
              :auto-apply="true"
              :locale="zhTW"
              menu-class-name="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700"
            >
              <template #trigger>
                <div class="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white flex items-center gap-2 cursor-pointer">
                  <PhCalendarBlank class="w-5 h-5 text-gray-500" />
                  <span>{{ newCycle.startDate ? newCycle.startDate.toLocaleDateString() : 'Select Date' }}</span>
                </div>
              </template>
            </VueDatePicker>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button 
            @click="showNewCycleModal = false"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium"
          >
            Cancel
          </button>
          <button 
            @click="startNewCycle"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
          >
            Start Cycle
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useSettingsStore } from '../stores/settings'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { PhCalendarBlank, PhArrowsClockwise } from '@phosphor-icons/vue'
import { zhTW } from 'date-fns/locale'

const settingsStore = useSettingsStore()
const isMenuBarVisible = ref(false)
const currentCycle = ref<any>(null)
const showNewCycleModal = ref(false)
const newCycle = ref({ title: '', startDate: new Date() })

const cycleEndDate = computed(() => {
  if (!currentCycle.value?.start_date) return ''
  const start = new Date(currentCycle.value.start_date)
  const end = new Date(start.getTime() + 84 * 24 * 60 * 60 * 1000) // 12 weeks
  return end.toLocaleDateString()
})

onMounted(async () => {
  await loadCycle()
})

async function loadCycle() {
  const data = await window.ipcRenderer.getDashboardData()
  if (data.cycle) {
    currentCycle.value = data.cycle
  }
}

async function toggleMenuBar() {
  isMenuBarVisible.value = !isMenuBarVisible.value
  await window.ipcRenderer.setMenuBarVisibility(isMenuBarVisible.value)
}

async function updateCycle() {
  console.log('Frontend: updateCycle called', currentCycle.value)
  if (!currentCycle.value) return
  try {
    await window.ipcRenderer.updateCycle({
      id: currentCycle.value.id,
      title: currentCycle.value.title,
      startDate: currentCycle.value.start_date
    })
    console.log('Frontend: updateCycle success')
    alert('Cycle updated!')
    await loadCycle()
  } catch (error) {
    console.error('Frontend: updateCycle failed:', error)
    alert('Failed to update cycle')
  }
}

function openNewCycleModal() {
  newCycle.value = { 
    title: `Cycle ${new Date().getFullYear()}`, 
    startDate: new Date() 
  }
  showNewCycleModal.value = true
}

async function startNewCycle() {
  if (!confirm('Are you sure? This will archive the current cycle and start a new one.')) return
  
  await window.ipcRenderer.startNewCycle({
    title: newCycle.value.title,
    startDate: newCycle.value.startDate.toISOString()
  })
  
  showNewCycleModal.value = false
  await loadCycle()
  alert('New cycle started!')
}
</script>
