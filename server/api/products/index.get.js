import { getPool } from '../../utils/db.js'
import { getDemoProducts } from '../../utils/demo-products.js'
import { fetchProductsPage, fetchAllProductsRows, toProductPayload, fetchReviewStats } from '../../utils/products.js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 50))
  const category = typeof query.category === 'string' ? query.category : null

  try {
    const pool = getPool()

    const search = typeof query.search === 'string' ? query.search.trim() : null

    if (query.page || query.limit || search) {
      const offset = (page - 1) * limit
      const { rows, hasCategory, total } = await fetchProductsPage(pool, { limit, offset, category, search })
      const ids = rows.map((r) => r.id)
      const reviewStats = await fetchReviewStats(pool, ids)
      const products = rows.map((row) => toProductPayload(row, hasCategory, reviewStats.get(row.id)))
      console.log('[api/products] Returning paginated products:', products.length, 'of', total, 'total')
      return {
        products,
        total,
        page,
        limit
      }
    }

    const { rows, hasCategory } = await fetchAllProductsRows(pool)
    const ids = rows.map((r) => r.id)
    const reviewStats = await fetchReviewStats(pool, ids)
    const products = rows.map((row) => toProductPayload(row, hasCategory, reviewStats.get(row.id)))
    console.log('[api/products] Returning all products:', products.length)
    return products
  } catch (error) {
    const message = error?.message || String(error)
    console.error('[api/products] Error fetching products:', message)

    if (process.env.NODE_ENV === 'production') {
      console.error('[api/products] Database products failed in production:', message)
      throw createError({ statusCode: 500, message: 'Failed to load products' })
    }

    console.warn(
      '[api/products] Falling back to demo products because database products could not be loaded:',
      message
    )
    const demoProducts = getDemoProducts()
    console.log('[api/products] Returning demo products:', demoProducts.length)
    if (query.page || query.limit || search) {
      const start = (page - 1) * limit
      const paged = demoProducts.slice(start, start + limit)
      return {
        products: paged,
        total: demoProducts.length,
        page,
        limit
      }
    }
    return demoProducts
  }
})
