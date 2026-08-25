# Catalogue Dashboard — Bug Hunt

A small MERN-style app: a login page, and a dashboard listing product catalogue
entries. There is no database — the listings live in
`server/data/listings.json` and are loaded at startup.

## Running it

```
npm install
npm run dev
```

That starts the API on <http://localhost:4000> and the app on
<http://localhost:5173>. Open the app in your browser.

### Dev logins

| Email                            | Password     |
| -------------------------------- | ------------ |
| `ana.ruiz@missionperform.com`    | `hunter2`    |
| `sam.okafor@missionperform.com`  | `review2026` |

## Your task

This app has **5 known defects**, spread across `client/` and `server/`.

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
  users.js        Fixture accounts
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
