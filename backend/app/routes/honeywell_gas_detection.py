from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.honeywell_gas_detection import (
    HoneywellGasDetectionBanner,
    HoneywellGasDetectionBannerResponse,
    HoneywellGasDetectionOverview,
    HoneywellGasDetectionOverviewResponse,
    HoneywellGasDetectionDetails,
    HoneywellGasDetectionDetailsResponse,
    DEFAULT_HONEYWELL_GAS_CARDS,
    DEFAULT_HONEYWELL_GAS_SUPPORT,
    HoneywellGasDetectionIndustries,
    HoneywellGasDetectionIndustriesResponse,
    DEFAULT_HONEYWELL_GAS_INDUSTRIES
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/honeywell-gas-detection",
    tags=["Honeywell Gas Detection Page"]
)

DEFAULT_BANNER = HoneywellGasDetectionBanner(
    title="Honeywell",
    subtitle="Gas & Flame Detection Systems",
    bg_image_url=""
)


DEFAULT_BANNER = HoneywellGasDetectionBanner(
    title="Honeywell",
    subtitle="Gas & Flame Detection Systems",
    bg_image_url=""
)

DEFAULT_OVERVIEW = HoneywellGasDetectionOverview(
    title="Honeywell Gas Detection Solutions",
    paragraph_1=(
        "In hazardous industrial environments, personnel safety and plant integrity depend on "
        "uncompromising gas detection capabilities. ESS-ME is a certified Middle Eastern distributor "
        "for Honeywell Gas Detection, providing advanced toxic and combustible gas monitors, flame detectors, "
        "and controller units. We equip industrial facilities across the GCC with rugged, high-precision safety "
        "systems engineered to deliver immediate warnings and prevent catastrophic incidents."
    ),
    image_url=""
)


DEFAULT_DETAILS = HoneywellGasDetectionDetails(
    header_title="Trusted Honeywell Gas Detection Solutions",
    header_description=(
        "Honeywell Analytics sets the industry benchmark for gas detection excellence, "
        "offering an unrivalled offering of technical expertise and market-leading equipment. "
        "The goal is to provide an all-embracing resource for all things gas detection and establish "
        "the highest standards of safety and reliability. Our partnership ensures you receive this "
        "world-class technology, backed by our local engineers with over two decades of regional "
        "fire and gas system experience."
    ),
    range_title="Our Honeywell Product Range",
    range_image_url="",
    range_paragraph_1=(
        "We provide a complete range of Honeywell gas detection technologies, "
        "from facility-wide monitoring networks to personal protective equipment."
    ),
    range_paragraph_2=(
        "ESSME's solutions are engineered for the harsh Middle Eastern climate. "
        "We are supported by lifelong calibration and maintenance services backed by "
        "our trusted partnership with Honeywell which we leverage on to benefit our customers.\n\n"
        "Two of our major offerings are Fixed Gas Detection Systems and Portable Gas Detectors."
    ),
    cards=DEFAULT_HONEYWELL_GAS_CARDS,
    support_title="Honeywell Analytics Distributor Support",
    support_points=DEFAULT_HONEYWELL_GAS_SUPPORT
)

DEFAULT_INDUSTRIES = HoneywellGasDetectionIndustries(
    section_title="Industries We Serve",
    intro_text="Our Honeywell gas detection solutions protect assets and personnel in the following major areas:",
    industry_list=DEFAULT_HONEYWELL_GAS_INDUSTRIES,
    poster_image_url="",
    poster_caption="Honeywell in Oil & Gas Applications",
    footer_text="Our applications range all across the Middle East, especially Qatar. To understand more about our services, send an email to our Honeywell Gas detection specialists and we will reach out to you right away."
)


