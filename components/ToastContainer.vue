<template>
  <div class="toast-container">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="toast.type"
        role="alert"
      >
        <span class="toast-message">{{ toast.message }}</span>
        <button type="button" class="toast-close" aria-label="Dismiss" @click="dismiss(toast.id)">×</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
const { toasts, remove } = useToast()
const dismiss = (id) => remove(id)
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 84px;
  right: 16px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}
.toast-container > div {
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: auto;
}
.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  animation: toastSlide 0.35s ease;
  min-width: 200px;
  max-width: 320px;
}
.toast.success {
  background: #0f172a;
  color: #d4af64;
  border: 1px solid #d4af64;
}
.toast.error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
.toast.info {
  background: #0f172a;
  color: #fff;
  border: 1px solid #334155;
}
.toast-message {
  flex: 1;
}
.toast-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
  color: inherit;
  opacity: 0.7;
}
.toast-close:hover { opacity: 1; }

@keyframes toastSlide {
  from { transform: translateX(120%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-leave-to {
  transform: translateX(120%);
  opacity: 0;
}

@media (max-width: 640px) {
  .toast-container {
    top: auto;
    bottom: 16px;
    left: 16px;
    right: 16px;
    align-items: center;
  }
  .toast {
    max-width: 100%;
    width: 100%;
  }
}
</style>