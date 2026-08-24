import { Navigate } from 'react-router-dom'
import { getToken } from './api.js'

export function ProtectedRoute({ children }) {
  if (!getToken()) {
    return <Navigate to="/login" replace />
  }

  return children
}
