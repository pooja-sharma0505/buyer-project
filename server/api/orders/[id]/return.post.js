import { getPool } from '../../../utils/db.js'
import { requireUser } from '../../../utils/auth.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const reason = String(body?.reason ?? '').trim()

  if (!id) {
    throw createError({ statusCode: 400, message: 'Order ID is required' })
  }

  const pool = getPool()

  // Verify ownership and check if returnable
  const [orders] = await pool.query(
    `SELECT id, status, created_at FROM orders WHERE id = ? AND user_id = ? LIMIT 1`,
    [id, user.id]
  )

  if (!orders.length) {
    throw createError({ statusCode: 404, message: 'Order not found' })
  }

  const order = orders[0]
  const status = String(order.status ?? '').toLowerCase()

  if (status !== 'delivered' && status !== 'completed') {
    throw createError({ statusCode: 400, message: 'This order cannot be returned' })
  }

  // Check 30-day return window
  const orderDate = new Date(order.created_at)
  const now = new Date()
  const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24))
  if (diffDays > 30) {
    throw createError({ statusCode: 400, message: 'Return window (30 days) has expired' })
  }

  // Update order status to "Return Requested"
  await pool.query('UPDATE orders SET status = ? WHERE id = ?', ['Return Requested', id])

  // In a real app, create a return request record
  // await pool.query('INSERT INTO returns (order_id, user_id, reason, status) VALUES (?, ?, ?, ?)', [id, user.id, reason, 'Pending'])

  return { message: 'Return request submitted successfully' }
})