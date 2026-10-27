from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.sampling_systems import (
    SamplingSystemsBanner,
    SamplingSystemsBannerResponse,
    SamplingSystemsOverview,
    SamplingSystemsOverviewResponse,
    DEFAULT_SAMPLING_SYSTEMS_IMAGES,
    SamplingSystemsApplications,
    SamplingSystemsApplicationsResponse,
    DEFAULT_SAMPLING_SYSTEMS_APPLICATIONS,
    SamplingSystemsCapabilities,
    SamplingSystemsCapabilitiesResponse,
    DEFAULT_SAMPLING_SYSTEMS_INDUSTRIES,
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/sampling-systems",
    tags=["Sampling Systems Page"]
)

DEFAULT_BANNER = SamplingSystemsBanner(
    title="Sampling Systems",
    subtitle="Integrated Sampling & Analytical Measurement Solutions",
    bg_image_url=""
)

DEFAULT_OVERVIEW = SamplingSystemsOverview(
    paragraph_1=(
        "Representative, contamination-free sampling is essential to accurate custody transfer, "
        "quality certification, and process analysis across the hydrocarbon value chain. ESS Saudi "
        "supplies sampling systems for crude oil, LNG, and natural gas applications, sourced from "
        "internationally reputed API certified manufacturers and engineered to meet recognized custody "
        "transfer and fiscal metering standards."
    ),
    paragraph_2=(
        "Our sampling system scope includes automatic and spot sampling systems, sample conditioning "
        "and probe assemblies, and fully integrated sampling skids designed to support Saudi Aramco's "
        "fiscal metering and crude oil quality control requirements."
    ),
    carousel_images=DEFAULT_SAMPLING_SYSTEMS_IMAGES
)

DEFAULT_APPLICATIONS = SamplingSystemsApplications(
    title="Key Applications",
    applications_list=DEFAULT_SAMPLING_SYSTEMS_APPLICATIONS
)

DEFAULT_CAPABILITIES = SamplingSystemsCapabilities(
    industries_title="Industries served",
    industries_list=DEFAULT_SAMPLING_SYSTEMS_INDUSTRIES,
    why_title="Why ESS Saudi",
    why_description=(
        "ESS Saudi supplies internationally engineered sampling systems as a distributor "
        "and channel partner, and offers local application support to align sampling system design "
        "with Saudi Aramco fiscal metering and quality control requirements."
    )
)

def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# SAMPLING SYSTEMS BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=SamplingSystemsBannerResponse)
@router.get("/banner/", response_model=SamplingSystemsBannerResponse)
async def get_sampling_systems_banner():
    """Public API: Retrieve Sampling Systems banner section data."""
    try:
        doc = await db["sampling_systems_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return SamplingSystemsBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return SamplingSystemsBannerResponse(success=True, data=DEFAULT_BANNER)

        return SamplingSystemsBannerResponse(
            success=True,
            data=SamplingSystemsBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Sampling Systems banner: {str(e)}")
        return SamplingSystemsBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=SamplingSystemsBannerResponse)
@router.put("/banner/", response_model=SamplingSystemsBannerResponse)
async def update_sampling_systems_banner(
    payload: SamplingSystemsBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Sampling Systems banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["sampling_systems_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return SamplingSystemsBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Sampling Systems banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Sampling Systems banner section: {str(e)}"
        )


# ==========================================
# SAMPLING SYSTEMS OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=SamplingSystemsOverviewResponse)
@router.get("/overview/", response_model=SamplingSystemsOverviewResponse)
async def get_sampling_systems_overview():
    """Public API: Retrieve Sampling Systems overview section data."""
    try:
        doc = await db["sampling_systems_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return SamplingSystemsOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return SamplingSystemsOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return SamplingSystemsOverviewResponse(
            success=True,
            data=SamplingSystemsOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Sampling Systems overview: {str(e)}")
        return SamplingSystemsOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=SamplingSystemsOverviewResponse)
@router.put("/overview/", response_model=SamplingSystemsOverviewResponse)
async def update_sampling_systems_overview(
    payload: SamplingSystemsOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Sampling Systems overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["sampling_systems_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return SamplingSystemsOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Sampling Systems overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Sampling Systems overview section: {str(e)}"
        )

# ==========================================
# SAMPLING SYSTEMS APPLICATIONS ENDPOINTS
# ==========================================

@router.get("/applications", response_model=SamplingSystemsApplicationsResponse)
@router.get("/applications/", response_model=SamplingSystemsApplicationsResponse)
async def get_sampling_systems_applications():
    """Public API: Retrieve Sampling Systems applications section data."""
    try:
        doc = await db["sampling_systems_page"].find_one({"section": "applications"})
        if not doc or "data" not in doc:
            return SamplingSystemsApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        app_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(app_data, dict):
            return SamplingSystemsApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        return SamplingSystemsApplicationsResponse(
            success=True,
            data=SamplingSystemsApplications(**app_data)
        )
    except Exception as e:
        print(f"Error fetching Sampling Systems applications: {str(e)}")
        return SamplingSystemsApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)


@router.put("/applications", response_model=SamplingSystemsApplicationsResponse)
@router.put("/applications/", response_model=SamplingSystemsApplicationsResponse)
async def update_sampling_systems_applications(
    payload: SamplingSystemsApplications,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Sampling Systems applications section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["sampling_systems_page"].update_one(
            {"section": "applications"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return SamplingSystemsApplicationsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Sampling Systems applications: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Sampling Systems applications section: {str(e)}"
        )



# ==========================================
# SAMPLING SYSTEMS CAPABILITIES ENDPOINTS
# ==========================================

@router.get("/capabilities", response_model=SamplingSystemsCapabilitiesResponse)
@router.get("/capabilities/", response_model=SamplingSystemsCapabilitiesResponse)
async def get_sampling_systems_capabilities():
    """Public API: Retrieve Sampling Systems capabilities & industries data."""
    try:
        doc = await db["sampling_systems_page"].find_one({"section": "capabilities"})
        if not doc or "data" not in doc:
            return SamplingSystemsCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        cap_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(cap_data, dict):
            return SamplingSystemsCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        return SamplingSystemsCapabilitiesResponse(
            success=True,
            data=SamplingSystemsCapabilities(**cap_data)
        )
    except Exception as e:
        print(f"Error fetching Sampling Systems capabilities: {str(e)}")
        return SamplingSystemsCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)


@router.put("/capabilities", response_model=SamplingSystemsCapabilitiesResponse)
@router.put("/capabilities/", response_model=SamplingSystemsCapabilitiesResponse)
async def update_sampling_systems_capabilities(
    payload: SamplingSystemsCapabilities,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Sampling Systems capabilities & industries content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["sampling_systems_page"].update_one(
            {"section": "capabilities"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return SamplingSystemsCapabilitiesResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Sampling Systems capabilities: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Sampling Systems capabilities section: {str(e)}"
        )