<template>
  <div class="orders-page">
    <div class="container">
      <div class="top">
        <NuxtLink to="/">← Continue Shopping</NuxtLink>
        <h1>My Orders</h1>
      </div>

      <div v-if="pending" class="orders-list">
        <SkeletonLoader v-for="n in 3" :key="n" type="text" lines="3" />
      </div>
      <div v-else-if="error" class="status error">{{ error }}</div>
      <div v-else-if="!orders.length" class="empty-state">
        <div class="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <h2 class="empty-title">No orders yet</h2>
        <p class="empty-text">Your order history will appear here after your first purchase.</p>
        <NuxtLink to="/" class="empty-cta">Start Shopping</NuxtLink>
      </div>

      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <div>
              <span class="order-id">Order #{{ order.id }}</span>
              <span class="order-date">{{ formatDate(order.createdAt) }}</span>
            </div>
            <span class="order-total">{{ formatPrice(order.total) }}</span>
          </div>

          <ul class="items">
            <li v-for="item in order.items" :key="item.productId" class="item">
              <span class="item-title">{{ item.title }}</span>
              <span class="item-meta">x{{ item.qty }} @ {{ formatPrice(item.price) }}</span>
            </li>
          </ul>

          <div class="order-summary">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>{{ formatPrice(order.subtotal) }}</span>
            </div>
            <div class="summary-row">
              <span>Tax (18%)</span>
              <span>{{ formatPrice(order.tax) }}</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>{{ formatPrice(order.total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'My Orders' })
useSeoMeta({
  ogTitle: 'My Orders - LUMIÈRE',
  ogDescription: 'View your order history at LUMIÈRE.',
  ogImage: '/og-image.svg',
  ogType: 'website'
})

const { data, pending, error } = await useFetch('/api/orders', { server: false })
const { formatPrice } = useFormatPrice()

const orders = computed(() => data.value?.orders || [])

function formatDate(raw) {
  if (!raw) return ''
  const d = new Date(raw)
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.orders-page { min-height: 100vh; background: #f8fafc; padding: 28px 16px; }
.container { max-width: 800px; margin: 0 auto; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 8px; }
.top a { color: #d4af64; text-decoration: none; }
.top h1 { margin: 0; font-size: 22px; color: #111827; font-family: 'Cormorant Garamond', serif; }
.status { color: #6b7280; margin: 0; }
.status.error { color: #dc2626; }
.orders-list { display: flex; flex-direction: column; gap: 16px; }
.order-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }
.order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
.order-id { font-weight: 600; color: #111827; margin-right: 10px; }
.order-date { color: #9ca3af; font-size: 13px; }
.order-total { font-weight: 700; color: #d4af64; font-size: 16px; }
.items { list-style: none; margin: 0 0 12px; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.item { display: flex; justify-content: space-between; font-size: 14px; color: #374151; }
.item-title { font-weight: 500; }
.item-meta { color: #6b7280; }
.order-summary { border-top: 1px dashed #e5e7eb; padding-top: 10px; }
.summary-row { display: flex; justify-content: space-between; font-size: 13px; color: #6b7280; margin-bottom: 4px; }
.summary-row.total { font-weight: 600; color: #111827; font-size: 14px; margin-top: 4px; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 20px; text-align: center; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; }
.empty-icon { color: #d1d5db; margin-bottom: 16px; }
.empty-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: #111827; margin: 0 0 6px; }
.empty-text { color: #6b7280; font-size: 14px; margin: 0 0 16px; }
.empty-cta { display: inline-block; padding: 10px 20px; background: #111827; color: #fff; border-radius: 8px; text-decoration: none; font-size: 14px; transition: background 0.2s ease; }
.empty-cta:hover { background: #d4af64; color: #0a0806; }
@media (max-width: 640px) {
  .orders-page { padding: 18px 10px; }
  .top h1 { font-size: 18px; }
  .order-card { padding: 14px; }
}
</style>