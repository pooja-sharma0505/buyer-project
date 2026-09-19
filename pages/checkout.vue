<template>
  <div class="checkout-page">
    <div class="container">
      <div class="top">
        <NuxtLink to="/cart">← Back to Cart</NuxtLink>
        <h1>Checkout</h1>
      </div>

      <div v-if="!items.length" class="empty-state">
        <div class="empty-wrap">
          <svg class="empty-icon" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <h2 class="empty-title">Your cart is empty</h2>
          <p class="empty-text">Add products to your cart before checking out.</p>
          <NuxtLink to="/" class="empty-cta">Continue Shopping</NuxtLink>
        </div>
      </div>

      <div v-else>
        <!-- Stepper Navigation -->
        <div class="stepper">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="step"
            :class="{ active: currentStep >= index, completed: currentStep > index }"
          >
            <div class="step-circle" :class="{ active: currentStep >= index, completed: currentStep > index }">
              <span v-if="currentStep > index" class="check-icon">✓</span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span class="step-label">{{ step.label }}</span>
            <div v-if="index < steps.length - 1" class="step-line" :class="{ active: currentStep > index }"></div>
          </div>
        </div>

        <!-- Step 1: Address -->
        <div v-if="currentStep === 0" class="checkout-step">
          <h2 class="step-title">Shipping Address</h2>
          <form @submit.prevent="nextStep">
            <div class="address-section">
              <div class="section-header">
                <h3>Select Address</h3>
                <button type="button" class="btn-link" @click="showAddressForm = true">
                  + Add New Address
                </button>
              </div>

              <div v-if="savedAddresses.length" class="address-cards">
                <label
                  v-for="addr in savedAddresses"
                  :key="addr.id"
                  class="address-card"
                  :class="{ selected: selectedAddressId === addr.id }"
                >
                  <input
                    type="radio"
                    name="address"
                    :value="addr.id"
                    v-model="selectedAddressId"
                    class="address-radio"
                  />
                  <div class="address-info">
                    <p class="address-name">{{ addr.fullName }}</p>
                    <p class="address-details">{{ formatAddress(addr) }}</p>
                    <span v-if="addr.isDefault" class="default-badge">Default</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- New Address Form -->
            <div v-if="showAddressForm" class="address-form-section">
              <h3>{{ editingAddress ? 'Edit Address' : 'Add New Address' }}</h3>
              <form @submit.prevent="saveAddress">
                <div class="field-row">
                  <div class="field">
                    <label for="fullName">Full Name</label>
                    <input id="fullName" v-model.trim="addressForm.fullName" type="text" placeholder="Full name" required />
                  </div>
                  <div class="field">
                    <label for="phone">Phone</label>
                    <input id="phone" v-model.trim="addressForm.phone" type="tel" inputmode="numeric" placeholder="Phone number" required />
                  </div>
                </div>
                <div class="field">
                  <label for="addressLine1">Address Line 1</label>
                  <input id="addressLine1" v-model.trim="addressForm.addressLine1" type="text" placeholder="Street address, building, apartment" required />
                </div>
                <div class="field">
                  <label for="addressLine2">Address Line 2 (Optional)</label>
                  <input id="addressLine2" v-model.trim="addressForm.addressLine2" type="text" placeholder="Floor, suite, landmark" />
                </div>
                <div class="field-row">
                  <div class="field">
                    <label for="city">City</label>
                    <input id="city" v-model.trim="addressForm.city" type="text" placeholder="City" required />
                  </div>
                  <div class="field">
                    <label for="state">State</label>
                    <input id="state" v-model.trim="addressForm.state" type="text" placeholder="State" required />
                  </div>
                  <div class="field">
                    <label for="zip">ZIP Code</label>
                    <input id="zip" v-model.trim="addressForm.zip" type="text" placeholder="ZIP" required />
                  </div>
                </div>
                <div class="field-row">
                  <div class="field">
                    <label for="country">Country</label>
                    <input id="country" v-model.trim="addressForm.country" type="text" placeholder="Country" required />
                  </div>
                </div>
                <div class="field checkbox-field">
                  <label class="checkbox-wrapper">
                    <input type="checkbox" v-model="addressForm.isDefault" />
                    <span>Set as default address</span>
                  </label>
                </div>
                <div class="form-actions">
                  <button type="button" class="btn-secondary" @click="cancelAddressForm">Cancel</button>
                  <button type="submit" class="btn-primary">{{ editingAddress ? 'Update Address' : 'Save Address' }}</button>
                </div>
              </form>
            </div>

            <button type="submit" class="btn-primary btn-continue" :disabled="!selectedAddressId && !showAddressForm">
              Continue to Payment
            </button>
          </form>
        </div>

        <!-- Step 2: Payment -->
        <div v-if="currentStep === 1" class="checkout-step">
          <h2 class="step-title">Payment Method</h2>

          <div class="payment-options">
            <label
              v-for="method in paymentMethods"
              :key="method.id"
              class="payment-option"
              :class="{ selected: selectedPaymentMethod === method.id }"
            >
              <input
                type="radio"
                name="payment"
                :value="method.id"
                v-model="selectedPaymentMethod"
                class="payment-radio"
              />
              <div class="payment-info">
                <div class="payment-icon" :class="method.icon">
                  <component :is="method.iconComponent" />
                </div>
                <div class="payment-details">
                  <span class="payment-name">{{ method.name }}</span>
                  <span v-if="method.details" class="payment-desc">{{ method.details }}</span>
                </div>
              </div>
              <div class="payment-check" v-if="selectedPaymentMethod === method.id">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </label>
          </div>

          <!-- Card details form (shown when card payment selected) -->
          <div v-if="selectedPaymentMethod === 'card'" class="card-form">
            <h3>Card Details</h3>
            <form @submit.prevent="nextStep">
              <div class="field">
                <label for="cardName">Name on Card</label>
                <input id="cardName" v-model.trim="cardForm.name" type="text" placeholder="As shown on card" required />
              </div>
              <div class="field">
                <label for="cardNumber">Card Number</label>
                <input
                  id="cardNumber"
                  v-model="cardForm.number"
                  type="text"
                  inputmode="numeric"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  @input="formatCardNumber"
                  required
                />
              </div>
              <div class="field-row">
                <div class="field">
                  <label for="cardExpiry">Expiry (MM/YY)</label>
                  <input
                    id="cardExpiry"
                    v-model="cardForm.expiry"
                    type="text"
                    inputmode="numeric"
                    placeholder="MM/YY"
                    maxlength="5"
                    @input="formatCardExpiry"
                    required
                  />
                </div>
                <div class="field">
                  <label for="cardCvv">CVV</label>
                  <input
                    id="cardCvv"
                    v-model="cardForm.cvv"
                    type="text"
                    inputmode="numeric"
                    placeholder="123"
                    maxlength="4"
                    required
                  />
                </div>
              </div>
              <p class="card-secure-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Your payment details are encrypted and secure. We never store full card numbers.
              </p>
              <div class="form-actions">
                <button type="button" class="btn-secondary" @click="prevStep">Back</button>
                <button type="submit" class="btn-primary">Continue to Review</button>
              </div>
            </form>
          </div>

          <!-- UPI / Wallet - no additional form needed -->
          <div v-if="selectedPaymentMethod !== 'card'" class="payment-note">
            <p>You will be redirected to complete the payment on the next step.</p>
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="prevStep">Back</button>
              <button type="button" class="btn-primary" @click="nextStep">Continue to Review</button>
            </div>
          </div>
        </div>

        <!-- Step 3: Review -->
        <div v-if="currentStep === 2" class="checkout-step">
          <h2 class="step-title">Review Order</h2>

          <div class="review-section">
            <h3>Shipping Address</h3>
            <p v-if="selectedAddress">{{ formatAddress(selectedAddress) }}</p>
            <button type="button" class="btn-link" @click="currentStep = 0">Change</button>
          </div>

          <div class="review-section">
            <h3>Payment Method</h3>
            <p>{{ getPaymentMethodLabel(selectedPaymentMethod) }}</p>
            <button type="button" class="btn-link" @click="currentStep = 1">Change</button>
          </div>

          <div class="review-section">
            <h3>Order Items</h3>
            <div class="review-items">
              <div v-for="item in items" :key="item.id" class="review-item">
                <div class="review-item-info">
                  <span class="review-item-name">{{ item.title }} × {{ item.qty }}</span>
                  <span class="review-item-price">{{ formatPrice(item.price * item.qty) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="review-totals">
            <div class="review-row">
              <span>Subtotal</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div v-if="couponDiscount > 0" class="review-row discount">
              <span>Discount</span>
              <span>-{{ formatPrice(couponDiscount) }}</span>
            </div>
            <div class="review-row">
              <span>Tax (18%)</span>
              <span>{{ formatPrice(tax) }}</span>
            </div>
            <div class="review-row">
              <span>Shipping</span>
              <span>{{ shippingCost > 0 ? formatPrice(shippingCost) : 'Free' }}</span>
            </div>
            <div class="review-row total">
              <span>Total</span>
              <span>{{ formatPrice(grandTotal) }}</span>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="prevStep">Back</button>
            <button type="button" class="btn-primary btn-place-order" @click="placeOrder" :disabled="placingOrder">
              {{ placingOrder ? 'Placing Order...' : 'Place Order' }}
            </button>
          </div>
        </div>

        <!-- Step 4: Confirmation -->
        <div v-if="currentStep === 3" class="checkout-step confirmation-step">
          <div class="confirmation-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h1 class="confirmation-title">Order Placed Successfully!</h1>
          <p class="confirmation-subtitle">Thank you for your order.</p>

          <div class="order-confirmation-details">
            <div class="confirmation-row">
              <span>Order ID</span>
              <strong>{{ orderId }}</strong>
            </div>
            <div class="confirmation-row">
              <span>Total Paid</span>
              <strong>{{ formatPrice(grandTotal) }}</strong>
            </div>
            <div class="confirmation-row">
              <span>Estimated Delivery</span>
              <strong>{{ estimatedDelivery }}</strong>
            </div>
          </div>

          <div class="confirmation-actions">
            <NuxtLink to="/orders" class="btn-primary">View My Orders</NuxtLink>
            <NuxtLink to="/" class="btn-secondary">Continue Shopping</NuxtLink>
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

const { items, subtotal, clearCart, couponDiscount } = useCart()
const { isLoggedIn, user } = useAuth()
const { formatPrice } = useFormatPrice()
const { success: toastSuccess, error: toastError } = useToast()
const router = useRouter()

const steps = [
  { id: 'address', label: 'Address' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
  { id: 'confirmation', label: 'Confirmation' }
]

const currentStep = ref(0)
const placingOrder = ref(false)
const orderId = ref('')

// Address state
const savedAddresses = ref([])
const selectedAddressId = ref(null)
const showAddressForm = ref(false)
const editingAddress = ref(false)
const addressForm = ref({
  id: null,
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zip: '',
  country: 'India',
  isDefault: false
})

// Payment state
const selectedPaymentMethod = ref('card')
const paymentMethods = [
  { id: 'card', name: 'Credit / Debit Card', details: 'Visa, Mastercard, RuPay', icon: 'card-icon', iconComponent: 'CardIcon' },
  { id: 'upi', name: 'UPI', details: 'Google Pay, PhonePe, Paytm', icon: 'upi-icon', iconComponent: 'UpiIcon' },
  { id: 'netbanking', name: 'Net Banking', details: 'All major banks', icon: 'bank-icon', iconComponent: 'BankIcon' },
  { id: 'wallet', name: 'Wallet', details: 'LUMIÈRE Wallet balance', icon: 'wallet-icon', iconComponent: 'WalletIcon' }
]

const cardForm = ref({
  name: '',
  number: '',
  expiry: '',
  cvv: ''
})

// Computed
const tax = computed(() => Math.round((Number(subtotal.value || 0) - couponDiscount.value) * 0.18))
const shippingCost = computed(() => (Number(subtotal.value || 0) - couponDiscount.value) >= 5000 ? 0 : 99)
const grandTotal = computed(() => Number(subtotal.value || 0) - couponDiscount.value + tax.value + shippingCost.value)

const selectedAddress = computed(() => {
  return savedAddresses.value.find(a => a.id === selectedAddressId.value)
})

async function fetchAddresses() {
  try {
    const data = await $fetch('/api/addresses')
    savedAddresses.value = data.addresses || []
    // Select default address
    const defaultAddr = savedAddresses.value.find(a => a.isDefault)
    if (defaultAddr) selectedAddressId.value = defaultAddr.id
    else if (savedAddresses.value.length) selectedAddressId.value = savedAddresses.value[0].id
  } catch {
    // Ignore - user may not have addresses yet
  }
}

async function fetchWalletBalance() {
  // In a real app, this would fetch from an API
  // For now, we'll use a mock value
}

onMounted(async () => {
  if (!isLoggedIn.value) {
    await navigateTo('/login?redirect=/checkout')
    return
  }
  await fetchAddresses()
  // Pre-fill from user profile
  if (user.value?.name && !addressForm.value.fullName) {
    addressForm.value.fullName = user.value.name
  }
})

function nextStep() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function formatAddress(addr) {
  if (!addr) return ''
  const parts = [
    addr.fullName,
    addr.addressLine1,
    addr.addressLine2,
    `${addr.city}, ${addr.state} ${addr.zip}`,
    addr.country
  ].filter(Boolean)
  return parts.join(', ')
}

function getPaymentMethodLabel(id) {
  const method = paymentMethods.find(m => m.id === id)
  return method ? method.name : id
}

function formatCardNumber(e) {
  let val = e.target.value.replace(/\D/g, '').slice(0, 16)
  val = val.replace(/(\d{4})/g, '$1 ').trim()
  cardForm.value.number = val
}

function formatCardExpiry(e) {
  let val = e.target.value.replace(/\D/g, '').slice(0, 4)
  if (val.length >= 2) {
    val = val.slice(0, 2) + '/' + val.slice(2)
  }
  cardForm.value.expiry = val
}

async function saveAddress() {
  try {
    const payload = { ...addressForm.value }
    if (editingAddress.value) {
      await $fetch(`/api/addresses/${payload.id}`, { method: 'PUT', body: payload })
      toastSuccess('Address updated')
    } else {
      const result = await $fetch('/api/addresses', { method: 'POST', body: payload })
      toastSuccess('Address added')
      selectedAddressId.value = result.id
    }
    await fetchAddresses()
    cancelAddressForm()
  } catch (err) {
    toastError(err.data?.message || 'Failed to save address')
  }
}

function cancelAddressForm() {
  showAddressForm.value = false
  editingAddress.value = false
  addressForm.value = {
    id: null,
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    isDefault: false
  }
}

const placeOrder = async () => {
  if (!selectedAddressId.value) {
    toastError('Please select a shipping address')
    return
  }
  if (!items.value.length) return

  placingOrder.value = true
  try {
    // Generate idempotency key
    const idempotencyKey = `order_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`

    const result = await $fetch('/api/orders', {
      method: 'POST',
      headers: { 'Idempotency-Key': idempotencyKey },
      body: {
        items: items.value.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          qty: item.qty
        })),
        fullName: selectedAddress.value.fullName,
        phone: selectedAddress.value.phone,
        address: `${selectedAddress.value.addressLine1}${selectedAddress.value.addressLine2 ? ', ' + selectedAddress.value.addressLine2 : ''}`,
        city: selectedAddress.value.city,
        zip: selectedAddress.value.zip
      }
    })

    clearCart()
    orderId.value = result.orderId
    currentStep.value = 3 // Confirmation
    toastSuccess('Order placed successfully!')
  } catch (err) {
    toastError(err.data?.message || err.message || 'Failed to place order')
  } finally {
    placingOrder.value = false
  }
}

