import { useDark, useToggle } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import api from '@/api'

export const useAppStore = defineStore('app', () => {
  const sidebarOpen = ref(false)
  const isDark = useDark()
  const toggleDark = useToggle(isDark)

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function closeSidebar() {
    sidebarOpen.value = false
  }

  function openSidebar() {
    sidebarOpen.value = true
  }

  async function fetchTheme() {
    try {
      const res = await api.get('/api/settings')
      if (res.data.ok && res.data.data.ui) {
        const theme = res.data.data.ui.theme
        isDark.value = theme === 'dark'
      }
    }
    catch (e) {
      console.error('Failed to fetch theme:', e)
    }
  }

  async function setTheme(theme: 'light' | 'dark') {
    try {
      await api.post('/api/settings/theme', { theme })
      isDark.value = theme === 'dark'
    }
    catch (e) {
      console.error('Failed to set theme:', e)
    }
  }

  // Watch for changes in isDark and sync with backend
  watch(isDark, (val) => {
    setTheme(val ? 'dark' : 'light')
  })

  return {
    sidebarOpen,
    isDark,
    toggleDark,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    fetchTheme,
    setTheme,
  }
})
