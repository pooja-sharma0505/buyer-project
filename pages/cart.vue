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
              <svg class="empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
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

          <!-- Coupon section -->
          <div class="coupon-section">
            <div class="coupon-input-row">
              <input
                v-model="couponCode"
                type="text"
                placeholder="Coupon code"
                class="coupon-input"
                @keyup.enter="applyCoupon"
                :disabled="applyingCoupon"
                aria-label="Coupon code"
              />
              <button
                class="coupon-btn"
                :class="{ applied: couponApplied }"
                :disabled="applyingCoupon || couponApplied"
                @click="couponApplied ? removeCoupon : applyCoupon"
              >
                {{ applyingCoupon ? '...' : (couponApplied ? 'Remove' : 'Apply') }}
              </button>
            </div>
            <p v-if="couponError" class="coupon-error">{{ couponError }}</p>
            <p v-if="couponApplied" class="coupon-success">Coupon applied! {{ formatPrice(couponDiscount) }} off</p>
          </div>

          <div v-if="couponDiscount > 0" class="row discount">
            <span>Discount</span>
            <strong>-{{ formatPrice(couponDiscount) }}</strong>
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
const { items: displayItems, updateQty, removeFromCart, itemCount: totalQty, subtotal, isHydrated } = useCart()

const tax = computed(() => Number(subtotal.value || 0) * 0.18)
const total = computed(() => Number(subtotal.value || 0) + tax.value - couponDiscount.value)

// Coupon state
const couponCode = ref('')
const couponApplied = ref(false)
const couponDiscount = ref(0)
const couponError = ref('')
const applyingCoupon = ref(false)

// Simple coupon validation (in production, this would be an API call)
const validCoupons = {
  'WELCOME10': { type: 'percent', value: 10, maxDiscount: 5000 },
  'SAVE500': { type: 'fixed', value: 500 },
  'LUXURY20': { type: 'percent', value: 20, maxDiscount: 10000 },
  'FREESHIP': { type: 'fixed', value: 0, freeShipping: true }
}

async function applyCoupon() {
  if (!couponCode.value.trim() || applyingCoupon.value) return
  if (couponApplied.value) return

  applyingCoupon.value = true
  couponError.value = ''

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const code = couponCode.value.trim().toUpperCase()
  const coupon = validCoupons[code]

  if (!coupon) {
    couponError.value = 'Invalid or expired coupon code'
    applyingCoupon.value = false
    return
  }

  let discount = 0
  const sub = Number(subtotal.value || 0)

  if (coupon.type === 'percent') {
    discount = Math.round(sub * (coupon.value / 100))
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount)
    }
  } else if (coupon.type === 'fixed') {
    discount = Math.min(coupon.value, sub)
  }

  couponDiscount.value = discount
  couponApplied.value = true
  couponCode.value = code
  applyingCoupon.value = false

  const toast = useToast()
  toast.success(`Coupon "${code}" applied! Saved ${formatPrice(discount)}`)
}

function removeCoupon() {
  couponApplied.value = false
  couponDiscount.value = 0
  couponCode.value = ''
  couponError.value = ''

  const toast = useToast()
  toast.info('Coupon removed')
}

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
.row.discount { color: #15803d; }
.row.total { border-top: 2px solid #e5e7eb; padding-top: 16px; margin-top: 16px; color: #111827; font-weight: 600; font-size: 16px; }

.coupon-section {
  margin: 16px 0;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}
.coupon-input-row {
  display: flex;
  gap: 8px;
}
.coupon-input {
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font: inherit;
  font-size: 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.coupon-input:focus {
  border-color: #d4af64;
  outline: none;
  box-shadow: 0 0 0 3px rgba(212,175,100,0.15);
}
.coupon-btn {
  white-space: nowrap;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}
.coupon-btn:not(.applied) {
  background: #111827;
  color: #fff;
  border-color: #111827;
}
.coupon-btn:not(.applied):hover:not(:disabled) {
  background: #d4af64;
  color: #0a0806;
  border-color: #d4af64;
}
.coupon-btn.applied {
  background: #fff;
  color: #374151;
  border-color: #d1d5db;
}
.coupon-btn.applied:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #d4af64;
  color: #d4af64;
}
.coupon-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.coupon-error {
  margin: 8px 0 0;
  font-size: 12px;
  color: #dc2626;
}
.coupon-success {
  margin: 8px 0 0;
  font-size: 12px;
  color: #15803d;
}

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
.empty-icon { color: #d4af64; margin-bottom: 24px; line-height: 1; opacity: 0.8; }
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
  .coupon-input-row { flex-direction: column; }
  .coupon-btn { width: 100%; }
}
</style>