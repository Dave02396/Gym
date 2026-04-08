import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import ClassesPage from './pages/ClassesPage'
import BookingsPage from './pages/BookingsPage'
import AdminClassesPage from './pages/AdminClassesPage'
import Navbar from './components/Navbar'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" />
}

function AppRoutes() {
  const { token } = useAuth()

  return (
    <BrowserRouter>
      {token && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/classes" element={
          <PrivateRoute><ClassesPage /></PrivateRoute>
        } />
        <Route path="/bookings" element={
          <PrivateRoute><BookingsPage /></PrivateRoute>
        } />
        <Route path="/admin/classes" element={
          <PrivateRoute><AdminClassesPage /></PrivateRoute>
        } />
        <Route path="*" element={<Navigate to={token ? "/classes" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}