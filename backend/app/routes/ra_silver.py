from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.ra_silver import (
    RASilverBanner,
    RASilverBannerResponse,
    RASilverOverview,
    RASilverOverviewResponse,
    RASilverDetails,
    RASilverDetailsResponse,
    DEFAULT_RA_SILVER_FEATURES,
    DEFAULT_RA_SILVER_INDUSTRIES
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/ra-silver",
    tags=["RA Silver System Integrator Page"]
)

DEFAULT_BANNER = RASilverBanner(
    title="RA Silver System Integrator",
    subtitle="Rockwell Automation Certified Silver System Integrator Partner",
    bg_image_url=""
)

# DEFAULT FALLBACK DATA
DEFAULT_BANNER = RASilverBanner(
    title="RA Silver System Integrator",
    subtitle="Rockwell Automation Certified Silver System Integrator Partner",
    bg_image_url=""
)

DEFAULT_OVERVIEW = RASilverOverview(
    title="Rockwell Automation System Integration",
    paragraph_1=(
        "As a certified Silver Level System Integrator for Rockwell Automation, "
        "ESS-ME delivers expert engineering, proven project execution, and unparalleled support for "
        "ControlLogix, PlantPAx, and other Allen-Bradley platforms across the Middle East."
    ),
    image_url=""
)


DEFAULT_DETAILS = RASilverDetails(
    expertise_title="Certified Rockwell Automation Expertise",
    expertise_description=(
        "Our Silver System Integrator status is a testament to our proven capability and a commitment to excellence validated by Rockwell Automation itself. "
        "This partnership grants us priority access to technical resources, advanced training, and beta programs, ensuring we deliver solutions that leverage the very latest in automation technology.\n\n"
        "Furthermore, our in-house team includes engineers with direct OEM experience at Rockwell Automation, providing you with an unparalleled level of insight and expertise that goes beyond standard certification."
    ),
    services_title="Our Rockwell Automation Services",
    services_description=(
        "As a Rockwell Automation Silver System Integrator, our certification is more than a status. It's a guarantee of deep technical proficiency and a commitment to best practices. "
        "We leverage the full power of the Rockwell ecosystem, from ControlLogix and PlantPAx to FactoryTalk, to deliver solutions that drive operational excellence, enhance safety, and provide a clear return on investment for your automation projects."
    ),
    features=DEFAULT_RA_SILVER_FEATURES,
    difference_title="The ESS-ME Difference",
    difference_description=(
        "We are one of the only system integrators in Qatar with compliance to IEC 61508 FSM and have FS certified engineers. "
        "Our team is locally available with sizeable experience across Oil & Gas, Water, Chemicals, and Petrochemicals."
    ),
    industries_title="Industries We Serve",
    industries_list=DEFAULT_RA_SILVER_INDUSTRIES
)


def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# RA SILVER BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=RASilverBannerResponse)
@router.get("/banner/", response_model=RASilverBannerResponse)
async def get_ra_silver_banner():
    """Public API: Retrieve RA Silver System Integrator banner section data."""
    try:
        doc = await db["ra_silver_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return RASilverBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return RASilverBannerResponse(success=True, data=DEFAULT_BANNER)

        return RASilverBannerResponse(
            success=True,
            data=RASilverBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching RA Silver banner: {str(e)}")
        return RASilverBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=RASilverBannerResponse)
@router.put("/banner/", response_model=RASilverBannerResponse)
async def update_ra_silver_banner(
    payload: RASilverBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update RA Silver System Integrator banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["ra_silver_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return RASilverBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating RA Silver banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update RA Silver banner section: {str(e)}"
        )


# ==========================================
# OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=RASilverOverviewResponse)
@router.get("/overview/", response_model=RASilverOverviewResponse)
async def get_ra_silver_overview():
    """Public API: Retrieve RA Silver overview section data."""
    try:
        doc = await db["ra_silver_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return RASilverOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return RASilverOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return RASilverOverviewResponse(
            success=True,
            data=RASilverOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching RA Silver overview: {str(e)}")
        return RASilverOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=RASilverOverviewResponse)
@router.put("/overview/", response_model=RASilverOverviewResponse)
async def update_ra_silver_overview(
    payload: RASilverOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update RA Silver overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["ra_silver_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return RASilverOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating RA Silver overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update RA Silver overview section: {str(e)}"
        )


# ==========================================
# RA SILVER DETAILS ENDPOINTS
# ==========================================

@router.get("/details", response_model=RASilverDetailsResponse)
@router.get("/details/", response_model=RASilverDetailsResponse)
async def get_ra_silver_details():
    """Public API: Retrieve RA Silver details section data."""
    try:
        doc = await db["ra_silver_page"].find_one({"section": "details"})
        if not doc or "data" not in doc:
            return RASilverDetailsResponse(success=True, data=DEFAULT_DETAILS)

        details_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(details_data, dict):
            return RASilverDetailsResponse(success=True, data=DEFAULT_DETAILS)

        return RASilverDetailsResponse(
            success=True,
            data=RASilverDetails(**details_data)
        )
    except Exception as e:
        print(f"Error fetching RA Silver details: {str(e)}")
        return RASilverDetailsResponse(success=True, data=DEFAULT_DETAILS)


@router.put("/details", response_model=RASilverDetailsResponse)
@router.put("/details/", response_model=RASilverDetailsResponse)
async def update_ra_silver_details(
    payload: RASilverDetails,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update RA Silver details section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["ra_silver_page"].update_one(
            {"section": "details"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return RASilverDetailsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating RA Silver details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update RA Silver details section: {str(e)}"
        )