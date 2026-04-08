from pydantic import BaseModel
from typing import Optional

class BaseUserSchema(BaseModel):
    name: str
    email: str
    role_id: int

class CreateUserSchema(BaseUserSchema):
    password: str

class UpdateUserSchema(BaseUserSchema):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    role_id: Optional[int] = None