<template>
  <div class="checkout-page">
    <div class="container">
      <div class="top">
        <NuxtLink to="/cart">← Back to Cart</NuxtLink>
        <h1>Checkout</h1>
      </div>

      <div v-if="!items.length" class="empty-state">
        <div class="empty-wrap">
          <i class="bi bi-bag-x-fill empty-icon"></i>
          <h2 class="empty-title">Your cart is empty</h2>
          <p class="empty-text">Add products to your cart before checking out.</p>
          <NuxtLink to="/" class="empty-cta">Continue Shopping</NuxtLink>
        </div>
      </div>

      <div v-else class="layout">
        <div class="form-section">
          <h2>Shipping Details</h2>
          <form @submit.prevent="placeOrder">
            <div class="field">
              <label for="fullName">Full Name</label>
              <input id="fullName" v-model.trim="form.fullName" type="text" placeholder="Enter your full name" required />
            </div>
            <div class="field">
              <label for="phone">Phone Number</label>
              <input id="phone" v-model.trim="form.phone" type="tel" inputmode="numeric" placeholder="10–15 digits" required />
            </div>
            <div class="field">
              <label for="address">Address</label>
              <textarea id="address" v-model.trim="form.address" rows="3" placeholder="Street address" required></textarea>
            </div>
            <div class="field-row">
              <div class="field">
                <label for="city">City</label>
                <input id="city" v-model.trim="form.city" type="text" placeholder="City" required />
              </div>
              <div class="field">
                <label for="zip">ZIP Code</label>
                <input id="zip" v-model.trim="form.zip" type="text" placeholder="ZIP" required />
              </div>
            </div>
            <button type="submit" class="order-btn" :disabled="placing">
              {{ placing ? 'Placing order…' : 'Place Order' }}
            </button>
            <p v-if="error" class="error">{{ error }}</p>
          </form>
        </div>

        <div class="summary">
          <h2>Order Summary</h2>
          <div v-for="item in items" :key="item.id" class="summary-item">
            <span class="item-name">{{ item.title }} × {{ item.qty }}</span>
            <span class="item-total">{{ formatPrice(item.price * item.qty) }}</span>
          </div>
          <div class="summary-row">
            <span>Subtotal</span>
            <strong>{{ formatPrice(subtotal) }}</strong>
          </div>
          <div class="summary-row">
            <span>Tax (18%)</span>
            <strong>{{ formatPrice(tax) }}</strong>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <strong>{{ formatPrice(total) }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Checkout' })
useSeoMeta({
  ogTitle: 'Checkout - LUMIÈRE',
  ogDescription: 'Complete your purchase at LUMIÈRE.',
  ogImage: '/og-image.svg',
  ogType: 'website'
})

definePageMeta({
  middleware: 'auth'
})

const { items, subtotal, clearCart } = useCart()
const { isLoggedIn, user } = useAuth()
const { formatPrice } = useFormatPrice()
const { success: toastSuccess } = useToast()
const router = useRouter()

const form = ref({
  fullName: '',
  phone: '',
  address: '',
  city: '',
  zip: ''
})

const placing = ref(false)
const error = ref('')

const tax = computed(() => Number(subtotal.value || 0) * 0.18)
const total = computed(() => Number(subtotal.value || 0) + tax.value)

onMounted(() => {
  if (!isLoggedIn.value) {
    navigateTo('/login')
  }
  if (user.value?.name) {
    form.value.fullName = user.value.name
  }
})

const placeOrder = async () => {
  error.value = ''
  if (!items.value.length) return

  placing.value = true
  try {
    const result = await $fetch('/api/orders', {
      method: 'POST',
      body: {
        items: items.value.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          qty: item.qty
        })),
        fullName: form.value.fullName,
        phone: form.value.phone,
        address: form.value.address,
        city: form.value.city,
        zip: form.value.zip
      }
    })
    clearCart()
    toastSuccess('Order placed successfully')
    await navigateTo(`/order-success?orderId=${result.orderId}`)
  } catch (err) {
    error.value = err.data?.message || err.message || 'Failed to place order'
  } finally {
    placing.value = false
  }
}
</script>

<style scoped>
.checkout-page { min-height: 100vh; background: #f8fafc; padding: 28px 16px; }
.container { max-width: 1100px; margin: 0 auto; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
.top a { color: #d4af64; text-decoration: none; }
.top a:hover { color: #b8860b; text-decoration: underline; }
.top h1 { margin: 0; font-size: 22px; color: #111827; font-family: 'Cormorant Garamond', serif; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; text-align: center; }
.empty-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; max-width: 400px; }
.empty-icon { font-size: 56px; color: #9ca3af; margin-bottom: 24px; line-height: 1; }
.empty-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; color: #111827; margin: 0 0 10px; }
.empty-text { color: #6b7280; font-size: 15px; margin: 0 0 28px; line-height: 1.5; }
.empty-cta { display: inline-block; padding: 14px 32px; background: #111827; color: #fff; border-radius: 10px; text-decoration: none; font-size: 15px; font-weight: 500; transition: background 0.2s ease; }
.empty-cta:hover { background: #d4af64; color: #0a0806; }
.layout { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px; }
.form-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }
.form-section h2 { margin-top: 0; color: #111827; }
.field { display: grid; gap: 6px; margin-bottom: 14px; }
.field label { font-size: 13px; color: #374151; font-weight: 500; }
.field input, .field textarea { border: 1px solid #d1d5db; border-radius: 8px; padding: 10px 12px; font: inherit; width: 100%; box-sizing: border-box; }
.field input:focus, .field textarea:focus { border-color: #d4af64; outline: none; box-shadow: 0 0 0 3px rgba(212,175,100,0.15); }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.order-btn { width: 100%; border: none; border-radius: 8px; background: #111827; color: #fff; padding: 12px; cursor: pointer; font-size: 14px; font-weight: 500; transition: background 0.2s ease; margin-top: 8px; }
.order-btn:hover { background: #d4af64; color: #0a0806; }
.order-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.error { color: #dc2626; margin-top: 10px; }
.summary { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; height: fit-content; }
.summary h2 { margin-top: 0; color: #111827; }
.summary-item { display: flex; justify-content: space-between; font-size: 13px; color: #4b5563; margin-bottom: 8px; }
.summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; color: #4b5563; }
.summary-row.total { border-top: 1px solid #e5e7eb; padding-top: 10px; margin-top: 10px; color: #111827; }
@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .checkout-page { padding: 18px 10px; }
  .field-row { grid-template-columns: 1fr; }
}
</style>
