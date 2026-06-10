<template>
  <div class="cart-page">
    <div class="container">
      <div class="top">
        <RouterLink to="/">← Continue Shopping</RouterLink>
        <h1>Your Cart ({{ cart.state.items.length }} items)</h1>
      </div>

      <div class="layout">
        <div class="items">
          <CartItem
            v-for="item in cart.state.items"
            :key="item.id"
            :product="item"
            :quantity="item.qty"
            @update-qty="({ id, quantity }) => cart.updateQty(id, quantity)"
            @remove="cart.removeFromCart"
          />
          <p v-if="cart.state.items.length === 0" class="empty">Your cart is empty.</p>
        </div>

        <div class="summary">
          <h2>Order Summary</h2>
          <div class="row">
            <span>Subtotal</span>
            <strong>${{ cart.subtotal.value.toFixed(2) }}</strong>
          </div>
          <div class="row">
            <span>Tax (18%)</span>
            <strong>${{ tax.toFixed(2) }}</strong>
          </div>
          <div class="row total">
            <span>Total</span>
            <strong>${{ total.toFixed(2) }}</strong>
          </div>
          <button class="order-btn" :disabled="cart.state.items.length === 0" @click="placeOrder">
            Place Order
          </button>
          <p v-if="success" class="success">Order placed successfully.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import CartItem from '../components/CartItem.vue'
import { useCartStore } from '../store/cart'

const cart = useCartStore()
const success = ref(false)

const tax = computed(() => cart.subtotal.value * 0.18)
const total = computed(() => cart.subtotal.value + tax.value)

const placeOrder = () => {
  cart.clearCart()
  success.value = true
  setTimeout(() => {
    success.value = false
  }, 2000)
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
.order-btn { width: 100%; border: none; border-radius: 8px; background: #111827; color: #fff; padding: 10px; cursor: pointer; margin-top: 12px; }
.order-btn:disabled { background: #9ca3af; cursor: not-allowed; }
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
