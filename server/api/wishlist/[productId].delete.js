import { getPool } from '../../utils/db.js'
import { requireUser } from '../../utils/auth.js'
import { ensureWishlistTable } from '../../utils/schema.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const productId = getRouterParam(event, 'productId')
  const pool = getPool()
  await ensureWishlistTable(pool)

  const [result] = await pool.query(
    'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
    [user.id, Number(productId)]
  )

  if (result.affectedRows === 0) {
    throw createError({ statusCode: 404, message: 'Wishlist item not found' })
  }

  return { message: 'Removed from wishlist' }
})
