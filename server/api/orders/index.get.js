import { getPool } from '../../utils/db.js'
import { requireUser } from '../../utils/auth.js'
import { ensureOrderTables } from '../../utils/schema.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const pool = getPool()
  await ensureOrderTables(pool)

  const [rows] = await pool.query(
    `
    SELECT o.id AS order_id, o.subtotal, o.tax, o.total, o.status, o.created_at,
           o.full_name, o.phone, o.address, o.city, o.zip,
           oi.product_id, oi.title, oi.price, oi.qty
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC, oi.id ASC
    `,
    [user.id]
  )

  const orderMap = new Map()
  for (const row of rows) {
    if (!orderMap.has(row.order_id)) {
      orderMap.set(row.order_id, {
        id: row.order_id,
        subtotal: Number(row.subtotal),
        tax: Number(row.tax),
        total: Number(row.total),
        status: row.status || 'Processing',
        fullName: row.full_name,
        phone: row.phone,
        address: row.address,
        city: row.city,
        zip: row.zip,
        createdAt: row.created_at,
        items: []
      })
    }
    orderMap.get(row.order_id).items.push({
      productId: row.product_id,
      title: row.title,
      price: Number(row.price),
      qty: row.qty
    })
  }

  return { orders: Array.from(orderMap.values()) }
})