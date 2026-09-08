import { getPool } from '../../utils/db.js'
import { requireUser } from '../../utils/auth.js'
import { ensureWishlistTable } from '../../utils/schema.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)
  const productId = Number(body?.productId)

  if (!productId) {
    throw createError({ statusCode: 400, message: 'Product ID is required' })
  }

  const pool = getPool()
  await ensureWishlistTable(pool)

  try {
    await pool.query(
      'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
      [user.id, productId]
    )
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return { message: 'Already in wishlist' }
    }
    throw err
  }

  return { message: 'Added to wishlist' }
})
