// Shared in-memory OTP store (dev only).
// NOTE: In production / serverless, use Redis or DB with TTL.
const otpStore = new Map()

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function setOTP(phone, code, data) {
  otpStore.set(phone, {
    code,
    data,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    attempts: 0
  })
}

export function getOTP(phone) {
  const entry = otpStore.get(phone)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(phone)
    return null
  }
  return entry
}

export function clearOTP(phone) {
  otpStore.delete(phone)
}
