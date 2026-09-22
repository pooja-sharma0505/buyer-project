<template>
  <div class="signup-page">
    <div class="card">
      <!-- Step 1: Basic Info -->
      <div v-if="step === 1" class="signup-step">
        <h1>Create Account</h1>
        <p>Sign up to start shopping with LUMIÈRE.</p>

        <form @submit.prevent="handleStep1">
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

          <label for="email">Email (Optional)</label>
          <input
            id="email"
            v-model.trim="email"
            type="email"
            placeholder="Email address"
            autocomplete="email"
            :aria-invalid="!!fieldErrors.email"
            @input="fieldErrors.email = ''"
            @blur="validateField('email')"
          />
          <p v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</p>

          <label for="password">Password</label>
          <div class="password-wrapper">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Create a password"
              autocomplete="new-password"
              :aria-invalid="!!fieldErrors.password"
              @input="fieldErrors.password = ''"
              @blur="validateField('password')"
            />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'">
              <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
          <p v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</p>

          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm password"
            autocomplete="new-password"
            :aria-invalid="!!fieldErrors.confirmPassword"
            @input="fieldErrors.confirmPassword = ''"
            @blur="validateField('confirmPassword')"
          />
          <p v-if="fieldErrors.confirmPassword" class="field-error">{{ fieldErrors.confirmPassword }}</p>

          <button type="submit" :disabled="loading" class="btn-primary">
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <p v-if="error" class="signup-error">{{ error }}</p>

        <div class="signup-links">
          <span>Already have an account?</span>
          <NuxtLink to="/login" class="link">Log in</NuxtLink>
        </div>
      </div>

      <!-- Success -->
      <div v-if="step === 2" class="signup-step success-step">
        <div class="success-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h1>Account Created!</h1>
        <p>Your account is ready to use.</p>
        <NuxtLink to="/login" class="btn-primary" style="margin-top: 16px;">Continue to Login</NuxtLink>
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

const { success: toastSuccess } = useToast()

// Step 1: Basic info
const name = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)
const fieldErrors = ref({ name: '', phone: '', email: '', password: '', confirmPassword: '' })
const showPassword = ref(false)

const step = ref(1)

function validate() {
  const next = { name: '', phone: '', email: '', password: '', confirmPassword: '' }

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

  if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    next.email = 'Enter a valid email address'
  }

  if (!password.value) {
    next.password = 'Password is required'
  } else if (password.value.length < 6) {
    next.password = 'Password must be at least 6 characters'
  }

  if (password.value !== confirmPassword.value) {
    next.confirmPassword = 'Passwords do not match'
  }

  fieldErrors.value = next
  return !next.name && !next.phone && !next.email && !next.password && !next.confirmPassword
}

function validateField(field) {
  const err = fieldErrors.value
  if (field === 'name') {
    if (!name.value) err.name = 'Name is required'
    else if (name.value.length < 2) err.name = 'Name must be at least 2 characters'
    else err.name = ''
  }
  if (field === 'phone') {
    if (!phone.value) err.phone = 'Phone is required'
    else if (!/^\d{10,15}$/.test(phone.value)) err.phone = 'Phone must be 10–15 digits only'
    else err.phone = ''
  }
  if (field === 'email') {
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) err.email = 'Enter a valid email address'
    else err.email = ''
  }
  if (field === 'password') {
    if (!password.value) err.password = 'Password is required'
    else if (password.value.length < 6) err.password = 'Password must be at least 6 characters'
    else err.password = ''
  }
  if (field === 'confirmPassword') {
    if (password.value !== confirmPassword.value) err.confirmPassword = 'Passwords do not match'
    else err.confirmPassword = ''
  }
}

const handleStep1 = async () => {
  error.value = ''
  if (!validate()) return

  loading.value = true
  try {
    await $fetch('/api/auth/signup', {
      method: 'POST',
      body: {
        name: name.value,
        phone: phone.value,
        email: email.value || null,
        password: password.value
      }
    })
    step.value = 2
    toastSuccess('Account created successfully!')
  } catch (err) {
    error.value = err.data?.message || err.message || 'Failed to create account'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.signup-page { min-height: calc(100vh - 72px); display: flex; align-items: center; justify-content: center; background: #f8fafc; padding: 40px 16px; }
.card { width: 100%; max-width: 380px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 28px 24px; }
.signup-step { animation: fadeIn 0.3s ease; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
h1 { margin: 0 0 8px; color: #111827; font-family: 'Cormorant Garamond', serif; font-size: 28px; }
p { margin: 0 0 20px; color: #6b7280; font-size: 14px; }
form { display: grid; gap: 10px; }
label { color: #374151; font-size: 13px; font-weight: 500; }
input { border: 1px solid #d1d5db; border-radius: 8px; padding: 12px; font-size: 14px; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
input:focus { border-color: #d4af64; outline: none; box-shadow: 0 0 0 3px rgba(212,175,100,0.15); }
input[aria-invalid="true"] { border-color: #dc2626; }
input[aria-invalid="true"]:focus { box-shadow: 0 0 0 3px rgba(220,38,38,0.15); }
.field-error { color: #dc2626; font-size: 12px; margin: -2px 0 4px; }
.btn-primary {
  margin-top: 8px;
  border: none;
  border-radius: 8px;
  background: #111827;
  color: #fff;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}
.btn-primary:hover { background: #d4af64; color: #0a0806; }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
.signup-error { color: #dc2626; margin-top: 12px; font-size: 13px; }
.success { color: #15803d; margin-top: 12px; font-size: 13px; }
.signup-links { display: flex; gap: 8px; justify-content: center; margin-top: 18px; font-size: 13px; color: #6b7280; }
.link { color: #d4af64; text-decoration: none; font-weight: 500; }
.link:hover { text-decoration: underline; }

/* Password wrapper */
.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.password-wrapper input {
  padding-right: 48px;
}
.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}
.toggle-password:hover { color: #6b7280; }
.toggle-password:focus { outline: none; }

/* Success step */
.success-step { text-align: center; }
.success-icon {
  color: #15803d;
  margin-bottom: 16px;
}
.success-step h1 { margin: 0 0 8px; font-size: 24px; }
.success-step p { margin: 0 0 24px; color: #6b7280; }

@media (max-width: 480px) {
  .signup-page { align-items: flex-start; padding: 24px 12px; }
  .card { border-radius: 10px; padding: 24px 16px; }
}
</style>