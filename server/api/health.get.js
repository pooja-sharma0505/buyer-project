import { getPool } from '../utils/db.js'

export default defineEventHandler(async () => {
  try {
    await getPool().query('SELECT 1')
    return { ok: true, database: 'connected' }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Database connection failed',
      data: { error: error.message }
    })
  }
})
