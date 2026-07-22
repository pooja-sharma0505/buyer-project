import { getPool, testDbConnection } from '../utils/db.js'
import { ensureAuthTables, ensureOrderTables, seedDemoUserIfEmpty, ensureReviewTables } from '../utils/schema.js'
import bcrypt from 'bcryptjs'

export default defineNitroPlugin(async () => {
  try {
    await testDbConnection()
    const pool = getPool()
    await ensureAuthTables(pool)
    await ensureOrderTables(pool)
    await ensureReviewTables(pool)
    const defaultPasswordHash = await bcrypt.hash('demo123', 10)
    await seedDemoUserIfEmpty(pool, defaultPasswordHash)
    const config = useRuntimeConfig()
    console.log(`[db] Connected to MySQL database: ${config.dbName}`)
  } catch (error) {
    console.warn(
      '[db] MySQL is not available. Start XAMPP MySQL, then restart `npm run dev`.',
      error?.message || error
    )
  }
})
