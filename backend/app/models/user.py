from datetime import datetime
from pydantic import BaseModel, Field


class UserModel(BaseModel):
    username: str
    email: str = ""
    password: str
    role: str = "admin"
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)