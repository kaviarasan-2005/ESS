from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.upstream_instrumentation import (
    UpstreamInstrumentationBanner,
    UpstreamInstrumentationBannerResponse,
    UpstreamInstrumentationOverview,
    UpstreamInstrumentationOverviewResponse,
    DEFAULT_UPSTREAM_INSTRUMENTATION_IMAGES,
    UpstreamInstrumentationApplications,
    UpstreamInstrumentationApplicationsResponse,
    DEFAULT_UPSTREAM_INSTRUMENTATION_APPLICATIONS,
    UpstreamInstrumentationCapabilities,
    UpstreamInstrumentationCapabilitiesResponse,
    DEFAULT_UPSTREAM_INSTRUMENTATION_INDUSTRIES,
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/upstream-instrumentation",
    tags=["Upstream Instrumentation Page"]
)

DEFAULT_BANNER = UpstreamInstrumentationBanner(
    title="Upstream Instrumentation (Water Cut Meters)",
    subtitle="Precision Real-Time Water Cut & Multiphase Measurement Solutions",
    bg_image_url=""
)

DEFAULT_OVERVIEW = UpstreamInstrumentationOverview(
    paragraph_1=(
        "Accurate water cut measurement is essential to production allocation, well testing, "
        "and fiscal metering across upstream and midstream operations. ESS Saudi supplies water cut meters "
        "and related upstream instrumentation from internationally reputed manufacturers, engineered for the wide "
        "range of flow, viscosity, and salinity conditions found in Saudi oilfield production."
    ),
    paragraph_2=(
        "Our upstream instrumentation portfolio supports well testing, production allocation metering, "
        "and fiscal metering applications, and is aligned with Saudi Aramco's In-Kingdom Total Value Add (IKTVA) "
        "localization program."
    ),
    carousel_images=DEFAULT_UPSTREAM_INSTRUMENTATION_IMAGES
)

DEFAULT_APPLICATIONS = UpstreamInstrumentationApplications(
    title="Key Applications",
    applications_list=DEFAULT_UPSTREAM_INSTRUMENTATION_APPLICATIONS
)
DEFAULT_CAPABILITIES = UpstreamInstrumentationCapabilities(
    industries_title="Industries served",
    industries_list=DEFAULT_UPSTREAM_INSTRUMENTATION_INDUSTRIES,
    why_title="Why ESS Saudi",
    why_description=(
        "ESS Saudi supplies internationally proven water cut and upstream measurement "
        "technologies as a distributor and channel partner, and offers in-Kingdom technical support "
        "and service capability aligned with Saudi Aramco's localization objectives."
    )
)

