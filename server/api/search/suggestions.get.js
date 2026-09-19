import { getPool } from '../../utils/db.js'
import { fetchProductsPage, toProductPayload, fetchReviewStats } from '../../utils/products.js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = typeof query.q === 'string' ? query.q.trim() : ''
  const limit = Math.max(1, Math.min(10, Number(query.limit) || 5))

  if (!search || search.length < 2) {
    return { suggestions: [] }
  }

  try {
    const pool = getPool()
    const { rows, hasCategory } = await fetchProductsPage(pool, { limit, offset: 0, search, category: null })
    const ids = rows.map((r) => r.id)
    const reviewStats = await fetchReviewStats(pool, ids)
    const suggestions = rows.map((row) => toProductPayload(row, hasCategory, reviewStats.get(row.id)))
    return { suggestions }
  } catch (error) {
    console.error('[api/search/suggestions] Error:', error?.message || error)
    return { suggestions: [] }
  }
})