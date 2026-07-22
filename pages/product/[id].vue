<template>
  <div class="detail-page">
    <div class="container">
      <NuxtLink to="/" class="back-link">← Back to Products</NuxtLink>

      <div v-if="pending" class="layout">
        <SkeletonLoader type="detail" />
      </div>
      <div v-else-if="product" class="layout">
        <div class="image-box">
          <img :src="detailImgSrc" :alt="product.title" loading="lazy" @error="detailImgBad = true" />
        </div>

        <div>
          <p class="category">{{ product.category }}</p>
          <h1 class="title">{{ product.title }}</h1>
          <p class="price">${{ formatPrice(product.price) }}</p>
          <p class="description">{{ product.description }}</p>
          <div class="qty-row">
            <button type="button" class="qty-btn" @click="detailQty > 1 && detailQty--" aria-label="Decrease quantity">-</button>
            <input
              v-model.number="detailQty"
              type="number"
              min="1"
              max="99"
              class="qty-input"
              aria-label="Quantity"
            />
            <button type="button" class="qty-btn" @click="detailQty < 99 && detailQty++" aria-label="Increase quantity">+</button>
          </div>
          <div class="cta-row">
            <button class="add-btn" @click="addToCartWithQty">Add to Cart</button>
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

      <div v-else class="not-found">{{ errorMessage }}</div>

      <div v-if="product" class="reviews-section">
        <h2 class="reviews-heading">Reviews</h2>

        <div v-if="user" class="review-form">
          <label class="review-label">Rating</label>
          <div class="star-rating">
            <button
              v-for="n in 5"
              :key="n"
              type="button"
              class="star-btn"
              :class="{ active: n <= newRating, error: !!reviewFieldErrors.rating }"
              @click="newRating = n; reviewFieldErrors.rating = ''"
              :aria-label="`${n} star${n > 1 ? 's' : ''}`"
            >
              ★
            </button>
          </div>
          <p v-if="reviewFieldErrors.rating" class="review-error">{{ reviewFieldErrors.rating }}</p>

          <label class="review-label" for="review-comment">Comment</label>
          <textarea
            id="review-comment"
            v-model="newComment"
            rows="3"
            placeholder="Share your experience..."
            class="review-textarea"
            :class="{ error: !!reviewFieldErrors.comment }"
            @input="reviewFieldErrors.comment = ''"
          />
          <p v-if="reviewFieldErrors.comment" class="review-error">{{ reviewFieldErrors.comment }}</p>

          <button
            type="button"
            class="review-submit"
            :disabled="reviewPending"
            @click="submitReview"
          >
            {{ reviewPending ? 'Submitting...' : 'Submit Review' }}
          </button>
          <p v-if="reviewError" class="review-error">{{ reviewError }}</p>
          <p v-if="reviewSuccess" class="review-success">Review submitted.</p>
        </div>

        <p v-if="reviewsPending" class="reviews-status">Loading reviews...</p>
        <p v-else-if="reviewsError" class="reviews-status error">Unable to load reviews.</p>

        <div v-else-if="reviews.length" class="reviews-list">
          <div v-for="r in reviews" :key="r.id" class="review-card">
            <div class="review-header">
              <span class="review-author">{{ r.userName }}</span>
              <span class="review-stars">{{ '★'.repeat(r.rating) }}{{ '☆'.repeat(5 - r.rating) }}</span>
            </div>
            <p class="review-comment">{{ r.comment }}</p>
            <p class="review-date">{{ new Date(r.createdAt).toLocaleDateString() }}</p>
          </div>
        </div>

        <p v-else class="reviews-status">No reviews yet. Be the first to write one.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const cart = useCart()
const wishlist = useWishlist()
const { user } = useAuth()

useHead(() => ({
  title: product.value?.title || 'Product'
}))

useSeoMeta(() => ({
  ogTitle: product.value?.title || 'Product',
  ogDescription: product.value?.description?.slice(0, 200) || 'Product details at LUMIÈRE.',
  ogImage: product.value?.image || '/og-image.svg',
  ogType: 'product'
}))

const detailImgBad = ref(false)
const detailQty = ref(1)

const { data: product, pending, error } = await useFetch(() => `/api/products/${route.params.id}`)

const { data: reviewsData, pending: reviewsPending, error: reviewsError, refresh: refreshReviews } = await useFetch(() => `/api/reviews/${route.params.id}`, { server: false })

const reviews = computed(() => reviewsData.value?.reviews || [])

