const STORAGE_KEY = 'buyer-wishlist-v1'

// Throttle identical warnings so a failing server/reload doesn't spam toasts.
const lastWarnedAt = new Map()
function warnThrottled(message, ttlMs = 5000) {
  if (import.meta.server) return
  const now = Date.now()
  if (now - (lastWarnedAt.get(message) || 0) < ttlMs) return
  lastWarnedAt.set(message, now)
  useToast().error(message)
}

function loadItems(key = STORAGE_KEY) {
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

function persist(items, key = STORAGE_KEY) {
  if (import.meta.server) return
  try {
    localStorage.setItem(key, JSON.stringify(items))
  } catch {
    /* private mode / quota */
  }
}

export function useWishlist() {
  const items = useState('wishlist-items', () => [])
  const { isLoggedIn, user } = useAuth()

  const scopedKey = computed(() => {
    const uid = user.value?.id
    return uid ? `${STORAGE_KEY}-user-${uid}` : STORAGE_KEY
  })

  if (import.meta.client && items.value.length === 0) {
    items.value = loadItems(scopedKey.value)
  }

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

  watch(
    items,
    (next) => persist(next, scopedKey.value),
    { deep: true }
  )

  const syncWithDb = async () => {
    if (!isLoggedIn.value || !import.meta.client) return
    try {
      const dbWishlist = await $fetch('/api/wishlist')
      if (dbWishlist?.items?.length) {
        items.value = dbWishlist.items.map((item) => ({
          id: item.id,
          image: item.image,
          title: item.title,
          price: item.price,
          category: item.category,
          rating: item.rating
        }))
        persist(items.value, scopedKey.value)
      }
    } catch (err) {
      // Keep localStorage items, but tell the user the server copy is stale.
      warnThrottled("Couldn't load your saved wishlist from the server — showing this device's copy.")
    }
  }

  const saveToDb = async (productId) => {
    if (!isLoggedIn.value || !import.meta.client) return
    try {
      await $fetch('/api/wishlist', {
        method: 'POST',
        body: { productId }
      })
    } catch (err) {
      warnThrottled("Your wishlist couldn't be saved to your account — it's only saved on this device.")
    }
  }

  const removeFromDb = async (productId) => {
    if (!isLoggedIn.value || !import.meta.client) return
    try {
      await $fetch(`/api/wishlist/${productId}`, { method: 'DELETE' })
    } catch (err) {
      warnThrottled("The item couldn't be removed from your account wishlist — it may come back after refresh.")
    }
  }

  if (import.meta.client) {
    watch(isLoggedIn, async (loggedIn) => {
      if (loggedIn) {
        await syncWithDb()
      }
    }, { immediate: true })
  }

  const isInWishlist = (id) => items.value.some((item) => item.id === id)

  const addToWishlist = async (product) => {
    if (isInWishlist(product.id)) return
    items.value.push({
      id: product.id,
      image: product.image,
      title: product.title,
      price: product.price,
      category: product.category,
      rating: product.rating
    })
    if (import.meta.client) {
      const toast = useToast()
      toast.success(`${product.title || 'Item'} saved to wishlist`)
      await saveToDb(product.id)
    }
  }

  const removeFromWishlist = async (id) => {
    const removed = items.value.find((item) => item.id === id)
    items.value = items.value.filter((item) => item.id !== id)
    if (import.meta.client && removed) {
      const toast = useToast()
      toast.info(`${removed.title || 'Item'} removed from wishlist`)
      await removeFromDb(id)
    }
  }

  const toggleWishlist = async (product) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id)
    } else {
      await addToWishlist(product)
    }
  }

  const clearWishlist = () => {
    items.value = []
  }

  const itemCount = computed(() => items.value.length)

  return {
    items,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    itemCount
  }
}
