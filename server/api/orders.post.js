import { getPool } from '../utils/db.js'
import { requireUser } from '../utils/auth.js'
import { ensureOrderTables } from '../utils/schema.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)
  const items = Array.isArray(body?.items) ? body.items : []

  if (!items.length) {
    throw createError({ statusCode: 400, message: 'Cart is empty' })
  }

  for (const item of items) {
    const qty = Number(item.qty)
    const price = Number(item.price)
    if (!item.id || !item.title || !Number.isFinite(qty) || qty < 1 || !Number.isFinite(price) || price < 0) {
      throw createError({ statusCode: 400, message: 'Invalid order items' })
    }
  }

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0)
  const tax = subtotal * 0.18
  const total = subtotal + tax

  const pool = getPool()
  await ensureOrderTables(pool)

  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, subtotal, tax, total) VALUES (?, ?, ?, ?)',
      [user.id, subtotal, tax, total]
    )

    const orderId = orderResult.insertId

    for (const item of items) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, title, price, qty) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.id, item.title, Number(item.price), Number(item.qty)]
      )
    }

    await connection.commit()

    return {
      message: 'Order placed successfully',
      orderId,
      subtotal,
      tax,
      total
    }
  } catch (error) {
    await connection.rollback()
    throw createError({
      statusCode: 500,
      message: 'Failed to place order',
      data: { error: error.message }
    })
  } finally {
    connection.release()
  }
})
