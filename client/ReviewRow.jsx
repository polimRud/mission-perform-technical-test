import { useState } from 'react'

export function ReviewRow({ review }) {
  const [flagged, setFlagged] = useState(false)

  return (
    <tr className={flagged ? 'flagged' : undefined}>
      <td>{review.employeeName}</td>
      <td>{review.department}</td>
      <td>{review.reviewCycle}</td>
      <td className="numeric">{review.score.toFixed(1)}</td>
      <td>
        <span className={`badge badge--${review.status}`}>{review.status}</span>
      </td>
      <td className="numeric">
        <input
          type="checkbox"
          checked={flagged}
          aria-label={`Flag ${review.employeeName} for follow-up`}
          onChange={(event) => setFlagged(event.target.checked)}
        />
      </td>
    </tr>
  )
}
