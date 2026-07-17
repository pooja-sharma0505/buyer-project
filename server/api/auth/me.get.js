import { getUserFromSession } from '../../utils/auth.js'

export default defineEventHandler(async (event) => {
  const user = await getUserFromSession(event)
  return { user }
})
