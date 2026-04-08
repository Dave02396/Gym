import api from './api'

export const getMyBookings = async () => {
  const response = await api.get('/bookings')
  return response.data
}

export const createBooking = async (class_id) => {
  const response = await api.post('/bookings', { class_id })
  return response.data
}

export const cancelBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`)
  return response.data
}