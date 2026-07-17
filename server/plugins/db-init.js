import { getPool, testDbConnection } from '../utils/db.js'
import { ensureAuthTables, ensureOrderTables, seedDemoUserIfEmpty } from '../utils/schema.js'

export default defineNitroPlugin(async () => {
  try {
    await testDbConnection()
    const pool = getPool()
    await ensureAuthTables(pool)
    await ensureOrderTables(pool)
    await seedDemoUserIfEmpty(pool)
    const config = useRuntimeConfig()
    console.log(`[db] Connected to MySQL database: ${config.dbName}`)
  } catch (error) {
    console.warn(
      '[db] MySQL is not available. Start XAMPP MySQL, then restart `npm run dev`.',
      error?.message || error
    )
  }
})
