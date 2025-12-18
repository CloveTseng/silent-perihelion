<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
      
      <!-- Header -->
      <div class="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Weekly Review</h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Week {{ weekNumber }} Check-in</p>
        </div>
        <button @click="close" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <span class="text-2xl">×</span>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Left Column: Scoreboard (1/3 width) -->
          <div class="lg:col-span-1 space-y-6">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 dark:text-indigo-400 font-bold text-sm">1</div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">The Scoreboard</h3>
            </div>

            <!-- Score Card -->
            <div class="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center border border-indigo-100 dark:border-indigo-800 h-64">
              <span class="text-sm font-medium text-indigo-500 dark:text-indigo-300 uppercase tracking-wider mb-4">Execution Score</span>
              <div class="text-7xl font-black text-indigo-500 dark:text-indigo-400 mb-4">
                {{ executionScore }}<span class="text-4xl">%</span>
              </div>
              <p class="text-sm text-indigo-500/80 dark:text-indigo-400/80">
                {{ completedTasksCount }} of {{ totalTasksCount }} tactics completed
              </p>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
                <div class="text-gray-500 dark:text-gray-400 text-xs mb-1 uppercase tracking-wide">Completed</div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ completedTasksCount }}</div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-center">
                <div class="text-gray-500 dark:text-gray-400 text-xs mb-1 uppercase tracking-wide">Missed</div>
                <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalTasksCount - completedTasksCount }}</div>
              </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div class="text-gray-500 dark:text-gray-400 text-xs mb-2 uppercase tracking-wide">Status</div>
              <div class="flex items-center gap-2">
                <div class="h-2 flex-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div class="h-full bg-indigo-500 transition-all duration-500" :style="{ width: `${executionScore}%` }"></div>
                </div>
                <span class="text-sm font-medium" :class="scoreColorClass">{{ executionScore >= 85 ? 'Excellent' : executionScore >= 60 ? 'Good' : 'Needs Improvement' }}</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Reflection (2/3 width) -->
          <div class="lg:col-span-2 space-y-6">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-8 h-8 rounded-full bg-green-500/20 dark:bg-green-500/30 flex items-center justify-center text-green-500 dark:text-green-500 font-bold text-sm">2</div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Reflection</h3>
            </div>

            <div class="space-y-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">本週亮點 <span class="text-gray-400 font-normal">- 這週做對了什麼？</span></label>
                <div class="w-full h-32 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-hidden">
                  <MarkdownEditor 
                    v-model="reviewData.wins"
                    theme="dark"
                    placeholder="List your victories..."
                  />
                </div>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">遇到的困難 <span class="text-gray-400 font-normal">- 什麼阻礙了你？</span></label>
                <div class="w-full h-32 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-hidden">
                  <MarkdownEditor 
                    v-model="reviewData.struggles"
                    theme="dark"
                    placeholder="Identify the blockers..."
                  />
                </div>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">下週改進 <span class="text-gray-400 font-normal">- 下週要做的一個改變</span></label>
                <div class="w-full h-32 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-hidden">
                  <MarkdownEditor 
                    v-model="reviewData.fixes"
                    theme="dark"
                    placeholder="Actionable improvement..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Section: Look Ahead -->
        <div class="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-full bg-yellow-500/20 dark:bg-yellow-500/30 flex items-center justify-center text-yellow-500 dark:text-yellow-500 font-bold text-sm">3</div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Look Ahead</h3>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Next Week Focus & Confidence -->
            <div class="bg-yellow-500/10 dark:bg-yellow-500/10 rounded-2xl p-6 border border-yellow-500/20 dark:border-yellow-500/30">
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">下週焦點</label>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">從下週的計畫中，選出「絕對要完成的一件事」</p>
                <input 
                  v-model="reviewData.nextWeekFocus"
                  type="text" 
                  class="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-yellow-500 focus:border-yellow-500 dark:text-white p-3.5"
                  placeholder="The one thing that must happen..."
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-900 dark:text-white mb-1">信心指數 (1-5)</label>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">你對下週達成目標有多少信心？</p>
                <div class="flex gap-4">
                  <button 
                    v-for="n in 5" 
                    :key="n"
                    @click="rating = n"
                    class="w-12 h-12 rounded-full font-bold text-lg transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    :class="rating === n ? 'bg-yellow-500 text-white shadow-lg scale-110' : 'bg-white dark:bg-gray-800 text-gray-400 hover:bg-yellow-500/20 dark:hover:bg-gray-700'"
                  >
                    {{ n }}
                  </button>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-2" v-if="rating && rating < 3">
                  ⚠️ Low confidence. Consider reducing scope for next week.
                </p>
              </div>
            </div>

            <!-- Next Week Preview -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
              <h4 class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">Next Week's Tasks (Preview)</h4>
              <div class="overflow-y-auto space-y-2 pr-2 max-h-[230px]">
                <div v-if="nextWeekTasks.length === 0" class="text-center py-8 text-gray-400 dark:text-gray-500 text-sm italic">
                  No tasks planned for next week yet.
                </div>
                <div 
                  v-for="task in nextWeekTasks" 
                  :key="task.id"
                  class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 text-sm"
                >
                  <div class="w-2 h-2 rounded-full flex-shrink-0" :style="{ backgroundColor: task.project_color || '#ccc' }"></div>
                  <span class="text-gray-700 dark:text-gray-200 truncate">{{ task.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Free Thoughts -->
        <div class="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-full bg-purple-500/20 dark:bg-purple-500/30 flex items-center justify-center text-purple-500 dark:text-purple-500 font-bold text-sm">4</div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Free Thoughts</h3>
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">其他想法 <span class="text-gray-400 font-normal">- 心情隨筆、靈感或任何想記錄的事</span></label>
            <div class="w-full h-32 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-hidden">
              <MarkdownEditor 
                v-model="reviewData.otherThoughts"
                theme="dark"
                placeholder="Write anything here..."
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-8 py-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end gap-3">
        <button 
          @click="close"
          class="px-6 py-2.5 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="save"
          class="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg shadow-sm shadow-indigo-200 dark:shadow-none transition-colors flex items-center gap-2"
        >
          <span>Commit Review</span>
          <span v-if="isSaving" class="animate-spin">⟳</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import MarkdownEditor from './MarkdownEditor.vue'

const props = defineProps<{
  isOpen: boolean
  weekNumber: number
  tasks: any[]
}>()

const emit = defineEmits(['close', 'saved'])

const isSaving = ref(false)
const rating = ref(0)
const nextWeekTasks = ref<any[]>([])
const reviewData = ref({
  wins: '',
  struggles: '',
  fixes: '',
  nextWeekFocus: '',
  otherThoughts: ''
})

// Scoreboard Calculations
const totalTasksCount = computed(() => props.tasks.length)
const completedTasksCount = computed(() => props.tasks.filter(t => t.is_completed === 1).length)
const executionScore = computed(() => {
  if (totalTasksCount.value === 0) return 0
  return Math.round((completedTasksCount.value / totalTasksCount.value) * 100)
})

const scoreColorClass = computed(() => {
  if (executionScore.value >= 85) return 'text-green-500 dark:text-green-500'
  if (executionScore.value >= 60) return 'text-yellow-500 dark:text-yellow-500'
  return 'text-red-500 dark:text-red-500'
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
  }
}

// Load existing review when opened
watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    window.addEventListener('keydown', handleKeydown)
    // Load Review Data
    try {
      const review = await window.ipcRenderer.getWeeklyReview(props.weekNumber)
      if (review) {
        rating.value = review.rating || 0
        try {
          const content = JSON.parse(review.content)
          reviewData.value = {
            wins: content.wins || '',
            struggles: content.struggles || '',
            fixes: content.fixes || '',
            nextWeekFocus: content.nextWeekFocus || '',
            otherThoughts: content.otherThoughts || ''
          }
        } catch (e) {
          reviewData.value.wins = review.content
        }
      } else {
        rating.value = 0
        reviewData.value = { wins: '', struggles: '', fixes: '', nextWeekFocus: '', otherThoughts: '' }
      }
    } catch (error) {
      console.error('Failed to load review:', error)
    }

    // Load Next Week's Tasks
    try {
      nextWeekTasks.value = await window.ipcRenderer.getWeeklyTasks(props.weekNumber + 1)
    } catch (error) {
      console.error('Failed to load next week tasks:', error)
    }
  } else {
    window.removeEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

async function save() {
  isSaving.value = true
  try {
    const content = JSON.stringify(reviewData.value)
    await window.ipcRenderer.saveWeeklyReview(props.weekNumber, content, rating.value)
    emit('saved')
    close()
  } catch (error) {
    console.error('Failed to save review:', error)
    alert('Failed to save review')
  } finally {
    isSaving.value = false
  }
}

function close() {
  emit('close')
}
</script>
