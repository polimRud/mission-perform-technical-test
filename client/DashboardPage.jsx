import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken, fetchCurrentUser, fetchListings } from './api.js'
import { ListingRow } from './ListingRow.jsx'

const COLUMNS = [
  { key: 'productName', label: 'Product' },
  { key: 'category', label: 'Category' },
  { key: 'season', label: 'Season' },
  { key: 'rating', label: 'Rating' },
  { key: 'status', label: 'Status' },
]

export function DashboardPage() {
  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState(null)
  const [listings, setListings] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState({ key: 'productName', direction: 'asc' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCurrentUser()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null))
  }, [])

  useEffect(() => {
    setLoading(true)

    fetchListings(search)
      .then((data) => {
        setListings(data.items)
        setTotal(data.total)
        setError(null)
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  const sortedListings = useMemo(() => {
    const copy = [...listings]

    copy.sort((a, b) => {
      const left = a[sort.key]
      const right = b[sort.key]
      const comparison =
        typeof left === 'number' ? left - right : String(left).localeCompare(String(right))

      return sort.direction === 'asc' ? comparison : -comparison
    })

    return copy
  }, [listings, sort])

  function toggleSort(key) {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )
  }

  function signOut() {
    clearToken()
    navigate('/login', { replace: true })
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>Product catalogue</h1>
          <p className="muted">
            {loading ? 'Loading…' : `${total.toLocaleString()} listings`}
          </p>
        </div>
        <div className="topbar__right">
          {currentUser ? <span className="muted">{currentUser.name}</span> : null}
          <button type="button" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      <div className="toolbar">
        <input
          type="search"
          value={search}
          placeholder="Search product or category…"
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {error ? <p className="error">{error}</p> : null}

      <table>
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <th key={column.key}>
                <button type="button" className="sort" onClick={() => toggleSort(column.key)}>
                  {column.label}
                  {sort.key === column.key ? (sort.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                </button>
              </th>
            ))}
            <th className="numeric">Flag</th>
          </tr>
        </thead>
        <tbody>
          {sortedListings.map((listing, index) => (
            <ListingRow key={index} listing={listing} />
          ))}
        </tbody>
      </table>

      {!loading && sortedListings.length === 0 ? (
        <p className="muted">No listings match that search.</p>
      ) : null}
    </div>
  )
}
