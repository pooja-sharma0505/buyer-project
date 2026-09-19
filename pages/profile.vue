<template>
  <div class="profile-page">
    <div class="container">
      <div class="top">
        <NuxtLink to="/">← Continue Shopping</NuxtLink>
        <h1>My Profile</h1>
      </div>

      <div v-if="!isLoggedIn" class="not-logged-in">
        <p>Please <NuxtLink to="/login?redirect=/profile" class="link">sign in</NuxtLink> to view your profile.</p>
      </div>

      <div v-else class="profile-tabs">
        <div class="tab-nav">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-btn"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="tab-content">
          <!-- Personal Info Tab -->
          <div v-if="activeTab === 'personal'" class="tab-panel">
            <div class="profile-section">
              <h2>Personal Information</h2>
              <form @submit.prevent="savePersonalInfo">
                <div class="field-row">
                  <div class="field">
                    <label for="profile-name">Name</label>
                    <input id="profile-name" v-model.trim="profileForm.name" type="text" required />
                  </div>
                  <div class="field">
                    <label for="profile-phone">Phone</label>
                    <input id="profile-phone" v-model.trim="profileForm.phone" type="tel" inputmode="numeric" required />
                  </div>
                </div>
                <div class="field">
                  <label for="profile-email">Email</label>
                  <input id="profile-email" v-model.trim="profileForm.email" type="email" placeholder="Optional" />
                </div>
                <p v-if="profileForm.email !== user?.email" class="verification-note">
                  Changing your email will require verification before it takes effect.
                </p>
                <div class="field checkbox-field">
                  <label class="checkbox-wrapper">
                    <input type="checkbox" v-model="profileForm.notifications" />
                    <span>Receive promotional emails & SMS</span>
                  </label>
                </div>
                <button type="submit" class="btn-primary" :disabled="savingProfile">{{ savingProfile ? 'Saving...' : 'Save Changes' }}</button>
              </form>
            </div>

            <div class="profile-section danger-zone">
              <h2>Security</h2>
              <div class="security-item">
                <div>
                  <h3>Change Password</h3>
                  <p>Update your password to keep your account secure.</p>
                </div>
                <NuxtLink to="/change-password" class="btn-secondary">Change Password</NuxtLink>
              </div>
              <div class="security-item">
                <div>
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security to your account.</p>
                </div>
                <button class="btn-secondary" disabled>Coming Soon</button>
              </div>
            </div>
          </div>

          <!-- Addresses Tab -->
          <div v-if="activeTab === 'addresses'" class="tab-panel">
            <div class="profile-section">
              <div class="section-header">
                <h2>Saved Addresses</h2>
                <button type="button" class="btn-primary" @click="showAddressForm = true; editingAddress = false; resetAddressForm()">
                  + Add Address
                </button>
              </div>

              <div v-if="addresses.length === 0" class="empty-addresses">
                <p>No saved addresses yet.</p>
                <button type="button" class="btn-primary" @click="showAddressForm = true; editingAddress = false; resetAddressForm()">Add Your First Address</button>
              </div>

              <div v-else class="address-list">
                <div v-for="addr in addresses" :key="addr.id" class="address-card">
                  <div class="address-info">
                    <p class="address-name">{{ addr.fullName }}</p>
                    <p class="address-details">{{ formatAddress(addr) }}</p>
                    <span v-if="addr.isDefault" class="default-badge">Default</span>
                  </div>
                  <div class="address-actions">
                    <button type="button" class="btn-link" @click="editAddress(addr)">Edit</button>
                    <button type="button" class="btn-link danger" @click="setDefaultAddress(addr.id)" :disabled="addr.isDefault">
                      {{ addr.isDefault ? 'Default' : 'Set as Default' }}
                    </button>
                    <button type="button" class="btn-link danger" @click="deleteAddress(addr.id)">Delete</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Address Form Modal -->
            <Teleport to="body">
              <div v-if="showAddressForm" class="address-modal-overlay" @click.self="closeAddressForm">
                <div class="address-modal" role="dialog" aria-modal="true" aria-labelledby="address-modal-title">
                  <button type="button" class="modal-close" @click="closeAddressForm" aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                  <h2 id="address-modal-title" class="modal-title">{{ editingAddress ? 'Edit Address' : 'Add New Address' }}</h2>
                  <form @submit.prevent="saveAddress">
                    <div class="field-row">
                      <div class="field">
                        <label for="addr-fullName">Full Name</label>
                        <input id="addr-fullName" v-model.trim="addressForm.fullName" type="text" placeholder="Full name" required />
                      </div>
                      <div class="field">
                        <label for="addr-phone">Phone</label>
                        <input id="addr-phone" v-model.trim="addressForm.phone" type="tel" inputmode="numeric" placeholder="Phone number" required />
                      </div>
                    </div>
                    <div class="field">
                      <label for="addr-addressLine1">Address Line 1</label>
                      <input id="addr-addressLine1" v-model.trim="addressForm.addressLine1" type="text" placeholder="Street address, building, apartment" required />
                    </div>
                    <div class="field">
                      <label for="addr-addressLine2">Address Line 2 (Optional)</label>
                      <input id="addr-addressLine2" v-model.trim="addressForm.addressLine2" type="text" placeholder="Floor, suite, landmark" />
                    </div>
                    <div class="field-row">
                      <div class="field">
                        <label for="addr-city">City</label>
                        <input id="addr-city" v-model.trim="addressForm.city" type="text" placeholder="City" required />
                      </div>
                      <div class="field">
                        <label for="addr-state">State</label>
                        <input id="addr-state" v-model.trim="addressForm.state" type="text" placeholder="State" required />
                      </div>
                      <div class="field">
                        <label for="addr-zip">ZIP Code</label>
                        <input id="addr-zip" v-model.trim="addressForm.zip" type="text" placeholder="ZIP" required />
                      </div>
                    </div>
                    <div class="field-row">
                      <div class="field">
                        <label for="addr-country">Country</label>
                        <input id="addr-country" v-model.trim="addressForm.country" type="text" placeholder="Country" required />
                      </div>
                    </div>
                    <div class="field checkbox-field">
                      <label class="checkbox-wrapper">
                        <input type="checkbox" v-model="addressForm.isDefault" />
                        <span>Set as default address</span>
                      </label>
                    </div>
                    <div class="form-actions">
                      <button type="button" class="btn-secondary" @click="closeAddressForm">Cancel</button>
                      <button type="submit" class="btn-primary">{{ editingAddress ? 'Update Address' : 'Save Address' }}</button>
                    </div>
                  </form>
                </div>
              </div>
            </Teleport>
          </div>

          <!-- Wallet Tab -->
          <div v-if="activeTab === 'wallet'" class="tab-panel">
            <div class="profile-section">
              <div class="wallet-header">
                <h2>LUMIÈRE Wallet</h2>
                <span class="wallet-badge">Beta</span>
              </div>
              <div class="wallet-balance">
                <span class="balance-label">Available Balance</span>
                <span class="balance-amount">{{ formatPrice(walletBalance) }}</span>
              </div>
              <div class="wallet-actions">
                <button type="button" class="btn-primary" @click="showAddMoney = true">Add Money</button>
                <button type="button" class="btn-secondary">Transaction History</button>
              </div>

              <div class="wallet-info">
                <p>Your wallet balance can be used for instant checkout across LUMIÈRE web and mobile app.</p>
                <p>Balance is synced in real-time — changes reflect immediately everywhere.</p>
              </div>
            </div>

            <!-- Add Money Modal -->
            <Teleport to="body">
              <div v-if="showAddMoney" class="address-modal-overlay" @click.self="closeAddMoney">
                <div class="address-modal" role="dialog" aria-modal="true" aria-labelledby="add-money-title">
                  <button type="button" class="modal-close" @click="closeAddMoney" aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                  <h2 id="add-money-title" class="modal-title">Add Money to Wallet</h2>
                  <form @submit.prevent="addMoney">
                    <div class="field">
                      <label>Quick Amount</label>
                      <div class="quick-amounts">
                        <button type="button" v-for="amt in [500, 1000, 2000, 5000]" :key="amt" class="quick-amt-btn" :class="{ selected: addMoneyAmount === amt }" @click="addMoneyAmount = amt">
                          {{ formatPrice(amt) }}
                        </button>
                      </div>
                    </div>
                    <div class="field">
                      <label for="custom-amount">Or enter custom amount</label>
                      <input id="custom-amount" v-model.number="addMoneyAmount" type="number" min="100" max="50000" step="100" placeholder="Enter amount" />
                    </div>
                    <div class="field">
                      <label>Payment Method</label>
                      <select v-model="addMoneyMethod" class="form-select">
                        <option value="card">Credit / Debit Card</option>
                        <option value="upi">UPI</option>
                        <option value="netbanking">Net Banking</option>
                      </select>
                    </div>
                    <div class="form-actions">
                      <button type="button" class="btn-secondary" @click="closeAddMoney">Cancel</button>
                      <button type="submit" class="btn-primary" :disabled="addingMoney">{{ addingMoney ? 'Processing...' : `Add ${formatPrice(addMoneyAmount)}` }}</button>
                    </div>
                  </form>
                </div>
              </div>
            </Teleport>
          </div>

          <!-- Payment Methods Tab -->
          <div v-if="activeTab === 'payments'" class="tab-panel">
            <div class="profile-section">
              <div class="section-header">
                <h2>Saved Payment Methods</h2>
                <button type="button" class="btn-primary" @click="showAddPayment = true">+ Add Payment Method</button>
              </div>

              <div v-if="paymentMethods.length === 0" class="empty-payments">
                <p>No saved payment methods.</p>
                <button type="button" class="btn-primary" @click="showAddPayment = true">Add Your First Card</button>
              </div>

              <div v-else class="payment-list">
                <div v-for="pm in paymentMethods" :key="pm.id" class="payment-card">
                  <div class="payment-info">
                    <div class="payment-icon" :class="pm.type">
                      <component :is="pm.iconComponent" />
                    </div>
                    <div class="payment-details">
                      <p class="payment-name">{{ pm.name }}</p>
                      <p class="payment-meta">{{ pm.mask }} • Expires {{ pm.expiry }}</p>
                    </div>
                  </div>
                  <div class="payment-actions">
                    <button type="button" class="btn-link danger" @click="removePaymentMethod(pm.id)">Remove</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add Payment Method Modal -->
            <Teleport to="body">
              <div v-if="showAddPayment" class="address-modal-overlay" @click.self="closeAddPayment">
                <div class="address-modal" role="dialog" aria-modal="true" aria-labelledby="add-payment-title">
                  <button type="button" class="modal-close" @click="closeAddPayment" aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                  <h2 id="add-payment-title" class="modal-title">Add Payment Method</h2>
                  <form @submit.prevent="addPaymentMethod">
                    <div class="field">
                      <label for="card-name">Name on Card</label>
                      <input id="card-name" v-model.trim="newPayment.name" type="text" placeholder="As shown on card" required />
                    </div>
                    <div class="field">
                      <label for="card-number">Card Number</label>
                      <input
                        id="card-number"
                        v-model="newPayment.number"
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
                        <label for="card-expiry">Expiry (MM/YY)</label>
                        <input
                          id="card-expiry"
                          v-model="newPayment.expiry"
                          type="text"
                          inputmode="numeric"
                          placeholder="MM/YY"
                          maxlength="5"
                          @input="formatCardExpiry"
                          required
                        />
                      </div>
                      <div class="field">
                        <label for="card-cvv">CVV</label>
                        <input id="card-cvv" v-model="newPayment.cvv" type="text" inputmode="numeric" placeholder="123" maxlength="4" required />
                      </div>
                    </div>
                    <div class="field checkbox-field">
                      <label class="checkbox-wrapper">
                        <input type="checkbox" v-model="newPayment.setDefault" />
                        <span>Set as default payment method</span>
                      </label>
                    </div>
                    <p class="secure-note">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      We only store tokenized references. Full card numbers are never saved.
                    </p>
                    <div class="form-actions">
                      <button type="button" class="btn-secondary" @click="closeAddPayment">Cancel</button>
                      <button type="submit" class="btn-primary">{{ addingPayment ? 'Saving...' : 'Save Card' }}</button>
                    </div>
                  </form>
                </div>
              </div>
            </Teleport>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'My Profile' })
