# Catalogue Dashboard — Bug Hunt

A small MERN-style app: a login page, and a dashboard listing product catalogue
entries. Each entry carries a price and a stock level, and you can order a
quantity of one straight from its row.

An in-memory MongoDB (`mongodb-memory-server`) starts with the app and
is seeded once at startup from `server/data/listings.json`. Nothing is written
to disk, and the database is rebuilt from the fixture on every boot.

## Running it

```
npm install
npm run dev
```

That starts the API on <http://localhost:4000> and the app on
<http://localhost:5173>. Open the app in your browser.

> **Run this once before your session.** The first `npm run dev` downloads a
> MongoDB binary (~120 MB) before the API can start, so it takes noticeably
> longer than later runs. Wait for `API listening on http://localhost:4000` in
> the terminal before loading the page — the dashboard will show an error if you
> get there first.

Ctrl+C stops both cleanly: the API finishes any in-flight request, shuts the
in-memory database down and releases port 4000. If the port is ever still held
after you stop the app, an older server is still running.

### Dev logins

| Email                            | Password     |
| -------------------------------- | ------------ |
| `ana.ruiz@missionperform.com`    | `hunter2`    |
| `sam.okafor@missionperform.com`  | `review2026` |

## Your task

This app has **6 known defects**, spread across `client/` and `server/`.

For each one you find, tell us:

1. **What's wrong** — the defect itself.
2. **Why it matters** — the impact on a user, or on the business.
3. **How you'd fix it** — pseudo-code is completely fine.

**You are not expected to write working code.** We would much rather hear you
talk through the code than watch you type. Use the browser, the terminal, the
DevTools Network and Performance tabs — whatever you would normally reach for.

If you spot something that isn't on our list of five, say so anyway. We are
interested in how you read unfamiliar code, not in a scavenger hunt.

## Layout

```
server/
  index.js        Express app + listener
  routes.js       API routes
  auth.js         Login handler and auth middleware
  users.js        Fixture accounts (seed data)
  db.js           In-memory MongoDB startup + seeding
  models/         Listing, User and Order schemas
  data/           listings.json (10,000 records)
client/
  main.jsx        Entry point
  App.jsx         Routes
  LoginPage.jsx   Login form
  DashboardPage.jsx  Listing table
  ListingRow.jsx  A single table row
  ProtectedRoute.jsx Route guard
  api.js          fetch wrapper
```
