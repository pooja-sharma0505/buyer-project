import { getPool } from '../../utils/db.js'
import { requireUser } from '../../utils/auth.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, message: 'Address ID is required' })
  }

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

  const pool = getPool()

  // Verify ownership
  const [existing] = await pool.query('SELECT id FROM addresses WHERE id = ? AND user_id = ?', [id, user.id])
  if (!existing.length) {
    throw createError({ statusCode: 404, message: 'Address not found' })
  }

  // If this is set as default, unset other defaults
  if (isDefault) {
    await pool.query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [user.id])
  }

  await pool.query(
    `UPDATE addresses
     SET full_name = ?, phone = ?, address_line1 = ?, address_line2 = ?, city = ?, state = ?, zip = ?, country = ?, is_default = ?
     WHERE id = ? AND user_id = ?`,
    [fullName, phone, addressLine1, addressLine2, city, state, zip, country, isDefault ? 1 : 0, id, user.id]
  )

  return { message: 'Address updated' }
})