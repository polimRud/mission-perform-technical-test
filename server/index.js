import express from 'express'
import { router } from './routes.js'
import { start, stop } from './db.js'

const app = express()
const PORT = process.env.PORT ?? 4000
const SHUTDOWN_GRACE_MS = 5000

app.use(express.json())
app.use('/api', router)

app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` })
})

// The in-memory database has to be up and seeded before the API can answer, so
// nothing listens until start() resolves.
const seeded = await start()
console.log(`Seeded ${seeded.listings} listings and ${seeded.users} users`)

const server = app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})

let shuttingDown = false

async function shutdown(signal) {
  if (shuttingDown) return
  shuttingDown = true

  console.log(`\n${signal} received, shutting down.`)

  // Stop accepting new connections, then drop the idle keep-alive sockets a
  // browser leaves open. Without that second call, close() waits on sockets
  // that will never send anything and the port stays held.
  const closed = new Promise((resolve) => server.close(resolve))
  server.closeIdleConnections()

  // A request still in flight gets the grace period to finish, then goes.
  const forced = setTimeout(() => {
    console.log('Grace period expired; dropping remaining connections.')
    server.closeAllConnections()
  }, SHUTDOWN_GRACE_MS)
  forced.unref()

  try {
    await closed
    // Only once nothing is being served can the database go, or in-flight
    // queries would fail on a disconnected client.
    await stop()
    console.log('Shutdown complete.')
  } catch (error) {
    console.error('Shutdown failed:', error)
    process.exitCode = 1
  } finally {
    clearTimeout(forced)
  }
}

// SIGINT is Ctrl+C. SIGTERM is what `node --watch` and most process managers
// send before a restart.
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => shutdown(signal))
}
