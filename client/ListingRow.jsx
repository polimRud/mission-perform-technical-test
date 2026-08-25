import { useState } from 'react'

export function ListingRow({ listing }) {
  const [flagged, setFlagged] = useState(false)

  return (
    <tr className={flagged ? 'flagged' : undefined}>
      <td>{listing.productName}</td>
      <td>{listing.category}</td>
      <td>{listing.season}</td>
      <td className="numeric">{listing.rating.toFixed(1)}</td>
      <td>
        <span className={`badge badge--${listing.status}`}>{listing.status}</span>
      </td>
      <td className="numeric">
        <input
          type="checkbox"
          checked={flagged}
          aria-label={`Flag ${listing.productName} for follow-up`}
          onChange={(event) => setFlagged(event.target.checked)}
        />
      </td>
    </tr>
  )
}
