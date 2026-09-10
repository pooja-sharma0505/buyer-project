// Module-level promise that resolves when auth initialization is complete
let authReadyPromise = null
let authReadyResolve = null

function createAuthReadyPromise() {
  authReadyPromise = new Promise((resolve) => {
    authReadyResolve = resolve
  })
}

// Initialize the promise
createAuthReadyPromise()

export function useAuth() {
  const user = useState('auth-user', () => null)
  const isAuthLoading = useState('auth-loading', () => true)

  const isLoggedIn = computed(() => !!user.value)

  // Function to reset the ready promise (used on logout)
  const resetAuthReady = () => {
    createAuthReadyPromise()
  }

  async function fetchUser() {
    isAuthLoading.value = true
    try {
      // During SSR, we need to forward cookies to the API call
      // On client side, cookies are sent automatically
      const headers = import.meta.server ? useRequestHeaders(['cookie']) : {}
      const data = await $fetch('/api/auth/me', {
        headers: headers.cookie ? { cookie: headers.cookie } : {}
      })
      user.value = data.user
    } catch {
      user.value = null
    } finally {
      isAuthLoading.value = false
      // Resolve the promise to signal auth is ready
      if (authReadyResolve) {
        authReadyResolve()
        authReadyResolve = null
      }
    }
  }

  // Function to wait for auth to be ready
  const waitForAuthReady = () => authReadyPromise

  async function login(phone, password) {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { phone, password }
    })
    user.value = data.user
    return data
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      user.value = null
      // Reset auth ready promise for next login
      resetAuthReady()
      if (import.meta.client) {
        try {
          localStorage.removeItem('buyer-cart-v1')
          localStorage.removeItem('buyer-wishlist-v1')
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('buyer-cart-v1-user-') || key.startsWith('buyer-wishlist-v1-user-')) {
              localStorage.removeItem(key)
            }
          })
        } catch {
          /* private mode / quota */
        }
      }
      const { success: toastSuccess } = useToast()
      toastSuccess('Logged out successfully')
      await navigateTo('/')
    }
  }

  return { user, isLoggedIn, isAuthLoading, fetchUser, login, logout, waitForAuthReady, resetAuthReady }
}
