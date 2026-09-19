import { getPool } from '../utils/db.js'
import { requireUser } from '../utils/auth.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)

  const fullName = String(body?.fullName ?? '').trim()
  const phone = String(body?.phone ?? '').trim()
  const addressLine1 = String(body?.addressLine1 ?? '').trim()
  const addressLine2 = body?.addressLine2 ? String(body.addressLine2).trim() : ''
  const city = String(body?.city ?? '').trim()
  const state = String(body?.state ?? '').trim()
  const zip = String(body?.zip ?? '').trim()
  const country = String(body?.country ?? 'India').trim()
  const isDefault = Boolean(body?.isDefault)

  if (!fullName || !phone || !addressLine1 || !city || !state || !zip) {
    throw createError({ statusCode: 400, message: 'All required address fields must be provided' })
  }

  if (!/^\d{10,15}$/.test(phone)) {
    throw createError({ statusCode: 400, message: 'Invalid phone number' })
  }

  const pool = getPool()

  // If this is set as default, unset other defaults
  if (isDefault) {
    await pool.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [user.id])
  }

  const [result] = await pool.query(
    `INSERT INTO addresses (user_id, full_name, phone, address_line1, address_line2, city, state, zip, country, is_default)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [user.id, fullName, phone, addressLine1, addressLine2, city, state, zip, country, isDefault ? 1 : 0]
  )

  return { id: result.insertId, message: 'Address added' }
})