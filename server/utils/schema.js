export async function ensureAuthTables(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      token VARCHAR(64) PRIMARY KEY,
      user_id INT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
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

export async function seedDemoUserIfEmpty(pool) {
  const [rows] = await pool.query('SELECT COUNT(*) AS cnt FROM users')
  if (Number(rows[0]?.cnt) > 0) return

  await pool.query(
    'INSERT INTO users (name, phone, role) VALUES (?, ?, ?)',
    ['Demo User', '9876543210', 'customer']
  )
  console.log('[db] Seeded demo user — login with name "Demo User" and phone "9876543210"')
}
