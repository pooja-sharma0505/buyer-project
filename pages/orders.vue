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
      <div v-else-if="orders.length === 0" class="empty-state">
        <div class="empty-wrap">
          <svg class="empty-icon" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <h2 class="empty-title">No orders yet</h2>
          <p class="empty-text">Your order history will appear here after your first purchase.</p>
          <NuxtLink to="/" class="empty-cta">Start Shopping</NuxtLink>
        </div>
      </div>

      <div v-else>
        <div class="orders-list">
          <div v-for="order in orders" :key="order.id" class="order-card">
            <div class="order-header">
              <div>
                <span class="order-id">Order #{{ order.id }}</span>
                <span class="order-date">{{ formatDate(order.createdAt) }}</span>
                <span class="status-badge" :class="statusClass(order.status)">{{ order.status }}</span>
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

              <div class="order-actions">
                <NuxtLink :to="`/orders/${order.id}`" class="btn secondary">View Details</NuxtLink>

                <!-- Reorder button - only for delivered/processing orders -->
                <button
                  v-if="canReorder(order.status)"
                  type="button"
                  class="btn secondary"
                  @click="reorder(order)"
                  :disabled="reordering === order.id"
                >
                  {{ reordering === order.id ? 'Adding...' : 'Reorder' }}
                </button>

                <!-- Cancel button - only for orders that can be cancelled -->
                <button
                  v-if="canCancel(order.status)"
                  type="button"
                  class="btn secondary danger"
                  @click="cancelOrder(order)"
                  :disabled="cancelling === order.id"
                >
                  {{ cancelling === order.id ? 'Cancelling...' : 'Cancel Order' }}
                </button>

                <!-- Return button - only for delivered orders within return window -->
                <button
                  v-if="canReturn(order.status, order.createdAt)"
                  type="button"
                  class="btn secondary"
                  @click="returnOrder(order)"
                  :disabled="returning === order.id"
                >
                  {{ returning === order.id ? 'Requesting...' : 'Return / Replace' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pageCount > 1" class="pagination">
          <button
            type="button"
            class="page-btn"
            :disabled="currentPage <= 1 || loadingPage"
            @click="goToPage(currentPage - 1)"
          >
            Previous
          </button>
          <span class="page-info">Page {{ currentPage }} of {{ pageCount }}</span>
          <button
            type="button"
            class="page-btn"
            :disabled="currentPage >= pageCount || loadingPage"
            @click="goToPage(currentPage + 1)"
          >
            Next
          </button>
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

definePageMeta({
  middleware: 'auth'
})

const { formatPrice } = useFormatPrice()
const { addToCart: addProductToCart } = useCart()
const { success: toastSuccess, error: toastError, info: toastInfo } = useToast()
const route = useRoute()
const router = useRouter()

const currentPage = ref(1)
const pageSize = 10
const loadingPage = ref(false)
const reordering = ref(null)
const cancelling = ref(null)
const returning = ref(null)

async function loadOrders(page = 1) {
  loadingPage.value = true
  try {
    const data = await $fetch('/api/orders', {
      query: { page, limit: pageSize }
    })
    orders.value = data.orders || []
    pageCount.value = data.pageCount || 1
    totalOrders.value = data.total || 0
  } catch (err) {
    error.value = err
  } finally {
    loadingPage.value = false
  }
}

await loadOrders()

watch(() => route.query.page, (val) => {
  const page = Number(val) || 1
  if (page !== currentPage.value) {
    currentPage.value = page
    loadOrders(page)
  }
}, { immediate: true })

// Refresh when navigating from order-success
watch(() => route.path, () => {
  loadOrders(currentPage.value)
})

const orders = ref([])
const pageCount = ref(1)
const totalOrders = ref(0)
const pending = ref(false)
const error = ref(null)

function formatDate(raw) {
  if (!raw) return ''
  const d = new Date(raw)
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

function statusClass(status) {
  const s = String(status ?? '').toLowerCase()
  if (s.includes('deliver') || s.includes('complete') || s.includes('shipped')) return 'success'
  if (s.includes('cancel')) return 'danger'
  if (s.includes('return')) return 'warning'
  return ''
}

function canReorder(status) {
  const s = String(status ?? '').toLowerCase()
  return s === 'delivered' || s === 'completed' || s === 'processing'
}

function canCancel(status) {
  const s = String(status ?? '').toLowerCase()
  return s === 'processing' || s === 'placed' || s === 'confirmed'
}

function canReturn(status, createdAt) {
  const s = String(status ?? '').toLowerCase()
  if (s !== 'delivered' && s !== 'completed') return false
  // Check if within 30-day return window
  const orderDate = new Date(createdAt)
  const now = new Date()
  const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24))
  return diffDays <= 30
}

const reorder = async (order) => {
  reordering.value = order.id
  try {
    let added = 0
    let unavailable = []

    for (const item of order.items) {
      // In a real app, check stock via API
      // For now, assume all available
      const ok = addProductToCart({
        id: item.productId,
        image: item.image,
        title: item.title,
        price: item.price,
        category: '',
        rating: { rate: 0, count: 0 },
        qty: item.qty
      })
      if (ok) added++
      else unavailable.push(item.title)
    }

    if (added > 0) {
      toastSuccess(`Added ${added} item${added > 1 ? 's' : ''} to cart`)
    }
    if (unavailable.length) {
      toastInfo(`${unavailable.join(', ')} currently unavailable`)
    }
  } catch (err) {
    toastError('Failed to reorder')
  } finally {
    reordering.value = null
  }
}

const cancelOrder = async (order) => {
  if (!confirm(`Cancel order #${order.id}? This action cannot be undone.`)) return

  cancelling.value = order.id
  try {
    await $fetch(`/api/orders/${order.id}/cancel`, { method: 'POST' })
    toastSuccess('Order cancelled successfully')
    await loadOrders(currentPage.value)
  } catch (err) {
    toastError(err.data?.message || 'Failed to cancel order')
  } finally {
    cancelling.value = null
  }
}

const returnOrder = async (order) => {
  returning.value = order.id
  try {
    await $fetch(`/api/orders/${order.id}/return`, {
      method: 'POST',
      body: { reason: 'Customer request' } // In real app, show a modal for reason
    })
    toastSuccess('Return request submitted')
    await loadOrders(currentPage.value)
  } catch (err) {
    toastError(err.data?.message || 'Failed to request return')
  } finally {
    returning.value = null
  }
}

function goToPage(page) {
  if (page < 1 || page > pageCount.value) return
  router.replace({ path: '/orders', query: { page } })
}
</script>

<style scoped>
.orders-page { min-height: 100vh; background: #f8fafc; padding: 28px 16px; }
.container { max-width: 800px; margin: 0 auto; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 8px; }
.top a { color: #d4af64; text-decoration: none; transition: color 0.2s ease; }
.top a:hover { color: #b8860b; text-decoration: underline; }
.top h1 { margin: 0; font-size: 22px; color: #111827; font-family: 'Cormorant Garamond', serif; }
.status { color: #6b7280; margin: 0; }
.status.error { color: #dc2626; }
.orders-list { display: flex; flex-direction: column; gap: 16px; }
.order-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; transition: box-shadow 0.2s ease, transform 0.1s ease; }
.order-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); transform: translateY(-1px); }
.order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
.order-id { font-weight: 600; color: #111827; margin-right: 10px; }
.order-date { color: #9ca3af; font-size: 13px; }
.status-badge { display: inline-block; margin-left: 10px; padding: 2px 10px; border-radius: 999px; background: #f3f4f6; color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
.status-badge.success { background: #dcfce7; color: #15803d; }
.status-badge.danger { background: #fee2e2; color: #b91c1c; }
.status-badge.warning { background: #fef3c7; color: #b45309; }
.order-total { font-weight: 700; color: #d4af64; font-size: 16px; }
.items { list-style: none; margin: 0 0 12px; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.item { display: flex; justify-content: space-between; font-size: 14px; color: #374151; }
.item-title { font-weight: 500; }
.item-meta { color: #6b7280; }
.order-summary { border-top: 1px dashed #e5e7eb; padding-top: 10px; }
.summary-row { display: flex; justify-content: space-between; font-size: 13px; color: #6b7280; margin-bottom: 4px; }
.summary-row.total { font-weight: 600; color: #111827; font-size: 14px; margin-top: 4px; }
.order-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.order-actions .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #d1d5db;
  background: #fff;
  color: #374151;
}
.order-actions .btn.secondary { background: #111827; color: #fff; border-color: #111827; }
.order-actions .btn.secondary:hover { background: #d4af64; color: #0a0806; border-color: #d4af64; }
.order-actions .btn.secondary:disabled { opacity: 0.7; cursor: not-allowed; }
.order-actions .btn.danger { color: #dc2626; border-color: #fecaca; background: #fef2f2; }
.order-actions .btn.danger:hover { background: #dc2626; color: #fff; border-color: #dc2626; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; text-align: center; }
.empty-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; max-width: 400px; }
.empty-icon { color: #d4af64; margin-bottom: 24px; line-height: 1; }
.empty-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; color: #111827; margin: 0 0 10px; }
.empty-text { color: #6b7280; font-size: 15px; margin: 0 0 28px; line-height: 1.5; }
.empty-cta { display: inline-block; padding: 14px 32px; background: #111827; color: #fff; border-radius: 10px; text-decoration: none; font-size: 15px; font-weight: 500; transition: background 0.2s ease, transform 0.15s ease; }
.empty-cta:hover { background: #d4af64; color: #0a0806; transform: translateY(-1px); }
.pagination { display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 24px; }
.page-btn { border: 1px solid #d1d5db; background: #fff; color: #374151; border-radius: 8px; padding: 8px 14px; cursor: pointer; font-size: 13px; }
.page-btn:hover:not(:disabled) { border-color: #d4af64; color: #d4af64; }
.page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.page-info { font-size: 13px; color: #6b7280; }
@media (max-width: 640px) {
  .orders-page { padding: 18px 10px; }
  .top h1 { font-size: 18px; }
  .order-card { padding: 14px; }
  .order-actions { flex-direction: column; }
  .order-actions .btn { width: 100%; }
}
</style>