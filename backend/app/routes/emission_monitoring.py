from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.emission_monitoring import (
    EmissionMonitoringBanner,
    EmissionMonitoringBannerResponse,
    EmissionMonitoringOverview,
    EmissionMonitoringOverviewResponse,
    DEFAULT_EMISSION_MONITORING_IMAGES,
    EmissionMonitoringApplications,
    EmissionMonitoringApplicationsResponse,
    DEFAULT_EMISSION_MONITORING_APPLICATIONS,
    EmissionMonitoringCapabilities,
    EmissionMonitoringCapabilitiesResponse,
    DEFAULT_EMISSION_MONITORING_INDUSTRIES,
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/emission-monitoring",
    tags=["Emission Monitoring Systems Page"]
)

DEFAULT_BANNER = EmissionMonitoringBanner(
    title="Emission Monitoring Systems",
    subtitle="Continuous Emission & Environmental Monitoring Solutions",
    bg_image_url=""
)

DEFAULT_OVERVIEW = EmissionMonitoringOverview(
    paragraph_1=(
        "Environmental compliance and regulatory reporting depend on accurate, continuous emissions "
        "and air quality data. ESS supplies emission monitoring systems, including Continuous "
        "Emissions Monitoring Systems (CEMS) and Ambient Air Quality Monitoring Systems (AQMS), "
        "from internationally reputed manufacturers, engineered to meet recognized environmental "
        "monitoring and reporting standards."
    ),
    paragraph_2=(
        "Our scope covers stack-mounted CEMS analyzer packages, ambient air quality monitoring stations, "
        "data acquisition and reporting systems, and integration support for regulatory compliance submissions."
    ),
    carousel_images=DEFAULT_EMISSION_MONITORING_IMAGES
)

DEFAULT_APPLICATIONS = EmissionMonitoringApplications(
    title="Key Applications",
    applications_list=DEFAULT_EMISSION_MONITORING_APPLICATIONS
)

DEFAULT_CAPABILITIES = EmissionMonitoringCapabilities(
    industries_title="Industries served",
    industries_list=DEFAULT_EMISSION_MONITORING_INDUSTRIES,
    why_title="Why ESS Saudi",
    why_description=(
        "ESS Saudi supplies CEMS and AQMS systems from internationally "
        "certified manufacturers, and offers local system integration, data handling "
        "system support, and assistance aligning monitoring systems with Saudi environmental regulatory requirements."
    )
)


def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# EMISSION MONITORING BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=EmissionMonitoringBannerResponse)
@router.get("/banner/", response_model=EmissionMonitoringBannerResponse)
async def get_emission_monitoring_banner():
    """Public API: Retrieve Emission Monitoring banner section data."""
    try:
        doc = await db["emission_monitoring_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return EmissionMonitoringBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return EmissionMonitoringBannerResponse(success=True, data=DEFAULT_BANNER)

        return EmissionMonitoringBannerResponse(
            success=True,
            data=EmissionMonitoringBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Emission Monitoring banner: {str(e)}")
        return EmissionMonitoringBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=EmissionMonitoringBannerResponse)
@router.put("/banner/", response_model=EmissionMonitoringBannerResponse)
async def update_emission_monitoring_banner(
    payload: EmissionMonitoringBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Emission Monitoring banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["emission_monitoring_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return EmissionMonitoringBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Emission Monitoring banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Emission Monitoring banner section: {str(e)}"
        )


# ==========================================
# EMISSION MONITORING OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=EmissionMonitoringOverviewResponse)
@router.get("/overview/", response_model=EmissionMonitoringOverviewResponse)
async def get_emission_monitoring_overview():
    """Public API: Retrieve Emission Monitoring overview section data."""
    try:
        doc = await db["emission_monitoring_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return EmissionMonitoringOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return EmissionMonitoringOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return EmissionMonitoringOverviewResponse(
            success=True,
            data=EmissionMonitoringOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Emission Monitoring overview: {str(e)}")
        return EmissionMonitoringOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=EmissionMonitoringOverviewResponse)
@router.put("/overview/", response_model=EmissionMonitoringOverviewResponse)
async def update_emission_monitoring_overview(
    payload: EmissionMonitoringOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Emission Monitoring overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["emission_monitoring_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return EmissionMonitoringOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Emission Monitoring overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Emission Monitoring overview section: {str(e)}"
        )


# ==========================================
# EMISSION MONITORING APPLICATIONS ENDPOINTS
# ==========================================

@router.get("/applications", response_model=EmissionMonitoringApplicationsResponse)
@router.get("/applications/", response_model=EmissionMonitoringApplicationsResponse)
async def get_emission_monitoring_applications():
    """Public API: Retrieve Emission Monitoring applications section data."""
    try:
        doc = await db["emission_monitoring_page"].find_one({"section": "applications"})
        if not doc or "data" not in doc:
            return EmissionMonitoringApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        app_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(app_data, dict):
            return EmissionMonitoringApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        return EmissionMonitoringApplicationsResponse(
            success=True,
            data=EmissionMonitoringApplications(**app_data)
        )
    except Exception as e:
        print(f"Error fetching Emission Monitoring applications: {str(e)}")
        return EmissionMonitoringApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)


@router.put("/applications", response_model=EmissionMonitoringApplicationsResponse)
@router.put("/applications/", response_model=EmissionMonitoringApplicationsResponse)
async def update_emission_monitoring_applications(
    payload: EmissionMonitoringApplications,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Emission Monitoring applications section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["emission_monitoring_page"].update_one(
            {"section": "applications"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return EmissionMonitoringApplicationsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Emission Monitoring applications: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Emission Monitoring applications section: {str(e)}"
        )


# ==========================================
# EMISSION MONITORING CAPABILITIES ENDPOINTS
# ==========================================

@router.get("/capabilities", response_model=EmissionMonitoringCapabilitiesResponse)
@router.get("/capabilities/", response_model=EmissionMonitoringCapabilitiesResponse)
async def get_emission_monitoring_capabilities():
    """Public API: Retrieve Emission Monitoring capabilities & industries data."""
    try:
        doc = await db["emission_monitoring_page"].find_one({"section": "capabilities"})
        if not doc or "data" not in doc:
            return EmissionMonitoringCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        cap_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(cap_data, dict):
            return EmissionMonitoringCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        return EmissionMonitoringCapabilitiesResponse(
            success=True,
            data=EmissionMonitoringCapabilities(**cap_data)
        )
    except Exception as e:
        print(f"Error fetching Emission Monitoring capabilities: {str(e)}")
        return EmissionMonitoringCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)


@router.put("/capabilities", response_model=EmissionMonitoringCapabilitiesResponse)
@router.put("/capabilities/", response_model=EmissionMonitoringCapabilitiesResponse)
async def update_emission_monitoring_capabilities(
    payload: EmissionMonitoringCapabilities,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Emission Monitoring capabilities & industries content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["emission_monitoring_page"].update_one(
            {"section": "capabilities"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return EmissionMonitoringCapabilitiesResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Emission Monitoring capabilities: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Emission Monitoring capabilities section: {str(e)}"
        )