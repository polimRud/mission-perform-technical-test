import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardPage } from './DashboardPage.jsx'
import { LoginPage } from './LoginPage.jsx'
import { ProtectedRoute } from './ProtectedRoute.jsx'

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
