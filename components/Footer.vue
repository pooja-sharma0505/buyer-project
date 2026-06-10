<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="grid">
        <!-- Matches header brand + storefront name on home -->
        <div class="block">
          <h3 class="title">About</h3>
          <p class="muted">
            <strong class="accent">LUMIÈRE</strong> · <strong class="accent">LUXESTORE</strong><br >
            Browse products from your database, filter by category, search, add items to cart or wishlist,
            open any product page, or sign in with name and phone.
          </p>
        </div>

        <!-- Every real route from router -->
        <div class="block">
          <h3 class="title">Pages</h3>
          <ul class="links">
            <li><RouterLink class="footer-link" to="/">Home — catalog</RouterLink></li>
            <li><RouterLink class="footer-link" to="/wishlist">Wishlist</RouterLink></li>
            <li><RouterLink class="footer-link" to="/cart">Cart &amp; checkout</RouterLink></li>
            <li><RouterLink class="footer-link" to="/login">Login</RouterLink></li>
            <li><span class="muted small">Products also open via <code class="inline">/product/:id</code> from listing.</span></li>
          </ul>
        </div>

        <!-- Same category chips as home (query sync) -->
        <div class="block">
          <h3 class="title">Categories</h3>
          <ul class="links">
            <li><RouterLink class="footer-link" :to="{ path: '/', query: {} }">All products</RouterLink></li>
            <li><RouterLink class="footer-link" :to="{ path: '/', query: { category: 'Men' } }">Men</RouterLink></li>
            <li><RouterLink class="footer-link" :to="{ path: '/', query: { category: 'Women' } }">Women</RouterLink></li>
            <li><RouterLink class="footer-link" :to="{ path: '/', query: { category: 'Jewellery' } }">Jewellery</RouterLink></li>
            <li><RouterLink class="footer-link" :to="{ path: '/', query: { category: 'Electronics' } }">Electronics</RouterLink></li>
          </ul>
        </div>

        <!-- No separate help/privacy routes — describe what backend powers the app -->
        <div class="block">
          <h3 class="title"></h3>
          <p class="muted small">
           
          </p>
        </div>
      </div>

      <p class="copyright">© {{ year }} LUXESTORE demo. Footer lists only routes and behavior this site implements.</p>
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
