import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import listings from './data/listings.json' with { type: 'json' }
import { users } from './users.js'
import { Listing } from './models/Listing.js'
import './models/Order.js'
import { User } from './models/User.js'

let memoryServer

// Starts an in-process MongoDB, connects Mongoose to it, and seeds both
// collections from the fixtures. The database is empty on every boot, so the
// seed runs unconditionally and the fixtures are read exactly once.
export async function start() {
  memoryServer = await MongoMemoryServer.create()
  await mongoose.connect(memoryServer.getUri(), { dbName: 'catalogue' })

  await User.insertMany(users.map(({ id, ...rest }) => ({ _id: id, ...rest })))
  await Listing.insertMany(listings.map(({ id, ...rest }) => ({ _id: id, ...rest })))

  return { listings: listings.length, users: users.length }
}

export async function stop() {
  await mongoose.disconnect()
  await memoryServer?.stop()
}
