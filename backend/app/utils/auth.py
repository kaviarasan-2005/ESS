import os
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, ExpiredSignatureError, jwt
from app.schemas.auth import TokenData

# Load environment variables directly from backend/.env
load_dotenv()

# Read JWT configurations directly from environment variables
JWT_SECRET = os.getenv(
    "JWT_SECRET",
    "36612a6dbb30f173723bdeb1deef60dcc4aa9bd178737a2d229a14a7a7362c82"
)
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


async def get_current_admin_user(
    token: str = Depends(oauth2_scheme)
) -> TokenData:
    """Dependency for validating Bearer tokens and checking admin role."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate admin credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )
        username: str = payload.get("sub")
        role: str = payload.get("role", "admin")

        if username is None:
            raise credentials_exception

        return TokenData(username=username, role=role)

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError:
        raise credentials_exception