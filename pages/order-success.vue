<template>
  <div class="success-page">
    <div class="container">
      <div class="card">
        <div class="icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h1>Order Placed Successfully</h1>
        <p v-if="orderId" class="order-id">Order #{{ orderId }}</p>

        <div v-if="pending" class="order-summary">
          <SkeletonLoader type="text" lines="3" />
        </div>
        <div v-else-if="order" class="order-summary">
          <div v-for="item in order.items" :key="item.productId" class="summary-item">
            <span>{{ item.title }} × {{ item.qty }}</span>
            <span>{{ formatPrice(item.price * item.qty) }}</span>
          </div>
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

        <div v-else class="not-found">
          <p>Order not found.</p>
        </div>

        <div class="actions">
          <NuxtLink to="/orders" class="btn primary">View My Orders</NuxtLink>
          <NuxtLink to="/" class="btn secondary">Continue Shopping</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Order Confirmation' })
useSeoMeta({
  ogTitle: 'Order Confirmation - LUMIÈRE',
  ogDescription: 'Your order has been placed successfully at LUMIÈRE.',
  ogImage: '/og-image.svg',
  ogType: 'website'
})

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const { formatPrice } = useFormatPrice()

const orderId = computed(() => route.query.orderId || '')

const { data: order, pending } = await useFetch(() => {
  const id = route.query.orderId
  return id ? `/api/orders/${id}` : null
})

if (!orderId.value) {
  await navigateTo('/orders')
}
</script>

<style scoped>
.success-page { min-height: calc(100vh - 72px); display: flex; align-items: center; justify-content: center; background: #f8fafc; padding: 40px 16px; }
.container { max-width: 520px; width: 100%; }
.card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px 24px; text-align: center; }
.icon { color: #15803d; margin-bottom: 16px; }
h1 { margin: 0 0 8px; font-family: 'Cormorant Garamond', serif; font-size: 24px; color: #111827; }
.order-id { margin: 0 0 20px; color: #6b7280; font-size: 14px; }
.order-summary { text-align: left; background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; margin-bottom: 20px; }
.summary-item { display: flex; justify-content: space-between; font-size: 13px; color: #374151; margin-bottom: 6px; }
.summary-row { display: flex; justify-content: space-between; font-size: 14px; color: #4b5563; margin-top: 8px; }
.summary-row.total { font-weight: 700; color: #111827; border-top: 1px solid #e5e7eb; padding-top: 8px; }
.not-found { text-align: center; padding: 20px; color: #6b7280; }
.actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.btn { display: inline-block; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 500; text-decoration: none; cursor: pointer; border: 1px solid transparent; transition: background 0.2s ease; }
.btn.primary { background: #111827; color: #fff; border-color: #111827; }
.btn.primary:hover { background: #d4af64; color: #0a0806; border-color: #d4af64; }
.btn.secondary { background: #fff; color: #374151; border-color: #d1d5db; }
.btn.secondary:hover { border-color: #d4af64; color: #d4af64; }
</style>
