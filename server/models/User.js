import mongoose from 'mongoose'

// `_id` holds the fixture id ("usr_1"), which is also the JWT subject.
const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
  },
  { versionKey: false },
)

export const User = mongoose.model('User', userSchema)
