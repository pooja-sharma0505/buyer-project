export function useAuth() {
  const user = useState('auth-user', () => null)

  const isLoggedIn = computed(() => !!user.value)

  async function fetchUser() {
    try {
      const data = await $fetch('/api/auth/me')
      user.value = data.user
    } catch {
      user.value = null
    }
  }

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
      // Clear user-scoped localStorage so the next user on a shared browser
      // doesn't see the previous user's cart or wishlist.
      if (import.meta.client) {
        try {
          localStorage.removeItem('buyer-cart-v1')
          localStorage.removeItem('buyer-wishlist-v1')
          // Remove any user-scoped keys
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

  return { user, isLoggedIn, fetchUser, login, logout }
}
