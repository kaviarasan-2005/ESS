from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, Response, status
from app.config.database import db
from app.schemas.emerson import (
    EmersonBannerHeader,
    EmersonBannerHeaderResponse,
    EmersonOverviewSection,
    EmersonOverviewResponse,
    EmersonDetailsSection,
    EmersonDetailsResponse,
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(prefix="/api/emerson", tags=["Emerson Brand Page"])

DEFAULT_BANNER = EmersonBannerHeader(
    title="Emerson",
    subtitle="Process Management, Measurement Instrumentation & Automation Solutions",
    bg_image="",
    bg_image_url=""
)

DEFAULT_OVERVIEW = EmersonOverviewSection(
    title="Emerson Automation System Integration & Engineering Services",
    paragraph_1="In an era of digital transformation, leveraging the right automation platform is critical for competitive advantage. ESS-ME is a certified system integrator for Emerson Automation Solutions, providing the expertise to design, deploy, and optimize their world-class technologies.",
    paragraph_2="We empower industries across the Middle East to achieve unprecedented levels of operational efficiency, production reliability, and safety using Emerson's comprehensive suite of control and safety systems.",
    card_image_url=""
)

DEFAULT_DETAILS = EmersonDetailsSection()

NO_CACHE_HEADERS = {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Pragma": "no-cache",
}


def clean_doc_data(data: dict) -> dict:
    """Utility to strip internal MongoDB keys."""
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


def set_no_cache(response: Response) -> None:
    """Stops browsers and proxies from serving an old copy of the response."""
    for key, value in NO_CACHE_HEADERS.items():
        response.headers[key] = value


def sync_banner_image(data: dict) -> dict:
    """bg_image_url is the source of truth; bg_image always mirrors it.

    This keeps a stale bg_image from bringing a removed image back.
    """
    image_url = (data.get("bg_image_url") or "").strip()
    data["bg_image_url"] = image_url
    data["bg_image"] = image_url
    return data


# ==========================================
# EMERSON BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=EmersonBannerHeaderResponse)
@router.get("/banner/", response_model=EmersonBannerHeaderResponse)
async def get_emerson_banner(response: Response):
    """Public API: Retrieve Emerson banner section data."""
    set_no_cache(response)
    try:
        doc = await db["emerson_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return EmersonBannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return EmersonBannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        # Fixes old documents where the two image fields disagree
        banner_data = sync_banner_image(banner_data)

        return EmersonBannerHeaderResponse(
            success=True,
            data=EmersonBannerHeader(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Emerson banner: {str(e)}")
        return EmersonBannerHeaderResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=EmersonBannerHeaderResponse)
@router.put("/banner/", response_model=EmersonBannerHeaderResponse)
async def update_emerson_banner(
    payload: EmersonBannerHeader,
    response: Response,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Emerson banner section data."""
    set_no_cache(response)
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        data_dict = sync_banner_image(data_dict)
        now = datetime.now(timezone.utc)

        await db["emerson_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        # Return what was actually stored, not the raw payload
        return EmersonBannerHeaderResponse(
            success=True,
            data=EmersonBannerHeader(**data_dict)
        )
    except Exception as e:
        print(f"Error updating Emerson banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Emerson banner: {str(e)}"
        )


# ==========================================
# EMERSON OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=EmersonOverviewResponse)
@router.get("/overview/", response_model=EmersonOverviewResponse)
async def get_emerson_overview():
    """Public API: Retrieve Emerson overview section data."""
    try:
        doc = await db["emerson_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return EmersonOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return EmersonOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return EmersonOverviewResponse(
            success=True,
            data=EmersonOverviewSection(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Emerson overview: {str(e)}")
        return EmersonOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=EmersonOverviewResponse)
@router.put("/overview/", response_model=EmersonOverviewResponse)
async def update_emerson_overview(
    payload: EmersonOverviewSection,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Emerson overview section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["emerson_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return EmersonOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Emerson overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Emerson overview: {str(e)}"
        )


# ==========================================
# EMERSON DETAILS ENDPOINTS
# ==========================================

@router.get("/details", response_model=EmersonDetailsResponse)
@router.get("/details/", response_model=EmersonDetailsResponse)
async def get_emerson_details():
    """Public API: Retrieve Emerson full details section data."""
    try:
        doc = await db["emerson_page"].find_one({"section": "details"})
        if not doc or "data" not in doc:
            return EmersonDetailsResponse(success=True, data=DEFAULT_DETAILS)

        details_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(details_data, dict):
            return EmersonDetailsResponse(success=True, data=DEFAULT_DETAILS)

        return EmersonDetailsResponse(
            success=True,
            data=EmersonDetailsSection(**details_data)
        )
    except Exception as e:
        print(f"Error fetching Emerson details: {str(e)}")
        return EmersonDetailsResponse(success=True, data=DEFAULT_DETAILS)


@router.put("/details", response_model=EmersonDetailsResponse)
@router.put("/details/", response_model=EmersonDetailsResponse)
async def update_emerson_details(
    payload: EmersonDetailsSection,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Emerson details section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["emerson_page"].update_one(
            {"section": "details"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return EmersonDetailsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Emerson details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Emerson details: {str(e)}"
        )