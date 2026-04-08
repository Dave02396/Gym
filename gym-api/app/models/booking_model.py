from db import db
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

class Booking(db.Model):
    __tablename__ = 'bookings'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    class_id = Column(Integer, ForeignKey('classes.id'))
    status = Column(String(50), default='CONFIRMED')
    created_at = Column(DateTime, default=func.now())

    user = relationship('User', back_populates='bookings')
    gym_class = relationship('GymClass', back_populates='bookings')

    def to_json(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'class_id': self.class_id,
            'status': self.status,
            'created_at': str(self.created_at)
        }