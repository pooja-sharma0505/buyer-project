import { getPool } from '../utils/db.js'
import { requireUser } from '../utils/auth.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)
  const pool = getPool()

  if (body?.clearAll) {
    await pool.query('DELETE FROM cart_items WHERE user_id = ?', [user.id])
    return { message: 'Cart cleared' }
  }

  if (body?.productId) {
    await pool.query('DELETE FROM cart_items WHERE user_id = ? AND product_id = ?', [user.id, Number(body.productId)])
    return { message: 'Item removed' }
  }

  throw createError({ statusCode: 400, message: 'Missing productId or clearAll' })
})