import { Router } from 'express'
import { login, requireAuth } from './auth.js'
import { Listing } from './models/Listing.js'
import { Order } from './models/Order.js'
import { User } from './models/User.js'

export const router = Router()

// The search is a case-insensitive substring match, so the term goes into a
// regex and its metacharacters have to be neutralised first.
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

router.post('/login', login)

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.auth.sub)

  if (!user) {
    return res.status(404).json({ error: 'User no longer exists.' })
  }

  return res.json({ id: user.id, name: user.name, email: user.email })
})

router.get('/listings', async (req, res) => {
  const search = String(req.query.search ?? '').trim().toLowerCase()

  const filter = search
    ? { $or: [{ productName: new RegExp(escapeRegExp(search), 'i') }, { category: new RegExp(escapeRegExp(search), 'i') }] }
    : {}

  const [items, total] = await Promise.all([
    Listing.aggregate([
      { $match: filter },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, id: '$_id', productName: '$productName', category: '$category', season: '$season', rating: '$rating', status: '$status', pricePence: '$pricePence', stock: '$stock' } },
    ]),
    Listing.countDocuments(filter),
  ])

  return res.json({ items, total })
})

router.post('/orders', requireAuth, async (req, res) => {
  const { listingId, quantity, unitPricePence } = req.body ?? {}


  const listing = await Listing.findById(listingId)

  if (!listing) {
    return res.status(404).json({ error: 'No such listing.' })
  }

  listing.stock -= quantity
  await listing.save()

  const order = await Order.create({
    listingId,
    merchandiserId: req.auth.sub,
    quantity,
    unitPricePence,
    placedAt: new Date(),
  })

  return res.status(201).json({
    id: order.id,
    listingId,
    quantity,
    unitPricePence,
    remainingStock: listing.stock,
  })
})
