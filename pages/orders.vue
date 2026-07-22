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
        <div class="empty-wrap">
          <i class="bi bi-file-earmark-text-fill empty-icon"></i>
          <h2 class="empty-title">No orders yet</h2>
          <p class="empty-text">Your order history will appear here after your first purchase.</p>
          <NuxtLink to="/" class="empty-cta">Start Shopping</NuxtLink>
        </div>
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
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; text-align: center; }
.empty-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; max-width: 400px; }
.empty-icon { font-size: 56px; color: #9ca3af; margin-bottom: 24px; line-height: 1; }
.empty-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; color: #111827; margin: 0 0 10px; }
.empty-text { color: #6b7280; font-size: 15px; margin: 0 0 28px; line-height: 1.5; }
.empty-cta { display: inline-block; padding: 14px 32px; background: #111827; color: #fff; border-radius: 10px; text-decoration: none; font-size: 15px; font-weight: 500; transition: background 0.2s ease, transform 0.15s ease; }
.empty-cta:hover { background: #d4af64; color: #0a0806; transform: translateY(-1px); }
@media (max-width: 640px) {
  .orders-page { padding: 18px 10px; }
  .top h1 { font-size: 18px; }
  .order-card { padding: 14px; }
}
</style>