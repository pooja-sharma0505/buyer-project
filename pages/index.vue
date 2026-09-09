<template>
  <div class="home-page">
    <div class="container">
      <div class="top-row">
        <h1 class="brand">Luxury Essentials, Curated for You</h1>
        <div class="search-wrapper">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="search"
            type="search"
            aria-label="Search products"
            placeholder="Search products…"
            class="search-input"
            @keyup.enter="onSearchEnter"
          />
        </div>
      </div>

      <div class="filters">
        <button
          v-for="cat in categories"
          :key="cat"
          class="filter-btn"
          :class="{ active: norm(selectedCategory) === norm(cat) }"
          @click="selectCategory(cat)"
        >
          {{ cat }}
        </button>
      </div>

      <div v-if="pending" class="row">
        <SkeletonLoader v-for="n in pageSize" :key="n" type="card" />
      </div>
      <p v-else-if="fetchError" class="status-text error">{{ fetchError.message || 'Unable to load products' }}</p>

      <template v-else>
        <div v-if="!paginatedProducts.length" class="empty-state">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
          <h2 class="empty-title">No products found</h2>
          <p class="empty-text">No products match{{ selectedCategory === 'All' ? '' : ` in “${selectedCategory}”` }}{{ search ? ' for your search' : '' }}.</p>
          <button class="empty-cta" @click="clearFilters">Clear Filters</button>
        </div>
        <div v-else class="row">
          <Productcard
            v-for="product in paginatedProducts"
            :key="product.id"
            :id="product.id"
            :image="product.image"
            :title="product.title"
            :price="product.price"
            :category="product.category"
            :rating="product.rating"
          />
        </div>

        <div v-if="pageCount > 1" class="pagination">
          <button
            type="button"
            class="page-btn"
            :disabled="currentPage <= 1"
            @click="goToPage(currentPage - 1)"
          >
            Previous
          </button>
          <span class="page-info">Page {{ currentPage }} of {{ pageCount }}</span>
          <button
            type="button"
            class="page-btn"
            :disabled="currentPage >= pageCount"
            @click="goToPage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Luxury Collection' })
useSeoMeta({
  ogTitle: 'LUMIÈRE - Luxury Collection',
  ogDescription: 'Discover curated luxury products from LUMIÈRE.',
  ogImage: '/og-image.svg',
  ogType: 'website'
})

const cart = useCart()
const route = useRoute()
const router = useRouter()

function getCategoryFromRoute() {
  const raw = route.query.category
  const r = Array.isArray(raw) ? String(raw[0] ?? '').trim() : typeof raw === 'string' ? raw.trim() : ''
  return r || 'All'
}

const selectedCategory = ref(getCategoryFromRoute())
const search = ref('')
const currentPage = ref(1)
const pageSize = 12

const searchDebounced = useDebounce(search, 300)

const { data: categoriesData } = await useAsyncData('product-categories', () => $fetch('/api/categories'))

const allCategoryProducts = computed(() => {
  const data = categoriesData.value
  if (!data) return []
  return Array.isArray(data) ? data.map(c => ({ category: c })) : []
})

const categories = computed(() => {
  const set = new Set()
  for (const p of allCategoryProducts.value) {
    const c = p.category
    if (c) set.add(c)
  }
  return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
})

const productsData = ref(null)
const productsPending = ref(true)
const productsError = ref(null)

// Monotonic token so rapidly-issued requests (e.g. page + filter changes)
// can't overwrite newer results with stale responses.
let productsRequestId = 0

async function loadProducts() {
  const requestId = ++productsRequestId
  productsPending.value = true
  productsError.value = null
  try {
    const q = {
      page: currentPage.value,
      limit: pageSize
    }
    if (searchDebounced.value.trim()) q.search = searchDebounced.value.trim()
    if (selectedCategory.value !== 'All') q.category = selectedCategory.value
    const data = await $fetch('/api/products', { query: q })
    if (requestId !== productsRequestId) return
    productsData.value = data
  } catch (err) {
    if (requestId !== productsRequestId) return
    productsError.value = err
  } finally {
    if (requestId === productsRequestId) {
      productsPending.value = false
    }
  }
}

await loadProducts()

watch([selectedCategory, searchDebounced], () => {
  currentPage.value = 1
  loadProducts()
})

watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  loadProducts()
})

const pageData = computed(() => productsData.value)
const pending = computed(() => productsPending.value)
const fetchError = computed(() => productsError.value)

const paginatedProducts = computed(() => {
  const data = pageData.value
  if (!data) return []
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.products)) return data.products
  return []
})