def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# UPSTREAM INSTRUMENTATION BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=UpstreamInstrumentationBannerResponse)
@router.get("/banner/", response_model=UpstreamInstrumentationBannerResponse)
async def get_upstream_instrumentation_banner():
    """Public API: Retrieve Upstream Instrumentation banner section data."""
    try:
        doc = await db["upstream_instrumentation_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return UpstreamInstrumentationBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return UpstreamInstrumentationBannerResponse(success=True, data=DEFAULT_BANNER)

        return UpstreamInstrumentationBannerResponse(
            success=True,
            data=UpstreamInstrumentationBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Upstream Instrumentation banner: {str(e)}")
        return UpstreamInstrumentationBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=UpstreamInstrumentationBannerResponse)
@router.put("/banner/", response_model=UpstreamInstrumentationBannerResponse)
async def update_upstream_instrumentation_banner(
    payload: UpstreamInstrumentationBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Upstream Instrumentation banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["upstream_instrumentation_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return UpstreamInstrumentationBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Upstream Instrumentation banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Upstream Instrumentation banner section: {str(e)}"
        )


# ==========================================
# UPSTREAM INSTRUMENTATION OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=UpstreamInstrumentationOverviewResponse)
@router.get("/overview/", response_model=UpstreamInstrumentationOverviewResponse)
async def get_upstream_instrumentation_overview():
    """Public API: Retrieve Upstream Instrumentation overview section data."""
    try:
        doc = await db["upstream_instrumentation_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return UpstreamInstrumentationOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return UpstreamInstrumentationOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return UpstreamInstrumentationOverviewResponse(
            success=True,
            data=UpstreamInstrumentationOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Upstream Instrumentation overview: {str(e)}")
        return UpstreamInstrumentationOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=UpstreamInstrumentationOverviewResponse)
@router.put("/overview/", response_model=UpstreamInstrumentationOverviewResponse)
async def update_upstream_instrumentation_overview(
    payload: UpstreamInstrumentationOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Upstream Instrumentation overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["upstream_instrumentation_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return UpstreamInstrumentationOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Upstream Instrumentation overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Upstream Instrumentation overview section: {str(e)}"
        )

# ==========================================
# UPSTREAM INSTRUMENTATION APPLICATIONS ENDPOINTS
# ==========================================

@router.get("/applications", response_model=UpstreamInstrumentationApplicationsResponse)
@router.get("/applications/", response_model=UpstreamInstrumentationApplicationsResponse)
async def get_upstream_instrumentation_applications():
    """Public API: Retrieve Upstream Instrumentation applications section data."""
    try:
        doc = await db["upstream_instrumentation_page"].find_one({"section": "applications"})
        if not doc or "data" not in doc:
            return UpstreamInstrumentationApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        app_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(app_data, dict):
            return UpstreamInstrumentationApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        return UpstreamInstrumentationApplicationsResponse(
            success=True,
            data=UpstreamInstrumentationApplications(**app_data)
        )
    except Exception as e:
        print(f"Error fetching Upstream Instrumentation applications: {str(e)}")
        return UpstreamInstrumentationApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)


@router.put("/applications", response_model=UpstreamInstrumentationApplicationsResponse)
@router.put("/applications/", response_model=UpstreamInstrumentationApplicationsResponse)
async def update_upstream_instrumentation_applications(
    payload: UpstreamInstrumentationApplications,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Upstream Instrumentation applications section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["upstream_instrumentation_page"].update_one(
            {"section": "applications"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return UpstreamInstrumentationApplicationsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Upstream Instrumentation applications: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Upstream Instrumentation applications section: {str(e)}"
        )

# ==========================================
# UPSTREAM INSTRUMENTATION CAPABILITIES ENDPOINTS
# ==========================================

@router.get("/capabilities", response_model=UpstreamInstrumentationCapabilitiesResponse)
@router.get("/capabilities/", response_model=UpstreamInstrumentationCapabilitiesResponse)
async def get_upstream_instrumentation_capabilities():
    """Public API: Retrieve Upstream Instrumentation capabilities & industries data."""
    try:
        doc = await db["upstream_instrumentation_page"].find_one({"section": "capabilities"})
        if not doc or "data" not in doc:
            return UpstreamInstrumentationCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        cap_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(cap_data, dict):
            return UpstreamInstrumentationCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        return UpstreamInstrumentationCapabilitiesResponse(
            success=True,
            data=UpstreamInstrumentationCapabilities(**cap_data)
        )
    except Exception as e:
        print(f"Error fetching Upstream Instrumentation capabilities: {str(e)}")
        return UpstreamInstrumentationCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)


@router.put("/capabilities", response_model=UpstreamInstrumentationCapabilitiesResponse)
@router.put("/capabilities/", response_model=UpstreamInstrumentationCapabilitiesResponse)
async def update_upstream_instrumentation_capabilities(
    payload: UpstreamInstrumentationCapabilities,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Upstream Instrumentation capabilities & industries content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["upstream_instrumentation_page"].update_one(
            {"section": "capabilities"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return UpstreamInstrumentationCapabilitiesResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Upstream Instrumentation capabilities: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Upstream Instrumentation capabilities section: {str(e)}"
        )