import { getPool } from '../utils/db.js'
import { requireUser } from '../utils/auth.js'

export default defineEventHandler(async (event) => {
  // Auth-gate this debug endpoint so it can't be called by anonymous users.
  await requireUser(event)

  try {
    const pool = getPool()
    const [rows] = await pool.query('SELECT NOW() AS currentTime')

    return {
      success: true,
      currentTime: rows[0].currentTime,
      message: 'Database connected successfully'
    }
  } catch (error) {
    console.error('[test-db] Database connection error:', error?.message || error)
    throw createError({
      statusCode: 500,
      message: 'Database connection failed'
    })
  }
})
