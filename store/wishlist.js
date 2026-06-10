import { computed, reactive, watch } from 'vue'

const STORAGE_KEY = 'buyer-wishlist-v1'

function loadItems() {
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
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* private mode / quota */
  }
}

const state = reactive({
  items: loadItems()
})

watch(
  () => state.items,
  (items) => persist(items),
  { deep: true }
)

const isInWishlist = (id) => state.items.some((item) => item.id === id)

const addToWishlist = (product) => {
  if (isInWishlist(product.id)) return
  state.items.push({
    id: product.id,
    image: product.image,
    title: product.title,
    price: product.price,
    category: product.category,
    rating: product.rating
  })
}

const removeFromWishlist = (id) => {
  state.items = state.items.filter((item) => item.id !== id)
}

const toggleWishlist = (product) => {
  if (isInWishlist(product.id)) {
    removeFromWishlist(product.id)
  } else {
    addToWishlist(product)
  }
}

const clearWishlist = () => {
  state.items = []
}

const itemCount = computed(() => state.items.length)

export const useWishlistStore = () => ({
  state,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  isInWishlist,
  clearWishlist,
  itemCount
})
