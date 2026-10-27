from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.analyzer_systems import (
    AnalyzerSystemsBanner,
    AnalyzerSystemsBannerResponse,
    AnalyzerSystemsOverview,
    AnalyzerSystemsOverviewResponse,
    DEFAULT_ANALYZER_SYSTEMS_IMAGES,
    AnalyzerSystemsApplications,
    AnalyzerSystemsApplicationsResponse,
    DEFAULT_ANALYZER_SYSTEMS_APPLICATIONS,
    AnalyzerSystemsCapabilities,
    AnalyzerSystemsCapabilitiesResponse,
    DEFAULT_ANALYZER_SYSTEMS_INDUSTRIES,
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/analyzer-systems",
    tags=["Analyzer Systems Page"]
)

DEFAULT_BANNER = AnalyzerSystemsBanner(
    title="Analyzer Systems",
    subtitle="Integrated Sampling & Analytical Measurement Solutions",
    bg_image_url=""
)

DEFAULT_OVERVIEW = AnalyzerSystemsOverview(
    paragraph_1=(
        "Process analyzers perform reliably only when properly housed, conditioned, and protected from the elements. "
        "ESS Saudi supplies complete analyzer systems right from individual analyzer packages to fully engineered analyzer "
        "shelters and cabinets designed and built for the temperature extremes, dust, and hazardous-area conditions typical "
        "of Saudi oil & gas and petrochemical sites."
    ),
    paragraph_2=(
        "Our analyzer system scope covers climate-controlled shelters, walk-in and non-walk-in cabinets, "
        "purge and pressurization systems for hazardous-area compliance, and integration of sample conditioning "
        "and analyzer racks within a single engineered enclosure."
    ),
    carousel_images=DEFAULT_ANALYZER_SYSTEMS_IMAGES
)

DEFAULT_CAPABILITIES = AnalyzerSystemsCapabilities(
    industries_title="Industries served",
    industries_list=DEFAULT_ANALYZER_SYSTEMS_INDUSTRIES,
    why_title="Why ESS Saudi",
    why_description=(
        "ESS Saudi supplies analyzer systems and shelters engineered by internationally "
        "recognized manufacturers and system houses, and offers local project engineering, "
        "site integration, and commissioning support from concept through handover."
    )
)

DEFAULT_APPLICATIONS = AnalyzerSystemsApplications(
    title="Key Applications",
    applications_list=DEFAULT_ANALYZER_SYSTEMS_APPLICATIONS
)

def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# ANALYZER SYSTEMS BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=AnalyzerSystemsBannerResponse)
@router.get("/banner/", response_model=AnalyzerSystemsBannerResponse)
async def get_analyzer_systems_banner():
    """Public API: Retrieve Analyzer Systems banner section data."""
    try:
        doc = await db["analyzer_systems_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return AnalyzerSystemsBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return AnalyzerSystemsBannerResponse(success=True, data=DEFAULT_BANNER)

        return AnalyzerSystemsBannerResponse(
            success=True,
            data=AnalyzerSystemsBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Analyzer Systems banner: {str(e)}")
        return AnalyzerSystemsBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=AnalyzerSystemsBannerResponse)
@router.put("/banner/", response_model=AnalyzerSystemsBannerResponse)
async def update_analyzer_systems_banner(
    payload: AnalyzerSystemsBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Analyzer Systems banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["analyzer_systems_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return AnalyzerSystemsBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Analyzer Systems banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Analyzer Systems banner section: {str(e)}"
        )


# ==========================================
# ANALYZER SYSTEMS OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=AnalyzerSystemsOverviewResponse)
@router.get("/overview/", response_model=AnalyzerSystemsOverviewResponse)
async def get_analyzer_systems_overview():
    """Public API: Retrieve Analyzer Systems overview section data."""
    try:
        doc = await db["analyzer_systems_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return AnalyzerSystemsOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return AnalyzerSystemsOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return AnalyzerSystemsOverviewResponse(
            success=True,
            data=AnalyzerSystemsOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Analyzer Systems overview: {str(e)}")
        return AnalyzerSystemsOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=AnalyzerSystemsOverviewResponse)
@router.put("/overview/", response_model=AnalyzerSystemsOverviewResponse)
async def update_analyzer_systems_overview(
    payload: AnalyzerSystemsOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Analyzer Systems overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["analyzer_systems_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return AnalyzerSystemsOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Analyzer Systems overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Analyzer Systems overview section: {str(e)}"
        )



# ==========================================
# ANALYZER SYSTEMS APPLICATIONS ENDPOINTS
# ==========================================

@router.get("/applications", response_model=AnalyzerSystemsApplicationsResponse)
@router.get("/applications/", response_model=AnalyzerSystemsApplicationsResponse)
async def get_analyzer_systems_applications():
    """Public API: Retrieve Analyzer Systems applications section data."""
    try:
        doc = await db["analyzer_systems_page"].find_one({"section": "applications"})
        if not doc or "data" not in doc:
            return AnalyzerSystemsApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        app_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(app_data, dict):
            return AnalyzerSystemsApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        return AnalyzerSystemsApplicationsResponse(
            success=True,
            data=AnalyzerSystemsApplications(**app_data)
        )
    except Exception as e:
        print(f"Error fetching Analyzer Systems applications: {str(e)}")
        return AnalyzerSystemsApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)


@router.put("/applications", response_model=AnalyzerSystemsApplicationsResponse)
@router.put("/applications/", response_model=AnalyzerSystemsApplicationsResponse)
async def update_analyzer_systems_applications(
    payload: AnalyzerSystemsApplications,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Analyzer Systems applications section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["analyzer_systems_page"].update_one(
            {"section": "applications"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return AnalyzerSystemsApplicationsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Analyzer Systems applications: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Analyzer Systems applications section: {str(e)}"
        )

# ==========================================
# ANALYZER SYSTEMS CAPABILITIES ENDPOINTS
# ==========================================

@router.get("/capabilities", response_model=AnalyzerSystemsCapabilitiesResponse)
@router.get("/capabilities/", response_model=AnalyzerSystemsCapabilitiesResponse)
async def get_analyzer_systems_capabilities():
    """Public API: Retrieve Analyzer Systems capabilities & industries data."""
    try:
        doc = await db["analyzer_systems_page"].find_one({"section": "capabilities"})
        if not doc or "data" not in doc:
            return AnalyzerSystemsCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        cap_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(cap_data, dict):
            return AnalyzerSystemsCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        return AnalyzerSystemsCapabilitiesResponse(
            success=True,
            data=AnalyzerSystemsCapabilities(**cap_data)
        )
    except Exception as e:
        print(f"Error fetching Analyzer Systems capabilities: {str(e)}")
        return AnalyzerSystemsCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)


@router.put("/capabilities", response_model=AnalyzerSystemsCapabilitiesResponse)
@router.put("/capabilities/", response_model=AnalyzerSystemsCapabilitiesResponse)
async def update_analyzer_systems_capabilities(
    payload: AnalyzerSystemsCapabilities,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Analyzer Systems capabilities & industries content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["analyzer_systems_page"].update_one(
            {"section": "capabilities"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return AnalyzerSystemsCapabilitiesResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Analyzer Systems capabilities: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Analyzer Systems capabilities section: {str(e)}"
        )