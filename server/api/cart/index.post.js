import { getPool } from '../../utils/db.js'
import { requireUser } from '../../utils/auth.js'
import { ensureCartTables } from '../../utils/schema.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)
  const items = Array.isArray(body?.items) ? body.items : []

  const pool = getPool()
  await ensureCartTables(pool)

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    // Clear existing cart for this user
    await connection.query('DELETE FROM cart WHERE user_id = ?', [user.id])

    // Insert new items
    for (const item of items) {
      const qty = Number(item.qty) || 1
      if (!item.id || qty < 1) continue
      await connection.query(
        'INSERT INTO cart (user_id, product_id, title, price, qty, image) VALUES (?, ?, ?, ?, ?, ?)',
        [user.id, item.id, item.title || '', item.price || 0, qty, item.image || '']
      )
    }

    await connection.commit()
    return { message: 'Cart saved' }
  } catch (error) {
    await connection.rollback()
    throw createError({ statusCode: 500, message: 'Failed to save cart' })
  } finally {
    connection.release()
  }
})