useSeoMeta({
  ogTitle: 'My Profile - LUMIÈRE',
  ogDescription: 'Manage your LUMIÈRE account settings.',
  ogImage: '/og-image.svg',
  ogType: 'website'
})

definePageMeta({
  middleware: 'auth'
})

const { isLoggedIn, user, updateProfile } = useAuth()
const { formatPrice } = useFormatPrice()
const { success: toastSuccess, error: toastError } = useToast()

const tabs = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'addresses', label: 'Addresses' },
  { id: 'wallet', label: 'Wallet' },
  { id: 'payments', label: 'Payment Methods' }
]

const activeTab = ref('personal')
const savingProfile = ref(false)

// Personal info form
const profileForm = ref({
  name: user.value?.name || '',
  phone: user.value?.phone || '',
  email: user.value?.email || '',
  notifications: true
})

// Address state
const addresses = ref([])
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

// Wallet state
const walletBalance = ref(0)
const showAddMoney = ref(false)
const addMoneyAmount = ref(1000)
const addMoneyMethod = ref('card')
const addingMoney = ref(false)

// Payment methods state
const paymentMethods = ref([])
const showAddPayment = ref(false)
const addingPayment = ref(false)
const newPayment = ref({
  name: '',
  number: '',
  expiry: '',
  cvv: '',
  setDefault: false
})

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    fetchAddresses(),
    fetchWalletBalance(),
    fetchPaymentMethods()
  ])
})

