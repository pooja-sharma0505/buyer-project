<template>
  <Teleport to="body">
    <div v-if="show" class="login-prompt-overlay" @click.self="close">
      <div class="login-prompt-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <h2 id="modal-title" class="modal-title">{{ title }}</h2>
        <p class="modal-message">{{ message }}</p>
        <div class="modal-actions">
          <button type="button" class="btn secondary" @click="close">
            Continue as Guest
          </button>
          <NuxtLink to="/login" class="btn primary" @click="handleLoginClick">
            Login / Sign Up
          </NuxtLink>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: 'Sign in to continue' },
  message: { type: String, default: 'Create an account or sign in to save items to your wishlist and access your cart across devices.' },
  actionType: { type: String, default: 'wishlist' } // 'wishlist' | 'cart' | 'checkout'
})

const emit = defineEmits(['close', 'login'])

function handleLoginClick() {
  emit('login')
}

function close() {
  emit('close')
}
</script>

<style scoped>
.login-prompt-overlay {
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

.login-prompt-modal {
  background: #fff;
  border-radius: 16px;
  padding: 32px 28px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18);
  animation: slideUp 0.25s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #fef3e2 0%, #fde8d0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f47504;
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

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  text-decoration: none;
}

.btn.primary {
  background: #111827;
  color: #fff;
  border-color: #111827;
}

.btn.primary:hover {
  background: #d4af64;
  color: #0a0806;
  border-color: #d4af64;
}

.btn.secondary {
  background: #fff;
  color: #374151;
  border-color: #d1d5db;
}

.btn.secondary:hover {
  background: #f8fafc;
  border-color: #d4af64;
  color: #d4af64;
}

@media (max-width: 480px) {
  .login-prompt-modal {
    padding: 24px 20px;
  }
  .modal-title { font-size: 18px; }
  .modal-message { font-size: 13px; }
}
</style>