const estimatedDelivery = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + 5)
  return date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })
})

// Card icons
const CardIcon = {
  template: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="22" height="14" rx="2"/><line x1="1" y1="5" x2="23" y2="5"/><line x1="7" y1="11" x2="17" y2="11"/></svg>`
}
const UpiIcon = {
  template: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="5"/><path d="M12 13v3"/></svg>`
}
const BankIcon = {
  template: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5"/><path d="M6 11h12"/></svg>`
}
const WalletIcon = {
  template: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12V7H5a2 2 0 0 1 0-4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1 0-4h16"/></svg>`
}
</script>

<style scoped>
.checkout-page { min-height: 100vh; background: #f8fafc; padding: 28px 16px; }
.container { max-width: 900px; margin: 0 auto; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.top a { color: #d4af64; text-decoration: none; font-weight: 500; }
.top a:hover { color: #b8860b; }
.top h1 { margin: 0; font-size: 26px; color: #111827; font-family: 'Cormorant Garamond', serif; font-weight: 600; }

/* Stepper */
.stepper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  position: relative;
}
.stepper::before {
  content: '';
  position: absolute;
  top: 16px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: #e5e7eb;
  z-index: 0;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  position: relative;
  z-index: 1;
}
.step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}
.step-circle.active {
  background: #d4af64;
  color: #0a0806;
  border-color: #d4af64;
}
.step-circle.completed {
  background: #15803d;
  color: #fff;
  border-color: #15803d;
}
.check-icon { font-size: 14px; }
.step-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
}
.step.active .step-label,
.step.completed .step-label {
  color: #111827;
}
.step-line {
  position: absolute;
  top: 16px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: #e5e7eb;
  z-index: -1;
}
.step-line.active {
  background: #d4af64;
}

/* Steps */
.checkout-step { animation: fadeIn 0.3s ease; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.step-title { margin: 0 0 24px; font-size: 20px; color: #111827; font-family: 'Cormorant Garamond', serif; }

/* Address Section */
.address-section { margin-bottom: 24px; }
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.section-header h3 { margin: 0; font-size: 15px; color: #374151; }
.btn-link {
  background: none;
  border: none;
  padding: 0;
  color: #d4af64;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
}
.btn-link:hover { color: #b8860b; }

.address-cards { display: flex; flex-direction: column; gap: 12px; }
.address-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fff;
}
.address-card:hover { border-color: #d4af64; }
.address-card.selected {
  border-color: #d4af64;
  background: #fefbf3;
}
.address-radio { width: 18px; height: 18px; accent-color: #d4af64; flex-shrink: 0; }
.address-info { flex: 1; min-width: 0; }
.address-name { margin: 0 0 4px; font-weight: 600; color: #111827; font-size: 14px; }
.address-details { margin: 0; font-size: 13px; color: #6b7280; line-height: 1.5; }
.default-badge {
  font-size: 10px;
  font-weight: 600;
  color: #d4af64;
  background: #fef3e2;
  padding: 2px 8px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Address Form */
.address-form-section {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}
.address-form-section h3 { margin: 0 0 16px; font-size: 16px; color: #111827; }
.address-form-section .field { margin-bottom: 16px; }
.address-form-section .field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.address-form-section .field-row .field { margin-bottom: 0; }
.address-form-section label { display: block; margin-bottom: 6px; font-size: 13px; color: #374151; font-weight: 500; }
.address-form-section input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font: inherit;
  box-sizing: border-box;
}
.address-form-section input:focus {
  border-color: #d4af64;
  outline: none;
  box-shadow: 0 0 0 3px rgba(212,175,100,0.15);
}
.checkbox-field { margin-top: 8px; }
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}
.btn-primary {
  background: #111827;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}
.btn-primary:hover { background: #d4af64; color: #0a0806; }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-secondary {
  background: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-secondary:hover { background: #f8fafc; border-color: #d4af64; color: #d4af64; }

/* Payment Options */
.payment-options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
.payment-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fff;
}
.payment-option:hover { border-color: #d4af64; }
.payment-option.selected {
  border-color: #d4af64;
  background: #fefbf3;
}
.payment-radio { width: 18px; height: 18px; accent-color: #d4af64; flex-shrink: 0; }
.payment-info { display: flex; align-items: center; gap: 12px; flex: 1; }
.payment-icon {
  width: 40px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: #fff;
}
.card-icon { background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%); }
.upi-icon { background: linear-gradient(135deg, #34a853 0%, #0f9d58 100%); }
.bank-icon { background: linear-gradient(135deg, #ea4335 0%, #fbbc05 100%); }
.wallet-icon { background: linear-gradient(135deg, #f47504 0%, #d4af64 100%); }
.payment-name { font-weight: 500; color: #111827; }
.payment-desc { font-size: 12px; color: #6b7280; }
.payment-check { color: #d4af64; flex-shrink: 0; }

.card-form { background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; }
.card-form h3 { margin: 0 0 16px; font-size: 16px; color: #111827; }
.card-form .field { margin-bottom: 16px; }
.card-form .field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.card-form label { display: block; margin-bottom: 6px; font-size: 13px; color: #374151; font-weight: 500; }
.card-form input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font: inherit;
  box-sizing: border-box;
}
.card-form input:focus {
  border-color: #d4af64;
  outline: none;
  box-shadow: 0 0 0 3px rgba(212,175,100,0.15);
}
.card-secure-note {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0 0;
  padding: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
  color: #6b7280;
}
.payment-note {
  padding: 20px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  text-align: center;
  color: #6b7280;
}
.payment-note .form-actions { margin-top: 16px; }

/* Review */
.review-section { margin-bottom: 24px; padding: 20px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; }
.review-section h3 { margin: 0 0 12px; font-size: 15px; color: #374151; }
.review-section .btn-link { font-size: 13px; }
.review-items { display: flex; flex-direction: column; gap: 8px; }
.review-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}
.review-item:last-child { border-bottom: none; }
.review-item-name { font-size: 13px; color: #4b5563; }
.review-item-price { font-weight: 600; color: #111827; }

.review-totals {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}
.review-row { display: flex; justify-content: space-between; margin-bottom: 10px; color: #4b5563; font-size: 14px; }
.review-row.discount { color: #15803d; }
.review-row.total { border-top: 2px solid #e5e7eb; padding-top: 12px; margin-top: 12px; color: #111827; font-weight: 600; font-size: 16px; }

/* Confirmation */
.confirmation-step { text-align: center; padding: 40px 20px; }
.confirmation-icon { color: #15803d; margin-bottom: 20px; }
.confirmation-title { margin: 0 0 8px; font-size: 28px; color: #111827; font-family: 'Cormorant Garamond', serif; }
.confirmation-subtitle { color: #6b7280; margin-bottom: 32px; }
.order-confirmation-details {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin: 0 auto 32px;
  max-width: 400px;
  text-align: left;
}
.confirmation-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; color: #4b5563; }
.confirmation-row:last-child { margin-bottom: 0; }
.confirmation-row strong { color: #111827; }
.confirmation-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
.confirmation-actions .btn-primary,
.confirmation-actions .btn-secondary { padding: 14px 28px; font-size: 15px; }

/* Empty state */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; text-align: center; }
.empty-wrap { max-width: 400px; }
.empty-icon { color: #d4af64; margin-bottom: 24px; opacity: 0.8; }
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
.empty-cta:hover { background: linear-gradient(135deg, #d4af64 0%, #b8860b 100%); color: #0a0806; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(212, 175, 100, 0.4); }

@media (max-width: 640px) {
  .checkout-page { padding: 18px 10px; }
  .top h1 { font-size: 20px; }
  .stepper { gap: 8px; }
  .step-label { font-size: 11px; }
  .step-circle { width: 28px; height: 28px; font-size: 12px; }
  .address-form-section .field-row,
  .card-form .field-row { grid-template-columns: 1fr; }
  .confirmation-actions { flex-direction: column; }
  .confirmation-actions .btn-primary,
  .confirmation-actions .btn-secondary { width: 100%; }
}
</style>