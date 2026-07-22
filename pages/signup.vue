<template>
  <div class="signup-page">
    <div class="card">
      <h1>Create Account</h1>
      <p>Sign up to start shopping with LUMIÈRE.</p>

      <form @submit.prevent="handleSignup">
        <label for="name">Name</label>
        <input
          id="name"
          v-model.trim="name"
          type="text"
          placeholder="Your name"
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
          placeholder="Create a password"
          autocomplete="new-password"
          :aria-invalid="!!fieldErrors.password"
          @input="fieldErrors.password = ''"
          @blur="validateField('password')"
        />
        <p v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Creating account...' : 'Sign Up' }}
        </button>
      </form>

      <p v-if="error" class="signup-error">{{ error }}</p>
      <p v-if="success" class="success">Account created. Redirecting to login...</p>

      <div class="signup-links">
        <span>Already have an account?</span>
        <NuxtLink to="/login" class="link">Log in</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Sign Up' })
useSeoMeta({
  ogTitle: 'Sign Up - LUMIÈRE',
  ogDescription: 'Create your LUMIÈRE account.',
  ogImage: '/og-image.svg',
  ogType: 'website'
})

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

const handleSignup = async () => {
  error.value = ''
  success.value = ''

  if (!validate()) return

  loading.value = true
  try {
    await $fetch('/api/auth/signup', {
      method: 'POST',
      body: { name: name.value, phone: phone.value, password: password.value }
    })
    success.value = 'Account created successfully'
    setTimeout(() => navigateTo('/login'), 1500)
  } catch (err) {
    error.value = err.data?.message || err.message || 'Signup failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.signup-page { min-height: calc(100vh - 72px); display: flex; align-items: center; justify-content: center; background: #f8fafc; padding: 16px; }
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
.signup-error { color: #dc2626; margin-top: 10px; }
.success { color: #15803d; margin-top: 10px; }
.signup-links { display: flex; gap: 6px; justify-content: center; margin-top: 14px; font-size: 13px; color: #6b7280; }
.link { color: #d4af64; text-decoration: none; font-weight: 500; }
.link:hover { text-decoration: underline; }
@media (max-width: 480px) {
  .signup-page { align-items: flex-start; padding: 12px; }
  .card { border-radius: 10px; padding: 16px; }
}
</style>