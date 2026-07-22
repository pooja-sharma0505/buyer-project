<template>
  <div class="wishlist-page">
    <div class="container">
      <div class="top">
        <NuxtLink to="/">← Continue Shopping</NuxtLink>
        <h1>Wishlist ({{ items.length }})</h1>
      </div>

      <p v-if="items.length === 0" class="empty">Your wishlist is empty. Save items from the home page or product details.</p>

      <ul v-else class="list">
        <li v-for="item in items" :key="item.id" class="row">
          <button type="button" class="thumb-wrap" @click="goProduct(item.id)">
            <img :src="item.image || '/placeholder-product.svg'" :alt="item.title" class="thumb" />
          </button>
          <div class="info">
            <p v-if="item.category" class="cat">{{ item.category }}</p>
            <button type="button" class="title-btn" @click="goProduct(item.id)">{{ item.title }}</button>
            <p class="price">${{ formatPrice(item.price) }}</p>
            <div class="actions">
              <button type="button" class="btn secondary" @click="removeFromWishlist(item.id)">Remove</button>
              <button type="button" class="btn primary" @click="addToCart(item)">Add to cart</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Wishlist' })
useSeoMeta({
  ogTitle: 'Wishlist - LUMIÈRE',
  ogDescription: 'Your saved items at LUMIÈRE.',
  ogImage: '/og-image.jpg',
  ogType: 'website'
})

const { addToCart: addProductToCart } = useCart()
const { items, removeFromWishlist } = useWishlist()

const goProduct = (id) => {
  navigateTo(`/product/${id}`)
}

const addToCart = (item) => {
  addProductToCart({
    id: item.id,
    image: item.image,
    title: item.title,
    price: item.price,
    category: item.category,
    rating: item.rating || { rate: 0, count: 0 },
    qty: 1
  })
}

function formatPrice(value) {
  return Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<style scoped>
.wishlist-page { min-height: 100vh; background: #f8fafc; padding: 28px 16px; }
.container { max-width: 800px; margin: 0 auto; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 8px; }
.top a { color: #4f46e5; text-decoration: none; }
.top h1 { margin: 0; font-size: 22px; color: #111827; }
.empty { color: #6b7280; margin: 0; }
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
.price { font-size: 16px; color: #4f46e5; font-weight: 700; margin: 0 0 12px; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; }
.btn {
  border-radius: 8px;
  padding: 8px 14px;
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
}
.btn.secondary:hover { background: #fef2f2; border-color: #fecaca; color: #991b1b; }
@media (max-width: 520px) {
  .wishlist-page { padding: 18px 10px; }
  .top h1 { font-size: 18px; }
  .row { grid-template-columns: var(--product-thumb-row, 96px) 1fr; gap: 12px; padding: 12px; }
  .btn { width: 100%; }
}
</style>
