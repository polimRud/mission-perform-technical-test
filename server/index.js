import express from 'express'
import { router } from './routes.js'
import { start } from './db.js'

const app = express()
const PORT = process.env.PORT ?? 4000

app.use(express.json())
app.use('/api', router)

app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` })
})

// The in-memory database has to be up and seeded before the API can answer, so
// nothing listens until start() resolves.
const seeded = await start()
console.log(`Seeded ${seeded.listings} listings and ${seeded.users} users`)

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
