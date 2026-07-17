<template>
  <div class="login-page">
    <div class="card">
      <h1>Login</h1>
      <p>Login using your name and phone from database users table.</p>

      <form @submit.prevent="handleLogin">
        <label for="name">Name</label>
        <input
          id="name"
          v-model.trim="name"
          type="text"
          placeholder="Name"
          autocomplete="name"
          :aria-invalid="!!fieldErrors.name"
        />
        <p v-if="fieldErrors.name" class="field-error">{{ fieldErrors.name }}</p>

        <label for="phone">Phone</label>
        <input
          id="phone"
          v-model.trim="phone"
          type="tel"
          inputmode="numeric"
          placeholder="Phone number"
          autocomplete="tel"
          :aria-invalid="!!fieldErrors.phone"
        />
        <p v-if="fieldErrors.phone" class="field-error">{{ fieldErrors.phone }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">Login successful. Redirecting...</p>
    </div>
  </div>
</template>

<script setup>
const { login } = useAuth()

const name = ref('')
const phone = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)
const fieldErrors = ref({ name: '', phone: '' })

function validate() {
  const next = { name: '', phone: '' }

  if (!name.value) {
    next.name = 'Name is required'
  } else if (name.value.length < 2) {
    next.name = 'Name must be at least 2 characters'
  }

  if (!phone.value) {
    next.phone = 'Phone is required'
  } else if (!/^\d{10,15}$/.test(phone.value)) {
    next.phone = 'Phone must be 10–15 digits only'
  }

  fieldErrors.value = next
  return !next.name && !next.phone
}

const handleLogin = async () => {
  error.value = ''
  success.value = ''

  if (!validate()) return

  loading.value = true
  try {
    await login(name.value, phone.value)
    success.value = 'Success'
    await navigateTo('/')
  } catch (err) {
    error.value = err.data?.message || err.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page { min-height: calc(100vh - 72px); display: flex; align-items: center; justify-content: center; background: #f8fafc; padding: 16px; }
.card { width: 100%; max-width: 360px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }
h1 { margin: 0 0 6px; color: #111827; }
p { margin: 0 0 12px; color: #6b7280; font-size: 14px; }
form { display: grid; gap: 8px; }
label { color: #374151; font-size: 13px; }
input { border: 1px solid #d1d5db; border-radius: 8px; padding: 10px; }
input[aria-invalid="true"] { border-color: #dc2626; }
.field-error { color: #dc2626; font-size: 12px; margin: -4px 0 4px; }
button { margin-top: 8px; border: none; border-radius: 8px; background: #111827; color: #fff; padding: 10px; cursor: pointer; }
button:disabled { opacity: 0.7; cursor: not-allowed; }
.error { color: #dc2626; margin-top: 10px; }
.success { color: #15803d; margin-top: 10px; }
@media (max-width: 480px) {
  .login-page { align-items: flex-start; padding: 12px; }
  .card { border-radius: 10px; padding: 16px; }
}
</style>
