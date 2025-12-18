<template>
  <div class="p-8 h-full flex flex-col">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Archive & Reviews</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Reflect on your progress and review past cycles.</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Weekly Reviews Section -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Weekly Review</h2>
          
          <div class="flex items-center gap-4 mb-6">
            <span class="text-gray-600 dark:text-gray-300 font-medium">Week:</span>
            <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button 
                v-for="w in 12" 
                :key="w"
                @click="selectWeek(w)"
                class="w-8 h-8 rounded flex items-center justify-center text-sm transition-colors"
                :class="selectedWeek === w ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
              >
                {{ w }}
              </button>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating (1-5)</label>
              <div class="flex gap-2">
                <button 
                  v-for="r in 5" 
                  :key="r"
                  @click="rating = r"
                  class="w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg transition-all"
                  :class="rating === r ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' : 'border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:border-indigo-300 dark:hover:border-indigo-500'"
                >
                  {{ r }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reflection (Keep / Problem / Try)</label>
              <div class="w-full h-64 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 overflow-hidden">
                <MarkdownEditor 
                  v-model="reviewContent"
                  theme="dark"
                  placeholder="What went well? What didn't? What will you change?"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <button 
                @click="saveReview"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Save Review
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Past Cycles Section -->
      <div class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Past Cycles</h2>
          
          <div v-if="archivedCycles.length === 0" class="text-center py-8 text-gray-400 dark:text-gray-500">
            No archived cycles yet.
          </div>

          <div class="space-y-3">
            <div 
              v-for="cycle in archivedCycles" 
              :key="cycle.id"
              class="p-4 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
            >
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-bold text-gray-900 dark:text-white">{{ cycle.title }}</h3>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(cycle.end_date) }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span>Final Score:</span>
                <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ cycle.final_score || 'N/A' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Archive Current Cycle Action -->
        <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/50 p-6">
          <h2 class="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-2">Current Cycle</h2>
          <p class="text-sm text-indigo-700 dark:text-indigo-400 mb-4">
            Ready to wrap up the current 12-week cycle? This will archive all current progress and allow you to start fresh.
          </p>
          <button 
            @click="archiveCycle"
            class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Complete & Archive Cycle
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MarkdownEditor from '../components/MarkdownEditor.vue'

const selectedWeek = ref(1)
const rating = ref(0)
const reviewContent = ref('')
const archivedCycles = ref<any[]>([])

onMounted(async () => {
  // Get current week
  const data = await window.ipcRenderer.getDashboardData()
  if (data.cycle) {
    selectedWeek.value = data.cycle.currentWeek
  }
  
  await loadReview()
  await loadArchivedCycles()
})

async function selectWeek(week: number) {
  selectedWeek.value = week
  await loadReview()
}

async function loadReview() {
  const review = await window.ipcRenderer.getWeeklyReview(selectedWeek.value)
  if (review) {
    rating.value = review.rating || 0
    reviewContent.value = review.content || ''
  } else {
    rating.value = 0
    reviewContent.value = ''
  }
}

async function saveReview() {
  await window.ipcRenderer.saveWeeklyReview(selectedWeek.value, reviewContent.value, rating.value)
  alert('Review saved!')
}

async function loadArchivedCycles() {
  archivedCycles.value = await window.ipcRenderer.getArchivedCycles()
}

async function archiveCycle() {
  if (!confirm('Are you sure you want to archive the current cycle? This cannot be undone.')) return
  
  const success = await window.ipcRenderer.archiveCurrentCycle()
  if (success) {
    alert('Cycle archived successfully!')
    await loadArchivedCycles()
    // Ideally redirect or refresh app state
    window.location.reload()
  } else {
    alert('Failed to archive cycle.')
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}
</script>
