<template>
  <div class="login-page">
    <div class="card">
      <h1>Login</h1>
      <p>Enter your account details to continue.</p>

      <form @submit.prevent="handleLogin">
        <label for="name">Name</label>
        <input
          id="name"
          v-model.trim="name"
          type="text"
          placeholder="Name"
          autocomplete="name"
          :aria-invalid="!!fieldErrors.name"
          @input="fieldErrors.name = ''"
          @blur="validateField('name')"
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
          @input="fieldErrors.phone = ''"
          @blur="validateField('phone')"
        />
        <p v-if="fieldErrors.phone" class="field-error">{{ fieldErrors.phone }}</p>

        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Password"
          autocomplete="current-password"
          :aria-invalid="!!fieldErrors.password"
          @input="fieldErrors.password = ''"
          @blur="validateField('password')"
        />
        <p v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p v-if="error" class="login-error">{{ error }}</p>
      <p v-if="success" class="success">Login successful. Redirecting...</p>

      <div class="login-links">
        <span class="link-placeholder">Forgot password?</span>
        <span class="divider">|</span>
        <span class="link-placeholder">Sign up</span>
      </div>

      <div class="demo-hint">
        <p><strong>Demo login:</strong> Name = <code>Demo User</code>, Phone = <code>9876543210</code>, Password = <code>demo123</code></p>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Login' })
useSeoMeta({
  ogTitle: 'Login - LUMIÈRE',
  ogDescription: 'Sign in to your LUMIÈRE account.',
  ogImage: '/og-image.svg',
  ogType: 'website'
})

const { login } = useAuth()

const name = ref('')
const phone = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)
const fieldErrors = ref({ name: '', phone: '', password: '' })

function validate() {
  const next = { name: '', phone: '', password: '' }

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

  if (!password.value) {
    next.password = 'Password is required'
  } else if (password.value.length < 6) {
    next.password = 'Password must be at least 6 characters'
  }

  fieldErrors.value = next
  return !next.name && !next.phone && !next.password
}

function validateField(field) {
  const err = fieldErrors.value
  if (field === 'name') {
    if (!name.value) {
      err.name = 'Name is required'
    } else if (name.value.length < 2) {
      err.name = 'Name must be at least 2 characters'
    } else {
      err.name = ''
    }
  }
  if (field === 'phone') {
    if (!phone.value) {
      err.phone = 'Phone is required'
    } else if (!/^\d{10,15}$/.test(phone.value)) {
      err.phone = 'Phone must be 10–15 digits only'
    } else {
      err.phone = ''
    }
  }
  if (field === 'password') {
    if (!password.value) {
      err.password = 'Password is required'
    } else if (password.value.length < 6) {
      err.password = 'Password must be at least 6 characters'
    } else {
      err.password = ''
    }
  }
}

const handleLogin = async () => {
  error.value = ''
  success.value = ''

  if (!validate()) return

  loading.value = true
  try {
    await login(name.value, phone.value, password.value)
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
h1 { margin: 0 0 6px; color: #111827; font-family: 'Cormorant Garamond', serif; }
p { margin: 0 0 12px; color: #6b7280; font-size: 14px; }
form { display: grid; gap: 8px; }
label { color: #374151; font-size: 13px; }
input { border: 1px solid #d1d5db; border-radius: 8px; padding: 10px; }
input[aria-invalid="true"] { border-color: #dc2626; }
.field-error { color: #dc2626; font-size: 12px; margin: -4px 0 4px; }
button { margin-top: 8px; border: none; border-radius: 8px; background: #111827; color: #fff; padding: 10px; cursor: pointer; transition: background 0.2s ease; }
button:hover { background: #d4af64; color: #0a0806; }
button:disabled { opacity: 0.7; cursor: not-allowed; }
.login-error { color: #dc2626; margin-top: 10px; }
.success { color: #15803d; margin-top: 10px; }
.login-links { display: flex; gap: 8px; justify-content: center; margin-top: 14px; font-size: 13px; color: #6b7280; }
.link-placeholder { cursor: pointer; transition: color 0.2s ease; }
.link-placeholder:hover { color: #d4af64; }
.divider { color: #d1d5db; }
.demo-hint { margin-top: 16px; padding: 12px; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #6b7280; }
.demo-hint code { background: #fff; padding: 2px 4px; border-radius: 4px; border: 1px solid #d1d5db; font-family: 'Courier New', monospace; color: #374151; }
.demo-hint p { margin: 0; font-size: 12px; }
@media (max-width: 480px) {
  .login-page { align-items: flex-start; padding: 12px; }
  .card { border-radius: 10px; padding: 16px; }
}
</style>
