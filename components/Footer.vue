<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="grid">
        <!-- About -->
        <div class="block">
          <h3 class="title">About</h3>
          <p class="muted">
            <strong class="accent">LUMIÈRE</strong> is a curated collection of luxury essentials. Browse by category, save your favourites, and shop with ease.
          </p>
        </div>

        <!-- Pages -->
        <div class="block">
          <h3 class="title">Pages</h3>
          <ul class="links">
            <li><NuxtLink class="footer-link" to="/">Home</NuxtLink></li>
            <li><NuxtLink class="footer-link" to="/wishlist">Wishlist</NuxtLink></li>
            <li><NuxtLink class="footer-link" to="/cart">Cart</NuxtLink></li>
            <li><NuxtLink class="footer-link" to="/login">Login</NuxtLink></li>
          </ul>
        </div>

        <!-- Categories -->
        <div class="block">
          <h3 class="title">Categories</h3>
          <ul class="links">
            <li><NuxtLink class="footer-link" :to="{ path: '/', query: {} }">All products</NuxtLink></li>
            <li><NuxtLink class="footer-link" :to="{ path: '/', query: { category: 'Men' } }">Men</NuxtLink></li>
            <li><NuxtLink class="footer-link" :to="{ path: '/', query: { category: 'Women' } }">Women</NuxtLink></li>
            <li><NuxtLink class="footer-link" :to="{ path: '/', query: { category: 'Jewellery' } }">Jewellery</NuxtLink></li>
            <li><NuxtLink class="footer-link" :to="{ path: '/', query: { category: 'Electronics' } }">Electronics</NuxtLink></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="block">
          <h3 class="title">Contact</h3>
          <p class="muted small">
            support@lumiere.store
          </p>
        </div>
      </div>

      <p class="copyright">© {{ year }} LUMIÈRE. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  margin-top: auto;
  background: #1e293b;
  color: #f1f5f9;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1rem 1.25rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.75rem;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.block .title {
  margin: 0 0 0.5rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #d4af64;
}

.block .accent {
  color: #e2e8f0;
  font-weight: 600;
}

.block .muted {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: #94a3b8;
}

.block .muted.small {
  font-size: 0.8rem;
  line-height: 1.5;
}

.inline {
  font-family: ui-monospace, monospace;
  font-size: 0.75em;
  color: #cbd5e1;
  word-break: break-all;
}

.links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.footer-link {
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #d4af64;
}

.copyright {
  margin: 2rem 0 0;
  padding-top: 1.25rem;
  border-top: 1px solid #334155;
  text-align: center;
  font-size: 0.78rem;
  color: #64748b;
  line-height: 1.5;
}
</style>
