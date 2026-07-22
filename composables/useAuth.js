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

  async function login(name, phone, password) {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { name, phone, password }
    })
    user.value = data.user
    return data
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      user.value = null
      await navigateTo('/')
    }
  }

  return { user, isLoggedIn, fetchUser, login, logout }
}
