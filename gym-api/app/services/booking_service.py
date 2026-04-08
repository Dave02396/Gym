from app.models.booking_model import Booking
from app.models.class_model import GymClass
from app.schemas.booking_schema import CreateBookingSchema
from db import db

class BookingService:
    def get_all_by_user(self, user_id: int):
        return Booking.query.filter_by(user_id=user_id).all()

    def get_by_id(self, id: int):
        return Booking.query.filter_by(id=id).first()

    def create(self, user_id: int, data: CreateBookingSchema):
        # Regla 1: verificar que la clase existe
        gym_class = GymClass.query.filter_by(
            id=data.class_id,
            is_active=True
        ).first()

        if not gym_class:
            raise Exception('La clase no existe o no está disponible')

        # Regla 2: verificar que el usuario no tenga ya una reserva en esa clase
        existing_booking = Booking.query.filter_by(
            user_id=user_id,
            class_id=data.class_id,
            status='CONFIRMED'
        ).first()

        if existing_booking:
            raise Exception('Ya tienes una reserva confirmada en esta clase')

        # Regla 3: verificar que la clase no esté llena
        confirmed_bookings = Booking.query.filter_by(
            class_id=data.class_id,
            status='CONFIRMED'
        ).count()

        if confirmed_bookings >= gym_class.capacity:
            raise Exception('La clase ya no tiene lugares disponibles')

        # Si pasa las 3 reglas, crear la reserva
        booking = Booking(
            user_id=user_id,
            class_id=data.class_id,
            status='CONFIRMED'
        )
        db.session.add(booking)
        db.session.commit()
        return booking

    def cancel(self, booking: Booking):
        booking.status = 'CANCELLED'
        db.session.commit()
        return booking

booking_service = BookingService()