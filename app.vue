<template>
  <div class="app-shell">
    <Navbar :cart-count="cart.itemCount.value" :wishlist-count="wishlist.itemCount.value" />
    <main class="app-main">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { useCartStore } from './store/cart'
import { useWishlistStore } from './store/wishlist'

const cart = useCartStore()
const wishlist = useWishlistStore()
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body,
#app {
  margin: 0;
  padding: 0;
  min-height: 100%;
  font-family: 'Montserrat', sans-serif;
  background: #ffffff;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding-top: 72px;
}
</style>