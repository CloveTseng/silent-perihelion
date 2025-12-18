import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // Initialize from localStorage or default to true
  const showMarkdownToolbar = ref(localStorage.getItem('showMarkdownToolbar') !== 'false')
  const dateFormat = ref(localStorage.getItem('dateFormat') || 'YYYY/MM/DD')
  const firstDayOfWeek = ref(Number(localStorage.getItem('firstDayOfWeek') || 0))
  const confirmDelete = ref(localStorage.getItem('confirmDelete') !== 'false')

  // Watch for changes and save to localStorage
  watch(showMarkdownToolbar, (newValue) => {
    localStorage.setItem('showMarkdownToolbar', String(newValue))
  })

  watch(dateFormat, (newValue) => {
    localStorage.setItem('dateFormat', newValue)
  })

  watch(firstDayOfWeek, (newValue) => {
    localStorage.setItem('firstDayOfWeek', String(newValue))
  })

  watch(confirmDelete, (newValue) => {
    localStorage.setItem('confirmDelete', String(newValue))
  })

  function toggleMarkdownToolbar() {
    showMarkdownToolbar.value = !showMarkdownToolbar.value
  }

  return {
    showMarkdownToolbar,
    toggleMarkdownToolbar,
    dateFormat,
    firstDayOfWeek,
    confirmDelete
  }
})
