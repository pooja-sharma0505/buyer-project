import { randomBytes } from 'node:crypto'
import { getPool } from '../../utils/db.js'
import { ensureAuthTables } from '../../utils/schema.js'
import { setSessionCookie } from '../../utils/auth.js'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const name = String(body?.name ?? '').trim()
  const phone = String(body?.phone ?? '').trim()
  const password = String(body?.password ?? '')

  if (!name || !phone || !password) {
    throw createError({ statusCode: 400, message: 'Name, phone, and password are required' })
  }

  if (name.length < 2) {
    throw createError({ statusCode: 400, message: 'Name must be at least 2 characters' })
  }

  if (!/^\d{10,15}$/.test(phone)) {
    throw createError({ statusCode: 400, message: 'Phone must be 10–15 digits' })
  }

  if (password.length < 6) {
    throw createError({ statusCode: 400, message: 'Password must be at least 6 characters' })
  }

  try {
    const pool = getPool()
    const [rows] = await pool.query(
      `
      SELECT id, name, phone, role, password_hash
      FROM users
      WHERE name = ? AND phone = ?
      LIMIT 1
      `,
      [name, phone]
    )

    if (!rows.length) {
      throw createError({ statusCode: 401, message: 'Invalid credentials' })
    }

    const user = rows[0]

    if (!user.password_hash) {
      throw createError({ statusCode: 401, message: 'Account not fully set up. Please contact support.' })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      throw createError({ statusCode: 401, message: 'Invalid credentials' })
    }

    await ensureAuthTables(pool)

    const token = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await pool.query('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)', [
      token,
      user.id,
      expires
    ])

    setSessionCookie(event, token)

    return {
      message: 'Login successful',
      user: { id: user.id, name: user.name, phone: user.phone, role: user.role }
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
