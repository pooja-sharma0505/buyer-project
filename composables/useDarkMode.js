import { ref, watch } from 'vue'

const STORAGE_KEY = 'buyer-dark-mode'

const isDark = ref(false)

export function useDarkMode() {
  if (import.meta.client && !isDark.value) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      isDark.value = stored ? stored === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch {
      isDark.value = false
    }
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    }
  }

  watch(isDark, (dark) => {
    if (!import.meta.client) return
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    try { localStorage.setItem(STORAGE_KEY, String(dark)) } catch {}
  })

  const toggle = () => {
    isDark.value = !isDark.value
  }

  return { isDark, toggle }
}