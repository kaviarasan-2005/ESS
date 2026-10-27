from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.prominent_metering import (
    ProminentMeteringBanner,
    ProminentMeteringBannerResponse,
    ProminentMeteringOverview,
    ProminentMeteringOverviewResponse,
    ProminentMeteringDetails,
    ProminentMeteringDetailsResponse,
    DEFAULT_PROMINENT_CATEGORIES,
    DEFAULT_PROMINENT_INDUSTRIES
)

from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/prominent-metering",
    tags=["Prominent Metering Page"]
)

DEFAULT_BANNER = ProminentMeteringBanner(
    title="Prominent Metering",
    subtitle="Precision Chemical Dosing & Metering Pump Solutions",
    bg_image_url=""
)


DEFAULT_BANNER = ProminentMeteringBanner(
    title="Prominent Metering",
    subtitle="Precision Chemical Dosing & Metering Pump Solutions",
    bg_image_url=""
)

DEFAULT_OVERVIEW = ProminentMeteringOverview(
    title="ProMinent Metering Pumps & Water Treatment",
    paragraph_1=(
        "In industrial processes where chemical accuracy is critical to efficiency and safety, "
        "precision is non-negotiable. ESS-ME is the authorized Middle Eastern distributor for ProMinent "
        "Metering Pumps, the global leader in chemical dosing technology. We provide complete dosing solutions "
        "that deliver unmatched accuracy, reliability, and control for water treatment, oil & gas, and chemical "
        "processing applications across the GCC, ensuring optimal chemical usage, cost savings, and process integrity."
    ),
    image_url=""
)

DEFAULT_DETAILS = ProminentMeteringDetails(
    header_title="Engineered Dosing Excellence with ProMinent Technology",
    header_description=(
        "The ProMinent Group has established a global benchmark in metering pump innovation for over five decades. "
        "Their extensive portfolio—ranging from robust hydraulic diaphragm pumps to intelligent multi-parameter "
        "controllers—is built for peak reliability in demanding industrial environments. Partnering with ProMinent "
        "enables us to supply chemical dosing systems that maintain precise chemical proportions, reduce waste, "
        "and protect critical assets from scaling, corrosion, and fouling."
    ),
    range_title="Our ProMinent Product Range",
    range_description=(
        "We offer complete fluid management solutions beyond individual pumps. From single injection point pumps "
        "to fully automated, skid-mounted systems equipped with integrated sensors and controllers, our expertise "
        "ensures a dosing solution tailored to your operational requirements."
    ),
    categories=DEFAULT_PROMINENT_CATEGORIES,
    support_title="ESS-ME's Total Dosing System Support",
    support_description=(
        "Our partnership with ProMinent is backed by robust local engineering and service capabilities. We offer "
        "expert application analysis, system design, installation supervision, and complete lifecycle support—including "
        "calibration services and genuine spare parts supply."
    ),
    industries_title="Industries Served",
    industries_list=DEFAULT_PROMINENT_INDUSTRIES
)

def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# PROMINENT METERING BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=ProminentMeteringBannerResponse)
@router.get("/banner/", response_model=ProminentMeteringBannerResponse)
async def get_prominent_metering_banner():
    """Public API: Retrieve Prominent Metering banner section data."""
    try:
        doc = await db["prominent_metering_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return ProminentMeteringBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return ProminentMeteringBannerResponse(success=True, data=DEFAULT_BANNER)

        return ProminentMeteringBannerResponse(
            success=True,
            data=ProminentMeteringBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Prominent Metering banner: {str(e)}")
        return ProminentMeteringBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=ProminentMeteringBannerResponse)
@router.put("/banner/", response_model=ProminentMeteringBannerResponse)
async def update_prominent_metering_banner(
    payload: ProminentMeteringBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Prominent Metering banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["prominent_metering_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return ProminentMeteringBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Prominent Metering banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Prominent Metering banner section: {str(e)}"
        )


# ==========================================
# PROMINENT METERING OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=ProminentMeteringOverviewResponse)
@router.get("/overview/", response_model=ProminentMeteringOverviewResponse)
async def get_prominent_metering_overview():
    """Public API: Retrieve Prominent Metering overview section data."""
    try:
        doc = await db["prominent_metering_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return ProminentMeteringOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return ProminentMeteringOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return ProminentMeteringOverviewResponse(
            success=True,
            data=ProminentMeteringOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Prominent Metering overview: {str(e)}")
        return ProminentMeteringOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=ProminentMeteringOverviewResponse)
@router.put("/overview/", response_model=ProminentMeteringOverviewResponse)
async def update_prominent_metering_overview(
    payload: ProminentMeteringOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Prominent Metering overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["prominent_metering_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return ProminentMeteringOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Prominent Metering overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Prominent Metering overview section: {str(e)}"
        )


# ==========================================
# DETAILS ENDPOINTS
# ==========================================

@router.get("/details", response_model=ProminentMeteringDetailsResponse)
@router.get("/details/", response_model=ProminentMeteringDetailsResponse)
async def get_prominent_metering_details():
    """Public API: Retrieve Prominent Metering details section data."""
    try:
        doc = await db["prominent_metering_page"].find_one({"section": "details"})
        if not doc or "data" not in doc:
            return ProminentMeteringDetailsResponse(success=True, data=DEFAULT_DETAILS)

        details_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(details_data, dict):
            return ProminentMeteringDetailsResponse(success=True, data=DEFAULT_DETAILS)

        return ProminentMeteringDetailsResponse(
            success=True,
            data=ProminentMeteringDetails(**details_data)
        )
    except Exception as e:
        print(f"Error fetching Prominent Metering details: {str(e)}")
        return ProminentMeteringDetailsResponse(success=True, data=DEFAULT_DETAILS)


@router.put("/details", response_model=ProminentMeteringDetailsResponse)
@router.put("/details/", response_model=ProminentMeteringDetailsResponse)
async def update_prominent_metering_details(
    payload: ProminentMeteringDetails,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Prominent Metering details section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["prominent_metering_page"].update_one(
            {"section": "details"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return ProminentMeteringDetailsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Prominent Metering details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Prominent Metering details section: {str(e)}"
        )
