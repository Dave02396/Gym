from app.models.role_model import Role
from app.schemas.role_schema import RoleSchema
from db import db

class RoleService:
    def create(self, data: RoleSchema):
        role = Role(name=data.name)
        db.session.add(role)
        db.session.commit()
        return role

role_service = RoleService()