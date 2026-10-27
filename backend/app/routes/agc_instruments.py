from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.agc_instruments import (
    AGCBannerHeader,
    AGCBannerHeaderResponse,
    AGCOverview,
    AGCOverviewResponse,
    AGCSolutionsSupport,
    AGCSolutionsSupportResponse,
)
from app.utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/agc-instruments", tags=["AGC Instruments Page"])

DEFAULT_BANNER = AGCBannerHeader(
    title="AGC Instruments",
    subtitle="Gas Chromatographs & Analysers",
    bg_image="",
    bg_image_url=""
)

DEFAULT_OVERVIEW = AGCOverview(
    title="AGC Instruments Gas Chromatographs & Analysers",
    description=(
        "In industries where gas composition directly impacts product quality, "
        "revenue, and safety, there is no room for estimation. ESS-ME is the "
        "trusted supplier of AGC Instruments gas chromatographs and process "
        "analyzers, delivering laboratory-grade precision for continuous online "
        "monitoring. We provide robust, reliable solutions for the Middle East's "
        "natural gas, petrochemical, and industrial sectors, ensuring you have "
        "the accurate, real-time data needed for custody transfer, process "
        "optimization, and quality assurance."
    ),
    image_url="",
    image=""
)

DEFAULT_SOLUTIONS_SUPPORT = AGCSolutionsSupport()


# ==========================================
# BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=AGCBannerHeaderResponse)
async def get_agc_banner():
    """Public API: Retrieve the AGC Instruments banner section data."""
    try:
        doc = await db["agc_instruments_page"].find_one({"section": "banner"})
        if not doc:
            return AGCBannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        banner_data = doc.get("data", {})
        return AGCBannerHeaderResponse(
            success=True,
            data=AGCBannerHeader(**banner_data)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch AGC Instruments banner: {str(e)}"
        )


@router.put("/banner", response_model=AGCBannerHeaderResponse)
async def update_agc_banner(
    payload: AGCBannerHeader,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update the AGC Instruments banner section data."""
    try:
        data_dict = payload.model_dump()
        now = datetime.now(timezone.utc)

        await db["agc_instruments_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return AGCBannerHeaderResponse(success=True, data=payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update AGC Instruments banner: {str(e)}"
        )


# ==========================================
# OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=AGCOverviewResponse)
async def get_agc_overview():
    """Public API: Retrieve the AGC Instruments overview section data."""
    try:
        doc = await db["agc_instruments_page"].find_one({"section": "overview"})
        if not doc:
            return AGCOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = doc.get("data", {})
        return AGCOverviewResponse(
            success=True,
            data=AGCOverview(**overview_data)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch AGC Instruments overview: {str(e)}"
        )


@router.put("/overview", response_model=AGCOverviewResponse)
async def update_agc_overview(
    payload: AGCOverview,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update the AGC Instruments overview section data."""
    try:
        data_dict = payload.model_dump()
        now = datetime.now(timezone.utc)

        await db["agc_instruments_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return AGCOverviewResponse(success=True, data=payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update AGC Instruments overview: {str(e)}"
        )


# ==========================================
# SOLUTIONS & SUPPORT ENDPOINTS
# ==========================================

@router.get("/solutions-support", response_model=AGCSolutionsSupportResponse)
async def get_agc_solutions_support():
    """Public API: Retrieve the AGC Solutions & Support section data."""
    try:
        doc = await db["agc_instruments_page"].find_one({"section": "solutions_support"})
        if not doc:
            return AGCSolutionsSupportResponse(success=True, data=DEFAULT_SOLUTIONS_SUPPORT)

        data = doc.get("data", {})
        return AGCSolutionsSupportResponse(
            success=True,
            data=AGCSolutionsSupport(**data)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch AGC Solutions & Support data: {str(e)}"
        )


@router.put("/solutions-support", response_model=AGCSolutionsSupportResponse)
async def update_agc_solutions_support(
    payload: AGCSolutionsSupport,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update the AGC Solutions & Support section data."""
    try:
        data_dict = payload.model_dump()
        now = datetime.now(timezone.utc)

        await db["agc_instruments_page"].update_one(
            {"section": "solutions_support"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return AGCSolutionsSupportResponse(success=True, data=payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update AGC Solutions & Support section: {str(e)}"
        )