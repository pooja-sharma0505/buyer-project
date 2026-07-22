const STORAGE_KEY = 'buyer-cart-v1'

function loadItems() {
  if (import.meta.server) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persist(items) {
  if (import.meta.server) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* private mode / quota */
  }
}

export function useCart() {
  const items = useState('cart-items', () => [])

  if (import.meta.client && items.value.length === 0) {
    items.value = loadItems()
  }

  watch(
    items,
    (next) => persist(next),
    { deep: true }
  )

  const addToCart = (product) => {
    const addQty = Number(product.qty) || 1
    const existing = items.value.find((item) => item.id === product.id)
    if (existing) {
      existing.qty += addQty
      return
    }

    items.value.push({
      ...product,
      qty: addQty
    })
  }

  const updateQty = (id, qty) => {
    const item = items.value.find((entry) => entry.id === id)
    if (!item) return

    if (qty <= 0) {
      items.value = items.value.filter((entry) => entry.id !== id)
      return
    }

    item.qty = qty
  }

  const removeFromCart = (id) => {
    items.value = items.value.filter((item) => item.id !== id)
  }

  const clearCart = () => {
    items.value = []
  }

  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.qty, 0)
  )

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + Number(item.price || 0) * item.qty, 0)
  )

  return {
    items,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    itemCount,
    subtotal
  }
}
