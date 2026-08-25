import mongoose from 'mongoose'

// Orders are created at runtime rather than seeded, so unlike Listing and User
// they take an ordinary ObjectId. `unitPricePence` is the price the Order was
// placed at, kept alongside the Order so a later price change cannot rewrite
// what a Merchandiser agreed to pay.
const orderSchema = new mongoose.Schema(
  {
    listingId: { type: String, required: true, ref: 'Listing' },
    merchandiserId: { type: String, required: true, ref: 'User' },
    quantity: { type: Number, required: true, min: 1 },
    unitPricePence: { type: Number, required: true, min: 0 },
    placedAt: { type: Date, required: true },
  },
  { versionKey: false },
)

export const Order = mongoose.model('Order', orderSchema)
