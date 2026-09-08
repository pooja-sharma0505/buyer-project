import mysql from 'mysql2/promise'

let pool = null

function resolveDbConfig() {
  const config = useRuntimeConfig()

  const isProduction = process.env.NODE_ENV === 'production'

  if (isProduction && (!config.dbHost || config.dbHost === '127.0.0.1')) {
    console.error(
      '[db] CRITICAL: DB_HOST is not configured for production. ' +
      'Set DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME in your environment.'
    )
  }

  if (isProduction && !config.dbPassword) {
    console.warn('[security] DB_PASSWORD is empty in production — this is a critical security risk.')
  }

  const poolConfig = {
    host: config.dbHost || '127.0.0.1',
    port: Number(config.dbPort) || 3306,
    user: config.dbUser || 'root',
    password: config.dbPassword ?? '',
    database: config.dbName || 'demostore',
    waitForConnections: true,
    connectionLimit: 10
  }

  const isRemote = config.dbHost && config.dbHost !== '127.0.0.1' && config.dbHost !== 'localhost'
  if (isRemote) {
    poolConfig.ssl = {
      rejectUnauthorized: config.dbSslRejectUnauthorized !== false
    }
  }

  return poolConfig
}

export function getPool() {
  if (pool) return pool

  const config = resolveDbConfig()
  console.log('[db] Creating MySQL connection pool for database:', config.database, 'host:', config.host, 'port:', config.port)
  pool = mysql.createPool(config)
  return pool
}

export async function testDbConnection() {
  const activePool = getPool()
  try {
    await activePool.query('SELECT 1')
    console.log('[db] Database connection test successful')
    return true
  } catch (error) {
    console.error('[db] Database connection test failed:', error?.message || String(error))
    throw error
  }
}

export function resetPool() {
  if (pool) {
    pool.end().catch(() => {})
    pool = null
  }
}
