<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="navbar-inner">
      <NuxtLink to="/" class="logo">
        <span class="logo-icon">◈</span>
        <span class="logo-text">LUMIÈRE</span>
      </NuxtLink>

      <div class="nav-search" v-if="!mobileOpen">
        <div class="search-wrapper">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model.trim="navSearch"
            type="search"
            aria-label="Search products"
            placeholder="Search…"
            class="search-input"
            @keydown.enter="handleNavSearch"
          />
        </div>
      </div>

      <ul class="nav-links">
        <li v-for="link in navLinks" :key="link.to">
          <NuxtLink :to="link.to" class="nav-link" active-class="active">
            {{ link.label }}
          </NuxtLink>
        </li>
        <li v-if="isLoggedIn" class="user-chip">
          <span class="user-name">{{ user.name }}</span>
          <button type="button" class="logout-btn" @click="logout">Logout</button>
        </li>
      </ul>

      <div class="nav-actions">
        <button class="icon-btn wishlist-btn" aria-label="Wishlist" @click="navigateTo('/wishlist')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <transition name="badge-pop">
            <span v-if="wishlist.itemCount > 0" class="cart-badge wish-badge" :key="wishlist.itemCount">
              {{ wishlist.itemCount > 99 ? '99+' : wishlist.itemCount }}
            </span>
          </transition>
        </button>

        <button class="icon-btn cart-btn" aria-label="Cart" @click="navigateTo('/cart')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <transition name="badge-pop">
            <span v-if="cart.itemCount > 0" class="cart-badge" :key="cart.itemCount">
              {{ cart.itemCount > 99 ? '99+' : cart.itemCount }}
            </span>
          </transition>
        </button>

        <button class="icon-btn dark-toggle" aria-label="Toggle dark mode" @click="toggleDark">
          <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>

        <button class="icon-btn menu-toggle" @click="mobileOpen = !mobileOpen" aria-label="Menu">
          <span class="hamburger" :class="{ open: mobileOpen }">
            <span></span><span></span><span></span>
          </span>
        </button>
      </div>
    </div>

    <transition name="mobile-slide">
      <div v-if="mobileOpen" class="mobile-menu">
        <div class="mobile-search">
          <div class="search-wrapper">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              v-model.trim="navSearch"
              type="search"
              aria-label="Search products"
              placeholder="Search…"
              class="search-input"
              @keydown.enter="handleNavSearch"
            />
          </div>
        </div>
        <ul>
          <li v-for="link in navLinks" :key="link.to">
            <NuxtLink :to="link.to" class="mobile-link" @click="mobileOpen = false">
              {{ link.label }}
            </NuxtLink>
          </li>
          <li v-if="isLoggedIn" class="mobile-user">
            <span>Signed in as {{ user.name }}</span>
            <button type="button" class="mobile-logout" @click="handleMobileLogout">Logout</button>
          </li>
        </ul>
      </div>
    </transition>
  </nav>
</template>

<script setup>
const cart = useCart()
const wishlist = useWishlist()
const { user, isLoggedIn, logout } = useAuth()
const { isDark, toggle } = useDarkMode()

const isScrolled = ref(false)
const mobileOpen = ref(false)

const toggleDark = () => toggle()

const navLinks = computed(() => {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/wishlist', label: 'Wishlist' },
    { to: '/cart', label: 'Cart' }
  ]
  if (isLoggedIn.value) {
    links.push({ to: '/orders', label: 'Orders' })
  } else {
    links.push({ to: '/login', label: 'Login' })
  }
  return links
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const handleMobileLogout = async () => {
  mobileOpen.value = false
  await logout()
}

const navSearch = ref('')

const handleNavSearch = () => {
  if (!navSearch.value.trim()) return
  navigateTo(`/?search=${encodeURIComponent(navSearch.value.trim())}`)
  navSearch.value = ''
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0 2rem;
  height: 72px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid transparent;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.navbar.scrolled {
  height: 60px;
  background: rgba(255, 255, 255, 0.98);
  border-bottom-color: rgba(209, 213, 219, 0.8);
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.08);
}

.navbar-inner {
  max-width: 1280px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  font-size: 1.4rem;
  color: #d4af64;
  line-height: 1;
  transition: transform 0.4s ease;
}

.logo:hover .logo-icon {
  transform: rotate(45deg);
}

.logo-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: 0.25em;
  color: #111827;
  transition: color 0.3s ease;
}

