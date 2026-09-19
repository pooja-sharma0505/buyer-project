import { getPool } from '../utils/db.js'
import { requireUser } from '../utils/auth.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const pool = getPool()

  const [rows] = await pool.query(
    `SELECT id, full_name, phone, address_line1, address_line2, city, state, zip, country, is_default
     FROM addresses
     WHERE user_id = ?
     ORDER BY is_default DESC, created_at DESC`,
    [user.id]
  )

  return {
    addresses: rows.map((r) => ({
      id: r.id,
      fullName: r.full_name,
      phone: r.phone,
      addressLine1: r.address_line1,
      addressLine2: r.address_line2,
      city: r.city,
      state: r.state,
      zip: r.zip,
      country: r.country,
      isDefault: Boolean(r.is_default)
    }))
  }
})