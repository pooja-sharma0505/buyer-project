const STORAGE_KEY = 'buyer-cart-v1'
let syncTimer = null

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
  const user = useState('auth-user', () => null)

  const isLoggedIn = computed(() => !!user.value)

  // Load cart on client: first from localStorage, then sync with server if logged in
  if (import.meta.client) {
    // Try localStorage first for immediate display
    if (items.value.length === 0) {
      items.value = loadItems()
    }

    // Watch login state changes to sync with server cart
    let lastSync = false
    watch(isLoggedIn, (loggedIn) => {
      if (loggedIn && !lastSync) {
        lastSync = true
        syncFromServer()
      } else if (!loggedIn) {
        lastSync = false
      }
    }, { immediate: true })
  }

  async function syncFromServer() {
    try {
      const data = await $fetch('/api/cart')
      if (data.items?.length) {
        items.value = data.items
        persist(data.items)
      }
    } catch {
      // silent fail — keep localStorage items
    }
  }

  async function syncToServer() {
    if (!isLoggedIn.value) return
    try {
      await $fetch('/api/cart', {
        method: 'POST',
        body: { items: items.value }
      })
    } catch {
      // silent fail — cart is still in localStorage
    }
  }

  watch(
    items,
    (next) => {
      persist(next)
      // Sync to server if logged in, debounced
      if (import.meta.client && isLoggedIn.value) {
        if (syncTimer) clearTimeout(syncTimer)
        syncTimer = setTimeout(() => syncToServer(), 500)
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
