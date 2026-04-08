import { useState, useEffect } from 'react'
import {
  getClasses,
  createClass,
  updateClass,
  deleteClass
} from '../services/classService'

const styles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: { fontSize: '1.8rem', fontWeight: '800', color: '#fff' },
  addBtn: {
    background: '#e63946',
    color: '#fff',
    border: 'none',
    padding: '0.65rem 1.3rem',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
  },
  th: {
    textAlign: 'left',
    padding: '0.75rem 1rem',
    color: '#888',
    fontWeight: '600',
    borderBottom: '1px solid #2a2a2a',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
  },
  td: {
    padding: '1rem',
    borderBottom: '1px solid #1f1f1f',
    color: '#ccc',
    verticalAlign: 'middle',
  },
  editBtn: {
    background: 'transparent',
    border: '1px solid #444',
    color: '#ccc',
    padding: '0.35rem 0.8rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    marginRight: '0.5rem',
  },
  deleteBtn: {
    background: 'transparent',
    border: '1px solid #e63946',
    color: '#e63946',
    padding: '0.35rem 0.8rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modal: {
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '16px',
    padding: '2rem',
    width: '100%',
    maxWidth: '480px',
  },
  modalTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    color: '#fff',
  },
  label: {
    display: 'block',
    color: '#aaa',
    fontSize: '0.8rem',
    marginBottom: '0.3rem',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '0.65rem 0.9rem',
    background: '#0f0f0f',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    outline: 'none',
  },
  modalActions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    marginTop: '0.5rem',
  },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid #444',
    color: '#aaa',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  saveBtn: {
    background: '#e63946',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '700',
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

const emptyForm = {
  name: '', description: '', instructor: '', schedule: '', capacity: ''
}

export default function AdminClassesPage() {
  const [classes, setClasses] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => { fetchClasses() }, [])

  const fetchClasses = async () => {
    const data = await getClasses()
    setClasses(data)
  }

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setError('')
    setShowModal(true)
  }

  const openEdit = (c) => {
    setEditing(c)
    setForm({
      name: c.name,
      description: c.description,
      instructor: c.instructor,
      schedule: c.schedule,
      capacity: c.capacity,
    })
    setError('')
    setShowModal(true)
  }

  const handleSave = async () => {
    setError('')
    try {
      const payload = { ...form, capacity: parseInt(form.capacity) }
      if (editing) {
        await updateClass(editing.id, payload)
      } else {
        await createClass(payload)
      }
      setShowModal(false)
      fetchClasses()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar esta clase?')) return
    await deleteClass(id)
    fetchClasses()
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Gestión de clases</h1>
        <button style={styles.addBtn} onClick={openCreate}>
          + Nueva clase
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Instructor</th>
            <th style={styles.th}>Horario</th>
            <th style={styles.th}>Capacidad</th>
            <th style={styles.th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {classes.map(c => (
            <tr key={c.id}>
              <td style={styles.td}>{c.name}</td>
              <td style={styles.td}>{c.instructor}</td>
              <td style={styles.td}>{c.schedule}</td>
              <td style={styles.td}>{c.capacity}</td>
              <td style={styles.td}>
                <button style={styles.editBtn} onClick={() => openEdit(c)}>
                  Editar
                </button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(c.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <p style={styles.modalTitle}>
              {editing ? 'Editar clase' : 'Nueva clase'}
            </p>
            {error && <div style={styles.error}>{error}</div>}
            {['name', 'description', 'instructor'].map(field => (
              <div key={field}>
                <label style={styles.label}>{field}</label>
                <input
                  style={styles.input}
                  value={form[field]}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                />
              </div>
            ))}
            <label style={styles.label}>Horario</label>
            <input
              style={styles.input}
              type="datetime-local"
              value={form.schedule}
              onChange={e => setForm({ ...form, schedule: e.target.value })}
            />
            <label style={styles.label}>Capacidad</label>
            <input
              style={styles.input}
              type="number"
              value={form.capacity}
              onChange={e => setForm({ ...form, capacity: e.target.value })}
            />
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button style={styles.saveBtn} onClick={handleSave}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}