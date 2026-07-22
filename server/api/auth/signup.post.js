import { getPool } from '../../utils/db.js'
import { ensureUsersTable } from '../../utils/schema.js'
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
    await ensureUsersTable(pool)

    // Check if user already exists with this phone
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE phone = ? LIMIT 1',
      [phone]
    )
    if (existing.length) {
      throw createError({ statusCode: 409, message: 'An account with this phone already exists' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const [result] = await pool.query(
      'INSERT INTO users (name, phone, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, phone, passwordHash, 'customer']
    )

    return {
      message: 'Account created successfully',
      user: { id: result.insertId, name, phone, role: 'customer' }
    }
  } catch (error) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      message: 'Signup failed',
      data: { error: error.message }
    })
  }
})