import { getPool } from '../../utils/db.js'
import { enforceRateLimit } from '../../utils/rate-limit.js'
import { generateOTP, setOTP } from '../../utils/otp-store.js'

export default defineEventHandler(async (event) => {
  enforceRateLimit(event, { scope: 'send-otp', max: 3, windowMs: 60 * 1000 })

  const body = await readBody(event)
  const phone = String(body?.phone ?? '').trim()
  const name = String(body?.name ?? '').trim()
  const email = body?.email ? String(body.email).trim() : null
  const password = String(body?.password ?? '')

  if (!phone || !/^\d{10,15}$/.test(phone)) {
    throw createError({ statusCode: 400, message: 'Valid phone number is required' })
  }
  if (!name || name.length < 2) {
    throw createError({ statusCode: 400, message: 'Name must be at least 2 characters' })
  }
  if (!password || password.length < 6) {
    throw createError({ statusCode: 400, message: 'Password must be at least 6 characters' })
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, message: 'Invalid email format' })
  }

  try {
    const pool = getPool()

    // Check if user already exists
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

    // Generate and store OTP
    const code = generateOTP()
    setOTP(phone, code, { name, email, password })

    // In production, send via SMS provider (Twilio, etc.)
    // For now, log to console
    console.log(`[send-otp] OTP for ${phone}: ${code}`)

    return { message: 'Verification code sent', expiresIn: 600 }
  } catch (error) {
    if (error.statusCode) throw error
    console.error('[send-otp] Unexpected error:', error?.message || error)
    throw createError({
      statusCode: 500,
      message: 'Failed to send verification code'
    })
  }
})