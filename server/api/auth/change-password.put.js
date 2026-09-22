import { getPool } from '../../utils/db.js'
import { requireUser } from '../../utils/auth.js'
import { ensureUsersTable } from '../../utils/schema.js'
import { enforceRateLimit } from '../../utils/rate-limit.js'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  enforceRateLimit(event, { scope: 'change-password', max: 5, windowMs: 15 * 60 * 1000 })

  const authenticatedUser = await requireUser(event)
  const body = await readBody(event)
  const newPassword = String(body?.newPassword ?? '')

  if (!newPassword) {
    throw createError({ statusCode: 400, message: 'New password is required' })
  }

  if (newPassword.length < 6) {
    throw createError({ statusCode: 400, message: 'Password must be at least 6 characters' })
  }

  if (newPassword.length > 255) {
    throw createError({ statusCode: 400, message: 'Password must be 255 characters or fewer' })
  }

  const pool = getPool()
  await ensureUsersTable(pool)

  try {
    const passwordHash = await bcrypt.hash(newPassword, 10)
    await pool.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [passwordHash, authenticatedUser.id]
    )

    return { message: 'Password updated successfully' }
  } catch (error) {
    if (error.statusCode) throw error
    console.error('[change-password] Unexpected error:', error?.message || error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update password'
    })
  }
})
