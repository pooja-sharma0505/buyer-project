import { getPool } from '../utils/db.js'
import { requireUser } from '../utils/auth.js'

export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const pool = getPool()

  // In a real app, this would be a payment_methods table with tokenized references
  // For now, return mock data
  return { methods: [] }
})