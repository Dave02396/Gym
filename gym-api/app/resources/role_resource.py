from flask_restful import Resource
from flask import request
from pydantic import ValidationError
from app.schemas.role_schema import RoleSchema
from app.services.role_service import role_service

class RoleResource(Resource):
    def post(self):
        try:
            json = request.get_json()
            validated_data = RoleSchema.model_validate(json)
            role = role_service.create(validated_data)

            return {'id': role.id, 'name': role.name}, 201

        except ValidationError as e:
            return {'error': e.errors()}, 400
        except Exception as e:
            return {'error': str(e)}, 400