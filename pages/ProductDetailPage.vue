<template>
  <div class="detail-page">
    <div class="container">
      <RouterLink to="/" class="back-link">← Back to Products</RouterLink>

      <p v-if="loading" class="not-found">Loading product...</p>
      <div v-else-if="product" class="layout">
        <div class="image-box">
          <img :src="detailImgSrc" :alt="product.title" loading="lazy" @error="detailImgBad = true" />
        </div>

        <div>
          <p class="category">{{ product.category }}</p>
          <h1 class="title">{{ product.title }}</h1>
          <p class="price">${{ product.price.toFixed(2) }}</p>
          <p class="description">{{ product.description }}</p>
          <div class="cta-row">
            <button class="add-btn" @click="cart.addToCart(product)">Add to Cart</button>
            <button
              type="button"
              class="wish-btn"
              :class="{ on: inWishlist }"
              :aria-pressed="inWishlist"
              @click="toggleWishlist"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" :fill="inWishlist ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {{ inWishlist ? 'Saved' : 'Wishlist' }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="not-found">{{ error || 'Product not found' }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getProductById } from '../services/api'
import { useCartStore } from '../store/cart'
import { useWishlistStore } from '../store/wishlist'

const route = useRoute()
const cart = useCartStore()
const wishlist = useWishlistStore()

const product = ref(null)
const loading = ref(true)
const error = ref('')
const detailImgBad = ref(false)

const detailImgSrc = computed(() => {
  if (!product.value) return ''
  if (detailImgBad.value) return '/placeholder-product.svg'
  return product.value.image || '/placeholder-product.svg'
})

const inWishlist = computed(() =>
  product.value ? wishlist.isInWishlist(product.value.id) : false
)

const toggleWishlist = () => {
  if (!product.value) return
  wishlist.toggleWishlist(product.value)
}

const loadProduct = async () => {
  loading.value = true
  error.value = ''
  try {
    product.value = await getProductById(route.params.id)
    if (!product.value) {
      error.value = 'Product not found'
    }
  } catch (err) {
    error.value = err.message || 'Unable to load product'
  } finally {
    loading.value = false
  }
}

onMounted(loadProduct)
watch(() => route.params.id, loadProduct)
watch(product, () => {
  detailImgBad.value = false
})
</script>

<style scoped>
.detail-page { min-height: 100vh; background: #f8fafc; padding: 28px 16px; }
.container { max-width: 1000px; margin: 0 auto; }
.back-link { color: #4f46e5; text-decoration: none; display: inline-block; margin-bottom: 14px; }
.layout { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }
.image-box {
  aspect-ratio: 1 / 1;
  width: 100%;
  max-width: min(100%, 420px);
  margin: 0 auto;
  box-sizing: border-box;
  background: var(--product-thumb-bg, #f8fafc);
  border: 1px solid #e5e7eb;
  border-radius: var(--product-thumb-radius, 10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(14px, 4vw, 24px);
}
.image-box img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.category { color: #6b7280; margin-bottom: 8px; }
.title { margin-bottom: 10px; color: #111827; }
.price { color: #4f46e5; font-weight: 700; margin-bottom: 12px; }
.description { color: #4b5563; margin-bottom: 16px; }
.cta-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.add-btn { background: #111827; color: #fff; border: none; border-radius: 8px; padding: 10px 16px; cursor: pointer; }
.wish-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  border: 1px solid #d1d5db;
  background: #fff;
  color: #374151;
  font: inherit;
}
.wish-btn:hover { border-color: #fca5a5; color: #dc2626; }
.wish-btn.on {
  border-color: #fca5a5;
  background: #fef2f2;
  color: #dc2626;
}
.not-found { color: #6b7280; text-align: center; padding: 30px; }
@media (max-width: 820px) {
  .detail-page { padding: 18px 10px; }
  .layout { grid-template-columns: 1fr; gap: 16px; padding: 14px; }
  .title { font-size: 22px; }
  .image-box { padding: 14px; }
  .cta-row > * { flex: 1; justify-content: center; }
}
</style>
