import { getPool } from '../../utils/db.js'
import { enforceRateLimit } from '../../utils/rate-limit.js'

export default defineEventHandler(async (event) => {
  enforceRateLimit(event, { scope: 'forgot-password', max: 3, windowMs: 15 * 60 * 1000 })

  const body = await readBody(event)
  const phone = String(body?.phone ?? '').trim()

  if (!phone || !/^\d{10,15}$/.test(phone)) {
    throw createError({ statusCode: 400, message: 'Valid phone number is required' })
  }

  try {
    const pool = getPool()

    // Check if user exists (but don't reveal if they do)
    const [users] = await pool.query(
      'SELECT id FROM users WHERE phone = ? LIMIT 1',
      [phone]
    )

    if (users.length > 0) {
      // In production, generate a secure token and send via SMS
      // For now, just log it
      console.log(`[forgot-password] Reset requested for user ${users[0].id} (${phone})`)
      // TODO: Generate reset token, store with expiry, send via SMS/email
    }

    // Always return success for security (don't reveal if account exists)
    return { message: 'If an account exists for this number, a password reset link has been sent via SMS.' }
  } catch (error) {
    console.error('[forgot-password] Unexpected error:', error?.message || error)
    throw createError({
      statusCode: 500,
      message: 'Failed to process password reset request'
    })
  }
})