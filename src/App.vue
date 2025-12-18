<script setup lang="ts">
import { 
  PhSquaresFour, 
  PhCalendarCheck, 
  PhTarget, 
  PhFolder, 
  PhArchiveBox, 
  PhGear,
  PhLightning
} from '@phosphor-icons/vue'
</script>

<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Sidebar -->
    <aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-200 z-50 relative" style="-webkit-app-region: no-drag">
      <div class="p-6 border-b border-gray-100 dark:border-gray-700">
        <h1 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
          <PhLightning weight="fill" class="text-2xl" /> 12-Week Year
        </h1>
      </div>
      
      <nav class="flex-1 p-4 space-y-1">
        <router-link 
          to="/" 
          @click="console.log('Sidebar: Dashboard clicked')"
          class="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          active-class="bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-medium"
        >
          <PhSquaresFour weight="bold" class="text-xl" /> Dashboard
        </router-link>
        <router-link 
          to="/weekly" 
          class="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          active-class="bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-medium"
        >
          <PhCalendarCheck weight="bold" class="text-xl" /> Weekly Plan
        </router-link>
        <router-link 
          to="/goals" 
          class="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          active-class="bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-medium"
        >
          <PhTarget weight="bold" class="text-xl" /> Goals & Strategy
        </router-link>
        <router-link 
          to="/documents" 
          class="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          active-class="bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-medium"
        >
          <PhFolder weight="bold" class="text-xl" /> Documents
        </router-link>
        <router-link 
          to="/archive" 
          class="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          active-class="bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 font-medium"
        >
          <PhArchiveBox weight="bold" class="text-xl" /> Archive
        </router-link>

      </nav>

      <div class="p-4 border-t border-gray-100 dark:border-gray-700 relative flex justify-center items-center">
        <span class="text-xs text-gray-400 dark:text-gray-500">v0.1.0 Alpha</span>
        <router-link 
          to="/settings" 
          class="absolute right-4 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          title="Settings"
        >
          <PhGear weight="bold" class="h-5 w-5" />
        </router-link>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 relative">
      <!-- DEBUG INFO -->
      <div class="bg-yellow-100 text-yellow-900 p-2 text-xs absolute top-0 right-0 z-50 opacity-75">
        Path: {{ $route.fullPath }} <br/>
        Matched: {{ $route.matched.length }} <br/>
        Name: {{ $route.name }}
      </div>

      <div v-if="!$route.matched.length" class="text-red-500 p-4">
        No route matched for: {{ $route.path }}
      </div>
      <router-view v-slot="{ Component }">
        <div v-if="!Component" class="p-4 text-gray-500">Loading component or no component found...</div>
        <component :is="Component" :key="$route.path" />
      </router-view>
    </main>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
