import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const styles = {
  nav: {
    background: '#1a1a1a',
    borderBottom: '2px solid #e63946',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
  },
  logo: {
    color: '#e63946',
    fontSize: '1.4rem',
    fontWeight: '800',
    letterSpacing: '2px',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  link: {
    color: '#cccccc',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  logoutBtn: {
    background: '#e63946',
    color: '#fff',
    border: 'none',
    padding: '0.4rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
  }
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/classes" style={styles.logo}>GYM MACETAS</Link>
      <div style={styles.links}>
        <Link to="/classes" style={styles.link}>Clases</Link>
        <Link to="/bookings" style={styles.link}>Mis Reservas</Link>
        {user?.role_id === 1 && (
          <Link to="/admin/classes" style={styles.link}>Admin</Link>
        )}
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Salir
        </button>
      </div>
    </nav>
  )
}