<script setup>
const { isDark } = useDarkMode()

useHead(computed(() => ({
  titleTemplate: '%s | LUMIÈRE',
  meta: [
    { name: 'description', content: 'LUMIÈRE — a curated collection of luxury essentials. Shop jewellery, fashion, electronics, and more.' }
  ],
  htmlAttrs: {
    class: isDark.value ? 'dark' : ''
  }
})))

// Scroll to top on every route change
const router = useRouter()
router.afterEach(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="app-shell">
    <Navbar />
    <main class="app-main">
      <NuxtPage />
    </main>
    <Footer />
    <ToastContainer />
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
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

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Global focus-visible */
:focus-visible {
  outline: 2px solid #d4af64;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}

/* Dark mode transition */
html, body, .app-shell, .home-page, .cart-page, .wishlist-page, .orders-page, .detail-page, .login-page, .signup-page {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Dark mode global styles */
.dark body {
  background: #0a0a0f;
  color: #e5e7eb;
}
.dark .home-page, .dark .cart-page, .dark .wishlist-page, .dark .orders-page, .dark .detail-page, .dark .login-page, .dark .signup-page {
  background: #0a0a0f !important;
}
.dark .navbar {
  background: rgba(10, 10, 15, 0.95) !important;
  border-bottom: 1px solid #1f1f2e !important;
}
.dark .footer {
  background: #0a0a0f !important;
  border-top: 1px solid #1f1f2e !important;
}
.dark .product-card, .dark .order-card, .dark .summary, .dark .row, .dark .list li, .dark .reviews-section, .dark .review-card, .dark .empty-state, .dark .card, .dark .cart-item {
  background: #16161f !important;
  border-color: #1f1f2e !important;
}
.dark .product-title, .dark .title, .dark .brand, .dark .top h1, .dark .order-id, .dark .item-title, .dark .reviews-heading, .dark .empty-title, .dark .summary h2, .dark .card h1 {
  color: #f1f5f9 !important;
}
.dark .category-tag, .dark .rating-count, .dark .product-price, .dark .cat, .dark .empty-text, .dark .status-text, .dark .hint, .dark .page-info, .dark .order-date, .dark .item-meta, .dark .description, .dark .footer, .dark .footer .title, .dark .footer a, .dark .footer p, .dark .footer .copyright {
  color: #94a3b8 !important;
}
.dark .status-text.error {
  color: #fca5a5 !important;
}
.dark .product-price, .dark .price, .dark .order-total, .dark .review-stars, .dark .back-link, .dark .top a {
  color: #d4af64 !important;
}
.dark .filter-btn {
  background: #16161f !important;
  border-color: #1f1f2e !important;
  color: #94a3b8 !important;
}
.dark .filter-btn.active {
  background: #d4af64 !important;
  color: #0a0806 !important;
  border-color: #d4af64 !important;
}
.dark .page-btn, .dark .qty-btn, .dark .qty-input, .dark .search-input, .dark .review-textarea, .dark .card input {
  background: #16161f !important;
  border-color: #1f1f2e !important;
  color: #e5e7eb !important;
}
.dark .page-btn:hover:not(:disabled), .dark .qty-btn:hover {
  border-color: #d4af64 !important;
  color: #d4af64 !important;
}
.dark .btn.primary, .dark .order-btn, .dark .add-btn, .dark .review-submit, .dark .empty-cta, .dark .card button {
  background: #d4af64 !important;
  color: #0a0806 !important;
  border-color: #d4af64 !important;
}
.dark .btn.primary:hover, .dark .order-btn:hover, .dark .add-btn:hover, .dark .review-submit:hover, .dark .empty-cta:hover, .dark .card button:hover {
  background: #e5c880 !important;
  color: #0a0806 !important;
}
.dark .footer .title {
  color: #d4af64 !important;
}
.dark .skeleton-line, .dark .skeleton-img {
  --skeleton-bg: #1f1f2e !important;
  --skeleton-shine: #2a2a3e !important;
}
.dark .toast {
  background: #16161f !important;
  border-color: #1f1f2e !important;
  color: #e5e7eb !important;
}
.dark .toast.success {
  border-color: #d4af64 !important;
  color: #d4af64 !important;
}

/* Dark mode — Logo */
.dark .logo-text {
  color: #f1f5f9 !important;
}
.dark .logo:hover .logo-text {
  color: #d4af64 !important;
}
.dark .logo-icon {
  color: #d4af64 !important;
}

/* Dark mode — Navbar */
.dark .nav-link {
  color: #94a3b8 !important;
}
.dark .nav-link.active {
  color: #f1f5f9 !important;
}
.dark .nav-link::after {
  background: #d4af64 !important;
}
.dark .user-name {
  color: #cbd5e1 !important;
}
.dark .logout-btn {
  background: #16161f !important;
  border-color: #1f1f2e !important;
  color: #94a3b8 !important;
}
.dark .logout-btn:hover {
  color: #f1f5f9 !important;
  border-color: #d4af64 !important;
}
.dark .icon-btn {
  color: #94a3b8 !important;
}
.dark .icon-btn:hover {
  color: #f1f5f9 !important;
  background: rgba(212, 175, 100, 0.14) !important;
}
.dark .mobile-menu {
  background: rgba(10, 10, 15, 0.98) !important;
  border-top: 1px solid #1f1f2e !important;
}
.dark .mobile-link {
  color: #94a3b8 !important;
  border-bottom: 1px solid #1f1f2e !important;
}
.dark .mobile-link:hover {
  color: #d4af64 !important;
}
.dark .mobile-user {
  color: #cbd5e1 !important;
}
.dark .mobile-logout {
  background: #16161f !important;
  border-color: #1f1f2e !important;
  color: #94a3b8 !important;
}

/* Dark mode — Login / Signup forms */
.dark .field-error {
  color: #fca5a5 !important;
}
.dark .login-error {
  color: #fca5a5 !important;
}
.dark .signup-error {
  color: #fca5a5 !important;
}
.dark .login-links .link-muted, .dark .signup-links {
  color: #94a3b8 !important;
}
.dark .login-links .link, .dark .signup-links .link {
  color: #d4af64 !important;
}

/* Dark mode — Product detail page */
.dark .wish-btn {
  background: #16161f !important;
  border-color: #1f1f2e !important;
  color: #94a3b8 !important;
}
.dark .wish-btn:hover {
  border-color: #fca5a5 !important;
  color: #fca5a5 !important;
}
.dark .wish-btn.on {
  border-color: #fca5a5 !important;
  background: #2a1010 !important;
  color: #fca5a5 !important;
}
.dark .review-textarea {
  background: #16161f !important;
  border-color: #1f1f2e !important;
  color: #e5e7eb !important;
}
.dark .review-textarea.error {
  border-color: #dc2626 !important;
}

/* Dark mode — Product card wishlist toggle */
.dark .wishlist-toggle {
  background: rgba(22, 22, 31, 0.92) !important;
  color: #94a3b8 !important;
}
.dark .wishlist-toggle:hover {
  color: #fca5a5 !important;
}
.dark .wishlist-toggle.active {
  color: #fca5a5 !important;
  background: #16161f !important;
}

/* Dark mode — Cart item text */
.dark .cart-item .meta h2,
.dark .cart-item .total p {
  color: #f1f5f9 !important;
}
.dark .cart-item .meta p,
.dark .cart-item .limit-msg {
  color: #94a3b8 !important;
}
.dark .cart-item .remove {
  color: #fca5a5 !important;
}
.dark .skeleton-cart-item {
  border-color: #1f1f2e !important;
}

/* Dark mode — Footer muted text */
.dark .block .muted {
  color: #94a3b8 !important;
}
.dark .block .accent {
  color: #cbd5e1 !important;
}

/* Dark mode — CSS variables */
.dark {
  --product-thumb-bg: #16161f;
}

/* Dark mode — Search input */
.dark .search-wrapper {
  background: #16161f !important;
  border-color: #1f1f2e !important;
}
.dark .search-wrapper:focus-within {
  border-color: #d4af64 !important;
  outline: 2px solid #d4af64 !important;
  outline-offset: 2px !important;
}
.dark .search-icon {
  color: #94a3b8 !important;
}
.dark .search-input::placeholder {
  color: #94a3b8 !important;
}

/* Dark mode — Product detail layout & reviews */
.dark .layout {
  background: #16161f !important;
  border-color: #1f1f2e !important;
}
.dark .reviews-section {
  background: #16161f !important;
  border-color: #1f1f2e !important;
}

/* Dark mode — Toasts */
.dark .toast.error {
  background: #2a1010 !important;
  border-color: #7f1d1d !important;
  color: #fca5a5 !important;
}
.dark .toast.info {
  background: #16161f !important;
  border-color: #1f1f2e !important;
  color: #e5e7eb !important;
}

/* Dark mode — HTML element background */
.dark html {
  background: #0a0a0f;
}

/* Dark mode — Product image boxes (border) */
.dark .thumb-wrap,
.dark .image-box {
  border-color: #1f1f2e !important;
}

/* Dark mode — Cart item quantity buttons */
.dark .qty-row button {
  background: #16161f !important;
  border-color: #1f1f2e !important;
  color: #e5e7eb !important;
}
.dark .qty-row button:hover:not(:disabled) {
  border-color: #d4af64 !important;
  color: #d4af64 !important;
}

/* Dark mode — Toast shadow */
.dark .toast {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
}

/* Dark mode — Dashed borders in summaries */
.dark .order-summary,
.dark .cart-item .total {
  border-top-color: #1f1f2e !important;
}
</style>
