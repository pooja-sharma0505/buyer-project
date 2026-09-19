import { getPool } from '../../../utils/db.js'
import { requireUser } from '../../../utils/auth.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Order ID is required' })
  }

  const pool = getPool()

  // Verify ownership and check if cancellable
  const [orders] = await pool.query(
    `SELECT id, status FROM orders WHERE id = ? AND user_id = ? LIMIT 1`,
    [id, user.id]
  )

  if (!orders.length) {
    throw createError({ statusCode: 404, message: 'Order not found' })
  }

  const order = orders[0]
  const status = String(order.status ?? '').toLowerCase()

  if (status !== 'processing' && status !== 'placed' && status !== 'confirmed') {
    throw createError({ statusCode: 400, message: 'This order cannot be cancelled' })
  }

  await pool.query('UPDATE orders SET status = ? WHERE id = ?', ['Cancelled', id])

  return { message: 'Order cancelled successfully' }
})