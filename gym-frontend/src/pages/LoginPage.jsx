import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/authService'
import { useAuth } from '../context/AuthContext'

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f0f0f',
  },
  card: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#e63946',
    marginBottom: '0.3rem',
    letterSpacing: '2px',
  },
  subtitle: {
    color: '#888',
    marginBottom: '2rem',
    fontSize: '0.9rem',
  },
  label: {
    display: 'block',
    color: '#aaa',
    fontSize: '0.85rem',
    marginBottom: '0.4rem',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: '#0f0f0f',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.95rem',
    marginBottom: '1.2rem',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '0.85rem',
    background: '#e63946',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '1px',
    marginTop: '0.5rem',
  },
  error: {
    background: '#2a0a0a',
    border: '1px solid #e63946',
    color: '#e63946',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    marginBottom: '1rem',
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { saveLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await login(email, password)
      const payload = JSON.parse(atob(data.access_token.split('.')[1]))
      saveLogin(data.access_token, { id: payload.sub, role_id: payload.role_id })
      navigate('/classes')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>GYM MACETAS</h1>
        <p style={styles.subtitle}>Inicia sesión para continuar</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@gym.com"
            required
          />
          <label style={styles.label}>Contraseña</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'INGRESAR'}
          </button>
        </form>
      </div>
    </div>
  )
}