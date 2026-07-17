import mysql from 'mysql2/promise'

let pool = null

function resolveDbConfig() {
  const config = useRuntimeConfig()

  return {
    host: config.dbHost || '127.0.0.1',
    user: config.dbUser || 'root',
    password: config.dbPassword ?? '',
    database: config.dbName || 'demostore',
    waitForConnections: true,
    connectionLimit: 10
  }
}

export function getPool() {
  if (pool) return pool

  pool = mysql.createPool(resolveDbConfig())
  return pool
}

export async function testDbConnection() {
  const activePool = getPool()
  await activePool.query('SELECT 1')
  return true
}

export function resetPool() {
  if (pool) {
    pool.end().catch(() => {})
    pool = null
  }
}
