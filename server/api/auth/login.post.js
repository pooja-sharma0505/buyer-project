import { randomBytes } from 'node:crypto'
import { getPool } from '../../utils/db.js'
import { ensureAuthTables } from '../../utils/schema.js'
import { setSessionCookie } from '../../utils/auth.js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const name = String(body?.name ?? '').trim()
  const phone = String(body?.phone ?? '').trim()

  if (!name || !phone) {
    throw createError({ statusCode: 400, message: 'Name and phone are required' })
  }

  if (name.length < 2) {
    throw createError({ statusCode: 400, message: 'Name must be at least 2 characters' })
  }

  if (!/^\d{10,15}$/.test(phone)) {
    throw createError({ statusCode: 400, message: 'Phone must be 10–15 digits' })
  }

  try {
    const pool = getPool()
    const [rows] = await pool.query(
      `
      SELECT id, name, phone, role
      FROM users
      WHERE name = ? AND phone = ?
      LIMIT 1
      `,
      [name, phone]
    )

    if (!rows.length) {
      throw createError({ statusCode: 401, message: 'Invalid credentials' })
    }

    await ensureAuthTables(pool)

    const token = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await pool.query('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)', [
      token,
      rows[0].id,
      expires
    ])

    setSessionCookie(event, token)

    return {
      message: 'Login successful',
      user: rows[0]
    }
  } catch (error) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      message: 'Login failed',
      data: { error: error.message }
    })
  }
})
