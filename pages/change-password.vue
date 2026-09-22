<template>
  <div class="change-password-page">
    <div class="card">
      <NuxtLink to="/profile" class="back-link">← Back to Profile</NuxtLink>
      <h1>Change Password</h1>
      <p>Choose a new password for your account.</p>

      <form @submit.prevent="handleChangePassword">
        <label for="new-password">New Password</label>
        <div class="password-wrapper">
          <input
            id="new-password"
            v-model="newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            placeholder="New password"
            autocomplete="new-password"
            :aria-invalid="!!fieldErrors.newPassword"
            @input="fieldErrors.newPassword = ''"
          />
          <button type="button" class="toggle-password" @click="showNewPassword = !showNewPassword" :aria-label="showNewPassword ? 'Hide new password' : 'Show new password'">
            <svg v-if="!showNewPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          </button>
        </div>
        <p v-if="fieldErrors.newPassword" class="field-error">{{ fieldErrors.newPassword }}</p>

        <label for="confirm-password">Confirm New Password</label>
        <input
          id="confirm-password"
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          autocomplete="new-password"
          :aria-invalid="!!fieldErrors.confirmPassword"
          @input="fieldErrors.confirmPassword = ''"
        />
        <p v-if="fieldErrors.confirmPassword" class="field-error">{{ fieldErrors.confirmPassword }}</p>

        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? 'Updating...' : 'Update Password' }}
        </button>
      </form>

      <p v-if="error" class="login-error">{{ error }}</p>
      <p v-if="success" class="success">{{ success }}</p>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Change Password' })
useSeoMeta({
  ogTitle: 'Change Password - LUMIÈRE',
  ogDescription: 'Update your LUMIÈRE account password.',
  ogImage: '/og-image.svg',
  ogType: 'website'
})

definePageMeta({
  middleware: 'auth'
})

const { changePassword } = useAuth()
const { success: toastSuccess, error: toastError } = useToast()

const newPassword = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)
const showNewPassword = ref(false)
const fieldErrors = ref({
  newPassword: '',
  confirmPassword: ''
})

function validate() {
  const next = {
    newPassword: '',
    confirmPassword: ''
  }

  if (!newPassword.value) {
    next.newPassword = 'New password is required'
  } else if (newPassword.value.length < 6) {
    next.newPassword = 'Password must be at least 6 characters'
  }

  if (!confirmPassword.value) {
    next.confirmPassword = 'Please confirm your new password'
  } else if (newPassword.value !== confirmPassword.value) {
    next.confirmPassword = 'Passwords do not match'
  }

  fieldErrors.value = next
  return !next.newPassword && !next.confirmPassword
}

async function handleChangePassword() {
  error.value = ''
  success.value = ''

  if (!validate()) return

  loading.value = true
  try {
    await changePassword(newPassword.value)
    toastSuccess('Password updated successfully')
    success.value = 'Password updated successfully. Redirecting...'
    newPassword.value = ''
    confirmPassword.value = ''
    await navigateTo('/profile')
  } catch (err) {
    error.value = err.data?.message || err.message || 'Failed to update password'
    toastError(error.value)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.change-password-page { min-height: calc(100vh - 72px); display: flex; align-items: center; justify-content: center; background: #f8fafc; padding: 40px 16px; }
.card { width: 100%; max-width: 420px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 28px 24px; }
.back-link { display: inline-block; margin-bottom: 20px; color: #d4af64; font-size: 13px; font-weight: 500; text-decoration: none; }
.back-link:hover { color: #b8860b; text-decoration: underline; }
h1 { margin: 0 0 8px; color: #111827; font-family: 'Cormorant Garamond', serif; font-size: 28px; }
p { margin: 0 0 20px; color: #6b7280; font-size: 14px; }
form { display: grid; gap: 10px; }
label { color: #374151; font-size: 13px; font-weight: 500; }
input { border: 1px solid #d1d5db; border-radius: 8px; padding: 12px; font-size: 14px; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
input:focus { border-color: #d4af64; outline: none; box-shadow: 0 0 0 3px rgba(212,175,100,0.15); }
input[aria-invalid="true"] { border-color: #dc2626; }
input[aria-invalid="true"]:focus { box-shadow: 0 0 0 3px rgba(220,38,38,0.15); }
.field-error { color: #dc2626; font-size: 12px; margin: -2px 0 4px; }
.btn-primary { margin-top: 8px; border: none; border-radius: 8px; background: #111827; color: #fff; padding: 12px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.2s ease; }
.btn-primary:hover { background: #d4af64; color: #0a0806; }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
.login-error { color: #dc2626; margin-top: 12px; font-size: 13px; }
.success { color: #15803d; margin-top: 12px; font-size: 13px; }
.password-wrapper { position: relative; display: flex; align-items: center; }
.password-wrapper input { padding-right: 48px; }
.toggle-password { position: absolute; right: 12px; background: none; border: none; padding: 0; cursor: pointer; color: #9ca3af; display: flex; align-items: center; justify-content: center; margin: 0; }
.toggle-password:hover { color: #6b7280; }
.toggle-password:focus { outline: none; }

@media (max-width: 480px) {
  .change-password-page { align-items: flex-start; padding: 24px 12px; }
  .card { border-radius: 10px; padding: 24px 16px; }
}
</style>
