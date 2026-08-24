import { Router } from 'express'
import reviews from './data/reviews.json' with { type: 'json' }
import { login, requireAuth } from './auth.js'
import { findUserById } from './users.js'

export const router = Router()

const DEFAULT_LIMIT = 25

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

router.post('/login', login)

router.get('/me', requireAuth, (req, res) => {
  const user = findUserById(req.auth.sub)

  if (!user) {
    return res.status(404).json({ error: 'User no longer exists.' })
  }

  return res.json({ id: user.id, name: user.name, email: user.email })
})

router.get('/reviews', (req, res) => {
  const page = toPositiveInt(req.query.page, 1)
  const limit = toPositiveInt(req.query.limit, DEFAULT_LIMIT)
  const search = String(req.query.search ?? '').trim().toLowerCase()

  const matched = search
    ? reviews.filter(
        (review) =>
          review.employeeName.toLowerCase().includes(search) ||
          review.department.toLowerCase().includes(search),
      )
    : reviews

  const start = (page - 1) * limit

  return res.json({
    items: matched.slice(start, start + limit),
    total: matched.length,
    page,
    limit,
  })
})
