from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.testo import (
    TestoBanner,
    TestoBannerResponse,
    TestoOverview,
    TestoOverviewResponse,
    TestoDetails,
    TestoDetailsResponse,
    DEFAULT_TESTO_CARDS,
    DEFAULT_TESTO_ADVANTAGES,
    DEFAULT_TESTO_INDUSTRIES
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/testo",
    tags=["Testo Portable Instruments Page"]
)

DEFAULT_BANNER = TestoBanner(
    title="Testo Portable Instruments",
    subtitle="Precision Measuring Solutions & Portable Instrumentation",
    bg_image_url=""
)

DEFAULT_OVERVIEW = TestoOverview(
    title="Testo Portable Measurement Instruments",
    paragraph_1=(
        "From optimizing combustion efficiency to ensuring perfect indoor air quality, "
        "accurate portable data is the key to operational excellence. ESS-ME is the "
        "authorized Middle Eastern distributor for Testo portable instruments, providing "
        "maintenance teams, facility managers, and service technicians with the precise, "
        "rugged, and easy-to-use tools they need."
    ),
    paragraph_2=(
        "We supply a comprehensive range of portable flue gas analyzers, environmental "
        "meters, and thermal imagers trusted across the GCC's industrial, HVAC, and "
        "facilities management sectors."
    ),
    image_url=""
)

DEFAULT_DETAILS = TestoDetails(
    header_title="Comprehensive Portable Measurement Solutions",
    header_description=(
        "Testo has been a global leader in portable measurement technology for decades, renowned for German engineering, accuracy, and durability. "
        "Their instruments are designed for the real-world conditions of the Middle East, providing reliable data that helps you reduce energy costs, ensure compliance, "
        "extend asset life through predictive maintenance, and guarantee product quality."
    ),
    solutions_title="Our Testo Product Solutions",
    solutions_description=(
        "Our portfolio covers critical measurement parameters for a wide range of industries. "
        "Whether you need to tune a boiler, validate an HVAC system, or inspect electrical panels, we have the right Testo instrument for your application."
    ),
    cards=DEFAULT_TESTO_CARDS,
    advantage_title="The ESS-ME Advantage: More Than a Supplier",
    advantage_subtitle="We ensure you get the most from your investment. Our value-added services include:",
    advantage_list=DEFAULT_TESTO_ADVANTAGES,
    industries_title="Industries We Serve",
    industries_list=DEFAULT_TESTO_INDUSTRIES
)


def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# TESTO BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=TestoBannerResponse)
@router.get("/banner/", response_model=TestoBannerResponse)
async def get_testo_banner():
    """Public API: Retrieve Testo Portable Instruments banner section data."""
    try:
        doc = await db["testo_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return TestoBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return TestoBannerResponse(success=True, data=DEFAULT_BANNER)

        return TestoBannerResponse(
            success=True,
            data=TestoBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Testo banner: {str(e)}")
        return TestoBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=TestoBannerResponse)
@router.put("/banner/", response_model=TestoBannerResponse)
async def update_testo_banner(
    payload: TestoBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Testo Portable Instruments banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["testo_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return TestoBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Testo banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Testo banner section: {str(e)}"
        )

# ==========================================
# TESTO OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=TestoOverviewResponse)
@router.get("/overview/", response_model=TestoOverviewResponse)
async def get_testo_overview():
    """Public API: Retrieve Testo overview section data."""
    try:
        doc = await db["testo_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return TestoOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return TestoOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return TestoOverviewResponse(
            success=True,
            data=TestoOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Testo overview: {str(e)}")
        return TestoOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=TestoOverviewResponse)
@router.put("/overview/", response_model=TestoOverviewResponse)
async def update_testo_overview(
    payload: TestoOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Testo overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["testo_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return TestoOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Testo overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Testo overview section: {str(e)}"
        )


# ==========================================
# TESTO DETAILS ENDPOINTS
# ==========================================

@router.get("/details", response_model=TestoDetailsResponse)
@router.get("/details/", response_model=TestoDetailsResponse)
async def get_testo_details():
    """Public API: Retrieve Testo details section data."""
    try:
        doc = await db["testo_page"].find_one({"section": "details"})
        if not doc or "data" not in doc:
            return TestoDetailsResponse(success=True, data=DEFAULT_DETAILS)

        details_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(details_data, dict):
            return TestoDetailsResponse(success=True, data=DEFAULT_DETAILS)

        return TestoDetailsResponse(
            success=True,
            data=TestoDetails(**details_data)
        )
    except Exception as e:
        print(f"Error fetching Testo details: {str(e)}")
        return TestoDetailsResponse(success=True, data=DEFAULT_DETAILS)


@router.put("/details", response_model=TestoDetailsResponse)
@router.put("/details/", response_model=TestoDetailsResponse)
async def update_testo_details(
    payload: TestoDetails,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Testo details section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["testo_page"].update_one(
            {"section": "details"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return TestoDetailsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Testo details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Testo details section: {str(e)}"
        )