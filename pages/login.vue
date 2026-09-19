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
        <div class="password-wrapper">
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            autocomplete="current-password"
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

        <div class="form-options">
          <label class="checkbox-wrapper">
            <input type="checkbox" v-model="rememberMe" />
            <span>Remember me</span>
          </label>
          <button type="button" class="forgot-link" @click="openForgotPassword">Forgot password?</button>
        </div>

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

    <!-- Forgot Password Modal -->
    <Teleport to="body">
      <div v-if="showForgotModal" class="forgot-modal-overlay" @click.self="closeForgotModal">
        <div class="forgot-modal" role="dialog" aria-modal="true" aria-labelledby="forgot-title">
          <button type="button" class="modal-close" @click="closeForgotModal" aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <h2 id="forgot-title" class="modal-title">Reset Password</h2>
          <p class="modal-message">Enter your phone number and we'll send you a reset link via SMS.</p>

          <form @submit.prevent="submitForgotPassword">
            <label for="forgot-phone">Phone Number</label>
            <input
              id="forgot-phone"
              v-model.trim="forgotPhone"
              type="tel"
              inputmode="numeric"
              placeholder="Phone number"
              autocomplete="tel"
              :aria-invalid="!!forgotFieldErrors.phone"
              @input="forgotFieldErrors.phone = ''"
            />
            <p v-if="forgotFieldErrors.phone" class="field-error">{{ forgotFieldErrors.phone }}</p>

            <button type="submit" :disabled="forgotLoading" class="btn-primary">
              {{ forgotLoading ? 'Sending...' : 'Send Reset Link' }}
            </button>
          </form>

          <p v-if="forgotError" class="login-error">{{ forgotError }}</p>
          <p v-if="forgotSuccess" class="success">{{ forgotSuccess }}</p>

          <p class="back-to-login" @click="closeForgotModal">← Back to Login</p>
        </div>
      </div>
    </Teleport>
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

const { login, mergeGuestData } = useAuth()
const { success: toastSuccess } = useToast()
const route = useRoute()

const phone = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)
const fieldErrors = ref({ phone: '', password: '' })
const showPassword = ref(false)
const rememberMe = ref(false)

// Forgot password modal state
const showForgotModal = ref(false)
const forgotPhone = ref('')
const forgotLoading = ref(false)
const forgotError = ref('')
const forgotSuccess = ref('')
const forgotFieldErrors = ref({ phone: '' })

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
    await login(phone.value, password.value, rememberMe.value)
    toastSuccess('Login successful')
    // Merge guest cart and wishlist into account
    await mergeGuestData()
    success.value = 'Success'
    const redirect = route.query.redirect || '/'
    await navigateTo(redirect)
  } catch (err) {
    error.value = err.data?.message || err.message || 'Login failed'
  } finally {
    loading.value = false
  }
}

// Forgot password functions
function openForgotPassword() {
  forgotPhone.value = ''
  forgotError.value = ''
  forgotSuccess.value = ''
  forgotFieldErrors.value = { phone: '' }
  showForgotModal.value = true
}

function closeForgotModal() {
  showForgotModal.value = false
  forgotPhone.value = ''
  forgotError.value = ''
  forgotSuccess.value = ''
  forgotFieldErrors.value = { phone: '' }
}

function validateForgotPhone() {
  if (!forgotPhone.value) {
    forgotFieldErrors.value.phone = 'Phone is required'
    return false
  }
  if (!/^\d{10,15}$/.test(forgotPhone.value)) {
    forgotFieldErrors.value.phone = 'Phone must be 10–15 digits only'
    return false
  }
  forgotFieldErrors.value.phone = ''
  return true
}

const submitForgotPassword = async () => {
  forgotError.value = ''
  forgotSuccess.value = ''

  if (!validateForgotPhone()) return

  forgotLoading.value = true
  try {
    // In production, this would call an API endpoint
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { phone: forgotPhone.value }
    })
    forgotSuccess.value = 'If an account exists for this number, a password reset link has been sent via SMS.'
    forgotPhone.value = ''
  } catch (err) {
    // Don't reveal if account exists for security
    forgotSuccess.value = 'If an account exists for this number, a password reset link has been sent via SMS.'
    console.error('[forgot-password] Error:', err)
  } finally {
    forgotLoading.value = false
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
.toggle-password:hover {
  color: #6b7280;
}
.toggle-password:focus {
  outline: none;
}

/* Form options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -4px;
}
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #374151;
}
.checkbox-wrapper input {
  width: 16px;
  height: 16px;
  accent-color: #d4af64;
  margin: 0;
}
.forgot-link {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  color: #d4af64;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
}
.forgot-link:hover {
  color: #b8860b;
  background: none;
}

/* Forgot Password Modal */
.forgot-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.forgot-modal {
  background: #fff;
  border-radius: 16px;
  padding: 28px 24px;
  max-width: 400px;
  width: 100%;
  position: relative;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18);
  animation: slideUp 0.25s ease-out;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #f8fafc;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  transition: background 0.2s ease, color 0.2s ease;
}
.modal-close:hover {
  background: #e5e7eb;
  color: #111827;
}
.modal-title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  font-family: 'Cormorant Garamond', serif;
}
.modal-message {
  margin: 0 0 24px;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.55;
}
.forgot-modal form {
  display: grid;
  gap: 12px;
}
.forgot-modal .btn-primary {
  width: 100%;
  margin-top: 4px;
}
.back-to-login {
  text-align: center;
  margin-top: 20px;
  font-size: 13px;
  color: #d4af64;
  cursor: pointer;
  text-decoration: underline;
}
.back-to-login:hover {
  color: #b8860b;
}

@media (max-width: 480px) {
  .login-page { align-items: flex-start; padding: 24px 12px; }
  .card { border-radius: 10px; padding: 24px 16px; }
  .forgot-modal { padding: 24px 20px; }
}
</style>