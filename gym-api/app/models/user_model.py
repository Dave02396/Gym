from db import db
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, func
from sqlalchemy.orm import relationship

class User(db.Model):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    email = Column(String(255), unique=True)
    password = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    role_id = Column(Integer, ForeignKey('roles.id'))

    role = relationship('Role', back_populates='users')
    bookings = relationship('Booking', back_populates='user')

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role_id': self.role_id
        }