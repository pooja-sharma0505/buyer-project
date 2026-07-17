<template>
  <div class="home-page">
    <div class="container">
      <div class="top-row">
        <h1 class="brand">LUXESTORE</h1>
        <input
          v-model.trim="search"
          type="search"
          aria-label="Search in current category"
          placeholder="Search in category…"
          class="search-input"
        />
      </div>

      <div class="filters">
        <button
          v-for="cat in categories"
          :key="cat"
          class="filter-btn"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <p v-if="pending" class="status-text">Loading products...</p>
      <p v-else-if="fetchError" class="status-text error">{{ fetchError.message || 'Unable to load products' }}</p>

      <template v-else>
        <p v-if="!filteredProducts.length" class="status-text">
          No products match{{ selectedCategory === 'All' ? '' : ` in “${selectedCategory}”` }}{{ search ? ' for your search' : '' }}.
        </p>
        <div v-else class="grid">
          <Productcard
            v-for="product in filteredProducts"
            :key="product.id"
            :id="product.id"
            :image="product.image"
            :title="product.title"
            :price="product.price"
            :category="product.category"
            :rating="product.rating"
            @add-to-cart="cart.addToCart"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
const cart = useCart()
const route = useRoute()
const router = useRouter()

const selectedCategory = ref('All')
const search = ref('')

const { data: products, pending, error: fetchError } = await useFetch('/api/products')

const SHOP_CATEGORIES = ['Men', 'Women', 'Jewellery', 'Electronics']

const categories = computed(() => {
  const list = products.value || []
  const extras = new Set()
  for (const p of list) {
    const c = p.category
    if (c && !SHOP_CATEGORIES.includes(c)) extras.add(c)
  }
  const extraSorted = Array.from(extras).sort((a, b) => a.localeCompare(b))
  return ['All', ...SHOP_CATEGORIES, ...extraSorted]
})

function norm(s) {
  return String(s ?? '')
    .trim()
    .toLowerCase()
}

function categoryMatches(productCategory, chip) {
  if (chip === 'All') return true
  return norm(productCategory) === norm(chip)
}

const filteredProducts = computed(() =>
  (products.value || []).filter((p) => {
    if (!categoryMatches(p.category, selectedCategory.value)) return false
    const q = norm(search.value)
    if (!q) return true
    const title = norm(p.title)
    const desc = norm(p.description)
    return title.includes(q) || desc.includes(q)
  })
)

function canonicalCategoryFromQuery(raw) {
  const r = typeof raw === 'string' ? raw.trim() : Array.isArray(raw) ? String(raw[0] ?? '').trim() : ''
  if (!r) return 'All'
  const list = categories.value.filter((c) => c !== 'All')
  const found = list.find((c) => norm(c) === norm(r))
  return found || 'All'
}

watch(
  () => route.query.category,
  () => {
    selectedCategory.value = canonicalCategoryFromQuery(route.query.category)
  },
  { immediate: true }
)

watch(selectedCategory, (cat) => {
  const want = cat === 'All' ? undefined : cat
  const cur = route.query.category
  const curStr = typeof cur === 'string' ? cur : undefined
  if (curStr === want || (!curStr && !want)) return
  router.replace({ path: '/', query: want ? { category: want } : {} })
})
</script>

<style scoped>
.home-page { min-height: 100vh; background: #f8fafc; padding: 28px 16px; }
.container { max-width: 1200px; margin: 0 auto; }
.top-row { display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; align-items: center; margin-bottom: 18px; }
.brand { font-size: 22px; color: #111827; }
.search-input { width: 280px; max-width: 100%; border: 1px solid #d1d5db; border-radius: 999px; padding: 10px 14px; background: #fff; font: inherit; }
.search-input::placeholder { color: #9ca3af; }
.filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
.filter-btn { border: 1px solid #d1d5db; background: #fff; color: #4b5563; border-radius: 999px; padding: 8px 14px; cursor: pointer; }
.filter-btn.active { background: #111827; color: #fff; border-color: #111827; }
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.status-text { color: #6b7280; margin: 12px 0; }
.status-text.error { color: #dc2626; }
@media (max-width: 900px) {
  .home-page { padding: 20px 12px; }
  .top-row { margin-bottom: 14px; }
  .brand { font-size: 20px; }
  .search-input { width: 100%; }
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
}
@media (max-width: 640px) {
  .home-page { padding: 16px 10px; }
  .top-row { flex-direction: column; align-items: stretch; }
  .brand { font-size: 18px; }
  .filters { gap: 6px; margin-bottom: 14px; }
  .filter-btn { padding: 7px 12px; font-size: 13px; }
  .grid { grid-template-columns: 1fr; }
}
</style>
