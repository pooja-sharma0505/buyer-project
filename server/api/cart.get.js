import { getPool } from '../utils/db.js'
import { requireUser } from '../utils/auth.js'
import { fetchProductRowById, toProductPayload, fetchReviewStats } from '../utils/products.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const pool = getPool()

  const [rows] = await pool.query(
    'SELECT product_id, qty FROM cart WHERE user_id = ? ORDER BY created_at DESC',
    [user.id]
  )

  const items = []
  for (const row of rows) {
    const { rows: productRows } = await fetchProductRowById(pool, row.product_id)
    if (!productRows.length) continue
    const reviewStats = await fetchReviewStats(pool, [row.product_id])
    const product = toProductPayload(productRows[0], true, reviewStats.get(row.product_id))
    items.push({ ...product, qty: row.qty })
  }

  return { items }
})