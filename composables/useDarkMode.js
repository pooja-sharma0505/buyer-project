import { computed, watch } from 'vue'

const STORAGE_KEY = 'buyer-dark-mode'

export function useDarkMode() {
  // Use useState for SSR-safe reactive state that works in both
  // client and server contexts. useStorage is not available in the
  // Nitro server context during SSR, so we use useState and manually
  // sync to localStorage on the client.
  const darkMode = useState(STORAGE_KEY, () => {
    if (import.meta.server) return 'false'
    try {
      return localStorage.getItem(STORAGE_KEY) || 'false'
    } catch {
      return 'false'
    }
  })

  const isDark = computed(() => darkMode.value === 'true')

  const toggle = () => {
    darkMode.value = isDark.value ? 'false' : 'true'
  }

  // Apply / remove the .dark class on the client so the toggle is
  // immediately visible without waiting for a full re-render.
  // This also handles the initial load case where the class needs to be set
  // before the first paint based on the persisted preference.
  if (import.meta.client) {
    watch(isDark, (dark) => {
      if (dark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }, { immediate: true })

    // Persist to localStorage on change
    watch(darkMode, (val) => {
      try {
        localStorage.setItem(STORAGE_KEY, val)
      } catch {
        /* private mode / quota */
      }
    })
  }

  return { isDark, toggle }
}
