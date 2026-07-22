import { getPool } from '../../utils/db.js'
import { getDemoProducts } from '../../utils/demo-products.js'
import { fetchAllProductsRows, toProductPayload } from '../../utils/products.js'

export default defineEventHandler(async () => {
  try {
    const pool = getPool()
    const { rows, hasCategory } = await fetchAllProductsRows(pool)
    return rows.map((row) => toProductPayload(row, hasCategory))
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Database products failed in production:', error?.message || String(error))
      throw createError({ statusCode: 500, message: 'Failed to load products' })
    }

    const message = error?.message || String(error)
    console.warn(
      'Falling back to demo products because database products could not be loaded:',
      message
    )
    return getDemoProducts()
  }
})
