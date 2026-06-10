<template>
  <div class="login-page">
    <div class="card">
      <h1>Login</h1>
      <p>Login using your name and phone from database users table.</p>

      <form @submit.prevent="handleLogin">
        <label>Name</label>
        <input v-model="name" type="text" placeholder="Name" />

        <label>Phone</label>
        <input v-model="phone" type="text" placeholder="Phone number" />

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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '../services/api'

const router = useRouter()
const name = ref('')
const phone = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    await loginUser({ name: name.value, phone: phone.value })
    success.value = 'Success'
    router.push('/')
  } catch (err) {
    error.value = err.message || 'Login failed'
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
button { margin-top: 8px; border: none; border-radius: 8px; background: #111827; color: #fff; padding: 10px; cursor: pointer; }
button:disabled { opacity: 0.7; cursor: not-allowed; }
.error { color: #dc2626; margin-top: 10px; }
.success { color: #15803d; margin-top: 10px; }
@media (max-width: 480px) {
  .login-page { align-items: flex-start; padding: 12px; }
  .card { border-radius: 10px; padding: 16px; }
}
</style>
