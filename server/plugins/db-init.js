import { getPool, testDbConnection } from '../utils/db.js'
import { ensureUsersTable, ensureProductsTable, ensureAuthTables, ensureOrderTables, seedDemoUserIfEmpty, ensureReviewTables, ensureCartTables } from '../utils/schema.js'
import { getDemoProducts } from '../utils/demo-products.js'
import bcrypt from 'bcryptjs'

export default defineNitroPlugin(async () => {
  try {
    await testDbConnection()
    const pool = getPool()
    await ensureUsersTable(pool)
    await ensureProductsTable(pool)
    await ensureAuthTables(pool)
    await ensureOrderTables(pool)
    await ensureCartTables(pool)
    await ensureReviewTables(pool)
    const defaultPasswordHash = await bcrypt.hash('demo123', 10)
    await seedDemoUserIfEmpty(pool, defaultPasswordHash)
    await seedDemoProductsIfEmpty(pool)
    const config = useRuntimeConfig()
    console.log(`[db] Connected to MySQL database: ${config.dbName}`)
  } catch (error) {
    console.warn(
      '[db] MySQL is not available. Start XAMPP MySQL, then restart `npm run dev`.',
      error?.message || error
    )
  }
})

async function seedDemoProductsIfEmpty(pool) {
  const [rows] = await pool.query('SELECT COUNT(*) AS cnt FROM products')
  if (Number(rows[0]?.cnt) > 0) return

  const products = getDemoProducts()
  for (const p of products) {
    await pool.query(
      'INSERT INTO products (name, price, old_price, image, description, category) VALUES (?, ?, ?, ?, ?, ?)',
      [p.title, p.price, p.oldPrice, p.image, p.description, p.category]
    )
  }
  console.log(`[db] Seeded ${products.length} demo products`)
}
