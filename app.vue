<script setup>
useHead({
  titleTemplate: '%s | LUMIÈRE',
  meta: [
    { name: 'description', content: 'LUMIÈRE — a curated collection of luxury essentials. Shop jewellery, fashion, electronics, and more.' }
  ]
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
html, body, .app-shell, .home-page, .cart-page, .wishlist-page, .orders-page, .detail-page, .login-page {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Dark mode global styles */
.dark body {
  background: #0a0a0f;
  color: #e5e7eb;
}
.dark .home-page, .dark .cart-page, .dark .wishlist-page, .dark .orders-page, .dark .detail-page, .dark .login-page {
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
.dark .product-card, .dark .order-card, .dark .summary, .dark .row, .dark .list li, .dark .reviews-section, .dark .review-card, .dark .empty-state, .dark .login-card, .dark .cart-item {
  background: #16161f !important;
  border-color: #1f1f2e !important;
}
.dark .product-title, .dark .title, .dark .brand, .dark .top h1, .dark .order-id, .dark .item-title, .dark .reviews-heading, .dark .empty-title, .dark .summary h2, .dark .login-card h2 {
  color: #f1f5f9 !important;
}
.dark .category-tag, .dark .rating-count, .dark .product-price, .dark .cat, .dark .empty-text, .dark .status-text, .dark .hint, .dark .page-info, .dark .order-date, .dark .item-meta, .dark .description, .dark .footer, .dark .footer .title, .dark .footer a, .dark .footer p, .dark .footer .copy {
  color: #94a3b8 !important;
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
.dark .page-btn, .dark .qty-btn, .dark .qty-input, .dark .search-input, .dark .review-input, .dark .login-input {
  background: #16161f !important;
  border-color: #1f1f2e !important;
  color: #e5e7eb !important;
}
.dark .page-btn:hover:not(:disabled), .dark .qty-btn:hover {
  border-color: #d4af64 !important;
  color: #d4af64 !important;
}
.dark .btn.primary, .dark .order-btn, .dark .add-btn, .dark .review-submit, .dark .empty-cta, .dark .login-btn {
  background: #d4af64 !important;
  color: #0a0806 !important;
  border-color: #d4af64 !important;
}
.dark .btn.primary:hover, .dark .order-btn:hover, .dark .add-btn:hover, .dark .review-submit:hover, .dark .empty-cta:hover, .dark .login-btn:hover {
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
</style>
