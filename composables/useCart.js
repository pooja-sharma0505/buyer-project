const STORAGE_KEY = 'buyer-cart-v1'
const MAX_QTY_PER_PRODUCT = 2

function loadItems(key) {
  if (import.meta.server) return []
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persist(items, key) {
  if (import.meta.server) return
  try {
    localStorage.setItem(key, JSON.stringify(items))
  } catch {
    /* private mode / quota */
  }
}

export function useCart() {
  const items = useState('cart-items', () => [])
  const { isLoggedIn, user } = useAuth()
  const isHydrated = ref(false)

  // User-scoped storage key so carts don't leak between accounts
  // sharing the same browser.
  const scopedKey = computed(() => {
    const uid = user.value?.id
    return uid ? `${STORAGE_KEY}-user-${uid}` : STORAGE_KEY
  })

  // Load from localStorage on client init (for guests or before auth resolves)
  if (import.meta.client && items.value.length === 0) {
    items.value = loadItems(scopedKey.value)
  }

  // When the user changes (login/logout), switch to the correct scoped store.
  if (import.meta.client) {
    watch(
      () => user.value?.id,
      (newUserId, oldUserId) => {
        if (newUserId !== oldUserId) {
          items.value = loadItems(
            newUserId ? `${STORAGE_KEY}-user-${newUserId}` : STORAGE_KEY
          )
        }
      }
    )
  }

  // Sync with DB when logged in
  const syncWithDb = async () => {
    if (!isLoggedIn.value || !import.meta.client) return
    try {
      const dbCart = await $fetch('/api/cart')
      if (dbCart?.items?.length) {
        items.value = dbCart.items.map((item) => ({ ...item, qty: item.qty || 1 }))
        persist(items.value, scopedKey.value)
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
      persist(next, scopedKey.value)
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
      if (existing.qty >= MAX_QTY_PER_PRODUCT) {
        if (import.meta.client) {
          const toast = useToast()
          toast.info(`You've already added the maximum quantity (${MAX_QTY_PER_PRODUCT}) of this item.`)
        }
        return false
      }
      existing.qty = Math.min(existing.qty + addQty, MAX_QTY_PER_PRODUCT)
    } else {
      items.value.push({ ...product, qty: Math.min(addQty, MAX_QTY_PER_PRODUCT) })
    }
    if (import.meta.client) {
      const toast = useToast()
      toast.success('Added to cart!')
    }
    return true
  }

  const updateQty = (id, qty) => {
    const item = items.value.find((entry) => entry.id === id)
    if (!item) return

    if (qty <= 0) {
      items.value = items.value.filter((entry) => entry.id !== id)
      return
    }

    item.qty = Math.min(qty, MAX_QTY_PER_PRODUCT)
  }

  const canAddMore = (productId) => {
    const item = items.value.find((entry) => entry.id === productId)
    if (!item) return true
    return item.qty < MAX_QTY_PER_PRODUCT
  }

  const getCartQty = (productId) => {
    const item = items.value.find((entry) => entry.id === productId)
    return item ? item.qty : 0
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
    syncWithDb,
    canAddMore,
    getCartQty,
    MAX_QTY_PER_PRODUCT
  }
}
