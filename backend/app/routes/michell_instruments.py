from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.michell_instruments import (
    MichellInstrumentsBanner,
    MichellInstrumentsBannerResponse,
    MichellInstrumentsOverview,
    MichellInstrumentsOverviewResponse,
    MichellInstrumentsDetails,
    MichellInstrumentsDetailsResponse,
    DEFAULT_MICHELL_CARDS,
    DEFAULT_MICHELL_SUPPORT_POINTS,
    DEFAULT_MICHELL_APPLICATIONS
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/michell-instruments",
    tags=["Michell Instruments Page"]
)

DEFAULT_BANNER = MichellInstrumentsBanner(
    title="Michell Instruments",
    subtitle="Dew Point, Humidity, and Oxygen Measurement Systems",
    bg_image_url=""
)


# DEFAULT FALLBACK DATA
DEFAULT_BANNER = MichellInstrumentsBanner(
    title="Michell Instruments",
    subtitle="Dew Point, Humidity, and Oxygen Measurement Systems",
    bg_image_url=""
)

DEFAULT_OVERVIEW = MichellInstrumentsOverview(
    title="Michell Instruments Moisture & Dew Point Analyzers",
    paragraph_1=(
        "In countless industrial processes, water vapor is more than just a contaminant—it's a direct threat "
        "to product quality, operational safety, and asset integrity. ESS-ME is the regional supplier for Michell "
        "Instruments moisture and dew point analyzers, providing the gold standard in water vapor measurement for "
        "the Middle East's oil & gas, industrial, and manufacturing sectors. We deliver the precise, reliable "
        "data needed to prevent icing, corrosion, and product spoilage in your most critical applications."
    ),
    image_url=""
)

DEFAULT_DETAILS = MichellInstrumentsDetails(
    importance_title="Importance of Moisture Measurement",
    importance_description=(
        "For decades, Michell Instruments has been the definitive name in moisture analysis, "
        "setting the benchmark for accuracy, reliability, and innovation. Their sensors and "
        "analyzers are engineered to deliver trustworthy data in the most challenging conditions, "
        "from the high pressures of natural gas pipelines to the dry environments of instrument air "
        "systems. Partnering with Michell ensures you have a measurement you can base critical decisions on."
    ),
    solutions_title="Our Michell Instruments Product Solutions",
    solutions_description=(
        "We provide a comprehensive range of Michell's industry-leading technologies, each designed to "
        "excel in specific moisture measurement applications. Our experts will help you select the correct "
        "sensor technology and analyzer for your pressure, temperature, and required measurement range."
    ),
    cards=DEFAULT_MICHELL_CARDS,
    support_title="Expert Application Support",
    support_intro="We provide more than just an instrument; we deliver a solution tailored to your process. Our services include:",
    support_points=DEFAULT_MICHELL_SUPPORT_POINTS,
    applications_title="Typical Applications",
    applications_list=DEFAULT_MICHELL_APPLICATIONS
)


def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# MICHELL INSTRUMENTS BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=MichellInstrumentsBannerResponse)
@router.get("/banner/", response_model=MichellInstrumentsBannerResponse)
async def get_michell_instruments_banner():
    """Public API: Retrieve Michell Instruments banner section data."""
    try:
        doc = await db["michell_instruments_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return MichellInstrumentsBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return MichellInstrumentsBannerResponse(success=True, data=DEFAULT_BANNER)

        return MichellInstrumentsBannerResponse(
            success=True,
            data=MichellInstrumentsBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Michell Instruments banner: {str(e)}")
        return MichellInstrumentsBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=MichellInstrumentsBannerResponse)
@router.put("/banner/", response_model=MichellInstrumentsBannerResponse)
async def update_michell_instruments_banner(
    payload: MichellInstrumentsBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Michell Instruments banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["michell_instruments_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return MichellInstrumentsBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Michell Instruments banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Michell Instruments banner section: {str(e)}"
        )


# ==========================================
# MICHELL INSTRUMENTS OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=MichellInstrumentsOverviewResponse)
@router.get("/overview/", response_model=MichellInstrumentsOverviewResponse)
async def get_michell_instruments_overview():
    """Public API: Retrieve Michell Instruments overview section data."""
    try:
        doc = await db["michell_instruments_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return MichellInstrumentsOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return MichellInstrumentsOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return MichellInstrumentsOverviewResponse(
            success=True,
            data=MichellInstrumentsOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Michell Instruments overview: {str(e)}")
        return MichellInstrumentsOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=MichellInstrumentsOverviewResponse)
@router.put("/overview/", response_model=MichellInstrumentsOverviewResponse)
async def update_michell_instruments_overview(
    payload: MichellInstrumentsOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Michell Instruments overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["michell_instruments_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return MichellInstrumentsOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Michell Instruments overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Michell Instruments overview section: {str(e)}"
        )


# ==========================================
# MICHELL INSTRUMENTS DETAILS ENDPOINTS
# ==========================================

@router.get("/details", response_model=MichellInstrumentsDetailsResponse)
@router.get("/details/", response_model=MichellInstrumentsDetailsResponse)
async def get_michell_instruments_details():
    """Public API: Retrieve Michell Instruments details section data."""
    try:
        doc = await db["michell_instruments_page"].find_one({"section": "details"})
        if not doc or "data" not in doc:
            return MichellInstrumentsDetailsResponse(success=True, data=DEFAULT_DETAILS)

        details_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(details_data, dict):
            return MichellInstrumentsDetailsResponse(success=True, data=DEFAULT_DETAILS)

        return MichellInstrumentsDetailsResponse(
            success=True,
            data=MichellInstrumentsDetails(**details_data)
        )
    except Exception as e:
        print(f"Error fetching Michell Instruments details: {str(e)}")
        return MichellInstrumentsDetailsResponse(success=True, data=DEFAULT_DETAILS)


@router.put("/details", response_model=MichellInstrumentsDetailsResponse)
@router.put("/details/", response_model=MichellInstrumentsDetailsResponse)
async def update_michell_instruments_details(
    payload: MichellInstrumentsDetails,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Michell Instruments details section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["michell_instruments_page"].update_one(
            {"section": "details"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return MichellInstrumentsDetailsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Michell Instruments details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Michell Instruments details section: {str(e)}"
        )