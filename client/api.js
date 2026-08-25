const TOKEN_KEY = 'mp.token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function request(path, options = {}) {
  const token = getToken()

  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error ?? `Request failed (${response.status})`)
  }

  return response.json()
}

export function login(email, password) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function fetchCurrentUser() {
  return request('/me')
}

export function fetchListings(search) {
  return request(`/listings?limit=10000&search=${encodeURIComponent(search)}`)
}

export function placeOrder({ listingId, quantity, unitPricePence }) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify({ listingId, quantity, unitPricePence }),
  })
}
