from flask_restful import Resource
from flask import request
from pydantic import ValidationError
from app.services.user_service import user_service
from app.schemas.user_schema import CreateUserSchema, UpdateUserSchema
from app.resources.auth_resource import admin_required
from flask_jwt_extended import jwt_required
import bcrypt

def hash_password(password: str) -> str:
    bytes_password = password.encode('utf-8')
    hashed = bcrypt.hashpw(bytes_password, bcrypt.gensalt())
    return hashed.decode('utf-8')

class UserResource(Resource):
    @admin_required()
    def get(self):
        try:
            users = user_service.get_all()
            return [user.to_json() for user in users], 200
        except Exception as e:
            return {'error': str(e)}, 400

    def post(self):
        try:
            json = request.get_json()
            validated_data = CreateUserSchema.model_validate(json)
            validated_data.password = hash_password(validated_data.password)
            user = user_service.create(validated_data)
            return user.to_json(), 201
        except ValidationError as e:
            return {'error': e.errors()}, 400
        except Exception as e:
            return {'error': str(e)}, 400

class ManageUserResource(Resource):
    @jwt_required()
    def get(self, id):
        try:
            user = user_service.get_by_id(id)
            if not user:
                return {'error': 'Usuario no encontrado'}, 404
            return user.to_json(), 200
        except Exception as e:
            return {'error': str(e)}, 400

    @admin_required()
    def put(self, id):
        try:
            json = request.get_json()
            validated_data = UpdateUserSchema.model_validate(json)
            user = user_service.get_by_id(id)
            if not user:
                return {'error': 'Usuario no encontrado'}, 404
            if validated_data.password:
                validated_data.password = hash_password(validated_data.password)
            user = user_service.update(user, validated_data)
            return user.to_json(), 200
        except ValidationError as e:
            return {'error': e.errors()}, 400
        except Exception as e:
            return {'error': str(e)}, 400

    @admin_required()
    def delete(self, id):
        try:
            user = user_service.get_by_id(id)
            if not user:
                return {'error': 'Usuario no encontrado'}, 404
            user_service.delete(user)
            return {'message': 'Usuario eliminado correctamente'}, 200
        except Exception as e:
            return {'error': str(e)}, 400