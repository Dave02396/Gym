from pydantic import BaseModel
from typing import Optional

class CreateBookingSchema(BaseModel):
    class_id: int

class UpdateBookingSchema(BaseModel):
    status: Optional[str] = None