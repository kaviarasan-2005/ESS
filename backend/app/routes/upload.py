import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from starlette.concurrency import run_in_threadpool
from app.utils.auth import get_current_admin_user

# Load environment variables directly from backend/.env
load_dotenv()

router = APIRouter(prefix="/api/upload", tags=["Upload API"])


def get_cloudinary_config():
    """Configure Cloudinary using credentials directly from .env."""
    cloud_name = (os.getenv("CLOUDINARY_CLOUD_NAME") or "").strip()
    api_key = (os.getenv("CLOUDINARY_API_KEY") or "").strip()
    api_secret = (os.getenv("CLOUDINARY_API_SECRET") or "").strip()

    if not cloud_name or not api_key or not api_secret:
        raise HTTPException(
            status_code=500,
            detail="Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET) are missing in backend .env."
        )

    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
        secure=True
    )


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_admin: dict = Depends(get_current_admin_user)
):
    # Enforce MIME-type check
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only valid image files are allowed.")

    # Re-verify and configure Cloudinary credentials directly from env
    get_cloudinary_config()

    try:
        contents = await file.read()

        # Run synchronous Cloudinary upload call off the main event loop thread
        response = await run_in_threadpool(
            cloudinary.uploader.upload,
            contents,
            folder="engen_assets",
            resource_type="image"
        )

        return {
            "success": True,
            "url": response.get("secure_url"),
            "public_id": response.get("public_id")
        }

    except Exception as e:
        print(f"Cloudinary Exception Details: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Cloudinary upload failed: {str(e)}")