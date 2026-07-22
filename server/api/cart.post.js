import { getPool } from '../utils/db.js'
import { requireUser } from '../utils/auth.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)
  const items = Array.isArray(body?.items) ? body.items : []

  if (!items.length) {
    throw createError({ statusCode: 400, message: 'Cart items are required' })
  }

  const pool = getPool()

  for (const item of items) {
    const productId = Number(item.id)
    const qty = Number(item.qty)
    if (!productId || !Number.isFinite(qty) || qty < 1) continue

    await pool.query(
      `INSERT INTO cart_items (user_id, product_id, qty) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE qty = ?`,
      [user.id, productId, qty, qty]
    )
  }

  return { message: 'Cart updated' }
})