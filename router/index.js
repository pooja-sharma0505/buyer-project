import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ProductDetailPage from '../pages/ProductDetailPage.vue'
import CartPage from '../pages/CartPage.vue'
import WishlistPage from '../pages/WishlistPage.vue'
import LoginPage from '../pages/LoginPage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/product/:id', name: 'product-detail', component: ProductDetailPage },
  { path: '/cart', name: 'cart', component: CartPage },
  { path: '/wishlist', name: 'wishlist', component: WishlistPage },
  { path: '/login', name: 'login', component: LoginPage }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
