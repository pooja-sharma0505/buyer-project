const STORAGE_KEY = 'buyer-wishlist-v1'

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

export function useWishlist() {
  const items = useState('wishlist-items', () => [])

  if (import.meta.client && items.value.length === 0) {
    items.value = loadItems()
  }

  watch(
    items,
    (next) => persist(next),
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
  }

  const removeFromWishlist = (id) => {
    items.value = items.value.filter((item) => item.id !== id)
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
