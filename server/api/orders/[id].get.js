import { getPool } from '../../utils/db.js'
import { requireUser } from '../../utils/auth.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Order ID is required' })
  }

  const pool = getPool()

  const [orders] = await pool.query(
    `
    SELECT o.id AS order_id, o.subtotal, o.tax, o.total, o.status, o.created_at,
           o.full_name, o.phone, o.address, o.city, o.zip
    FROM orders o
    WHERE o.id = ? AND o.user_id = ?
    LIMIT 1
    `,
    [id, user.id]
  )

  if (!orders.length) {
    throw createError({ statusCode: 404, message: 'Order not found' })
  }

  const order = orders[0]

  const [items] = await pool.query(
    `
    SELECT product_id, title, price, qty
    FROM order_items
    WHERE order_id = ?
    ORDER BY id ASC
    `,
    [id]
  )

  return {
    id: order.order_id,
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    total: Number(order.total),
    status: order.status || 'Processing',
    fullName: order.full_name,
    phone: order.phone,
    address: order.address,
    city: order.city,
    zip: order.zip,
    createdAt: order.created_at,
    items: items.map((item) => ({
      productId: item.product_id,
      title: item.title,
      price: Number(item.price),
      qty: item.qty
    }))
  }
})
