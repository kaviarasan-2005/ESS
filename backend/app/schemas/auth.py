from typing import Optional
from pydantic import BaseModel, EmailStr, Field


# --- TOKEN SCHEMAS ---

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = "admin"


# --- AUTH REQUEST SCHEMAS ---

class UserLogin(BaseModel):
    username: str = Field(..., example="admin")
    password: str = Field(..., example="admin123")


class ChangePasswordSchema(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)


class ResetPasswordSchema(BaseModel):
    """Used by the Forgot Password page — no current password required."""
    username: str = Field(..., example="admin")
    new_password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)


# --- RESPONSE SCHEMAS ---

class AdminUserResponse(BaseModel):
    id: Optional[str] = None
    username: str
    role: str = "admin"
    is_active: bool = True


class AuthResponse(BaseModel):
    success: bool = True
    message: str = "Authentication successful"
    token: Token
    user: AdminUserResponse