import express from 'express'
import { router } from './routes.js'

const app = express()
const PORT = process.env.PORT ?? 4000

app.use(express.json())
app.use('/api', router)

app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` })
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
