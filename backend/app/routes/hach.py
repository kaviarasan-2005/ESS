from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.hach import (
    HachBannerHeader,
    HachBannerHeaderResponse,
    HachOverviewSection,
    HachOverviewResponse,
    HachDetailsSection,
    HachDetailsResponse,
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(prefix="/api/hach", tags=["HACH Brand Page"])

DEFAULT_BANNER = HachBannerHeader(
    title="HACH",
    subtitle="Water Quality Analysis & Precision Analytical Testing Solutions",
    bg_image="",
    bg_image_url=""
)

DEFAULT_OVERVIEW = HachOverviewSection()

DEFAULT_DETAILS = HachDetailsSection()


def clean_doc_data(data: dict) -> dict:
    """Utility to strip internal MongoDB keys."""
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# HACH BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=HachBannerHeaderResponse)
@router.get("/banner/", response_model=HachBannerHeaderResponse)
async def get_hach_banner():
    """Public API: Retrieve HACH banner section data."""
    try:
        doc = await db["hach_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return HachBannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return HachBannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        return HachBannerHeaderResponse(
            success=True,
            data=HachBannerHeader(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching HACH banner: {str(e)}")
        return HachBannerHeaderResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=HachBannerHeaderResponse)
@router.put("/banner/", response_model=HachBannerHeaderResponse)
async def update_hach_banner(
    payload: HachBannerHeader,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update HACH banner section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["hach_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return HachBannerHeaderResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating HACH banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update HACH banner: {str(e)}"
        )


# ==========================================
# HACH OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=HachOverviewResponse)
@router.get("/overview/", response_model=HachOverviewResponse)
async def get_hach_overview():
    """Public API: Retrieve HACH overview section data."""
    try:
        doc = await db["hach_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return HachOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return HachOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return HachOverviewResponse(
            success=True,
            data=HachOverviewSection(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching HACH overview: {str(e)}")
        return HachOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=HachOverviewResponse)
@router.put("/overview/", response_model=HachOverviewResponse)
async def update_hach_overview(
    payload: HachOverviewSection,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update HACH overview section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["hach_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return HachOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating HACH overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update HACH overview: {str(e)}"
        )



# ==========================================
# HACH DETAILS ENDPOINTS
# ==========================================

@router.get("/details", response_model=HachDetailsResponse)
@router.get("/details/", response_model=HachDetailsResponse)
async def get_hach_details():
    """Public API: Retrieve HACH details section data."""
    try:
        doc = await db["hach_page"].find_one({"section": "details"})
        if not doc or "data" not in doc:
            return HachDetailsResponse(success=True, data=DEFAULT_DETAILS)

        details_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(details_data, dict):
            return HachDetailsResponse(success=True, data=DEFAULT_DETAILS)

        return HachDetailsResponse(
            success=True,
            data=HachDetailsSection(**details_data)
        )
    except Exception as e:
        print(f"Error fetching HACH details: {str(e)}")
        return HachDetailsResponse(success=True, data=DEFAULT_DETAILS)


@router.put("/details", response_model=HachDetailsResponse)
@router.put("/details/", response_model=HachDetailsResponse)
async def update_hach_details(
    payload: HachDetailsSection,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update HACH details section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["hach_page"].update_one(
            {"section": "details"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return HachDetailsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating HACH details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update HACH details: {str(e)}"
        )