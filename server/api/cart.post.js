import { getPool } from '../utils/db.js'
import { requireUser } from '../utils/auth.js'
import { fetchProductRowById } from '../utils/products.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)
  const items = Array.isArray(body?.items) ? body.items : []

  if (!items.length) {
    throw createError({ statusCode: 400, message: 'Cart items are required' })
  }

  const pool = getPool()
  const MAX_QTY = 2

  const productIds = items
    .map((item) => Number(item.id))
    .filter((id) => Number.isFinite(id) && id > 0)

  if (!productIds.length) {
    throw createError({ statusCode: 400, message: 'Invalid cart items' })
  }

  const placeholders = productIds.map(() => '?').join(',')
  const [productRows] = await pool.query(
    `SELECT id, price FROM products WHERE id IN (${placeholders})`,
    productIds
  )

  const validProductIds = new Set(productRows.map((p) => p.id))

  for (const item of items) {
    const productId = Number(item.id)
    const requestedQty = Number(item.qty)

    if (!productId || !Number.isFinite(requestedQty) || requestedQty < 1) continue
    if (!validProductIds.has(productId)) continue

    const qty = Math.min(requestedQty, MAX_QTY)

    await pool.query(
      `INSERT INTO cart (user_id, product_id, qty) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE qty = ?`,
      [user.id, productId, qty, qty]
    )
  }

  return { message: 'Cart updated' }
})
