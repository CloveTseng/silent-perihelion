<template>
  <div class="p-8 h-full flex flex-col">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1" v-if="cycle">
          {{ cycle.title }} • Week {{ cycle.currentWeek }} of 12 <span class="ml-2 text-gray-400 font-normal">{{ cycleDateRange }}</span>
        </p>
        <p class="text-gray-500 dark:text-gray-400 mt-1" v-else>
          No active cycle found.
        </p>
      </div>
      <div class="flex gap-3">
        <button 
          @click="openReviewModal"
          class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Weekly Review
        </button>
        <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
          Complete Cycle
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Execution Score -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Execution Score</h3>
        <div class="flex items-end gap-3">
          <span class="text-4xl font-bold text-gray-900 dark:text-white">{{ score }}%</span>
          <span class="text-sm text-green-600 dark:text-green-400 font-medium mb-1" v-if="score >= 80">Excellent!</span>
          <span class="text-sm text-yellow-600 dark:text-yellow-400 font-medium mb-1" v-else-if="score >= 60">Keep pushing</span>
          <span class="text-sm text-red-600 dark:text-red-400 font-medium mb-1" v-else>Needs focus</span>
        </div>
        <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mt-4">
          <div 
            class="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
            :style="{ width: `${score}%` }"
          ></div>
        </div>
      </div>

      <!-- Weekly Review -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Weekly Review</h3>
          <button 
            v-if="weeklyReview"
            @click="openReviewModal"
            class="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <PhPencilSimple class="w-4 h-4" />
          </button>
        </div>
        
        <div v-if="weeklyReview">
          <div class="flex gap-1 mb-2">
            <PhStar 
              v-for="n in 5" 
              :key="n"
              class="w-5 h-5"
              :class="n <= weeklyReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'"
              weight="fill"
            />
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{{ weeklyReview.content }}</p>
        </div>
        
        <div v-else class="flex items-end">
          <button 
            @click="openReviewModal"
            class="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-colors"
          >
            Add Review
          </button>
        </div>
      </div>

      <!-- Days Remaining -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Days Remaining</h3>
        <div class="flex items-end gap-3">
          <span class="text-4xl font-bold text-gray-900 dark:text-white">{{ daysRemaining }}</span>
          <span class="text-sm text-gray-400 dark:text-gray-500 mb-1">days left in cycle</span>
        </div>
      </div>

      <!-- Active Projects -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Active Projects</h3>
        <div class="flex items-end gap-3">
          <span class="text-4xl font-bold text-gray-900 dark:text-white">{{ projects.length }}</span>
          <span class="text-sm text-gray-400 dark:text-gray-500 mb-1">goals in progress</span>
        </div>
      </div>
    </div>

    <!-- Goal Cards -->
    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Goal Progress</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="project in projects" 
        :key="project.id"
        class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-bold text-gray-900 dark:text-white">{{ project.title }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{{ project.description }}</p>
          </div>
          <div 
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: project.color || '#4F46E5' }"
          ></div>
        </div>
        
        <div class="mt-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600 dark:text-gray-300">{{ project.completedTasks }} / {{ project.totalTasks }} tasks</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ project.progress }}%</span>
          </div>
          <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
            <div 
              class="h-2 rounded-full transition-all duration-500"
              :style="{ 
                width: `${project.progress}%`,
                backgroundColor: project.color || '#4F46E5'
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>


    <!-- Review Modal -->
    <!-- Review Modal -->
    <WeeklyReviewModal 
      v-if="cycle"
      :is-open="showReviewModal"
      :week-number="cycle.currentWeek"
      :tasks="weeklyTasks"
      @close="showReviewModal = false"
      @saved="onReviewSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { PhStar, PhPencilSimple } from '@phosphor-icons/vue'
import WeeklyReviewModal from '../components/WeeklyReviewModal.vue'

const cycle = ref<any>(null)
const score = ref(0)
const projects = ref<any[]>([])
const weeklyReview = ref<any>(null)
const showReviewModal = ref(false)
const weeklyTasks = ref<any[]>([])

const daysRemaining = computed(() => {
  if (!cycle.value) return 0
  const end = new Date(cycle.value.end_date)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
})

const cycleDateRange = computed(() => {
  if (!cycle.value?.start_date || !cycle.value?.end_date) return ''
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `(${formatDate(cycle.value.start_date)} - ${formatDate(cycle.value.end_date)})`
})

onMounted(async () => {
  await loadDashboardData()
})

async function loadDashboardData() {
  try {
    const data = await window.ipcRenderer.getDashboardData()
    cycle.value = data.cycle
    score.value = data.score
    projects.value = data.projects
    
    if (cycle.value) {
      console.log('Dashboard: Active cycle found', cycle.value)
      await loadWeeklyReview()
      // Load tasks for the current week to pass to the modal
      console.log('Dashboard: Fetching tasks for week', cycle.value.currentWeek)
      weeklyTasks.value = await window.ipcRenderer.getWeeklyTasks(cycle.value.currentWeek)
      console.log('Dashboard: Fetched weekly tasks:', weeklyTasks.value)
    }
  } catch (e) {
    console.error('Failed to load dashboard data:', e)
  }
}

async function loadWeeklyReview() {
  if (!cycle.value || !cycle.value.currentWeek) {
    console.log('Dashboard: Skipping loadWeeklyReview - cycle or currentWeek missing')
    return
  }
  const review = await window.ipcRenderer.getWeeklyReview(cycle.value.currentWeek, cycle.value.id)
  weeklyReview.value = review
}

async function openReviewModal() {
  if (cycle.value) {
    // Refresh tasks before opening to ensure data is up to date
    weeklyTasks.value = await window.ipcRenderer.getWeeklyTasks(cycle.value.currentWeek)
  }
  showReviewModal.value = true
}

async function onReviewSaved() {
  await loadWeeklyReview()
  showReviewModal.value = false
}
</script>
