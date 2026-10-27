import traceback

from fastapi import APIRouter, HTTPException, status

from app.config.database import db
from app.models.user import UserModel
from app.schemas.register import RegisterSchema
from app.utils.security import get_password_hash

router = APIRouter(prefix="/api/auth", tags=["Auth"])

USERS_COLLECTION = "users"


def model_to_dict(model):
    """Works on both Pydantic v2 (model_dump) and v1 (dict)."""
    if hasattr(model, "model_dump"):
        return model.model_dump()
    return model.dict()


# POST /api/auth/register
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_admin(payload: RegisterSchema):
    """Register a new admin user. Username must be unique."""
    username = payload.username.strip()
    email = (payload.email or "").strip()

    try:
        existing = await db[USERS_COLLECTION].find_one({"username": username})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username already exists. Please choose a different username."
            )

        new_user = UserModel(
            username=username,
            email=email,
            password=get_password_hash(payload.password),
        )

        await db[USERS_COLLECTION].insert_one(model_to_dict(new_user))

    except HTTPException:
        raise
    except Exception as exc:
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {exc}"
        )

    return {
        "success": True,
        "message": f"Admin account '{username}' created successfully."
    }