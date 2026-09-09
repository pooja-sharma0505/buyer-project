<template>
  <div class="login-page">
    <div class="card">
      <h1>Login</h1>
      <p>Enter your account details to continue.</p>

      <form @submit.prevent="handleLogin">
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
        <span>Don't have an account?</span>
        <NuxtLink to="/signup" class="link">Sign up</NuxtLink>
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
const { success: toastSuccess } = useToast()
const route = useRoute()

const phone = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)
const fieldErrors = ref({ phone: '', password: '' })

function validate() {
  const next = { phone: '', password: '' }

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
  return !next.phone && !next.password
}

function validateField(field) {
  const err = fieldErrors.value
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
    await login(phone.value, password.value)
    toastSuccess('Login successful')
    success.value = 'Success'
    const redirect = route.query.redirect || '/'
    await navigateTo(redirect)
  } catch (err) {
    error.value = err.data?.message || err.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page { min-height: calc(100vh - 72px); display: flex; align-items: center; justify-content: center; background: #f8fafc; padding: 40px 16px; }
.card { width: 100%; max-width: 380px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 28px 24px; }
h1 { margin: 0 0 8px; color: #111827; font-family: 'Cormorant Garamond', serif; font-size: 28px; }
p { margin: 0 0 20px; color: #6b7280; font-size: 14px; }
form { display: grid; gap: 10px; }
label { color: #374151; font-size: 13px; font-weight: 500; }
input { border: 1px solid #d1d5db; border-radius: 8px; padding: 12px; font-size: 14px; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
input:focus { border-color: #d4af64; outline: none; box-shadow: 0 0 0 3px rgba(212,175,100,0.15); }
input[aria-invalid="true"] { border-color: #dc2626; }
input[aria-invalid="true"]:focus { box-shadow: 0 0 0 3px rgba(220,38,38,0.15); }
.field-error { color: #dc2626; font-size: 12px; margin: -2px 0 4px; }
button { margin-top: 8px; border: none; border-radius: 8px; background: #111827; color: #fff; padding: 12px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.2s ease; }
button:hover { background: #d4af64; color: #0a0806; }
button:disabled { opacity: 0.7; cursor: not-allowed; }
.login-error { color: #dc2626; margin-top: 12px; font-size: 13px; }
.success { color: #15803d; margin-top: 12px; font-size: 13px; }
.login-links { display: flex; gap: 8px; justify-content: center; margin-top: 18px; font-size: 13px; color: #6b7280; }
.link { color: #d4af64; text-decoration: none; font-weight: 500; }
.link:hover { text-decoration: underline; }
@media (max-width: 480px) {
  .login-page { align-items: flex-start; padding: 24px 12px; }
  .card { border-radius: 10px; padding: 24px 16px; }
}
</style>
