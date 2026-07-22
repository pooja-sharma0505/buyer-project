import { getPool } from '../utils/db.js'
import { requireUser } from '../utils/auth.js'
import { ensureReviewTables } from '../utils/schema.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)
  const productId = Number(body?.productId)
  const rating = Number(body?.rating)
  const comment = String(body?.comment ?? '').trim()

  if (!productId || !Number.isFinite(rating) || rating < 1 || rating > 5) {
    throw createError({ statusCode: 400, message: 'Product ID and rating (1-5) are required' })
  }

  try {
    const pool = getPool()
    await ensureReviewTables(pool)

    await pool.query(
      'INSERT INTO reviews (product_id, user_id, user_name, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [productId, user.id, user.name, rating, comment]
    )

    return { message: 'Review submitted' }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to submit review',
      data: { error: error.message }
    })
  }
})