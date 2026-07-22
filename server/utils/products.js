import { Buffer } from 'node:buffer'

function isMissingColumnError(err) {
  return err && (err.code === 'ER_BAD_FIELD_ERROR' || err.errno === 1054)
}

export async function fetchProductsPage(pool, { limit = 12, offset = 0, category = null } = {}) {
  const hasCategory = await checkColumnExists(pool, 'category')
  let baseQuery = `SELECT id, name, price, old_price, image, description${hasCategory ? ', category' : ''} FROM products`
  let countQuery = `SELECT COUNT(*) as total FROM products`
  const params = []
  const countParams = []

  if (category && hasCategory) {
    baseQuery += ' WHERE category = ?'
    countQuery += ' WHERE category = ?'
    params.push(category)
    countParams.push(category)
  }

  baseQuery += ' ORDER BY id DESC LIMIT ? OFFSET ?'
  params.push(Number(limit), Number(offset))

  const [rows] = await pool.query(baseQuery, params)
  const [countRows] = await pool.query(countQuery, countParams)
  return { rows, hasCategory, total: Number(countRows[0]?.total || 0) }
}

async function checkColumnExists(pool, column) {
  try {
    const [rows] = await pool.query(`SELECT ${column} FROM products LIMIT 1`)
    return true
  } catch (err) {
    if (err.code === 'ER_BAD_FIELD_ERROR' || err.errno === 1054) return false
    throw err
  }
}

export async function fetchAllProductsRows(pool) {
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

export async function fetchProductRowById(pool, id) {
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

function inferCategoryFromName(name = '') {
  const raw = String(name ?? '').trim()
  if (!raw) return 'General'

  const low = raw.toLowerCase()

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

export function toProductPayload(row, hasCategory) {
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
