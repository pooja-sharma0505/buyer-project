import { getPool } from '../../utils/db.js'
import { requireUser } from '../../utils/auth.js'
import { ensureOrderTables } from '../../utils/schema.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const pool = getPool()
  await ensureOrderTables(pool)

  const page = Math.max(1, Number(getQuery(event).page) || 1)
  const limit = Math.max(1, Number(getQuery(event).limit) || 10)
  const offset = (page - 1) * limit

  // Count total orders for this user
  const [countRows] = await pool.query(
    'SELECT COUNT(*) AS total FROM orders WHERE user_id = ?',
    [user.id]
  )
  const total = Number(countRows[0]?.total || 0)
  const pageCount = Math.max(1, Math.ceil(total / limit))

  // Get paginated order IDs
  const [orderRows] = await pool.query(
    `SELECT id FROM orders WHERE user_id = ? ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
    [user.id, limit, offset]
  )

  if (!orderRows.length) {
    return { orders: [], total, pageCount, page, limit }
  }

  const orderIds = orderRows.map((r) => r.id)
  const placeholders = orderIds.map(() => '?').join(',')

  const [rows] = await pool.query(
    `
    SELECT o.id AS order_id, o.subtotal, o.tax, o.total, o.status, o.created_at,
           o.full_name, o.phone, o.address, o.city, o.zip,
           oi.product_id, oi.title, oi.price, oi.qty, p.image
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    LEFT JOIN products p ON p.id = oi.product_id
    WHERE o.id IN (${placeholders})
    ORDER BY FIELD(o.id, ${orderIds.map(() => '?').join(',')}), oi.id ASC
    `,
    [...orderIds, ...orderIds]
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
      qty: row.qty,
      image: row.image || null
    })
  }

  return { orders: Array.from(orderMap.values()), total, pageCount, page, limit }
})