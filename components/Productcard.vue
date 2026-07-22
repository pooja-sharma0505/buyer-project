<template>
  <div class="product-card" @click="goToDetail">
    <div class="img-wrapper">
      <button
        type="button"
        class="wishlist-toggle"
        :class="{ active: inWishlist }"
        :aria-label="inWishlist ? 'Remove from wishlist' : 'Add to wishlist'"
        :aria-pressed="inWishlist"
        @click.stop="toggleWishlist"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" :fill="inWishlist ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
      <img :src="displaySrc" :alt="title" class="product-img" loading="lazy" @error="onImgError" />
    </div>

    <div class="card-body">
      <p v-if="category" class="category-tag">{{ category }}</p>
      <p class="product-title">{{ title }}</p>

      <div class="rating-row">
        <span class="stars">{{ starDisplay }}</span>
        <span class="rating-count">({{ rating.count }})</span>
      </div>

      <p class="product-price">{{ formatPrice(price) }}</p>

      <div class="qty-row" @click.stop>
        <button type="button" class="qty-btn" @click="localQty > 1 && localQty--" aria-label="Decrease quantity">-</button>
        <input
          v-model.number="localQty"
          type="number"
          min="1"
          max="99"
          class="qty-input"
          aria-label="Quantity"
          @click.stop
        />
        <button type="button" class="qty-btn" @click="localQty < 99 && localQty++" aria-label="Increase quantity">+</button>
      </div>

      <button class="add-btn" :class="{ added: isAdded }" @click.stop="handleAddToCart">
        {{ isAdded ? 'Added!' : '+ Add to Cart' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    id: { type: Number, required: true },
    image: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, default: '' },
    rating: { type: Object, default: () => ({ rate: 0, count: 0 }) }
  },
  emits: ['add-to-cart'],
  setup() {
    const wishlist = useWishlist()
    const { formatPrice } = useFormatPrice()
    return { wishlist, formatPrice }
  },
  data() {
    return { isAdded: false, imgFailed: false, localQty: 1 }
  },
  computed: {
    inWishlist() {
      return this.wishlist?.isInWishlist(this.id) ?? false
    },
    displaySrc() {
      return this.imgFailed ? '/placeholder-product.svg' : this.image || '/placeholder-product.svg'
    },
    starDisplay() {
      const filled = Math.round(this.rating.rate)
      return '★'.repeat(filled) + '☆'.repeat(5 - filled)
    }
  },
  watch: {
    image() {
      this.imgFailed = false
    }
  },
  methods: {
    onImgError() {
      if (!this.imgFailed) this.imgFailed = true
    },
    goToDetail() {
      navigateTo(`/product/${this.id}`)
    },
    handleAddToCart() {
      this.$emit('add-to-cart', {
        id: this.id,
        image: this.image,
        title: this.title,
        price: this.price,
        category: this.category,
        rating: this.rating,
        qty: this.localQty
      })
      this.isAdded = true
      this.localQty = 1
      setTimeout(() => {
        this.isAdded = false
      }, 1200)
    },
    toggleWishlist() {
      this.wishlist.toggleWishlist({
        id: this.id,
        image: this.image,
        title: this.title,
        price: this.price,
        category: this.category,
        rating: this.rating
      })
    }
  }
}
</script>

<style scoped>
.product-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; cursor: pointer; transition: transform .15s ease, box-shadow .15s ease; }
.product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,.08); }
.img-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: var(--product-thumb-bg, #f8fafc);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(10px, 3vw, 16px);
}
.wishlist-toggle {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(255,255,255,.92);
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,.06);
  transition: color .2s ease, background .2s ease, transform .15s ease;
}
.wishlist-toggle:hover {
  color: #dc2626;
  transform: scale(1.05);
}
.wishlist-toggle.active {
  color: #dc2626;
  background: #fff;
}
.product-img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.card-body { padding: 14px; }
.category-tag { font-size: 10px; color: #9ca3af; text-transform: uppercase; letter-spacing: .6px; margin-bottom: 4px; }
.product-title { font-size: 13px; color: #111827; line-height: 1.4; margin-bottom: 6px; min-height: 36px; }
.rating-row { display: flex; align-items: center; gap: 4px; margin-bottom: 6px; }
.stars { font-size: 12px; color: #d4af64; }
.rating-count { font-size: 11px; color: #9ca3af; }
.product-price { font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 10px; }
.qty-row { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
.qty-btn { width: 28px; height: 28px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; color: #374151; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; }
.qty-btn:hover { border-color: #d4af64; color: #d4af64; }
.qty-input { width: 40px; text-align: center; border: 1px solid #d1d5db; border-radius: 6px; padding: 4px; font-size: 13px; color: #111827; }
.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.qty-input { -moz-appearance: textfield; }
.add-btn { width: 100%; padding: 8px; font-size: 13px; border: 1px solid #d1d5db; border-radius: 8px; background: transparent; color: #374151; cursor: pointer; transition: all .15s ease; }
.add-btn:hover { background: #d4af64; color: #0a0806; border-color: #d4af64; }
.add-btn.added { background: #d1fae5; border-color: #6ee7b7; color: #065f46; }
@media (max-width: 640px) {
  .img-wrapper { padding: 10px; }
  .card-body { padding: 12px; }
  .product-title { min-height: auto; font-size: 14px; }
  .product-price { font-size: 18px; }
  .wishlist-toggle { width: 34px; height: 34px; top: 8px; right: 8px; }
}
</style>
