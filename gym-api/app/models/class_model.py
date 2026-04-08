from db import db
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, func
from sqlalchemy.orm import relationship

class GymClass(db.Model):
    __tablename__ = 'classes'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    description = Column(Text)
    instructor = Column(String(255))
    schedule = Column(DateTime)
    capacity = Column(Integer)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())

    bookings = relationship('Booking', back_populates='gym_class')

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'instructor': self.instructor,
            'schedule': str(self.schedule),
            'capacity': self.capacity
        }