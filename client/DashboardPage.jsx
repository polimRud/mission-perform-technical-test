import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken, fetchCurrentUser, fetchReviews } from './api.js'
import { ReviewRow } from './ReviewRow.jsx'

const COLUMNS = [
  { key: 'employeeName', label: 'Employee' },
  { key: 'department', label: 'Department' },
  { key: 'reviewCycle', label: 'Cycle' },
  { key: 'score', label: 'Score' },
  { key: 'status', label: 'Status' },
]

export function DashboardPage() {
  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState(null)
  const [reviews, setReviews] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState({ key: 'employeeName', direction: 'asc' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCurrentUser()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null))
  }, [])

  useEffect(() => {
    setLoading(true)

    fetchReviews(search)
      .then((data) => {
        setReviews(data.items)
        setTotal(data.total)
        setError(null)
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  const sortedReviews = useMemo(() => {
    const copy = [...reviews]

    copy.sort((a, b) => {
      const left = a[sort.key]
      const right = b[sort.key]
      const comparison =
        typeof left === 'number' ? left - right : String(left).localeCompare(String(right))

      return sort.direction === 'asc' ? comparison : -comparison
    })

    return copy
  }, [reviews, sort])

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
          <h1>Performance reviews</h1>
          <p className="muted">
            {loading ? 'Loading…' : `${total.toLocaleString()} reviews`}
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
          placeholder="Search employee or department…"
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
          {sortedReviews.map((review, index) => (
            <ReviewRow key={index} review={review} />
          ))}
        </tbody>
      </table>

      {!loading && sortedReviews.length === 0 ? (
        <p className="muted">No reviews match that search.</p>
      ) : null}
    </div>
  )
}
