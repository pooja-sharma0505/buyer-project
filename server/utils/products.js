import { Buffer } from 'node:buffer'

function isMissingColumnError(err) {
  return err && (err.code === 'ER_BAD_FIELD_ERROR' || err.errno === 1054)
}

export async function fetchProductsPage(pool, { limit = 12, offset = 0, category = null, search = null } = {}) {
  const hasCategory = await checkColumnExists(pool, 'category')
  let baseQuery = `SELECT id, name, price, old_price, image, description${hasCategory ? ', category' : ''} FROM products`
  let countQuery = `SELECT COUNT(*) as total FROM products`
  const params = []
  const countParams = []
  const conditions = []

  if (search && search.trim()) {
    const q = `%${search.trim()}%`
    conditions.push(`(name LIKE ? OR description LIKE ?)`)
    params.push(q, q)
    countParams.push(q, q)
  }

  if (category && hasCategory) {
    conditions.push('category = ?')
    params.push(category)
    countParams.push(category)
  }

  if (conditions.length) {
    baseQuery += ' WHERE ' + conditions.join(' AND ')
    countQuery += ' WHERE ' + conditions.join(' AND ')
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

export async function fetchAllProductsRows(pool, { search = null } = {}) {
  let query = 'SELECT id, name, price, old_price, image, description, category FROM products'
  const params = []
  if (search && search.trim()) {
    query += ' WHERE name LIKE ? OR description LIKE ?'
    params.push(`%${search.trim()}%`, `%${search.trim()}%`)
  }
  query += ' ORDER BY id DESC'
  try {
    const [rows] = await pool.query(query, params)
    return { rows, hasCategory: true }
  } catch (err) {
    if (!isMissingColumnError(err)) throw err
    query = 'SELECT id, name, price, old_price, image, description FROM products'
    if (search && search.trim()) {
      query += ' WHERE name LIKE ? OR description LIKE ?'
    }
    query += ' ORDER BY id DESC'
    const [rows] = await pool.query(query, params)
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

function hashIdToFloat(id) {
  // Simple deterministic hash of an integer ID into [0, 1)
  let hash = id
  hash = ((hash >> 16) ^ hash) * 0x45d9f3b
  hash = ((hash >> 16) ^ hash) * 0x45d9f3b
  hash = (hash >> 16) ^ hash
  return (Math.abs(hash) % 1000) / 1000
}

function generateRating(id) {
  const f = hashIdToFloat(id)
  // rate between 3.0 and 4.9, step 0.1
  const rate = Math.round((3.0 + f * 1.9) * 10) / 10
  // count between 20 and 200, step 5
  const count = 20 + Math.round((f * 180) / 5) * 5
  return { rate, count }
}

export async function fetchReviewStats(pool, productIds) {
  if (!productIds.length) return new Map()
  const [rows] = await pool.query(
    `SELECT product_id, AVG(rating) AS avg_rating, COUNT(*) AS review_count
     FROM reviews
     WHERE product_id IN (${productIds.map(() => '?').join(',')})
     GROUP BY product_id`,
    productIds
  )
  const map = new Map()
  for (const row of rows) {
    map.set(Number(row.product_id), {
      rate: Math.round(Number(row.avg_rating) * 10) / 10,
      count: Number(row.review_count)
    })
  }
  return map
}

export function toProductPayload(row, hasCategory, ratingOverride = null) {
  const dbCat = hasCategory ? normalizeDbCategory(row.category) : ''
  const category = dbCat || inferCategoryFromName(row.name)
  const rating = ratingOverride ?? generateRating(row.id)
  return {
    id: row.id,
    title: row.name,
    price: Number(row.price),
    oldPrice: row.old_price ? Number(row.old_price) : null,
    category,
    image: publicImageUrl(row.image),
    description: row.description,
    rating
  }
}
