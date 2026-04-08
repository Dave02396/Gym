from flask_restful import Resource
from flask import request
from pydantic import ValidationError
from app.services.booking_service import booking_service
from app.schemas.booking_schema import CreateBookingSchema
from flask_jwt_extended import jwt_required, get_jwt_identity

class BookingResource(Resource):
    @jwt_required()
    def get(self):
        try:
            user_id = get_jwt_identity()
            bookings = booking_service.get_all_by_user(user_id)
            return [b.to_json() for b in bookings], 200
        except Exception as e:
            return {'error': str(e)}, 400

    @jwt_required()
    def post(self):
        try:
            user_id = get_jwt_identity()
            json = request.get_json()
            validated_data = CreateBookingSchema.model_validate(json)
            booking = booking_service.create(user_id, validated_data)
            return booking.to_json(), 201
        except ValidationError as e:
            return {'error': e.errors()}, 400
        except Exception as e:
            return {'error': str(e)}, 400

class ManageBookingResource(Resource):
    @jwt_required()
    def delete(self, id):
        try:
            booking = booking_service.get_by_id(id)
            if not booking:
                return {'error': 'Reserva no encontrada'}, 404
            booking_service.cancel(booking)
            return {'message': 'Reserva cancelada correctamente'}, 200
        except Exception as e:
            return {'error': str(e)}, 400