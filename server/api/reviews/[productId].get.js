import { getPool } from '../../utils/db.js'
import { ensureReviewTables } from '../../utils/schema.js'

export default defineEventHandler(async (event) => {
  const productId = getRouterParam(event, 'productId')

  try {
    const pool = getPool()
    await ensureReviewTables(pool)

    const [rows] = await pool.query(
      `
      SELECT id, user_name, rating, comment, created_at
      FROM reviews
      WHERE product_id = ?
      ORDER BY created_at DESC
      `,
      [productId]
    )

    return {
      reviews: rows.map((r) => ({
        id: r.id,
        userName: r.user_name,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.created_at
      }))
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch reviews',
      data: { error: error.message }
    })
  }
})