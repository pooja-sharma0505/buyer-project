import { getPool } from '../../utils/db.js'
import { getDemoProductById } from '../../utils/demo-products.js'
import { fetchProductRowById, toProductPayload, getProductRatings } from '../../utils/products.js'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  try {
    const pool = getPool()
    const { rows, hasCategory } = await fetchProductRowById(pool, id)

    if (!rows.length) {
      throw createError({ statusCode: 404, message: 'Product not found' })
    }

    const rating = await getProductRatings(pool, id)
    return toProductPayload(rows[0], hasCategory, rating)
  } catch (error) {
    if (error.statusCode) throw error

    if (process.env.NODE_ENV === 'production') {
      console.error(`Database product lookup failed in production: ${id}`, error?.message || error)
      throw createError({ statusCode: 500, message: 'Failed to fetch product' })
    }

    const fallbackProduct = getDemoProductById(id)
    if (fallbackProduct) {
      console.warn(
        `Falling back to demo product ${id} because database product lookup failed:`,
        error?.message || error
      )
      return fallbackProduct
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to fetch product',
      data: { error: error.message }
    })
  }
})
