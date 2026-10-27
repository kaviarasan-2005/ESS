from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.tsi import (
    TSIBanner,
    TSIBannerResponse,
    TSIOverview,
    TSIOverviewResponse,
    TSIDetails,
    TSIDetailsResponse,
    DEFAULT_TSI_CATEGORIES,
    DEFAULT_TSI_EXPERTISE,
    DEFAULT_TSI_INDUSTRIES
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/tsi",
    tags=["TSI Instruments Page"]
)

DEFAULT_BANNER = TSIBanner(
    title="TSI Instruments",
    subtitle="Precision Measurement & Environmental Monitoring Solutions",
    bg_image_url=""
)

DEFAULT_OVERVIEW = TSIOverview(
    title="Precision TSI Instruments for Environmental, Safety & Process Monitoring",
    paragraph_1=(
        "ESS-ME is the authorized distributor for TSI Instruments, a global leader in precision measurement technology, "
        "serving the Middle East's most critical industries. We supply, calibrate, and support TSI's extensive range of cutting-edge "
        "instruments for environmental monitoring, occupational health and safety, and advanced process control. From ensuring cleanroom "
        "compliance to optimizing worker safety and combustion efficiency, TSI provides the data-driven insights you need to excel."
    ),
    image_url=""
)

DEFAULT_DETAILS = TSIDetails(
    header_title="Trusted TSI Measurement Solutions for the Middle East",
    header_description=(
        "For decades, TSI has been at the forefront of measurement technology, advancing solutions that remain at the industry's cutting edge. "
        "Our customers rely on TSI not just for accurate and reliable data, but also for unparalleled expertise and dedicated support. "
        "With a proven history of trust and innovation, TSI helps you make informed, data-driven decisions to enhance safety, ensure quality, and optimize operations in the demanding climates of the GCC."
    ),
    categories_title="Our Core TSI Product Categories & Applications",
    categories=DEFAULT_TSI_CATEGORIES,
    expertise_title="More Than a Supplier: Our TSI Expertise & Value-Add",
    expertise_subtitle="ESS-ME delivers more than just world-class instruments. We take pride in providing comprehensive solutions to ensure your measurement integrity from day one.",
    expertise_list=DEFAULT_TSI_EXPERTISE,
    industries_title="TSI for Your Industry",
    industries_subtitle="While there are a variety of core applications for our TSI offerings, here are some critical ones:",
    industries_list=DEFAULT_TSI_INDUSTRIES,
    cta_title="Secure Your Operational Excellence With TSI Data",
    cta_subtitle="Stop guessing and start measuring with precision. Partner with ESS-ME to leverage TSI's trusted technology and our local expertise.",
    cta_button_text="Contact a TSI Application Specialist",
    cta_button_link="/contact"
)


def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# TSI BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=TSIBannerResponse)
@router.get("/banner/", response_model=TSIBannerResponse)
async def get_tsi_banner():
    """Public API: Retrieve TSI Instruments banner section data."""
    try:
        doc = await db["tsi_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return TSIBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return TSIBannerResponse(success=True, data=DEFAULT_BANNER)

        return TSIBannerResponse(
            success=True,
            data=TSIBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching TSI banner: {str(e)}")
        return TSIBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=TSIBannerResponse)
@router.put("/banner/", response_model=TSIBannerResponse)
async def update_tsi_banner(
    payload: TSIBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update TSI Instruments banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["tsi_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return TSIBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating TSI banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update TSI banner section: {str(e)}"
        )

# ==========================================
# TSI OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=TSIOverviewResponse)
@router.get("/overview/", response_model=TSIOverviewResponse)
async def get_tsi_overview():
    """Public API: Retrieve TSI Instruments overview section data."""
    try:
        doc = await db["tsi_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return TSIOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return TSIOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return TSIOverviewResponse(
            success=True,
            data=TSIOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching TSI overview: {str(e)}")
        return TSIOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=TSIOverviewResponse)
@router.put("/overview/", response_model=TSIOverviewResponse)
async def update_tsi_overview(
    payload: TSIOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update TSI Instruments overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["tsi_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return TSIOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating TSI overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update TSI overview section: {str(e)}"
        )

# ==========================================
# TSI DETAILS ENDPOINTS
# ==========================================

@router.get("/details", response_model=TSIDetailsResponse)
@router.get("/details/", response_model=TSIDetailsResponse)
async def get_tsi_details():
    """Public API: Retrieve TSI Instruments details section data."""
    try:
        doc = await db["tsi_page"].find_one({"section": "details"})
        if not doc or "data" not in doc:
            return TSIDetailsResponse(success=True, data=DEFAULT_DETAILS)

        details_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(details_data, dict):
            return TSIDetailsResponse(success=True, data=DEFAULT_DETAILS)

        return TSIDetailsResponse(
            success=True,
            data=TSIDetails(**details_data)
        )
    except Exception as e:
        print(f"Error fetching TSI details: {str(e)}")
        return TSIDetailsResponse(success=True, data=DEFAULT_DETAILS)


@router.put("/details", response_model=TSIDetailsResponse)
@router.put("/details/", response_model=TSIDetailsResponse)
async def update_tsi_details(
    payload: TSIDetails,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update TSI Instruments details section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["tsi_page"].update_one(
            {"section": "details"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return TSIDetailsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating TSI details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update TSI details section: {str(e)}"
        )