async function fetchAddresses() {
  try {
    const data = await $fetch('/api/addresses')
    addresses.value = data.addresses || []
  } catch {
    // Ignore
  }
}

async function fetchWalletBalance() {
  try {
    const data = await $fetch('/api/wallet/balance')
    walletBalance.value = data.balance || 0
  } catch {
    walletBalance.value = 0
  }
}

async function fetchPaymentMethods() {
  try {
    const data = await $fetch('/api/payment-methods')
    paymentMethods.value = data.methods || []
  } catch {
    paymentMethods.value = []
  }
}

// Personal info
async function savePersonalInfo() {
  savingProfile.value = true
  try {
    await updateProfile({
      name: profileForm.value.name,
      email: profileForm.value.email
    })
    toastSuccess('Profile updated successfully')
  } catch (err) {
    toastError(err.data?.message || 'Failed to update profile')
  } finally {
    savingProfile.value = false
  }
}

// Address functions
function resetAddressForm() {
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

function editAddress(addr) {
  editingAddress.value = true
  addressForm.value = { ...addr }
  showAddressForm.value = true
}

async function saveAddress() {
  try {
    if (editingAddress.value) {
      await $fetch(`/api/addresses/${addressForm.value.id}`, { method: 'PUT', body: addressForm.value })
      toastSuccess('Address updated')
    } else {
      const result = await $fetch('/api/addresses', { method: 'POST', body: addressForm.value })
      toastSuccess('Address added')
    }
    await fetchAddresses()
    closeAddressForm()
  } catch (err) {
    toastError(err.data?.message || 'Failed to save address')
  }
}

async function setDefaultAddress(id) {
  try {
    const addr = addresses.value.find(a => a.id === id)
    if (addr) {
      await $fetch(`/api/addresses/${id}`, { method: 'PUT', body: { ...addr, isDefault: true } })
      toastSuccess('Default address updated')
      await fetchAddresses()
    }
  } catch (err) {
    toastError('Failed to set default address')
  }
}

async function deleteAddress(id) {
  if (!confirm('Are you sure you want to delete this address?')) return
  try {
    await $fetch(`/api/addresses/${id}`, { method: 'DELETE' })
    toastSuccess('Address deleted')
    await fetchAddresses()
  } catch (err) {
    toastError('Failed to delete address')
  }
}

function closeAddressForm() {
  showAddressForm.value = false
  editingAddress.value = false
  resetAddressForm()
}

// Wallet functions
async function addMoney() {
  addingMoney.value = true
  try {
    // In production, this would call payment gateway
    await new Promise(r => setTimeout(r, 1000))
    walletBalance.value += addMoneyAmount.value
    toastSuccess(`Added ${formatPrice(addMoneyAmount.value)} to wallet`)
    closeAddMoney()
  } catch {
    toastError('Failed to add money')
  } finally {
    addingMoney.value = false
  }
}

function closeAddMoney() {
  showAddMoney.value = false
  addMoneyAmount.value = 1000
  addMoneyMethod.value = 'card'
}

// Payment methods functions
function formatCardNumber(e) {
  let val = e.target.value.replace(/\D/g, '').slice(0, 16)
  val = val.replace(/(\d{4})/g, '$1 ').trim()
  newPayment.value.number = val
}

function formatCardExpiry(e) {
  let val = e.target.value.replace(/\D/g, '').slice(0, 4)
  if (val.length >= 2) {
    val = val.slice(0, 2) + '/' + val.slice(2)
  }
  newPayment.value.expiry = val
}

async function addPaymentMethod() {
  addingPayment.value = true
  try {
    // In production, tokenize card with payment gateway
    await new Promise(r => setTimeout(r, 1000))
    const masked = '**** **** **** ' + newPayment.value.number.replace(/\s/g, '').slice(-4)
    const method = {
      id: Date.now(),
      name: newPayment.value.name,
      type: 'card',
      iconComponent: 'CardIcon',
      mask: masked,
      expiry: newPayment.value.expiry,
      isDefault: newPayment.value.setDefault
    }
    paymentMethods.value.push(method)
    if (method.isDefault) {
      paymentMethods.value.forEach(m => { if (m.id !== method.id) m.isDefault = false })
    }
    toastSuccess('Card saved successfully')
    closeAddPayment()
  } catch {
    toastError('Failed to save card')
  } finally {
    addingPayment.value = false
  }
}

async function removePaymentMethod(id) {
  if (!confirm('Remove this payment method?')) return
  paymentMethods.value = paymentMethods.value.filter(m => m.id !== id)
  toastSuccess('Payment method removed')
}

function closeAddPayment() {
  showAddPayment.value = false
  addingPayment.value = false
  newPayment.value = { name: '', number: '', expiry: '', cvv: '', setDefault: false }
}

function formatAddress(addr) {
  if (!addr) return ''
  const parts = [
    addr.addressLine1,
    addr.addressLine2,
    `${addr.city}, ${addr.state} ${addr.zip}`,
    addr.country
  ].filter(Boolean)
  return parts.join(', ')
}

// Card icon component
const CardIcon = {
  template: `<svg width="24" height="16" viewBox="0 0 24 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="22" height="14" rx="2"/><line x1="1" y1="5" x2="23" y2="5"/><line x1="7" y1="11" x2="17" y2="11"/></svg>`
}
</script>

<style scoped>
.profile-page { min-height: 100vh; background: #f8fafc; padding: 28px 16px; }
.container { max-width: 900px; margin: 0 auto; }
.top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.top a { color: #d4af64; text-decoration: none; font-weight: 500; }
.top a:hover { color: #b8860b; }
.top h1 { margin: 0; font-size: 26px; color: #111827; font-family: 'Cormorant Garamond', serif; font-weight: 600; }
.not-logged-in { text-align: center; padding: 80px 20px; color: #6b7280; }
.not-logged-in .link { color: #d4af64; font-weight: 500; }

.profile-tabs { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; }
.tab-nav {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
  overflow-x: auto;
}
.tab-btn {
  padding: 14px 20px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.tab-btn:hover { color: #374151; background: #fff; }
.tab-btn.active { color: #d4af64; border-bottom-color: #d4af64; background: #fff; }

.tab-content { padding: 24px; }
.tab-panel { animation: fadeIn 0.2s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

.profile-section { margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb; }
.profile-section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.profile-section h2 { margin: 0 0 20px; font-size: 18px; color: #111827; font-family: 'Cormorant Garamond', serif; }
.profile-section .field { margin-bottom: 16px; }
.profile-section .field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.profile-section label { display: block; margin-bottom: 6px; font-size: 13px; color: #374151; font-weight: 500; }
.profile-section input, .profile-section select {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font: inherit;
  box-sizing: border-box;
}
.profile-section input:focus, .profile-section select:focus {
  border-color: #d4af64;
  outline: none;
  box-shadow: 0 0 0 3px rgba(212,175,100,0.15);
}
.verification-note { margin: 4px 0 16px; font-size: 12px; color: #6b7280; }
.checkbox-field { margin-top: 8px; }
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #374151;
}
.checkbox-wrapper input { width: 16px; height: 16px; accent-color: #d4af64; margin: 0; }
.form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; }
.btn-primary { background: #111827; color: #fff; border: none; border-radius: 8px; padding: 12px 20px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.2s ease; }
.btn-primary:hover { background: #d4af64; color: #0a0806; }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
.btn-secondary { background: #fff; color: #374151; border: 1px solid #d1d5db; border-radius: 8px; padding: 12px 20px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; }
.btn-secondary:hover { background: #f8fafc; border-color: #d4af64; color: #d4af64; }
.btn-link { background: none; border: none; padding: 0; color: #d4af64; font-size: 13px; font-weight: 500; cursor: pointer; text-decoration: underline; }
.btn-link:hover { color: #b8860b; }
.btn-link.danger { color: #dc2626; }
.btn-link.danger:hover { color: #b91c1c; }

/* Danger zone */
.danger-zone { border-top: 1px dashed #fecaca; padding-top: 24px; }
.security-item { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding: 16px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; margin-bottom: 12px; }
.security-item:last-child { margin-bottom: 0; }
.security-item h3 { margin: 0 0 4px; font-size: 14px; color: #111827; }
.security-item p { margin: 0; font-size: 13px; color: #6b7280; }

/* Addresses */
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.empty-addresses, .empty-payments { text-align: center; padding: 40px 20px; color: #6b7280; }
.empty-addresses .btn-primary, .empty-payments .btn-primary { margin-top: 16px; }
.address-list { display: flex; flex-direction: column; gap: 16px; }
.address-card { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; }
.address-info { flex: 1; min-width: 0; }
.address-name { margin: 0 0 6px; font-weight: 600; color: #111827; font-size: 15px; }
.address-details { margin: 0; font-size: 13px; color: #6b7280; line-height: 1.55; }
.address-actions { display: flex; flex-wrap: wrap; gap: 8px; flex-shrink: 0; }
.address-actions .btn-link { font-size: 13px; }

/* Wallet */
.wallet-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.wallet-badge { background: #f47504; color: #fff; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.04em; }
.wallet-balance { background: linear-gradient(135deg, #111827 0%, #1f2937 100%); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px; color: #fff; }
.balance-label { display: block; font-size: 14px; color: #9ca3af; margin-bottom: 8px; }
.balance-amount { font-size: 40px; font-weight: 700; font-family: 'Cormorant Garamond', serif; color: #d4af64; }
.wallet-actions { display: flex; gap: 12px; justify-content: center; margin-bottom: 24px; flex-wrap: wrap; }
.wallet-info { font-size: 13px; color: #6b7280; line-height: 1.6; text-align: center; }
.wallet-info p { margin: 0 0 8px; }
.wallet-info p:last-child { margin-bottom: 0; }

/* Payment methods */
.payment-list { display: flex; flex-direction: column; gap: 12px; }
.payment-card { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; }
.payment-info { display: flex; align-items: center; gap: 12px; }
.payment-icon { width: 40px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 6px; color: #fff; }
.card-icon { background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%); }
.upi-icon { background: linear-gradient(135deg, #34a853 0%, #0f9d58 100%); }
.bank-icon { background: linear-gradient(135deg, #ea4335 0%, #fbbc05 100%); }
.wallet-icon { background: linear-gradient(135deg, #f47504 0%, #d4af64 100%); }
.payment-name { font-weight: 500; color: #111827; }
.payment-meta { font-size: 12px; color: #6b7280; }
.secure-note { display: flex; align-items: center; gap: 8px; margin: 16px 0 0; padding: 12px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 12px; color: #6b7280; }

/* Modals */
.address-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease-out;
}
.address-modal {
  background: #fff;
  border-radius: 16px;
  padding: 28px 24px;
  max-width: 520px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18);
  animation: slideUp 0.25s ease-out;
}
.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #f8fafc;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  transition: background 0.2s ease, color 0.2s ease;
}
.modal-close:hover { background: #e5e7eb; color: #111827; }
.modal-title { margin: 0 0 24px; font-size: 20px; font-weight: 600; color: #111827; font-family: 'Cormorant Garamond', serif; }
.address-modal .field { margin-bottom: 16px; }
.address-modal .field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.address-modal label { display: block; margin-bottom: 6px; font-size: 13px; color: #374151; font-weight: 500; }
.address-modal input, .address-modal select {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font: inherit;
  box-sizing: border-box;
}
.address-modal input:focus { border-color: #d4af64; outline: none; box-shadow: 0 0 0 3px rgba(212,175,100,0.15); }
.address-modal .checkbox-field { margin-top: 8px; }
.address-modal .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; }
.quick-amounts { display: flex; gap: 8px; flex-wrap: wrap; }
.quick-amt-btn { padding: 10px 16px; border: 1px solid #d1d5db; border-radius: 8px; background: #fff; color: #374151; font-size: 13px; cursor: pointer; transition: all 0.2s ease; }
.quick-amt-btn:hover { border-color: #d4af64; color: #d4af64; }
.quick-amt-btn.selected { background: #d4af64; color: #0a0806; border-color: #d4af64; }
.form-select { width: 100%; border: 1px solid #d1d5db; border-radius: 8px; padding: 10px 12px; font: inherit; }

@media (max-width: 640px) {
  .profile-page { padding: 18px 10px; }
  .top h1 { font-size: 20px; }
  .tab-btn { padding: 12px 16px; font-size: 13px; }
  .tab-content { padding: 16px; }
  .profile-section .field-row,
  .address-modal .field-row,
  .card-form .field-row { grid-template-columns: 1fr; }
  .address-card { flex-direction: column; align-items: flex-start; }
  .address-actions { width: 100%; }
  .address-actions .btn-link { flex: 1; text-align: center; }
  .wallet-balance { padding: 24px; }
  .balance-amount { font-size: 32px; }
  .wallet-actions { flex-direction: column; }
  .wallet-actions .btn-primary, .wallet-actions .btn-secondary { width: 100%; }
}
</style>