.logo:hover .logo-text {
  color: #d4af64;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.72rem;
  font-weight: 400;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #6b7280;
  text-decoration: none;
  padding: 0.4rem 0.9rem;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  right: 50%;
  height: 1px;
  background: #d4af64;
  transition: left 0.3s ease, right 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #111827;
}

.nav-link:hover::after,
.nav-link.active::after {
  left: 0.9rem;
  right: 0.9rem;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.5rem;
}

.user-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  color: #374151;
}

.logout-btn {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: 1px solid #d1d5db;
  background: #fff;
  color: #6b7280;
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.logout-btn:hover {
  color: #111827;
  border-color: #d4af64;
}

.nav-search {
  flex: 1;
  max-width: 320px;
  margin: 0 1rem;
}

.nav-search .search-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  padding: 8px 12px;
  width: 100%;
}

.nav-search .search-wrapper:focus-within {
  border-color: #d4af64;
  outline: 2px solid #d4af64;
  outline-offset: 2px;
}

.nav-search .search-input {
  border: none;
  background: transparent;
  padding: 0;
  width: 100%;
  font: inherit;
  font-size: 0.85rem;
  outline: none;
}

.nav-search .search-input::placeholder {
  color: #9ca3af;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.icon-btn {
  position: relative;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: color 0.3s ease, background 0.3s ease;
}

.icon-btn:hover {
  color: #111827;
  background: rgba(212, 175, 100, 0.14);
}

.cart-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: #d4af64;
  color: #0a0806;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.6rem;
  font-weight: 600;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  pointer-events: none;
}

.badge-pop-enter-active {
  animation: badge-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.badge-pop-leave-active {
  animation: badge-in 0.2s ease reverse;
}
@keyframes badge-in {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

.wishlist-btn svg {
  fill: transparent;
}

.wishlist-btn:hover svg {
  color: #dc2626;
}

.menu-toggle {
  display: none;
}

.hamburger {
  width: 18px;
  height: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.hamburger span {
  display: block;
  height: 1px;
  background: currentColor;
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform-origin: center;
}

.hamburger.open span:nth-child(1) { transform: translateY(5.5px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger.open span:nth-child(3) { transform: translateY(-5.5px) rotate(-45deg); }

.mobile-menu {
  background: rgba(255, 255, 255, 0.98);
  border-top: 1px solid #e5e7eb;
  padding: 1.5rem 2rem 2rem;
}

.mobile-search {
  padding: 0.75rem 0 0.5rem;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 0.5rem;
}

.mobile-search .search-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  padding: 10px 14px;
}

.mobile-search .search-input {
  border: none;
  background: transparent;
  padding: 0;
  width: 100%;
  font: inherit;
  outline: none;
}

.mobile-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mobile-link {
  display: block;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #6b7280;
  text-decoration: none;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
  transition: color 0.3s ease;
}

.mobile-link:hover { color: #d4af64; }

.mobile-user {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  color: #374151;
}

.mobile-logout {
  align-self: flex-start;
  border: 1px solid #d1d5db;
  background: #fff;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font: inherit;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.65rem;
}

.mobile-slide-enter-active,
.mobile-slide-leave-active {
  transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
  overflow: hidden;
  max-height: 300px;
}
.mobile-slide-enter-from,
.mobile-slide-leave-to {
  max-height: 0;
  opacity: 0;
}

@media (max-width: 768px) {
  .navbar { padding: 0 0.75rem; }
  .navbar-inner { gap: 0.5rem; }
  .logo-text { font-size: 1.05rem; letter-spacing: 0.12em; }
  .icon-btn { width: 36px; height: 36px; }
  .cart-badge { min-width: 16px; height: 16px; font-size: 0.55rem; top: 3px; right: 3px; }
  .nav-links { display: none; }
  .menu-toggle { display: flex; }
  .mobile-menu { padding: 1rem 1rem 1.25rem; }
}
@media (max-width: 420px) {
  .logo-icon { display: none; }
  .logo-text { font-size: 0.95rem; letter-spacing: 0.1em; }
}
</style>
