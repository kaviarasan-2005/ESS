import os
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from jose import jwt
from passlib.context import CryptContext

# Load environment variables directly from backend/.env
load_dotenv()

# Read JWT configurations directly from environment variables
JWT_SECRET = os.getenv(
    "JWT_SECRET",
    "36612a6dbb30f173723bdeb1deef60dcc4aa9bd178737a2d229a14a7a7362c82"
)
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "10080"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Safely verify plain text password against bcrypt hash."""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    """Generate bcrypt password hash."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """Generate JWT access token using direct environment configuration."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta
        or timedelta(minutes=JWT_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )
    return encoded_jwt