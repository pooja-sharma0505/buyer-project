export async function ensureAuthTables(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      token VARCHAR(64) PRIMARY KEY,
      user_id INT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Add password_hash column if missing (migration for existing users table)
  try {
    await pool.query(`ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL AFTER phone`)
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME' && err.code !== 'ER_BAD_FIELD_ERROR') throw err
  }
}

export async function ensureOrderTables(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      subtotal DECIMAL(10,2) NOT NULL,
      tax DECIMAL(10,2) NOT NULL,
      total DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      qty INT NOT NULL
    )
  `)
}

export async function seedDemoUserIfEmpty(pool, defaultPasswordHash) {
  const [rows] = await pool.query('SELECT COUNT(*) AS cnt FROM users')
  if (Number(rows[0]?.cnt) > 0) return

  await pool.query(
    'INSERT INTO users (name, phone, password_hash, role) VALUES (?, ?, ?, ?)',
    ['Demo User', '9876543210', defaultPasswordHash, 'customer']
  )
  console.log('[db] Seeded demo user — login with name "Demo User" and phone "9876543210", password "demo123"')
}
