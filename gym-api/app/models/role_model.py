from db import db
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Role(db.Model):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True)

    users = relationship('User', back_populates='role')