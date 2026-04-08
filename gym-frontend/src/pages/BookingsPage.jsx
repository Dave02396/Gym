import { useState, useEffect } from 'react'
import { getMyBookings, cancelBooking } from '../services/bookingService'

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#fff',
  },
  subtitle: {
    color: '#888',
    fontSize: '0.9rem',
    marginTop: '0.3rem',
  },
  card: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '1.2rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  cardLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#fff',
  },
  cardText: {
    fontSize: '0.85rem',
    color: '#888',
  },
  badgeConfirmed: {
    background: '#0a2a0a',
    border: '1px solid #2a7a2a',
    color: '#4caf50',
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '0.2rem 0.8rem',
    borderRadius: '20px',
  },
  badgeCancelled: {
    background: '#2a0a0a',
    border: '1px solid #7a2a2a',
    color: '#e63946',
    fontSize: '0.75rem',
    fontWeight: '700',
    padding: '0.2rem 0.8rem',
    borderRadius: '20px',
  },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid #e63946',
    color: '#e63946',
    padding: '0.4rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    color: '#555',
    padding: '3rem',
    fontSize: '0.95rem',
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

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings()
      setBookings(data)
    } catch (err) {
      setError('Error al cargar las reservas')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    setCancellingId(id)
    try {
      await cancelBooking(id)
      setBookings(prev =>
        prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b)
      )
    } catch (err) {
      setError('Error al cancelar la reserva')
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Mis reservas</h1>
        <p style={styles.subtitle}>Historial de tus reservas en el gimnasio</p>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <p style={{ color: '#888', textAlign: 'center', padding: '3rem' }}>
          Cargando reservas...
        </p>
      ) : bookings.length === 0 ? (
        <p style={styles.empty}>No tienes reservas todavía</p>
      ) : (
        bookings.map(b => (
          <div key={b.id} style={styles.card}>
            <div style={styles.cardLeft}>
              <p style={styles.cardTitle}>Reserva #{b.id}</p>
              <p style={styles.cardText}>Clase ID: {b.class_id}</p>
              <p style={styles.cardText}>{b.created_at}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={
                b.status === 'CONFIRMED'
                  ? styles.badgeConfirmed
                  : styles.badgeCancelled
              }>
                {b.status === 'CONFIRMED' ? 'Confirmada' : 'Cancelada'}
              </span>
              {b.status === 'CONFIRMED' && (
                <button
                  style={styles.cancelBtn}
                  onClick={() => handleCancel(b.id)}
                  disabled={cancellingId === b.id}
                >
                  {cancellingId === b.id ? '...' : 'Cancelar'}
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}