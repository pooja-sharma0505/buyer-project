import { getPool } from '../utils/db.js'
import { requireUser } from '../utils/auth.js'
import { fetchProductRowById, toProductPayload, fetchReviewStats } from '../utils/products.js'
import { ensureCartTables } from '../utils/schema.js'
// Force rebuild v3

export default defineEventHandler(async (event) => {
  try {
    const user = await requireUser(event)
    const pool = getPool()

    let rows = []
    try {
      const result = await pool.query(
        'SELECT product_id, qty FROM cart WHERE user_id = ? ORDER BY created_at DESC',
        [user.id]
      )
      rows = result[0] || []
    } catch (err) {
      if (err.code === 'ER_BAD_FIELD_ERROR' || err.errno === 1054) {
        const result = await pool.query(
          'SELECT product_id, qty FROM cart WHERE user_id = ?',
          [user.id]
        )
        rows = result[0] || []
      } else if (err.code === 'ER_NO_SUCH_TABLE' || err.errno === 1146) {
        await ensureCartTables(pool)
        const result = await pool.query(
          'SELECT product_id, qty FROM cart WHERE user_id = ?',
          [user.id]
        )
        rows = result[0] || []
      } else {
        throw err
      }
    }

    const items = []
    for (const row of rows) {
      const { rows: productRows } = await fetchProductRowById(pool, row.product_id)
      if (!productRows.length) continue
      const reviewStats = await fetchReviewStats(pool, [row.product_id])
      const product = toProductPayload(productRows[0], true, reviewStats.get(row.product_id))
      items.push({ ...product, qty: row.qty })
    }

    return { items }
  } catch (err) {
    console.error('[cart.get] Error:', err.message, 'code:', err.code, 'errno:', err.errno)
    throw createError({ statusCode: 500, message: 'Cart error: ' + err.message })
  }
})