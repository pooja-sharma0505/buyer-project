import { getPool } from '../../utils/db.js'
import { requireUser } from '../../utils/auth.js'
import { ensureUsersTable } from '../../utils/schema.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const authenticatedUser = await requireUser(event)
  const body = await readBody(event)
  const name = String(body?.name ?? '').trim()
  const emailValue = String(body?.email ?? '').trim()
  const email = emailValue || null

  if (!name) {
    throw createError({ statusCode: 400, message: 'Name is required' })
  }

  if (name.length < 2) {
    throw createError({ statusCode: 400, message: 'Name must be at least 2 characters' })
  }

  if (name.length > 255) {
    throw createError({ statusCode: 400, message: 'Name must be 255 characters or fewer' })
  }

  if (email && (!EMAIL_PATTERN.test(email) || email.length > 255)) {
    throw createError({ statusCode: 400, message: 'Enter a valid email address' })
  }

  const pool = getPool()
  await ensureUsersTable(pool)

  try {
    await pool.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, authenticatedUser.id]
    )

    const [rows] = await pool.query(
      'SELECT id, name, phone, email, role FROM users WHERE id = ? LIMIT 1',
      [authenticatedUser.id]
    )

    if (!rows[0]) {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    return { user: rows[0] }
  } catch (error) {
    if (error.statusCode) throw error
    console.error('[profile] Unexpected error:', error?.message || error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update profile'
    })
  }
})