def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# HONEYWELL GAS DETECTION BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=HoneywellGasDetectionBannerResponse)
@router.get("/banner/", response_model=HoneywellGasDetectionBannerResponse)
async def get_honeywell_gas_detection_banner():
    """Public API: Retrieve Honeywell Gas Detection banner section data."""
    try:
        doc = await db["honeywell_gas_detection_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return HoneywellGasDetectionBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return HoneywellGasDetectionBannerResponse(success=True, data=DEFAULT_BANNER)

        return HoneywellGasDetectionBannerResponse(
            success=True,
            data=HoneywellGasDetectionBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Honeywell Gas Detection banner: {str(e)}")
        return HoneywellGasDetectionBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=HoneywellGasDetectionBannerResponse)
@router.put("/banner/", response_model=HoneywellGasDetectionBannerResponse)
async def update_honeywell_gas_detection_banner(
    payload: HoneywellGasDetectionBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Honeywell Gas Detection banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["honeywell_gas_detection_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return HoneywellGasDetectionBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Honeywell Gas Detection banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Honeywell Gas Detection banner section: {str(e)}"
        )


# ==========================================
# HONEYWELL GAS DETECTION BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=HoneywellGasDetectionBannerResponse)
@router.get("/banner/", response_model=HoneywellGasDetectionBannerResponse)
async def get_honeywell_gas_detection_banner():
    """Public API: Retrieve Honeywell Gas Detection banner section data."""
    try:
        doc = await db["honeywell_gas_detection_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return HoneywellGasDetectionBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return HoneywellGasDetectionBannerResponse(success=True, data=DEFAULT_BANNER)

        return HoneywellGasDetectionBannerResponse(
            success=True,
            data=HoneywellGasDetectionBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Honeywell Gas Detection banner: {str(e)}")
        return HoneywellGasDetectionBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=HoneywellGasDetectionBannerResponse)
@router.put("/banner/", response_model=HoneywellGasDetectionBannerResponse)
async def update_honeywell_gas_detection_banner(
    payload: HoneywellGasDetectionBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Honeywell Gas Detection banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["honeywell_gas_detection_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return HoneywellGasDetectionBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Honeywell Gas Detection banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Honeywell Gas Detection banner section: {str(e)}"
        )


# ==========================================
# HONEYWELL GAS DETECTION OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=HoneywellGasDetectionOverviewResponse)
@router.get("/overview/", response_model=HoneywellGasDetectionOverviewResponse)
async def get_honeywell_gas_detection_overview():
    """Public API: Retrieve Honeywell Gas Detection overview section data."""
    try:
        doc = await db["honeywell_gas_detection_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return HoneywellGasDetectionOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return HoneywellGasDetectionOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return HoneywellGasDetectionOverviewResponse(
            success=True,
            data=HoneywellGasDetectionOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Honeywell Gas Detection overview: {str(e)}")
        return HoneywellGasDetectionOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=HoneywellGasDetectionOverviewResponse)
@router.put("/overview/", response_model=HoneywellGasDetectionOverviewResponse)
async def update_honeywell_gas_detection_overview(
    payload: HoneywellGasDetectionOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Honeywell Gas Detection overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["honeywell_gas_detection_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return HoneywellGasDetectionOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Honeywell Gas Detection overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Honeywell Gas Detection overview section: {str(e)}"
        )


# ==========================================
# HONEYWELL GAS DETECTION DETAILS ENDPOINTS
# ==========================================

@router.get("/details", response_model=HoneywellGasDetectionDetailsResponse)
@router.get("/details/", response_model=HoneywellGasDetectionDetailsResponse)
async def get_honeywell_gas_detection_details():
    """Public API: Retrieve Honeywell Gas Detection details section data."""
    try:
        doc = await db["honeywell_gas_detection_page"].find_one({"section": "details"})
        if not doc or "data" not in doc:
            return HoneywellGasDetectionDetailsResponse(success=True, data=DEFAULT_DETAILS)

        details_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(details_data, dict):
            return HoneywellGasDetectionDetailsResponse(success=True, data=DEFAULT_DETAILS)

        return HoneywellGasDetectionDetailsResponse(
            success=True,
            data=HoneywellGasDetectionDetails(**details_data)
        )
    except Exception as e:
        print(f"Error fetching Honeywell Gas Detection details: {str(e)}")
        return HoneywellGasDetectionDetailsResponse(success=True, data=DEFAULT_DETAILS)


@router.put("/details", response_model=HoneywellGasDetectionDetailsResponse)
@router.put("/details/", response_model=HoneywellGasDetectionDetailsResponse)
async def update_honeywell_gas_detection_details(
    payload: HoneywellGasDetectionDetails,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Honeywell Gas Detection details section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["honeywell_gas_detection_page"].update_one(
            {"section": "details"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return HoneywellGasDetectionDetailsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Honeywell Gas Detection details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Honeywell Gas Detection details section: {str(e)}"
        )


# ==========================================
# HONEYWELL GAS DETECTION INDUSTRIES ENDPOINTS
# ==========================================

@router.get("/industries", response_model=HoneywellGasDetectionIndustriesResponse)
@router.get("/industries/", response_model=HoneywellGasDetectionIndustriesResponse)
async def get_honeywell_gas_detection_industries():
    """Public API: Retrieve Honeywell Gas Detection industries section data."""
    try:
        doc = await db["honeywell_gas_detection_page"].find_one({"section": "industries"})
        if not doc or "data" not in doc:
            return HoneywellGasDetectionIndustriesResponse(success=True, data=DEFAULT_INDUSTRIES)

        industries_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(industries_data, dict):
            return HoneywellGasDetectionIndustriesResponse(success=True, data=DEFAULT_INDUSTRIES)

        return HoneywellGasDetectionIndustriesResponse(
            success=True,
            data=HoneywellGasDetectionIndustries(**industries_data)
        )
    except Exception as e:
        print(f"Error fetching Honeywell Gas Detection industries: {str(e)}")
        return HoneywellGasDetectionIndustriesResponse(success=True, data=DEFAULT_INDUSTRIES)


@router.put("/industries", response_model=HoneywellGasDetectionIndustriesResponse)
@router.put("/industries/", response_model=HoneywellGasDetectionIndustriesResponse)
async def update_honeywell_gas_detection_industries(
    payload: HoneywellGasDetectionIndustries,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Honeywell Gas Detection industries section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["honeywell_gas_detection_page"].update_one(
            {"section": "industries"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return HoneywellGasDetectionIndustriesResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Honeywell Gas Detection industries: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Honeywell Gas Detection industries section: {str(e)}"
        )