import { getPool } from '../../utils/db.js'
import { getDemoProducts } from '../../utils/demo-products.js'
import { fetchProductsPage, fetchAllProductsRows, toProductPayload, getProductsRatings } from '../../utils/products.js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 50))
  const category = typeof query.category === 'string' ? query.category : null

  try {
    const pool = getPool()

    if (query.page || query.limit) {
      const offset = (page - 1) * limit
      const { rows, hasCategory, total } = await fetchProductsPage(pool, { limit, offset, category })
      const ids = rows.map(r => r.id)
      const ratingsMap = await getProductsRatings(pool, ids)
      return {
        products: rows.map((row) => toProductPayload(row, hasCategory, ratingsMap.get(row.id) || null)),
        total,
        page,
        limit
      }
    }

    const { rows, hasCategory } = await fetchAllProductsRows(pool)
    const ids = rows.map(r => r.id)
    const ratingsMap = await getProductsRatings(pool, ids)
    return rows.map((row) => toProductPayload(row, hasCategory, ratingsMap.get(row.id) || null))
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Database products failed in production:', error?.message || String(error))
      throw createError({ statusCode: 500, message: 'Failed to load products' })
    }

    const message = error?.message || String(error)
    console.warn(
      'Falling back to demo products because database products could not be loaded:',
      message
    )
    return getDemoProducts()
  }
})
