import { getPool } from '../../utils/db.js'
import { requireUser } from '../../utils/auth.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const pool = getPool()

  // In a real app, this would be a wallet table
  // For now, return a mock balance or calculate from wallet table
  try {
    const [rows] = await pool.query('SELECT balance FROM wallet WHERE user_id = ?', [user.id])
    return { balance: rows[0]?.balance || 0 }
  } catch {
    return { balance: 0 }
  }
})