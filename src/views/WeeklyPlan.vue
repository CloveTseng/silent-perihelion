<template>
  <div class="p-8 h-full flex flex-col">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Weekly Plan</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Execute your tactics week by week.</p>
      </div>
      
      <!-- Week Selector -->
      <div class="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 shadow-sm">
        <button 
          @click="changeWeek(selectedWeek - 1)"
          :disabled="selectedWeek <= 1"
          class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded disabled:opacity-50 text-gray-600 dark:text-gray-300"
        >
          ←
        </button>
        <span class="px-4 font-bold text-gray-700 dark:text-gray-200 w-24 text-center">Week {{ selectedWeek }}</span>
        <button 
          @click="changeWeek(selectedWeek + 1)"
          :disabled="selectedWeek >= 12"
          class="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded disabled:opacity-50 text-gray-600 dark:text-gray-300"
        >
          →
        </button>
      </div>
    </div>

    <!-- Task List -->
    <div class="space-y-6">
      <div v-if="groupedTasks.length === 0" class="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 border-dashed">
        <p class="text-gray-500 dark:text-gray-400 text-lg">No tasks planned for this week.</p>
        <router-link to="/goals" class="text-indigo-600 dark:text-indigo-400 font-medium hover:underline mt-2 inline-block">
          Go to Goals & Strategy to plan tactics
        </router-link>
      </div>

      <div 
        v-for="group in groupedTasks" 
        :key="group.projectTitle"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
      >
        <div 
          class="px-6 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3"
          :style="{ borderLeft: `4px solid ${group.tasks[0].project_color || '#4F46E5'}` }"
        >
          <h3 class="font-bold text-gray-900 dark:text-white">{{ group.projectTitle }}</h3>
          <span class="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-full">{{ group.tasks.length }} tasks</span>
        </div>

        <div class="divide-y divide-gray-50 dark:divide-gray-700">
          <div 
            v-for="task in group.tasks" 
            :key="task.id"
            class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-start gap-4 group"
          >
            <!-- Checkbox -->
            <div class="pt-1">
              <input 
                type="checkbox" 
                :checked="task.is_completed === 1"
                @change="toggleTask(task)"
                class="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer bg-white dark:bg-gray-700"
              />
            </div>

            <!-- Content -->
            <div class="flex-1">
              <p 
                class="text-gray-900 dark:text-gray-100 font-medium transition-all"
                :class="{ 'line-through text-gray-400 dark:text-gray-500': task.is_completed === 1 }"
              >
                {{ task.title }}
              </p>
              
              <!-- Notes -->
              <div class="mt-2">
                <div class="w-full h-24 border border-gray-100 dark:border-gray-700 rounded overflow-hidden">
                  <MarkdownEditor 
                    v-model="task.notes"
                    theme="dark"
                    placeholder="Add notes..."
                    @blur="updateNotes(task)"
                  />
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
              <button 
                @click="postponeTask(task)"
                class="text-xs text-gray-400 hover:text-orange-500 dark:text-gray-500 dark:hover:text-orange-400 flex items-center gap-1 px-2 py-1 rounded hover:bg-orange-50 dark:hover:bg-gray-600"
                title="Move to next week"
              >
                <span>↪</span> Postpone
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import MarkdownEditor from '../components/MarkdownEditor.vue'
const selectedWeek = ref(1)
const tasks = ref<any[]>([])

const groupedTasks = computed(() => {
  const groups: { projectTitle: string; tasks: any[] }[] = []
  const groupMap = new Map<string, any[]>()

  // Since tasks are already sorted by project order from backend,
  // we can just iterate and build groups in order.
  tasks.value.forEach(task => {
    if (!groupMap.has(task.project_title)) {
      const newGroup: any[] = []
      groupMap.set(task.project_title, newGroup)
      groups.push({ projectTitle: task.project_title, tasks: newGroup })
    }
    groupMap.get(task.project_title)?.push(task)
  })
  return groups
})

onMounted(async () => {
  // Get current week from dashboard data first
  const data = await window.ipcRenderer.getDashboardData()
  if (data.cycle) {
    selectedWeek.value = data.cycle.currentWeek
  }
  await loadTasks()
})

async function loadTasks() {
  tasks.value = await window.ipcRenderer.getWeeklyTasks(selectedWeek.value)
}

async function changeWeek(week: number) {
  if (week < 1 || week > 12) return
  selectedWeek.value = week
  await loadTasks()
}

async function toggleTask(task: any) {
  task.is_completed = task.is_completed === 1 ? 0 : 1
  await window.ipcRenderer.toggleTaskComplete(task.id, task.is_completed === 1)
}

async function updateNotes(task: any) {
  await window.ipcRenderer.updateTaskNotes({ id: task.id, notes: task.notes })
}

async function postponeTask(task: any) {
  if (!confirm('Move this task to the next week?')) return
  const success = await window.ipcRenderer.postponeTask(task.id)
  if (success) {
    await loadTasks()
  } else {
    alert('Cannot postpone task (already at week 12 or error).')
  }
}

</script>
