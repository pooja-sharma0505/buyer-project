import { getPool } from './db.js'
import { ensureAuthTables } from './schema.js'

const SESSION_COOKIE = 'auth_session'

export function getSessionToken(event) {
  return getCookie(event, SESSION_COOKIE) || null
}

export async function getUserFromSession(event) {
  const token = getSessionToken(event)
  if (!token) return null

  const pool = getPool()
  await ensureAuthTables(pool)

  const [rows] = await pool.query(
    `
    SELECT u.id, u.name, u.phone, u.role
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = ? AND s.expires_at > NOW()
    LIMIT 1
    `,
    [token]
  )

  return rows[0] || null
}

export async function requireUser(event) {
  const user = await getUserFromSession(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Login required' })
  }
  return user
}

export function setSessionCookie(event, token, maxAgeSeconds = 7 * 24 * 60 * 60) {
  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeSeconds
  })
}

export function clearSessionCookie(event) {
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

export async function destroySession(event) {
  const token = getSessionToken(event)
  if (!token) return

  const pool = getPool()
  await ensureAuthTables(pool)
  await pool.query('DELETE FROM sessions WHERE token = ?', [token])
  clearSessionCookie(event)
}
