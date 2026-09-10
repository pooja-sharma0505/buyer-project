<template>
  <div class="detail-page">
    <div class="container">
      <div class="top">
        <NuxtLink to="/orders" class="back-link">
          <i class="bi bi-arrow-left"></i>
          Back to Orders
        </NuxtLink>
        <h1 v-if="order">Order #{{ order.id }}</h1>
        <h1 v-else>Order Details</h1>
      </div>

      <div v-if="pending" class="card">
        <SkeletonLoader type="text" lines="4" />
      </div>
      <div v-else-if="error || !order" class="not-found">
        <div class="not-found-wrap">
          <i class="bi bi-exclamation-circle empty-icon"></i>
          <p>{{ errorMessage }}</p>
          <NuxtLink to="/orders" class="btn primary">View My Orders</NuxtLink>
        </div>
      </div>
      <div v-else class="layout">
        <div class="info">
          <div class="order-meta">
            <p class="date">
              <i class="bi bi-calendar3"></i>
              {{ formatDate(order.createdAt) }}
            </p>
            <p class="status-line">
              <span class="status-badge" :class="statusClass(order.status)">
                <i class="bi bi-circle-fill status-dot"></i>
                {{ order.status }}
              </span>
            </p>
          </div>

          <div class="section">
            <h2>
              <i class="bi bi-truck"></i>
              Shipping Details
            </h2>
            <div class="shipping-card">
              <p class="shipping-line name"><strong>{{ order.fullName }}</strong></p>
              <p class="shipping-line">{{ order.address }}</p>
              <p class="shipping-line">{{ order.city }}{{ order.zip ? ', ' + order.zip : '' }}</p>
              <p class="shipping-line">
                <i class="bi bi-telephone"></i>
                {{ order.phone }}
              </p>
            </div>
          </div>

          <div class="section">
            <h2>
              <i class="bi bi-bag"></i>
              Order Items ({{ order.items.length }})
            </h2>
            <div class="items-list">
              <div v-for="item in order.items" :key="item.productId" class="item-card">
                <div class="item-image-wrap">
                  <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.title"
                    class="item-image"
                    loading="lazy"
                  />
                  <div v-else class="item-image-placeholder">
                    <i class="bi bi-image"></i>
                  </div>
                </div>
                <div class="item-details">
                  <h3 class="item-title">{{ item.title }}</h3>
                  <p class="item-price">{{ formatPrice(item.price) }} × {{ item.qty }}</p>
                </div>
                <div class="item-total">
                  {{ formatPrice(item.price * item.qty) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="summary">
          <h2>Order Summary</h2>
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
          <div class="summary-actions">
            <NuxtLink to="/" class="btn secondary">
              <i class="bi bi-bag-plus"></i>
              Continue Shopping
            </NuxtLink>
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

// Fetch order on client-side mount to ensure route params are available
onMounted(async () => {
  try {
    pending.value = true
    error.value = null
    order.value = await $fetch(`/api/orders/${route.params.id}`)
  } catch (err) {
    error.value = err
    order.value = null
  } finally {
    pending.value = false
  }
})

// Also watch for route changes in case user navigates between orders
watch(() => route.params.id, async (newId) => {
  if (newId) {
    try {
      pending.value = true
      error.value = null
      order.value = await $fetch(`/api/orders/${newId}`)
    } catch (err) {
      error.value = err
      order.value = null
    } finally {
      pending.value = false
    }
  }
})

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
.detail-page { min-height: 100vh; background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); padding: 28px 16px; }
.container { max-width: 900px; margin: 0 auto; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #d4af64;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}
.back-link:hover { color: #b8860b; }
.top h1 { margin: 0; font-size: 24px; color: #111827; font-family: 'Cormorant Garamond', serif; font-weight: 600; }
.not-found { text-align: center; padding: 60px 20px; }
.not-found-wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.empty-icon { font-size: 48px; color: #9ca3af; }
.not-found p { color: #6b7280; font-size: 16px; margin: 0; }
.not-found .btn { display: inline-block; padding: 12px 24px; background: #111827; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 500; transition: all 0.2s ease; }
.not-found .btn:hover { background: #d4af64; color: #0a0806; }
.layout { display: grid; grid-template-columns: 1fr 320px; gap: 24px; align-items: start; }
.info { display: flex; flex-direction: column; gap: 24px; }
.order-meta { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }
.date { color: #6b7280; font-size: 14px; margin: 0 0 12px; display: flex; align-items: center; gap: 8px; }
.date i { color: #d4af64; }
.status-line { margin: 0; }
.status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 999px; background: #f3f4f6; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
.status-dot { font-size: 8px; }
.status-badge.success { background: #dcfce7; color: #15803d; }
.status-badge.danger { background: #fee2e2; color: #b91c1c; }
.section h2 { margin: 0 0 12px; font-size: 16px; color: #111827; display: flex; align-items: center; gap: 8px; }
.section h2 i { color: #d4af64; }
.shipping-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }
.shipping-line { margin: 0 0 8px; color: #4b5563; font-size: 14px; display: flex; align-items: center; gap: 8px; }
.shipping-line.name { font-size: 16px; color: #111827; margin-bottom: 12px; }
.shipping-line i { color: #9ca3af; }
.items-list { display: flex; flex-direction: column; gap: 12px; }
.item-card { display: flex; align-items: center; gap: 16px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; transition: box-shadow 0.2s ease; }
.item-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
.item-image-wrap { width: 72px; height: 72px; flex-shrink: 0; border-radius: 10px; background: #f8fafc; border: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.item-image { max-width: 100%; max-height: 100%; object-fit: contain; }
.item-image-placeholder { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: #cbd5e1; font-size: 24px; }
.item-details { flex: 1; min-width: 0; }
.item-title { margin: 0 0 4px; font-size: 14px; font-weight: 600; color: #111827; line-height: 1.3; }
.item-price { margin: 0; font-size: 13px; color: #6b7280; }
.item-total { font-weight: 700; color: #111827; font-size: 15px; white-space: nowrap; }
.summary { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; height: fit-content; position: sticky; top: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
.summary h2 { margin-top: 0; color: #111827; font-size: 18px; font-weight: 600; margin-bottom: 16px; }
.summary-row { display: flex; justify-content: space-between; font-size: 14px; color: #4b5563; margin-bottom: 12px; }
.summary-row.total { font-weight: 700; color: #111827; border-top: 2px solid #e5e7eb; padding-top: 16px; margin-top: 16px; font-size: 16px; }
.summary-actions { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
.btn.secondary { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px 16px; background: #f8fafc; color: #374151; border: 1px solid #e5e7eb; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px; transition: all 0.2s ease; }
.btn.secondary:hover { background: #d4af64; color: #0a0806; border-color: #d4af64; }
@media (max-width: 768px) {
  .layout { grid-template-columns: 1fr; }
  .summary { position: static; }
}
@media (max-width: 640px) {
  .detail-page { padding: 18px 10px; }
  .top h1 { font-size: 20px; }
  .item-card { padding: 12px; gap: 12px; }
  .item-image-wrap { width: 60px; height: 60px; }
}
</style>
