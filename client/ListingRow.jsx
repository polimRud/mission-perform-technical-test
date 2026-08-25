import { useState } from 'react'
import { placeOrder } from './api.js'

export function formatPrice(pence) {
  return `£${(pence / 100).toFixed(2)}`
}

export function ListingRow({ listing, onOrdered }) {
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState(null)

  function order() {
    setMessage(null)

    placeOrder({
      listingId: listing.id,
      quantity,
      unitPricePence: listing.pricePence,
    })
      .then((placed) => {
        setMessage(`Ordered ${placed.quantity}`)
        onOrdered()
      })
      .catch((orderError) => setMessage(orderError.message))
  }

  return (
    <tr>
      <td>{listing.productName}</td>
      <td>{listing.category}</td>
      <td>{listing.season}</td>
      <td className="numeric">{listing.rating.toFixed(1)}</td>
      <td>
        <span className={`badge badge--${listing.status}`}>{listing.status}</span>
      </td>
      <td className="numeric">{formatPrice(listing.pricePence)}</td>
      <td className="numeric">{listing.stock}</td>
      <td className="order">
        <input
          type="number"
          min="1"
          value={quantity}
          aria-label={`Quantity of ${listing.productName} to order`}
          onChange={(event) => setQuantity(Number(event.target.value))}
        />
        <button type="button" onClick={order}>
          Order
        </button>
        {message ? <span className="muted order__message">{message}</span> : null}
      </td>
    </tr>
  )
}
