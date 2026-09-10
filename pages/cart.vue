<template>
  <div class="cart-page">
    <div class="container">
      <div class="top">
        <NuxtLink to="/">← Continue Shopping</NuxtLink>
        <h1>Your Cart ({{ totalQty }} items)</h1>
      </div>

      <!-- Loading state while cart is being hydrated -->
      <div v-if="!isHydrated" class="loading-state">
        <div class="loading-wrap">
          <div class="spinner"></div>
          <p>Loading your cart...</p>
        </div>
      </div>

      <div v-else class="layout">
        <div class="items">
          <CartItem
            v-for="item in displayItems"
            :key="item.id"
            :product="item"
            :quantity="item.qty"
            @update-qty="handleUpdateQty"
            @remove="handleRemove"
          />
          <div v-if="displayItems.length === 0" class="empty-state">
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
            :disabled="displayItems.length === 0"
            @click="goToCheckout"
          >
            Proceed to Checkout
          </button>
          <p v-if="!isLoggedIn" class="hint">You must be <NuxtLink to="/login" class="login-link">logged in</NuxtLink> to checkout.</p>
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

const { isLoggedIn } = useAuth()
const { formatPrice } = useFormatPrice()
// Use the shared useCart() composable (localStorage-backed) so guests see
// the same items the Navbar shows, instead of the auth-gated /api/cart.
const { items: displayItems, updateQty, removeFromCart, itemCount: totalQty, subtotal, isHydrated } = useCart()

const tax = computed(() => Number(subtotal.value || 0) * 0.18)
const total = computed(() => Number(subtotal.value || 0) + tax.value)

const goToCheckout = async () => {
  if (!isLoggedIn.value) {
    await navigateTo('/login?redirect=/checkout')
    return
  }
  if (!displayItems.value.length) return
  await navigateTo('/checkout')
}

const handleUpdateQty = ({ id, quantity }) => {
  updateQty(id, quantity)
}

const handleRemove = (id) => {
  removeFromCart(id)
}
</script>

<style scoped>
.cart-page { min-height: 100vh; background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); padding: 28px 16px; }
.container { max-width: 1100px; margin: 0 auto; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.top a { 
  color: #d4af64; 
  text-decoration: none; 
  transition: all 0.2s ease; 
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.top a:hover { color: #b8860b; }
.top h1 { margin: 0; font-size: 26px; color: #111827; font-family: 'Cormorant Garamond', serif; font-weight: 600; }

/* Loading state */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}
.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #6b7280;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #d4af64;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.loading-wrap p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.layout { display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: start; }
.items { display: flex; flex-direction: column; gap: 16px; }
.summary { 
  background: #fff; 
  border: 1px solid #e5e7eb; 
  border-radius: 16px; 
  padding: 24px; 
  height: fit-content; 
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  position: sticky;
  top: 20px;
}
.summary h2 { margin-top: 0; color: #111827; font-size: 18px; font-weight: 600; margin-bottom: 16px; }
.row { display: flex; justify-content: space-between; margin-bottom: 12px; color: #4b5563; font-size: 14px; }
.row.total { border-top: 2px solid #e5e7eb; padding-top: 16px; margin-top: 16px; color: #111827; font-weight: 600; font-size: 16px; }
.order-btn { 
  width: 100%; 
  border: none; 
  border-radius: 10px; 
  background: linear-gradient(135deg, #111827 0%, #1f2937 100%); 
  color: #fff; 
  padding: 14px 20px; 
  cursor: pointer; 
  margin-top: 20px; 
  transition: all 0.3s ease;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.order-btn:hover { 
  background: linear-gradient(135deg, #d4af64 0%, #b8860b 100%); 
  color: #0a0806; 
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 100, 0.4);
}
.order-btn:disabled { 
  background: #9ca3af; 
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
.hint { color: #6b7280; font-size: 13px; margin-top: 14px; text-align: center; }
.login-link { color: #d4af64; text-decoration: underline; font-weight: 500; }
.login-link:hover { color: #b8860b; }
.empty-state { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  padding: 80px 20px; 
  text-align: center;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
}
.empty-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; max-width: 400px; }
.empty-icon { font-size: 64px; color: #d4af64; margin-bottom: 24px; line-height: 1; opacity: 0.8; }
.empty-title { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 600; color: #111827; margin: 0 0 12px; }
.empty-text { color: #6b7280; font-size: 15px; margin: 0 0 32px; line-height: 1.6; }
.empty-cta { 
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px; 
  background: linear-gradient(135deg, #111827 0%, #1f2937 100%); 
  color: #fff; 
  border-radius: 10px; 
  text-decoration: none; 
  font-size: 15px; 
  font-weight: 500; 
  transition: all 0.3s ease;
}
.empty-cta:hover { 
  background: linear-gradient(135deg, #d4af64 0%, #b8860b 100%); 
  color: #0a0806; 
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 100, 0.4);
}
@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
  .summary { position: static; }
}
@media (max-width: 640px) {
  .cart-page { padding: 18px 10px; }
  .top h1 { font-size: 20px; }
  .summary { padding: 18px; }
  .layout { gap: 16px; }
}
</style>
