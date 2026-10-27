from fastapi import APIRouter, HTTPException, status, Depends
from app.config.database import db
from app.schemas.auth import UserLogin, Token, ChangePasswordSchema, ResetPasswordSchema
from app.utils.security import verify_password, create_access_token, get_password_hash
from app.utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/auth", tags=["Auth"])

USERS_COLLECTION = "users"


# ─────────────────────────────────────────────
# POST /api/auth/login
# ─────────────────────────────────────────────
@router.post("/login", response_model=Token)
async def login_for_access_token(credentials: UserLogin):
    """Authenticate admin credentials via JSON payload."""
    username = credentials.username.strip()
    admin_user = await db[USERS_COLLECTION].find_one({"username": username})

    if not admin_user or not verify_password(credentials.password, admin_user.get("password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_data = {
        "sub": admin_user["username"],
        "role": admin_user.get("role", "admin")
    }

    access_token = create_access_token(data=token_data)

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# ─────────────────────────────────────────────
# GET /api/auth/me
# ─────────────────────────────────────────────
@router.get("/me")
async def get_current_user(current_admin=Depends(get_current_admin_user)):
    """Return the currently authenticated admin's basic info."""
    user = await db[USERS_COLLECTION].find_one({"username": current_admin.username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return {
        "username": user["username"],
        "email": user.get("email", ""),
        "role": user.get("role", "admin"),
        "is_active": user.get("is_active", True)
    }


# ─────────────────────────────────────────────
# POST /api/auth/change-password
# ─────────────────────────────────────────────
@router.post("/change-password")
async def change_password(
    payload: ChangePasswordSchema,
    current_admin=Depends(get_current_admin_user)
):
    """Allow the authenticated admin to change their own password."""
    user = await db[USERS_COLLECTION].find_one({"username": current_admin.username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    if not verify_password(payload.current_password, user.get("password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect."
        )

    new_hashed = get_password_hash(payload.new_password)
    await db[USERS_COLLECTION].update_one(
        {"username": current_admin.username},
        {"$set": {"password": new_hashed}}
    )

    return {"success": True, "message": "Password changed successfully."}


# ─────────────────────────────────────────────
# POST /api/auth/reset-password  (no auth required — Forgot Password flow)
# ─────────────────────────────────────────────
@router.post("/reset-password")
async def reset_password(payload: ResetPasswordSchema):
    """Reset admin password by username only. No current password needed."""

    # Passwords must match
    if payload.new_password != payload.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password and confirm password do not match."
        )

    user = await db[USERS_COLLECTION].find_one({"username": payload.username.strip()})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No admin account found with that username."
        )

    new_hashed = get_password_hash(payload.new_password)
    await db[USERS_COLLECTION].update_one(
        {"username": payload.username.strip()},
        {"$set": {"password": new_hashed}}
    )

    return {"success": True, "message": "Password has been reset successfully."}