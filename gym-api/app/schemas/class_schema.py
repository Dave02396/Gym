from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BaseClassSchema(BaseModel):
    name: str
    description: str
    instructor: str
    schedule: datetime
    capacity: int

class CreateClassSchema(BaseClassSchema):
    pass

class UpdateClassSchema(BaseClassSchema):
    name: Optional[str] = None
    description: Optional[str] = None
    instructor: Optional[str] = None
    schedule: Optional[datetime] = None
    capacity: Optional[int] = None