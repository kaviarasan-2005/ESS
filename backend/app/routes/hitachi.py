from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.hitachi import (
    HitachiBannerHeader,
    HitachiBannerHeaderResponse,
    HitachiOverviewSection,
    HitachiOverviewResponse,
    HitachiDetailsSection,
    HitachiDetailsResponse,
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(prefix="/api/hitachi", tags=["Hitachi Brand Page"])

DEFAULT_BANNER = HitachiBannerHeader(
    title="Hitachi",
    subtitle="Industrial Automation & Advanced Technology Solutions",
    bg_image="",
    bg_image_url=""
)

DEFAULT_OVERVIEW = HitachiOverviewSection()

DEFAULT_DETAILS = HitachiDetailsSection()

def clean_doc_data(data: dict) -> dict:
    """Utility to strip internal MongoDB keys."""
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# HITACHI BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=HitachiBannerHeaderResponse)
@router.get("/banner/", response_model=HitachiBannerHeaderResponse)
async def get_hitachi_banner():
    """Public API: Retrieve Hitachi banner section data."""
    try:
        doc = await db["hitachi_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return HitachiBannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return HitachiBannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        return HitachiBannerHeaderResponse(
            success=True,
            data=HitachiBannerHeader(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Hitachi banner: {str(e)}")
        return HitachiBannerHeaderResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=HitachiBannerHeaderResponse)
@router.put("/banner/", response_model=HitachiBannerHeaderResponse)
async def update_hitachi_banner(
    payload: HitachiBannerHeader,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Hitachi banner section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["hitachi_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return HitachiBannerHeaderResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Hitachi banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Hitachi banner: {str(e)}"
        )


# ==========================================
# HITACHI OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=HitachiOverviewResponse)
@router.get("/overview/", response_model=HitachiOverviewResponse)
async def get_hitachi_overview():
    """Public API: Retrieve Hitachi overview section data."""
    try:
        doc = await db["hitachi_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return HitachiOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return HitachiOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return HitachiOverviewResponse(
            success=True,
            data=HitachiOverviewSection(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Hitachi overview: {str(e)}")
        return HitachiOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=HitachiOverviewResponse)
@router.put("/overview/", response_model=HitachiOverviewResponse)
async def update_hitachi_overview(
    payload: HitachiOverviewSection,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Hitachi overview section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["hitachi_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return HitachiOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Hitachi overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Hitachi overview: {str(e)}"
        )



# ==========================================
# HITACHI DETAILS ENDPOINTS
# ==========================================

@router.get("/details", response_model=HitachiDetailsResponse)
@router.get("/details/", response_model=HitachiDetailsResponse)
async def get_hitachi_details():
    """Public API: Retrieve Hitachi details section data."""
    try:
        doc = await db["hitachi_page"].find_one({"section": "details"})
        if not doc or "data" not in doc:
            return HitachiDetailsResponse(success=True, data=DEFAULT_DETAILS)

        details_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(details_data, dict):
            return HitachiDetailsResponse(success=True, data=DEFAULT_DETAILS)

        return HitachiDetailsResponse(
            success=True,
            data=HitachiDetailsSection(**details_data)
        )
    except Exception as e:
        print(f"Error fetching Hitachi details: {str(e)}")
        return HitachiDetailsResponse(success=True, data=DEFAULT_DETAILS)


@router.put("/details", response_model=HitachiDetailsResponse)
@router.put("/details/", response_model=HitachiDetailsResponse)
async def update_hitachi_details(
    payload: HitachiDetailsSection,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Hitachi details section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["hitachi_page"].update_one(
            {"section": "details"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return HitachiDetailsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Hitachi details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Hitachi details: {str(e)}"
        )