from app.models.user_model import User
from app.schemas.user_schema import CreateUserSchema, UpdateUserSchema
from db import db

class UserService:
    def get_all(self):
        return User.query.filter_by(is_active=True).all()

    def get_by_id(self, id: int):
        return User.query.filter_by(id=id).first()

    def get_by_email(self, email: str):
        return User.query.filter_by(email=email, is_active=True).first()

    def create(self, data: CreateUserSchema):
        user = User(
            name=data.name,
            email=data.email,
            password=data.password,
            role_id=data.role_id
        )
        db.session.add(user)
        db.session.commit()
        return user

    def update(self, user: User, data: UpdateUserSchema):
        if data.name:
            user.name = data.name
        if data.email:
            user.email = data.email
        if data.role_id:
            user.role_id = data.role_id
        if data.password:
            user.password = data.password
        db.session.commit()
        return user

    def delete(self, user: User):
        user.is_active = False
        db.session.commit()
        return user

user_service = UserService()