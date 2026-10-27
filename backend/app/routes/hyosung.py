from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.hyosung import (
    HyosungBannerHeader,
    HyosungBannerHeaderResponse,
    HyosungOverviewSection,
    HyosungOverviewResponse,
    HyosungDetailsSection,
    HyosungDetailsResponse,
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(prefix="/api/hyosung", tags=["Hyosung Goodsprings Brand Page"])

DEFAULT_BANNER = HyosungBannerHeader(
    title="Hyosung Goodsprings",
    subtitle="Industrial Pump & Fluid Handling Solutions",
    bg_image="",
    bg_image_url=""
)

DEFAULT_OVERVIEW = HyosungOverviewSection()

DEFAULT_DETAILS = HyosungDetailsSection()


def clean_doc_data(data: dict) -> dict:
    """Utility to strip internal MongoDB keys."""
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# HYOSUNG BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=HyosungBannerHeaderResponse)
@router.get("/banner/", response_model=HyosungBannerHeaderResponse)
async def get_hyosung_banner():
    """Public API: Retrieve Hyosung Goodsprings banner section data."""
    try:
        doc = await db["hyosung_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return HyosungBannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return HyosungBannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        return HyosungBannerHeaderResponse(
            success=True,
            data=HyosungBannerHeader(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Hyosung banner: {str(e)}")
        return HyosungBannerHeaderResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=HyosungBannerHeaderResponse)
@router.put("/banner/", response_model=HyosungBannerHeaderResponse)
async def update_hyosung_banner(
    payload: HyosungBannerHeader,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Hyosung Goodsprings banner section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["hyosung_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return HyosungBannerHeaderResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Hyosung banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Hyosung banner: {str(e)}"
        )



# ==========================================
# HYOSUNG OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=HyosungOverviewResponse)
@router.get("/overview/", response_model=HyosungOverviewResponse)
async def get_hyosung_overview():
    """Public API: Retrieve Hyosung Goodsprings overview section data."""
    try:
        doc = await db["hyosung_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return HyosungOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return HyosungOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return HyosungOverviewResponse(
            success=True,
            data=HyosungOverviewSection(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Hyosung overview: {str(e)}")
        return HyosungOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=HyosungOverviewResponse)
@router.put("/overview/", response_model=HyosungOverviewResponse)
async def update_hyosung_overview(
    payload: HyosungOverviewSection,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Hyosung Goodsprings overview section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["hyosung_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return HyosungOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Hyosung overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Hyosung overview: {str(e)}"
        )


# ==========================================
# HYOSUNG DETAILS ENDPOINTS
# ==========================================

@router.get("/details", response_model=HyosungDetailsResponse)
@router.get("/details/", response_model=HyosungDetailsResponse)
async def get_hyosung_details():
    """Public API: Retrieve Hyosung Goodsprings details section data."""
    try:
        doc = await db["hyosung_page"].find_one({"section": "details"})
        if not doc or "data" not in doc:
            return HyosungDetailsResponse(success=True, data=DEFAULT_DETAILS)

        details_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(details_data, dict):
            return HyosungDetailsResponse(success=True, data=DEFAULT_DETAILS)

        return HyosungDetailsResponse(
            success=True,
            data=HyosungDetailsSection(**details_data)
        )
    except Exception as e:
        print(f"Error fetching Hyosung details: {str(e)}")
        return HyosungDetailsResponse(success=True, data=DEFAULT_DETAILS)


@router.put("/details", response_model=HyosungDetailsResponse)
@router.put("/details/", response_model=HyosungDetailsResponse)
async def update_hyosung_details(
    payload: HyosungDetailsSection,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Hyosung Goodsprings details section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["hyosung_page"].update_one(
            {"section": "details"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return HyosungDetailsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Hyosung details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Hyosung details: {str(e)}"
        )