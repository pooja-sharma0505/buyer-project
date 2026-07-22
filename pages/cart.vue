<template>
  <div class="cart-page">
    <div class="container">
      <div class="top">
        <NuxtLink to="/">← Continue Shopping</NuxtLink>
        <h1>Your Cart ({{ items.length }} items)</h1>
      </div>

      <div class="layout">
        <div class="items">
          <CartItem
            v-for="item in items"
            :key="item.id"
            :product="item"
            :quantity="item.qty"
            @update-qty="({ id, quantity }) => updateQty(id, quantity)"
            @remove="removeFromCart"
          />
          <p v-if="items.length === 0" class="empty">Your cart is empty.</p>
        </div>

        <div class="summary">
          <h2>Order Summary</h2>
          <div class="row">
            <span>Subtotal</span>
            <strong>${{ formatPrice(subtotal) }}</strong>
          </div>
          <div class="row">
            <span>Tax (18%)</span>
            <strong>${{ formatPrice(tax) }}</strong>
          </div>
          <div class="row total">
            <span>Total</span>
            <strong>${{ formatPrice(total) }}</strong>
          </div>
          <button
            class="order-btn"
            :disabled="items.length === 0 || placing"
            @click="placeOrder"
          >
            {{ placing ? 'Placing order…' : 'Place Order' }}
          </button>
          <p v-if="!isLoggedIn" class="hint">You must be logged in to place an order.</p>
          <p v-if="orderError" class="error">{{ orderError }}</p>
          <p v-if="success" class="success">Order placed successfully.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Shopping Cart' })
useSeoMeta({
  ogTitle: 'Shopping Cart - LUMIÈRE',
  ogDescription: 'Review your items and complete your purchase at LUMIÈRE.',
  ogImage: '/og-image.svg',
  ogType: 'website'
})

const { items, subtotal, updateQty, removeFromCart, clearCart } = useCart()
const { isLoggedIn } = useAuth()

const success = ref(false)
const placing = ref(false)
const orderError = ref('')

const tax = computed(() => Number(subtotal.value || 0) * 0.18)
const total = computed(() => Number(subtotal.value || 0) + tax.value)

function formatPrice(value) {
  return Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const placeOrder = async () => {
  orderError.value = ''
  success.value = false

  if (!isLoggedIn.value) {
    await navigateTo('/login')
    return
  }

  if (!items.value.length) return

  placing.value = true
  try {
    await $fetch('/api/orders', {
      method: 'POST',
      body: {
        items: items.value.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          qty: item.qty
        }))
      }
    })
    clearCart()
    success.value = true
    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch (err) {
    orderError.value = err.data?.message || err.message || 'Failed to place order'
  } finally {
    placing.value = false
  }
}
</script>

<style scoped>
.cart-page { min-height: 100vh; background: #f8fafc; padding: 28px 16px; }
.container { max-width: 1100px; margin: 0 auto; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
.top a { color: #4f46e5; text-decoration: none; }
.top h1 { margin: 0; font-size: 22px; color: #111827; }
.layout { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
.items { display: grid; gap: 10px; }
.summary { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; height: fit-content; }
.summary h2 { margin-top: 0; color: #111827; }
.row { display: flex; justify-content: space-between; margin-bottom: 10px; color: #4b5563; }
.row.total { border-top: 1px solid #e5e7eb; padding-top: 10px; margin-top: 10px; color: #111827; }
.order-btn { width: 100%; border: none; border-radius: 8px; background: #111827; color: #fff; padding: 10px; cursor: pointer; margin-top: 12px; transition: background 0.2s ease; }
.order-btn:hover { background: #d4af64; color: #0a0806; }
.order-btn:disabled { background: #9ca3af; cursor: not-allowed; }
.hint { color: #6b7280; font-size: 13px; margin-top: 10px; }
.error { color: #dc2626; margin-top: 10px; }
.success { color: #15803d; margin-top: 10px; }
.empty { color: #6b7280; }
@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
  .summary { position: static; }
}
@media (max-width: 640px) {
  .cart-page { padding: 18px 10px; }
  .top h1 { font-size: 18px; }
  .summary { padding: 14px; }
}
</style>
