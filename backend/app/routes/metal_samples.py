from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.metal_samples import (
    MetalSamplesBanner,
    MetalSamplesBannerResponse,
    MetalSamplesOverview,
    MetalSamplesOverviewResponse,
    MetalSamplesDetails,
    MetalSamplesDetailsResponse,
    DEFAULT_METAL_CARDS,
    DEFAULT_METAL_ADVANTAGE_POINTS,
    DEFAULT_METAL_INDUSTRIES
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/metal-samples",
    tags=["Metal Samples Page"]
)

DEFAULT_BANNER = MetalSamplesBanner(
    title="Metal Samples",
    subtitle="Corrosion Monitoring & Material Evaluation Systems",
    bg_image_url=""
)

DEFAULT_BANNER = MetalSamplesBanner(
    title="Metal Samples",
    subtitle="Corrosion Monitoring & Material Evaluation Systems",
    bg_image_url=""
)

DEFAULT_OVERVIEW = MetalSamplesOverview(
    title="Metal Samples Corrosion Monitoring Products",
    paragraph_1=(
        "Corrosion is a constant threat to your pipelines, vessels, and process equipment, "
        "leading to costly downtime, safety hazards, and catastrophic failures. ESS-ME is the "
        "authorized supplier of Metal Samples corrosion monitoring products, providing the essential "
        "tools for a proactive, data-driven asset integrity strategy. We equip industries across the "
        "Middle East with reliable solutions to measure, monitor, and mitigate corrosion, "
        "transforming your maintenance from reactive to predictive."
    ),
    image_url=""
)

DEFAULT_DETAILS = MetalSamplesDetails(
    global_title="Global Standard in Corrosion/Erosion Monitoring",
    global_description=(
        "For over four decades, Metal Samples has been the industry benchmark for corrosion and erosion monitoring technology. "
        "Trusted by chemical plants, water treatment facilities, and oil & gas operators worldwide, their products deliver the "
        "accurate, actionable data needed to optimize chemical treatment programs, validate materials performance, and schedule "
        "maintenance proactively, ultimately extending asset life and ensuring operational safety."
    ),
    range_title="Our Metal Samples Product Range",
    range_description=(
        "We provide a complete range of monitoring tools, from simple, cost-effective coupons for periodic checks to "
        "sophisticated electronic systems for real-time insight. Our experts help you design a monitoring program that fits your "
        "risk profile and data requirements."
    ),
    cards=DEFAULT_METAL_CARDS,
    advantage_title="ESS-ME Advantage: From Data to Decision",
    advantage_intro="We partner with you to build an effective corrosion management program. Our services include:",
    advantage_points=DEFAULT_METAL_ADVANTAGE_POINTS,
    industries_title="Industries Reliant on This Technology",
    industries_list=DEFAULT_METAL_INDUSTRIES
)

def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# METAL SAMPLES BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=MetalSamplesBannerResponse)
@router.get("/banner/", response_model=MetalSamplesBannerResponse)
async def get_metal_samples_banner():
    """Public API: Retrieve Metal Samples banner section data."""
    try:
        doc = await db["metal_samples_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return MetalSamplesBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return MetalSamplesBannerResponse(success=True, data=DEFAULT_BANNER)

        return MetalSamplesBannerResponse(
            success=True,
            data=MetalSamplesBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Metal Samples banner: {str(e)}")
        return MetalSamplesBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=MetalSamplesBannerResponse)
@router.put("/banner/", response_model=MetalSamplesBannerResponse)
async def update_metal_samples_banner(
    payload: MetalSamplesBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Metal Samples banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["metal_samples_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return MetalSamplesBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Metal Samples banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Metal Samples banner section: {str(e)}"
        )



# ==========================================
# METAL SAMPLES BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=MetalSamplesBannerResponse)
@router.get("/banner/", response_model=MetalSamplesBannerResponse)
async def get_metal_samples_banner():
    """Public API: Retrieve Metal Samples banner section data."""
    try:
        doc = await db["metal_samples_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return MetalSamplesBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return MetalSamplesBannerResponse(success=True, data=DEFAULT_BANNER)

        return MetalSamplesBannerResponse(
            success=True,
            data=MetalSamplesBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Metal Samples banner: {str(e)}")
        return MetalSamplesBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=MetalSamplesBannerResponse)
@router.put("/banner/", response_model=MetalSamplesBannerResponse)
async def update_metal_samples_banner(
    payload: MetalSamplesBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Metal Samples banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["metal_samples_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return MetalSamplesBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Metal Samples banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Metal Samples banner section: {str(e)}"
        )


# ==========================================
# METAL SAMPLES OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=MetalSamplesOverviewResponse)
@router.get("/overview/", response_model=MetalSamplesOverviewResponse)
async def get_metal_samples_overview():
    """Public API: Retrieve Metal Samples overview section data."""
    try:
        doc = await db["metal_samples_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return MetalSamplesOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return MetalSamplesOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return MetalSamplesOverviewResponse(
            success=True,
            data=MetalSamplesOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Metal Samples overview: {str(e)}")
        return MetalSamplesOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=MetalSamplesOverviewResponse)
@router.put("/overview/", response_model=MetalSamplesOverviewResponse)
async def update_metal_samples_overview(
    payload: MetalSamplesOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Metal Samples overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["metal_samples_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return MetalSamplesOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Metal Samples overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Metal Samples overview section: {str(e)}"
        )


# ==========================================
# METAL SAMPLES DETAILS ENDPOINTS
# ==========================================

@router.get("/details", response_model=MetalSamplesDetailsResponse)
@router.get("/details/", response_model=MetalSamplesDetailsResponse)
async def get_metal_samples_details():
    """Public API: Retrieve Metal Samples details section data."""
    try:
        doc = await db["metal_samples_page"].find_one({"section": "details"})
        if not doc or "data" not in doc:
            return MetalSamplesDetailsResponse(success=True, data=DEFAULT_DETAILS)

        details_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(details_data, dict):
            return MetalSamplesDetailsResponse(success=True, data=DEFAULT_DETAILS)

        return MetalSamplesDetailsResponse(
            success=True,
            data=MetalSamplesDetails(**details_data)
        )
    except Exception as e:
        print(f"Error fetching Metal Samples details: {str(e)}")
        return MetalSamplesDetailsResponse(success=True, data=DEFAULT_DETAILS)


@router.put("/details", response_model=MetalSamplesDetailsResponse)
@router.put("/details/", response_model=MetalSamplesDetailsResponse)
async def update_metal_samples_details(
    payload: MetalSamplesDetails,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Metal Samples details section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["metal_samples_page"].update_one(
            {"section": "details"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return MetalSamplesDetailsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Metal Samples details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Metal Samples details section: {str(e)}"
        )