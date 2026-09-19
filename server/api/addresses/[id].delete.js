import { getPool } from '../../utils/db.js'
import { requireUser } from '../../utils/auth.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Address ID is required' })
  }

  const pool = getPool()

  // Verify ownership
  const [existing] = await pool.query('SELECT id FROM addresses WHERE id = ? AND user_id = ?', [id, user.id])
  if (!existing.length) {
    throw createError({ statusCode: 404, message: 'Address not found' })
  }

  await pool.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [id, user.id])

  return { message: 'Address deleted' }
})