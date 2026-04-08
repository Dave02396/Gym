import { useState, useEffect } from 'react'
import { getClasses } from '../services/classService'
import { createBooking } from '../services/bookingService'

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1100px',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.2rem',
  },
  card: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#fff',
  },
  cardText: {
    fontSize: '0.85rem',
    color: '#888',
  },
  badge: {
    display: 'inline-block',
    background: '#1f1f1f',
    border: '1px solid #333',
    color: '#e63946',
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '0.2rem 0.6rem',
    borderRadius: '20px',
    width: 'fit-content',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #2a2a2a',
    margin: '0.5rem 0',
  },
  bookBtn: {
    marginTop: '0.5rem',
    padding: '0.65rem',
    background: '#e63946',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    letterSpacing: '0.5px',
  },
  bookBtnDisabled: {
    marginTop: '0.5rem',
    padding: '0.65rem',
    background: '#2a2a2a',
    color: '#555',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'not-allowed',
    letterSpacing: '0.5px',
  },
  success: {
    background: '#0a2a0a',
    border: '1px solid #2a7a2a',
    color: '#4caf50',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    marginBottom: '1rem',
  },
  error: {
    background: '#2a0a0a',
    border: '1px solid #e63946',
    color: '#e63946',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    marginBottom: '1rem',
  },
  loading: {
    color: '#888',
    textAlign: 'center',
    padding: '3rem',
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ClassesPage() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [bookingId, setBookingId] = useState(null)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const data = await getClasses()
      setClasses(data)
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al cargar las clases' })
    } finally {
      setLoading(false)
    }
  }

  const handleBook = async (classId) => {
    setBookingId(classId)
    setMessage({ type: '', text: '' })
    try {
      await createBooking(classId)
      setMessage({ type: 'success', text: 'Reserva creada correctamente' })
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Error al crear la reserva'
      })
    } finally {
      setBookingId(null)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Clases disponibles</h1>
        <p style={styles.subtitle}>Reserva tu lugar en la clase que quieras</p>
      </div>

      {message.text && (
        <div style={message.type === 'success' ? styles.success : styles.error}>
          {message.text}
        </div>
      )}

      {loading ? (
        <p style={styles.loading}>Cargando clases...</p>
      ) : (
        <div style={styles.grid}>
          {classes.map(c => (
            <div key={c.id} style={styles.card}>
              <span style={styles.badge}>
                {c.capacity} lugares
              </span>
              <p style={styles.cardTitle}>{c.name}</p>
              <p style={styles.cardText}>{c.description}</p>
              <hr style={styles.divider} />
              <p style={styles.cardText}>
                Instructor: <strong style={{ color: '#ccc' }}>{c.instructor}</strong>
              </p>
              <p style={styles.cardText}>
                {formatDate(c.schedule)}
              </p>
              <button
                style={bookingId === c.id ? styles.bookBtnDisabled : styles.bookBtn}
                onClick={() => handleBook(c.id)}
                disabled={bookingId === c.id}
              >
                {bookingId === c.id ? 'Reservando...' : 'Reservar lugar'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}