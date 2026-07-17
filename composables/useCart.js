export function useCart() {
  const items = useState('cart-items', () => [])

  const addToCart = (product) => {
    const existing = items.value.find((item) => item.id === product.id)
    if (existing) {
      existing.qty += 1
      return
    }

    items.value.push({
      ...product,
      qty: 1
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