const newRating = ref(5)
const newComment = ref('')
const reviewPending = ref(false)
const reviewError = ref('')
const reviewSuccess = ref(false)
const reviewFieldErrors = ref({ rating: '', comment: '' })

function validateReview() {
  const errors = { rating: '', comment: '' }
  if (newRating.value < 1 || newRating.value > 5) {
    errors.rating = 'Please select a rating between 1 and 5 stars.'
  }
  if (newComment.value.trim().length < 5) {
    errors.comment = 'Comment must be at least 5 characters.'
  }
  reviewFieldErrors.value = errors
  return !errors.rating && !errors.comment
}

const submitReview = async () => {
  reviewError.value = ''
  reviewSuccess.value = false

  if (!validateReview()) return

  reviewPending.value = true
  try {
    await $fetch('/api/reviews', {
      method: 'POST',
      body: {
        productId: Number(route.params.id),
        rating: newRating.value,
        comment: newComment.value
      }
    })
    reviewSuccess.value = true
    newComment.value = ''
    newRating.value = 5
    await refreshReviews()
  } catch (err) {
    reviewError.value = err.data?.message || err.message || 'Failed to submit review'
  } finally {
    reviewPending.value = false
  }
}

const errorMessage = computed(() => {
  if (error.value) return error.value.message || 'Unable to load product'
  return 'Product not found'
})

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

const addToCartWithQty = () => {
  if (!product.value) return
  cart.addToCart({ ...product.value, qty: detailQty.value })
  detailQty.value = 1
}

function formatPrice(value) {
  return Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

watch(product, () => {
  detailImgBad.value = false
  detailQty.value = 1
})
</script>

<style scoped>
.detail-page { min-height: 100vh; background: #f8fafc; padding: 28px 16px; }
.container { max-width: 1000px; margin: 0 auto; }
.back-link { color: #d4af64; text-decoration: none; display: inline-block; margin-bottom: 14px; }
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
.title { margin-bottom: 10px; color: #111827; font-family: 'Cormorant Garamond', serif; }
.price { color: #111827; font-weight: 700; margin-bottom: 12px; font-size: 18px; }
.description { color: #4b5563; margin-bottom: 16px; }
.qty-row { display: flex; align-items: center; gap: 6px; margin-bottom: 14px; }
.qty-btn { width: 32px; height: 32px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; color: #374151; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; }
.qty-btn:hover { border-color: #d4af64; color: #d4af64; }
.qty-input { width: 48px; text-align: center; border: 1px solid #d1d5db; border-radius: 6px; padding: 5px; font-size: 14px; color: #111827; }
.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.qty-input { -moz-appearance: textfield; }
.cta-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.add-btn { background: #111827; color: #fff; border: none; border-radius: 8px; padding: 10px 16px; cursor: pointer; }
.add-btn:hover { background: #d4af64; color: #0a0806; }
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

.reviews-section { max-width: 1000px; margin: 24px auto 0; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }
.reviews-heading { margin: 0 0 14px; color: #111827; font-size: 18px; font-family: 'Cormorant Garamond', serif; }
.review-form { display: grid; gap: 8px; margin-bottom: 20px; }
.review-label { font-size: 13px; color: #374151; }
.star-rating { display: flex; gap: 4px; }
.star-btn { font-size: 20px; background: none; border: none; color: #d1d5db; cursor: pointer; padding: 0; line-height: 1; transition: color 0.2s ease; }
.star-btn.active { color: #d4af64; }
.star-btn.error { color: #fca5a5; }
.review-textarea { border: 1px solid #d1d5db; border-radius: 8px; padding: 10px; font: inherit; resize: vertical; }
.review-textarea.error { border-color: #dc2626; }
.review-submit { justify-self: start; border: none; border-radius: 8px; background: #111827; color: #fff; padding: 10px 16px; cursor: pointer; }
.review-submit:hover { background: #d4af64; color: #0a0806; }
.review-submit:disabled { opacity: 0.7; cursor: not-allowed; }
.review-error { color: #dc2626; font-size: 13px; margin: 0; }
.review-success { color: #15803d; font-size: 13px; margin: 0; }
.reviews-status { color: #6b7280; font-size: 14px; margin: 0; }
.reviews-status.error { color: #dc2626; }
.reviews-list { display: grid; gap: 12px; }
.review-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; }
.review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.review-author { font-size: 14px; font-weight: 500; color: #111827; }
.review-stars { font-size: 14px; color: #d4af64; letter-spacing: 1px; }
.review-comment { color: #4b5563; margin: 0 0 6px; font-size: 14px; }
.review-date { color: #9ca3af; font-size: 12px; margin: 0; }
</style>
