import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { findUserByEmail } from './users.js'

const SECRET = process.env.JWT_SECRET ?? 'dev-only-secret'
const TOKEN_TTL = '1h'

export async function login(req, res) {
  const { email, password } = req.body ?? {}

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  const user = findUserByEmail(email)
  const hash = user?.passwordHash

  // Compare against a dummy hash when the user is unknown so that a missing
  // account and a wrong password take the same amount of time to reject.
  const matches = await bcrypt.compare(password, hash ?? '$2b$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv')

  if (!user || !matches) {
    return res.status(401).json({ error: 'Invalid email or password.' })
  }

  const token = jwt.sign({ sub: user.id }, SECRET, { expiresIn: TOKEN_TTL })
  return res.json({ token })
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? ''

  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token.' })
  }

  try {
    req.auth = jwt.verify(header.slice('Bearer '.length), SECRET)
    return next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' })
  }
}
