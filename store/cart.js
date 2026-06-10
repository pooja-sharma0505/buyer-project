import { computed, reactive } from 'vue'

const state = reactive({
  items: []
})

const addToCart = (product) => {
  const existing = state.items.find((item) => item.id === product.id)
  if (existing) {
    existing.qty += 1
    return
  }

  state.items.push({
    ...product,
    qty: 1
  })
}

const updateQty = (id, qty) => {
  const item = state.items.find((entry) => entry.id === id)
  if (!item) return

  if (qty <= 0) {
    state.items = state.items.filter((entry) => entry.id !== id)
    return
  }

  item.qty = qty
}

const removeFromCart = (id) => {
  state.items = state.items.filter((item) => item.id !== id)
}

const clearCart = () => {
  state.items = []
}

const itemCount = computed(() =>
  state.items.reduce((sum, item) => sum + item.qty, 0)
)

const subtotal = computed(() =>
  state.items.reduce((sum, item) => sum + item.price * item.qty, 0)
)

export const useCartStore = () => ({
  state,
  addToCart,
  updateQty,
  removeFromCart,
  clearCart,
  itemCount,
  subtotal
})
