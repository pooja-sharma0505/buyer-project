import { ref } from 'vue'

const _toasts = ref([])

export function useToast() {
  const toasts = _toasts

  const add = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, message, type, duration })
    setTimeout(() => remove(id), duration)
  }

  const remove = (id) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, add, remove, success: (msg) => add(msg, 'success'), error: (msg) => add(msg, 'error'), info: (msg) => add(msg, 'info') }
}