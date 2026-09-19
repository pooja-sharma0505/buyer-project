import { getPool } from '../../utils/db.js'
import { ensureUsersTable } from '../../utils/schema.js'
import { enforceRateLimit } from '../../utils/rate-limit.js'
import { getOTP, clearOTP } from '../../utils/otp-store.js'

export default defineEventHandler(async (event) => {
  enforceRateLimit(event, { scope: 'verify-otp', max: 5, windowMs: 60 * 1000 })

  const body = await readBody(event)
  const phone = String(body?.phone ?? '').trim()
  const code = String(body?.code ?? '').trim()
  const name = String(body?.name ?? '').trim()
  const email = body?.email ? String(body.email).trim() : null
  const password = String(body?.password ?? '')

  if (!phone || !/^\d{10,15}$/.test(phone)) {
    throw createError({ statusCode: 400, message: 'Valid phone number is required' })
  }
  if (!code || !/^\d{6}$/.test(code)) {
    throw createError({ statusCode: 400, message: '6-digit code is required' })
  }

  try {
    const otpEntry = getOTP(phone)
    if (!otpEntry) {
      throw createError({ statusCode: 400, message: 'Code expired or not found. Please request a new one.' })
    }

    if (otpEntry.code !== code) {
      otpEntry.attempts++
      if (otpEntry.attempts >= 5) {
        clearOTP(phone)
        throw createError({ statusCode: 400, message: 'Too many failed attempts. Please request a new code.' })
      }
      throw createError({ statusCode: 400, message: 'Invalid code. Please try again.' })
    }

    // OTP verified - create user
    const pool = getPool()
    await ensureUsersTable(pool)

    // Check if user already exists (race condition protection)
    const [existing] = await pool.query('SELECT id FROM users WHERE phone = ? LIMIT 1', [phone])
    if (existing.length > 0) {
      throw createError({ statusCode: 409, message: 'An account with this phone number already exists' })
    }
    if (email) {
      const [existingEmail] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email])
      if (existingEmail.length > 0) {
        throw createError({ statusCode: 409, message: 'An account with this email already exists' })
      }
    }

    // Hash password
    const bcrypt = await import('bcryptjs')
    const passwordHash = await bcrypt.hash(password, 12)

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (name, phone, email, password_hash, role, email_verified, phone_verified) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, phone, email, passwordHash, 'user', !!email, true]
    )

    // Clear OTP
    clearOTP(phone)

    return { message: 'Account created successfully', userId: result.insertId }
  } catch (error) {
    if (error.statusCode) throw error
    console.error('[verify-otp] Unexpected error:', error?.message || error)
    throw createError({
      statusCode: 500,
      message: 'Failed to verify code and create account'
    })
  }
})