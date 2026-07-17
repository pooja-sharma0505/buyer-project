import { destroySession } from '../../utils/auth.js'

export default defineEventHandler(async (event) => {
  await destroySession(event)
  return { message: 'Logged out' }
})
