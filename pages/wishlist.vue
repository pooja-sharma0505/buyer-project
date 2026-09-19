<template>
  <div class="wishlist-page">
    <div class="container">
      <div class="top">
        <NuxtLink to="/">← Continue Shopping</NuxtLink>
        <h1>Wishlist ({{ items.length }})</h1>
      </div>

      <div v-if="items.length === 0" class="empty-state">
        <div class="empty-wrap">
          <svg class="empty-icon" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <h2 class="empty-title">Your wishlist is empty</h2>
          <p class="empty-text">Save items you love to your wishlist and they'll be here when you're ready.</p>
          <NuxtLink to="/" class="empty-cta">Browse Products</NuxtLink>
        </div>
      </div>

      <div v-else>
        <div class="wishlist-header-actions">
          <button type="button" class="btn secondary" @click="moveAllToCart" :disabled="movingAll">
            {{ movingAll ? 'Moving...' : 'Move All to Cart' }}
          </button>
        </div>

        <ul class="list">
          <li v-for="item in items" :key="item.id" class="row">
            <button type="button" class="thumb-wrap" @click="goProduct(item.id)">
              <img :src="item.image || '/placeholder-product.svg'" :alt="item.title" class="thumb" />
              <span v-if="item.outOfStock" class="out-of-stock-badge">Out of Stock</span>
            </button>
            <div class="info">
              <p v-if="item.category" class="cat">{{ item.category }}</p>
              <button type="button" class="title-btn" @click="goProduct(item.id)">{{ item.title }}</button>
              <p class="price">{{ formatPrice(item.price) }}</p>
              <div class="actions">
                <button type="button" class="btn secondary" @click="removeFromWishlist(item.id)">Remove</button>
                <button
                  type="button"
                  class="btn primary"
                  @click="addToCart(item)"
                  :disabled="item.outOfStock"
                >
                  {{ item.outOfStock ? 'Out of Stock' : 'Add to cart' }}
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <LoginPromptModal
        v-if="showLoginPrompt"
        :title="loginPromptTitle"
        :message="loginPromptMessage"
        @close="showLoginPrompt = false"
        @login="navigateToLogin"
      />
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Wishlist' })
useSeoMeta({
  ogTitle: 'Wishlist - LUMIÈRE',
  ogDescription: 'Your saved items at LUMIÈRE.',
  ogImage: '/og-image.svg',
  ogType: 'website'
})

import LoginPromptModal from '~/components/LoginPromptModal.vue'

const { addToCart: addProductToCart } = useCart()
const { items, removeFromWishlist } = useWishlist()
const { formatPrice } = useFormatPrice()
const { isLoggedIn } = useAuth()

const showLoginPrompt = ref(false)
const loginPromptTitle = ref('')
const loginPromptMessage = ref('')
const movingAll = ref(false)

const goProduct = (id) => {
  navigateTo(`/product/${id}`)
}

const addToCart = (item) => {
  if (item.outOfStock) return
  addProductToCart({
    id: item.id,
    image: item.image,
    title: item.title,
    price: item.price,
    category: item.category,
    rating: item.rating || { rate: 0, count: 0 },
    qty: 1
  })
  // Optionally remove from wishlist after adding to cart
  removeFromWishlist(item.id)
}

const moveAllToCart = async () => {
  if (!isLoggedIn.value) {
    loginPromptTitle.value = 'Sign in to move items to cart'
    loginPromptMessage.value = 'Create an account or sign in to move your wishlist items to cart.'
    showLoginPrompt.value = true
    return
  }

  const availableItems = items.value.filter(item => !item.outOfStock)
  if (availableItems.length === 0) {
    const toast = useToast()
    toast.info('No available items to move to cart')
    return
  }

  movingAll.value = true
  const toast = useToast()

  try {
    for (const item of availableItems) {
      addProductToCart({
        id: item.id,
        image: item.image,
        title: item.title,
        price: item.price,
        category: item.category,
        rating: item.rating || { rate: 0, count: 0 },
        qty: 1
      })
      removeFromWishlist(item.id)
    }
    toast.success(`Moved ${availableItems.length} item${availableItems.length > 1 ? 's' : ''} to cart`)
  } catch (err) {
    toast.error('Failed to move items to cart')
  } finally {
    movingAll.value = false
  }
}

function navigateToLogin() {
  showLoginPrompt.value = false
  navigateTo('/login?redirect=/wishlist')
}
</script>

<style scoped>
.wishlist-page { min-height: 100vh; background: #f8fafc; padding: 28px 16px; }
.container { max-width: 800px; margin: 0 auto; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 8px; }
.top a { color: #d4af64; text-decoration: none; }
.top h1 { margin: 0; font-size: 22px; color: #111827; font-family: 'Cormorant Garamond', serif; }
.empty { color: #6b7280; margin: 0; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; text-align: center; }
.empty-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; max-width: 400px; }
.empty-icon { color: #d4af64; margin-bottom: 24px; line-height: 1; }
.empty-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; color: #111827; margin: 0 0 10px; }
.empty-text { color: #6b7280; font-size: 15px; margin: 0 0 28px; line-height: 1.5; }
.empty-cta { display: inline-block; padding: 14px 32px; background: #111827; color: #fff; border-radius: 10px; text-decoration: none; font-size: 15px; font-weight: 500; transition: background 0.2s ease, transform 0.15s ease; }
.empty-cta:hover { background: #d4af64; color: #0a0806; transform: translateY(-1px); }
.wishlist-header-actions { display: flex; justify-content: flex-end; margin-bottom: 16px; }
.btn {
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid #d1d5db;
  background: #fff;
  color: #374151;
}
.btn.primary {
  background: #111827;
  color: #fff;
  border-color: #111827;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
.btn.primary:hover { background: #d4af64; color: #0a0806; border-color: #d4af64; }
.btn.primary:disabled { opacity: 0.7; cursor: not-allowed; }
.btn.secondary:hover { background: #f8fafc; border-color: #d4af64; color: #d4af64; }
.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.row {
  display: grid;
  grid-template-columns: var(--product-thumb-row, 120px) 1fr;
  gap: 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
  align-items: start;
}
.thumb-wrap {
  position: relative;
  border: none;
  padding: 8px;
  box-sizing: border-box;
  width: var(--product-thumb-row, 120px);
  height: var(--product-thumb-row, 120px);
  background: var(--product-thumb-bg, #f8fafc);
  border-radius: var(--product-thumb-radius, 10px);
  border: 1px solid #e5e7eb;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.thumb {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}
.out-of-stock-badge {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  background: rgba(220, 38, 38, 0.9);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.info { min-width: 0; }
.cat { font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 4px; }
.title-btn {
  display: block;
  text-align: left;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  margin-bottom: 6px;
  line-height: 1.35;
}
.title-btn:hover { color: #d4af64; }
.price { font-size: 16px; color: #d4af64; font-weight: 700; margin: 0 0 12px; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; }
@media (max-width: 520px) {
  .wishlist-page { padding: 18px 10px; }
  .top h1 { font-size: 18px; }
  .row { grid-template-columns: var(--product-thumb-row, 96px) 1fr; gap: 12px; padding: 12px; }
  .btn { width: 100%; }
  .wishlist-header-actions { justify-content: stretch; }
  .wishlist-header-actions .btn { width: 100%; }
}
</style>