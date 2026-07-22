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
    if (!item.id || !Number.isFinite(qty) || qty < 1 || qty > 999) {
      throw createError({ statusCode: 400, message: 'Invalid order items' })
    }
  }

  const pool = getPool()
  await ensureOrderTables(pool)

  const connection = await pool.getConnection()

  try {
    // Look up real prices and names from the products table
    const productIds = items.map((item) => Number(item.id))
    const [productRows] = await connection.query(
      `SELECT id, name, price FROM products WHERE id IN (${productIds.map(() => '?').join(',')})`,
      productIds
    )

    const productMap = new Map(productRows.map((p) => [p.id, p]))

    const resolvedItems = items.map((item) => {
      const product = productMap.get(Number(item.id))
      if (!product) {
        throw createError({ statusCode: 400, message: `Product not found: ${item.id}` })
      }
      return {
        id: item.id,
        title: product.name,
        price: Number(product.price),
        qty: Number(item.qty)
      }
    })

    const subtotal = resolvedItems.reduce((sum, item) => sum + item.price * item.qty, 0)
    const tax = subtotal * 0.18
    const total = subtotal + tax

    await connection.beginTransaction()

    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, subtotal, tax, total) VALUES (?, ?, ?, ?)',
      [user.id, subtotal, tax, total]
    )

    const orderId = orderResult.insertId

    for (const item of resolvedItems) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, title, price, qty) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.id, item.title, item.price, item.qty]
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
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      message: 'Failed to place order',
      data: { error: error.message }
    })
  } finally {
    connection.release()
  }
})
