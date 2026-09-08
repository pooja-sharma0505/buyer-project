import { getPool } from '../utils/db.js'
import { requireUser } from '../utils/auth.js'
import { ensureOrderTables, ensureCartTables } from '../utils/schema.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)
  const items = Array.isArray(body?.items) ? body.items : []

  if (!items.length) {
    throw createError({ statusCode: 400, message: 'Cart is empty' })
  }

  const MAX_QTY = 2
  const resolvedItems = []

  for (const item of items) {
    const productId = Number(item.id)
    const qty = Number(item.qty)
    if (!productId || !Number.isFinite(qty) || qty < 1) {
      throw createError({ statusCode: 400, message: 'Invalid order items' })
    }
    if (qty > MAX_QTY) {
      throw createError({ statusCode: 400, message: `Maximum quantity per product is ${MAX_QTY}` })
    }
    resolvedItems.push({ id: productId, qty })
  }

  const pool = getPool()
  await ensureOrderTables(pool)
  await ensureCartTables(pool)

  const connection = await pool.getConnection()

  try {
    const productIds = resolvedItems.map((item) => item.id)
    const placeholders = productIds.map(() => '?').join(',')
    const [productRows] = await connection.query(
      `SELECT id, name, price FROM products WHERE id IN (${placeholders})`,
      productIds
    )

    const productMap = new Map(productRows.map((p) => [p.id, p]))

    const orderItems = resolvedItems.map((item) => {
      const product = productMap.get(item.id)
      if (!product) {
        throw createError({ statusCode: 400, message: `Product not found: ${item.id}` })
      }
      return {
        id: item.id,
        title: product.name,
        price: Number(product.price),
        qty: item.qty
      }
    })

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0)
    const tax = subtotal * 0.18
    const total = subtotal + tax

    await connection.beginTransaction()

    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, subtotal, tax, total, status) VALUES (?, ?, ?, ?, ?)',
      [user.id, subtotal, tax, total, 'Processing']
    )

    const orderId = orderResult.insertId

    for (const item of orderItems) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, title, price, qty) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.id, item.title, item.price, item.qty]
      )
    }

    await connection.query('DELETE FROM cart WHERE user_id = ?', [user.id])

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
    if (error.statusCode) throw error
    console.error('[orders.post] Unexpected error:', error?.message || error)
    throw createError({
      statusCode: 500,
      message: 'Failed to place order'
    })
  } finally {
    connection.release()
  }
})
