const STORAGE_KEY = 'buyer-wishlist-v1'

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

  // User-scoped storage key so wishlists don't leak between accounts
  // sharing the same browser.
  const scopedKey = computed(() => {
    const uid = user.value?.id
    return uid ? `${STORAGE_KEY}-user-${uid}` : STORAGE_KEY
  })

  // Load from localStorage on client init
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

  watch(
    items,
    (next) => persist(next, scopedKey.value),
    { deep: true }
  )

  const isInWishlist = (id) => items.value.some((item) => item.id === id)

  const addToWishlist = (product) => {
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
    }
  }

  const removeFromWishlist = (id) => {
    const removed = items.value.find((item) => item.id === id)
    items.value = items.value.filter((item) => item.id !== id)
    if (import.meta.client && removed) {
      const toast = useToast()
      toast.info(`${removed.title || 'Item'} removed from wishlist`)
    }
  }

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
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
