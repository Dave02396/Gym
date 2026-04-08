from app.models.class_model import GymClass
from app.schemas.class_schema import CreateClassSchema, UpdateClassSchema
from db import db

class ClassService:
    def get_all(self):
        return GymClass.query.filter_by(is_active=True).all()

    def get_by_id(self, id: int):
        return GymClass.query.filter_by(id=id, is_active=True).first()

    def create(self, data: CreateClassSchema):
        gym_class = GymClass(
            name=data.name,
            description=data.description,
            instructor=data.instructor,
            schedule=data.schedule,
            capacity=data.capacity
        )
        db.session.add(gym_class)
        db.session.commit()
        return gym_class

    def update(self, gym_class: GymClass, data: UpdateClassSchema):
        if data.name:
            gym_class.name = data.name
        if data.description:
            gym_class.description = data.description
        if data.instructor:
            gym_class.instructor = data.instructor
        if data.schedule:
            gym_class.schedule = data.schedule
        if data.capacity:
            gym_class.capacity = data.capacity
        db.session.commit()
        return gym_class

    def delete(self, gym_class: GymClass):
        gym_class.is_active = False
        db.session.commit()
        return gym_class

class_service = ClassService()