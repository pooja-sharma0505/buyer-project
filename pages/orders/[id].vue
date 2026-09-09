<template>
  <div class="detail-page">
    <div class="container">
      <div class="top">
        <NuxtLink to="/orders">← Back to Orders</NuxtLink>
        <h1>Order #{{ order?.id }}</h1>
      </div>

      <div v-if="pending" class="card">
        <SkeletonLoader type="text" lines="4" />
      </div>
      <div v-else-if="error || !order" class="not-found">
        <p>{{ errorMessage }}</p>
        <NuxtLink to="/orders" class="btn primary">View My Orders</NuxtLink>
      </div>
      <div v-else class="layout">
        <div class="info">
          <p class="date">{{ formatDate(order.createdAt) }}</p>
          <p class="status-line">
            <span class="status-badge" :class="statusClass(order.status)">{{ order.status }}</span>
          </p>

          <h2>Shipping</h2>
          <p class="shipping-line"><strong>{{ order.fullName }}</strong></p>
          <p class="shipping-line">{{ order.address }}</p>
          <p class="shipping-line">{{ order.city }}{{ order.zip ? ', ' + order.zip : '' }}</p>
          <p class="shipping-line">{{ order.phone }}</p>

          <h2>Items</h2>
          <div v-for="item in order.items" :key="item.productId" class="item-row">
            <span class="item-title">{{ item.title }}</span>
            <span class="item-meta">× {{ item.qty }} — {{ formatPrice(item.price * item.qty) }}</span>
          </div>
        </div>

        <div class="summary">
          <h2>Summary</h2>
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
</template>

<script setup>
useHead({ title: 'Order Details' })
useSeoMeta({
  ogTitle: 'Order Details - LUMIÈRE',
  ogDescription: 'View your order details at LUMIÈRE.',
  ogImage: '/og-image.svg',
  ogType: 'website'
})

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const { formatPrice } = useFormatPrice()

const order = ref(null)
const pending = ref(true)
const error = ref(null)

try {
  order.value = await $fetch(`/api/orders/${route.params.id}`)
} catch (err) {
  error.value = err
} finally {
  pending.value = false
}

const errorMessage = computed(() => {
  if (error.value?.statusCode === 404) return 'Order not found'
  return error.value?.message || 'Unable to load order'
})

function formatDate(raw) {
  if (!raw) return ''
  const d = new Date(raw)
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

function statusClass(status) {
  const s = String(status ?? '').toLowerCase()
  if (s.includes('deliver') || s.includes('complete') || s.includes('shipped')) return 'success'
  if (s.includes('cancel')) return 'danger'
  return ''
}
</script>

<style scoped>
.detail-page { min-height: 100vh; background: #f8fafc; padding: 28px 16px; }
.container { max-width: 800px; margin: 0 auto; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 8px; }
.top a { color: #d4af64; text-decoration: none; }
.top a:hover { color: #b8860b; text-decoration: underline; }
.top h1 { margin: 0; font-size: 22px; color: #111827; font-family: 'Cormorant Garamond', serif; }
.not-found { text-align: center; padding: 40px; color: #6b7280; }
.not-found .btn { display: inline-block; margin-top: 16px; padding: 10px 20px; background: #111827; color: #fff; border-radius: 8px; text-decoration: none; }
.layout { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.info { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }
.date { color: #9ca3af; font-size: 13px; margin: 0 0 16px; }
.status-line { margin: 0 0 16px; }
.status-badge { display: inline-block; padding: 2px 10px; border-radius: 999px; background: #f3f4f6; color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
.status-badge.success { background: #dcfce7; color: #15803d; }
.status-badge.danger { background: #fee2e2; color: #b91c1c; }
.shipping-line { margin: 0 0 4px; color: #4b5563; font-size: 14px; }
.shipping-line strong { color: #111827; }
.info h2 { margin: 20px 0 10px; font-size: 16px; color: #111827; }
.item-row { display: flex; justify-content: space-between; font-size: 14px; color: #374151; margin-bottom: 6px; }
.item-title { font-weight: 500; }
.item-meta { color: #6b7280; }
.summary { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; height: fit-content; }
.summary h2 { margin-top: 0; color: #111827; }
.summary-row { display: flex; justify-content: space-between; font-size: 14px; color: #4b5563; margin-bottom: 8px; }
.summary-row.total { font-weight: 700; color: #111827; border-top: 1px solid #e5e7eb; padding-top: 8px; margin-top: 8px; }
@media (max-width: 768px) {
  .layout { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .detail-page { padding: 18px 10px; }
  .top h1 { font-size: 18px; }
}
</style>
