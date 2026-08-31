import mongoose from 'mongoose'

// `_id` holds the fixture id ("lst_00001") rather than an ObjectId, so a
// Listing carries the same identity in Mongo that it has in listings.json.
// Price is stored in whole pence; the client formats it for display.
const listingSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    season: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    status: { type: String, required: true, enum: ['draft', 'submitted', 'approved'] },
    pricePence: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true },
  },
  { versionKey: false },
)

export const Listing = mongoose.model('Listing', listingSchema)
