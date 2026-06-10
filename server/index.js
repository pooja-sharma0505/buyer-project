import { Buffer } from 'node:buffer'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from './utils/db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = Number(process.env.API_PORT || 4001)

function isMissingColumnError(err) {
  return err && (err.code === 'ER_BAD_FIELD_ERROR' || err.errno === 1054)
}

/** Prefer DB `category`; if the column does not exist, retry without it (infer from name instead). */
async function fetchAllProductsRows() {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, price, old_price, image, description, category FROM products ORDER BY id DESC`
    )
    return { rows, hasCategory: true }
  } catch (err) {
    if (!isMissingColumnError(err)) throw err
    const [rows] = await pool.query(
      `SELECT id, name, price, old_price, image, description FROM products ORDER BY id DESC`
    )
    return { rows, hasCategory: false }
  }
}

async function fetchProductRowById(id) {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, price, old_price, image, description, category FROM products WHERE id = ? LIMIT 1`,
      [id]
    )
    return { rows, hasCategory: true }
  } catch (err) {
    if (!isMissingColumnError(err)) throw err
    const [rows] = await pool.query(
      `SELECT id, name, price, old_price, image, description FROM products WHERE id = ? LIMIT 1`,
      [id]
    )
    return { rows, hasCategory: false }
  }
}

/** When there is no `category` column (or cell is blank), infer from **name only** — aligned with your shop (Men/Women/Jewellery/Electronics). */
function inferCategoryFromName(name = '') {
  const raw = String(name ?? '').trim()
  if (!raw) return 'General'

  const low = raw.toLowerCase()

  // Names like "Men Casual Shirt" / "Women Kurti"
  if (/\bmen\b/.test(low)) return 'Men'
  if (/\bwomen\b/.test(low)) return 'Women'

  if (
    /laptop|smartphone|headphones?|phone|bluetooth|tablet|electronics|charger|camera|monitor|keyboard|mouse|speaker/i.test(raw)
  ) {
    return 'Electronics'
  }

  if (/gold|silver|diamond|necklace|earring|earrings|jewel|jewellery|ring\b/i.test(raw)) {
    return 'Jewellery'
  }

  // Only real cosmetics words (avoid "cream" inside unrelated strings)
  if (/\b(perfume|lipstick|foundation|makeup|mascara|serum|concealer)\b|\bcream\b/i.test(low)) {
    return 'Beauty'
  }

  return 'General'
}

function normalizeDbCategory(value) {
  if (value === null || value === undefined) return ''
  const s = Buffer.isBuffer(value) ? value.toString('utf8') : String(value)
  const t = s.trim()
  if (!t || /^null$/i.test(t)) return ''
  return t.replace(/\s+/g, ' ')
}

function publicImageUrl(image) {
  if (image == null || !String(image).trim()) {
    return '/placeholder-product.svg'
  }
  const s = String(image).trim()
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  if (s.startsWith('/')) {
    return s.startsWith('/uploads/') ? s : `/uploads/${s.replace(/^\/+/u, '')}`
  }
  return `/uploads/${s}`
}

function toProductPayload(row, hasCategory) {
  const dbCat = hasCategory ? normalizeDbCategory(row.category) : ''
  const category = dbCat || inferCategoryFromName(row.name)
  return {
    id: row.id,
    title: row.name,
    price: Number(row.price),
    oldPrice: row.old_price ? Number(row.old_price) : null,
    category,
    image: publicImageUrl(row.image),
    description: row.description,
    rating: {
      rate: 4.5,
      count: 120
    }
  }
}

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ ok: true, database: 'connected' })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

app.get('/api/products', async (_req, res) => {
  try {
    const { rows, hasCategory } = await fetchAllProductsRows()
    const products = rows.map((row) => toProductPayload(row, hasCategory))

    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message })
  }
})

app.get('/api/products/:id', async (req, res) => {
  try {
    const { rows, hasCategory } = await fetchProductRowById(req.params.id)

    if (!rows.length) {
      res.status(404).json({ message: 'Product not found' })
      return
    }

    const row = rows[0]
    res.json(toProductPayload(row, hasCategory))
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error: error.message })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { name, phone } = req.body

    if (!name || !phone) {
      res.status(400).json({ message: 'Name and phone are required' })
      return
    }

    const [rows] = await pool.query(
      `
      SELECT id, name, phone, role
      FROM users
      WHERE name = ? AND phone = ?
      LIMIT 1
      `,
      [name, phone]
    )

    if (!rows.length) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    res.json({
      message: 'Login successful',
      user: rows[0]
    })
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
