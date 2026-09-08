import { getPool } from '../../utils/db.js'
import { requireUser } from '../../utils/auth.js'
import { ensureReviewTables } from '../../utils/schema.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)
  const productId = Number(body?.productId)
  const rating = Number(body?.rating)
  const comment = String(body?.comment ?? '').trim()

  if (!productId || !Number.isFinite(productId)) {
    throw createError({ statusCode: 400, message: 'Product ID is required' })
  }
  if (!rating || rating < 1 || rating > 5) {
    throw createError({ statusCode: 400, message: 'Rating must be between 1 and 5' })
  }
  if (comment.length < 5) {
    throw createError({ statusCode: 400, message: 'Comment must be at least 5 characters' })
  }

  const pool = getPool()
  await ensureReviewTables(pool)

  const [result] = await pool.query(
    'INSERT INTO reviews (product_id, user_id, user_name, rating, comment) VALUES (?, ?, ?, ?, ?)',
    [productId, user.id, user.name, rating, comment]
  )

  return {
    message: 'Review submitted successfully',
    reviewId: result.insertId
  }
})