const pageCount = computed(() => {
  const data = pageData.value
  if (data && typeof data.total === 'number') {
    return Math.max(1, Math.ceil(data.total / pageSize))
  }
  return 1
})

function canonicalCategoryFromQuery(raw) {
  const r = typeof raw === 'string' ? raw.trim() : Array.isArray(raw) ? String(raw[0] ?? '').trim() : ''
  if (!r) return 'All'
  return r
}

watch(
  () => route.query.category,
  () => {
    selectedCategory.value = canonicalCategoryFromQuery(route.query.category)
  },
  { immediate: true }
)

watch(
  () => route.query.search,
  (val) => {
    search.value = typeof val === 'string' ? val : ''
  },
  { immediate: true }
)

watch(search, (val) => {
  currentPage.value = 1
  const cur = route.query.search
  const curStr = typeof cur === 'string' ? cur : undefined
  if (curStr === val || (!curStr && !val)) return
  router.replace({ path: '/', query: val ? { ...route.query, search: val } : Object.fromEntries(Object.entries(route.query).filter(([k]) => k !== 'search')) })
})

watch(selectedCategory, (cat) => {
  currentPage.value = 1
  const want = cat === 'All' ? undefined : cat
  const cur = route.query.category
  const curStr = typeof cur === 'string' ? cur : undefined
  if (curStr === want || (!curStr && !want)) return
  router.replace({ path: '/', query: want ? { ...route.query, category: want } : Object.fromEntries(Object.entries(route.query).filter(([k]) => k !== 'category')) })
})

watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  loadProducts()
})

function norm(s) {
  return String(s ?? '')
    .trim()
    .toLowerCase()
}

function selectCategory(cat) {
  selectedCategory.value = cat
}

function clearFilters() {
  selectedCategory.value = 'All'
  search.value = ''
}

function onSearchEnter() {
  currentPage.value = 1
}

function goToPage(page) {
  currentPage.value = page
}
</script>

<style scoped>
.home-page { min-height: 100vh; background: #f8fafc; padding: 28px 16px; }
.container { max-width: 1200px; margin: 0 auto; }
.top-row { display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; align-items: center; margin-bottom: 18px; }
.brand { font-size: 22px; color: #111827; font-family: 'Cormorant Garamond', serif; }
.search-wrapper { display: flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #d1d5db; border-radius: 999px; padding: 10px 14px; width: 280px; max-width: 100%; }
.search-wrapper:focus-within { border-color: #d4af64; outline: 2px solid #d4af64; outline-offset: 2px; }
.search-icon { flex-shrink: 0; color: #9ca3af; }
.search-input { border: none; background: transparent; padding: 0; width: 100%; font: inherit; outline: none; }
.search-input::placeholder { color: #9ca3af; }
.filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
.filter-btn { border: 1px solid #d1d5db; background: #fff; color: #4b5563; border-radius: 999px; padding: 8px 14px; cursor: pointer; }
.filter-btn.active { background: #d4af64; color: #0a0806; border-color: #d4af64; }
.row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
@media (min-width: 768px) {
  .row { grid-template-columns: repeat(3, 1fr); }
}
@media (min-width: 992px) {
  .row { grid-template-columns: repeat(4, 1fr); }
}
.status-text { color: #6b7280; margin: 12px 0; }
.status-text.error { color: #dc2626; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 20px; text-align: center; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; width: 100%; }
.empty-icon { color: #d1d5db; margin-bottom: 16px; }
.empty-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; color: #111827; margin: 0 0 6px; }
.empty-text { color: #6b7280; font-size: 14px; margin: 0 0 16px; }
.empty-cta { padding: 10px 20px; background: #111827; color: #fff; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; transition: background 0.2s ease; }
.empty-cta:hover { background: #d4af64; color: #0a0806; }
.pagination { display: flex; justify-content: center; align-items: center; gap: 12px; margin-top: 24px; }
.page-btn { border: 1px solid #d1d5db; background: #fff; color: #374151; border-radius: 8px; padding: 8px 14px; cursor: pointer; font-size: 13px; }
.page-btn:hover:not(:disabled) { border-color: #d4af64; color: #d4af64; }
.page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.page-info { font-size: 13px; color: #6b7280; }
@media (max-width: 900px) {
  .home-page { padding: 20px 12px; }
  .top-row { margin-bottom: 14px; }
  .brand { font-size: 20px; }
  .search-wrapper { width: 100%; }
}
@media (max-width: 640px) {
  .home-page { padding: 16px 10px; }
  .top-row { flex-direction: column; align-items: stretch; }
  .brand { font-size: 18px; }
  .filters { gap: 6px; margin-bottom: 14px; }
  .filter-btn { padding: 7px 12px; font-size: 13px; }
}
</style>
