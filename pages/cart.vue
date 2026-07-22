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
          <div v-if="items.length === 0" class="empty-state">
            <div class="empty-wrap">
              <i class="bi bi-bag-x-fill empty-icon"></i>
              <h2 class="empty-title">Your cart is empty</h2>
              <p class="empty-text">Looks like you haven't added anything to your cart yet.</p>
              <NuxtLink to="/" class="empty-cta">Continue Shopping</NuxtLink>
            </div>
          </div>
        </div>

        <div class="summary">
          <h2>Order Summary</h2>
          <div class="row">
            <span>Subtotal</span>
            <strong>{{ formatPrice(subtotal) }}</strong>
          </div>
          <div class="row">
            <span>Tax (18%)</span>
            <strong>{{ formatPrice(tax) }}</strong>
          </div>
          <div class="row total">
            <span>Total</span>
            <strong>{{ formatPrice(total) }}</strong>
          </div>
          <button
            class="order-btn"
            :disabled="items.length === 0 || placing"
            @click="placeOrder"
          >
            {{ placing ? 'Placing order…' : 'Place Order' }}
          </button>
          <p v-if="!isLoggedIn" class="hint">You must be <NuxtLink to="/login" class="login-link">logged in</NuxtLink> to place an order.</p>
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
const { formatPrice } = useFormatPrice()

const success = ref(false)
const placing = ref(false)
const orderError = ref('')

const tax = computed(() => Number(subtotal.value || 0) * 0.18)
const total = computed(() => Number(subtotal.value || 0) + tax.value)

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
.top a { color: #d4af64; text-decoration: none; }
.top h1 { margin: 0; font-size: 22px; color: #111827; font-family: 'Cormorant Garamond', serif; }
.layout { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
.items { display: grid; gap: 12px; }
.summary { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; height: fit-content; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.summary h2 { margin-top: 0; color: #111827; }
.row { display: flex; justify-content: space-between; margin-bottom: 10px; color: #4b5563; }
.row.total { border-top: 1px solid #e5e7eb; padding-top: 10px; margin-top: 10px; color: #111827; }
.order-btn { width: 100%; border: none; border-radius: 8px; background: #111827; color: #fff; padding: 10px; cursor: pointer; margin-top: 12px; transition: background 0.2s ease; }
.order-btn:hover { background: #d4af64; color: #0a0806; }
.order-btn:disabled { background: #9ca3af; cursor: not-allowed; }
.hint { color: #6b7280; font-size: 13px; margin-top: 10px; }
.login-link { color: #d4af64; text-decoration: underline; font-weight: 500; }
.error { color: #dc2626; margin-top: 10px; }
.success { color: #15803d; margin-top: 10px; }
.empty { color: #6b7280; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; text-align: center; }
.empty-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; max-width: 400px; }
.empty-icon { font-size: 56px; color: #9ca3af; margin-bottom: 24px; line-height: 1; }
.empty-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; color: #111827; margin: 0 0 10px; }
.empty-text { color: #6b7280; font-size: 15px; margin: 0 0 28px; line-height: 1.5; }
.empty-cta { display: inline-block; padding: 14px 32px; background: #111827; color: #fff; border-radius: 10px; text-decoration: none; font-size: 15px; font-weight: 500; transition: background 0.2s ease, transform 0.15s ease; }
.empty-cta:hover { background: #d4af64; color: #0a0806; transform: translateY(-1px); }
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
