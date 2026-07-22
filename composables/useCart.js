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
  const { isLoggedIn } = useAuth()
  const isHydrated = ref(false)

  // Load from localStorage on client init (for guests or before auth resolves)
  if (import.meta.client && items.value.length === 0) {
    items.value = loadItems()
  }

  // Sync with DB when logged in
  const syncWithDb = async () => {
    if (!isLoggedIn.value || !import.meta.client) return
    try {
      const dbCart = await $fetch('/api/cart')
      if (dbCart?.items?.length) {
        items.value = dbCart.items.map((item) => ({ ...item, qty: item.qty || 1 }))
        persist(items.value)
      }
    } catch (err) {
      // If DB cart is empty or fails, keep localStorage items
    }
  }

  const saveToDb = async () => {
    if (!isLoggedIn.value || !import.meta.client) return
    try {
      const payload = items.value.map((item) => ({
        id: item.id,
        qty: item.qty
      }))
      await $fetch('/api/cart', {
        method: 'POST',
        body: { items: payload }
      })
    } catch (err) {
      // Silent fail — localStorage is backup
    }
  }

  // Watch for auth state changes and sync cart
  if (import.meta.client) {
    watch(isLoggedIn, async (loggedIn) => {
      if (loggedIn) {
        await syncWithDb()
      }
    }, { immediate: true })
  }

  watch(
    items,
    (next) => {
      persist(next)
      if (isLoggedIn.value) {
        saveToDb()
      }
    },
    { deep: true }
  )

  const addToCart = (product) => {
    const addQty = Number(product.qty) || 1
    const existing = items.value.find((item) => item.id === product.id)
    if (existing) {
      existing.qty += addQty
    } else {
      items.value.push({ ...product, qty: addQty })
    }
    if (import.meta.client) {
      const toast = useToast()
      toast.success(`${product.title || 'Item'} added to cart`)
    }
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

  const removeFromCart = async (id) => {
    items.value = items.value.filter((item) => item.id !== id)
    if (isLoggedIn.value && import.meta.client) {
      try {
        await $fetch('/api/cart', {
          method: 'DELETE',
          body: { productId: id }
        })
      } catch (err) {
        // Silent fail — localStorage is backup
      }
    }
  }

  const clearCart = async () => {
    items.value = []
    if (isLoggedIn.value && import.meta.client) {
      try {
        await $fetch('/api/cart', {
          method: 'DELETE',
          body: { clearAll: true }
        })
      } catch (err) {
        // Silent fail
      }
    }
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
    subtotal,
    syncWithDb
  }
}
