import { getPool } from '../../utils/db.js'
import { requireUser } from '../../utils/auth.js'
import { ensureCartTables } from '../../utils/schema.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const pool = getPool()
  await ensureCartTables(pool)

  const [rows] = await pool.query(
    `SELECT product_id, title, price, qty, image FROM cart WHERE user_id = ? ORDER BY created_at DESC`,
    [user.id]
  )

  return {
    items: rows.map((r) => ({
      id: r.product_id,
      title: r.title,
      price: Number(r.price),
      qty: r.qty,
      image: r.image
    }))
  }
})
