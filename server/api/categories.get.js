import { getPool } from '../utils/db.js'

export default defineEventHandler(async () => {
  try {
    const pool = getPool()
    const [rows] = await pool.query('SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND TRIM(category) != "" ORDER BY category ASC')
    const categories = rows.map((r) => String(r.category).trim()).filter(Boolean)
    return categories
  } catch (error) {
    console.error('[api/categories] Error fetching categories:', error?.message || error)
    throw createError({ statusCode: 500, message: 'Failed to load categories' })
  }
})
