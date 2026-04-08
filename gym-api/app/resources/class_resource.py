from flask_restful import Resource
from flask import request
from pydantic import ValidationError
from app.services.class_service import class_service
from app.schemas.class_schema import CreateClassSchema, UpdateClassSchema
from app.resources.auth_resource import admin_required
from flask_jwt_extended import jwt_required

class ClassResource(Resource):
    @jwt_required()
    def get(self):
        try:
            classes = class_service.get_all()
            return [c.to_json() for c in classes], 200
        except Exception as e:
            return {'error': str(e)}, 400

    @admin_required()
    def post(self):
        try:
            json = request.get_json()
            validated_data = CreateClassSchema.model_validate(json)
            gym_class = class_service.create(validated_data)
            return gym_class.to_json(), 201
        except ValidationError as e:
            return {'error': e.errors()}, 400
        except Exception as e:
            return {'error': str(e)}, 400

class ManageClassResource(Resource):
    @jwt_required()
    def get(self, id):
        try:
            gym_class = class_service.get_by_id(id)
            if not gym_class:
                return {'error': 'Clase no encontrada'}, 404
            return gym_class.to_json(), 200
        except Exception as e:
            return {'error': str(e)}, 400

    @admin_required()
    def put(self, id):
        try:
            json = request.get_json()
            validated_data = UpdateClassSchema.model_validate(json)
            gym_class = class_service.get_by_id(id)
            if not gym_class:
                return {'error': 'Clase no encontrada'}, 404
            gym_class = class_service.update(gym_class, validated_data)
            return gym_class.to_json(), 200
        except ValidationError as e:
            return {'error': e.errors()}, 400
        except Exception as e:
            return {'error': str(e)}, 400

    @admin_required()
    def delete(self, id):
        try:
            gym_class = class_service.get_by_id(id)
            if not gym_class:
                return {'error': 'Clase no encontrada'}, 404
            class_service.delete(gym_class)
            return {'message': 'Clase eliminada correctamente'}, 200
        except Exception as e:
            return {'error': str(e)}, 400