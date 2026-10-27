from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.industrial_automation import (
    IndustrialAutomationBanner,
    IndustrialAutomationBannerResponse,
    IndustrialAutomationOverview,
    IndustrialAutomationOverviewResponse,
    DEFAULT_INDUSTRIAL_AUTOMATION_IMAGES,
    IndustrialAutomationApplications,
    IndustrialAutomationApplicationsResponse,
    DEFAULT_INDUSTRIAL_AUTOMATION_APPLICATIONS,
    IndustrialAutomationCapabilities,
    IndustrialAutomationCapabilitiesResponse,
    DEFAULT_INDUSTRIAL_AUTOMATION_INDUSTRIES,
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/industrial-automation",
    tags=["Industrial Automation Page"]
)

DEFAULT_BANNER = IndustrialAutomationBanner(
    title="Industrial Automation & SIL-Rated Control Systems",
    subtitle="Integrated Safety & Process Control Solutions",
    bg_image_url=""
)

DEFAULT_OVERVIEW = IndustrialAutomationOverview(
    paragraph_1=(
        "Modern process plants depend on robust automation and control architectures to run efficiently and safely. "
        "ESS Saudi supplies industrial automation and SIL-rated control systems including PLC and SCADA platforms from "
        "internationally reputed manufacturers. We engineer and complete the system integration to meet the "
        "safety-integrity and reliability requirements of oil & gas, petrochemical, and power facilities."
    ),
    paragraph_2=(
        "Our scope covers PLC-based control panels, SCADA and HMI systems, safety instrumented systems (SIS) up to SIL 3, "
        "and system integration services connecting field instrumentation to plant-wide control and monitoring architectures."
    ),
    carousel_images=DEFAULT_INDUSTRIAL_AUTOMATION_IMAGES
)
DEFAULT_APPLICATIONS = IndustrialAutomationApplications(
    title="Key Applications",
    applications_list=DEFAULT_INDUSTRIAL_AUTOMATION_APPLICATIONS
)

DEFAULT_CAPABILITIES = IndustrialAutomationCapabilities(
    industries_title="Industries served",
    industries_list=DEFAULT_INDUSTRIAL_AUTOMATION_INDUSTRIES,
    why_title="Why ESS Saudi",
    why_description=(
        "ESS Saudi supplies automation and SIL-rated control system hardware from "
        "internationally certified manufacturers, and offers local system integration, "
        "panel engineering, and commissioning support for control and safety system projects."
    )
)


def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# INDUSTRIAL AUTOMATION BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=IndustrialAutomationBannerResponse)
@router.get("/banner/", response_model=IndustrialAutomationBannerResponse)
async def get_industrial_automation_banner():
    """Public API: Retrieve Industrial Automation banner section data."""
    try:
        doc = await db["industrial_automation_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return IndustrialAutomationBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return IndustrialAutomationBannerResponse(success=True, data=DEFAULT_BANNER)

        return IndustrialAutomationBannerResponse(
            success=True,
            data=IndustrialAutomationBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Industrial Automation banner: {str(e)}")
        return IndustrialAutomationBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=IndustrialAutomationBannerResponse)
@router.put("/banner/", response_model=IndustrialAutomationBannerResponse)
async def update_industrial_automation_banner(
    payload: IndustrialAutomationBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Industrial Automation banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["industrial_automation_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return IndustrialAutomationBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Industrial Automation banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Industrial Automation banner section: {str(e)}"
        )


# ==========================================
# INDUSTRIAL AUTOMATION OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=IndustrialAutomationOverviewResponse)
@router.get("/overview/", response_model=IndustrialAutomationOverviewResponse)
async def get_industrial_automation_overview():
    """Public API: Retrieve Industrial Automation overview section data."""
    try:
        doc = await db["industrial_automation_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return IndustrialAutomationOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return IndustrialAutomationOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return IndustrialAutomationOverviewResponse(
            success=True,
            data=IndustrialAutomationOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Industrial Automation overview: {str(e)}")
        return IndustrialAutomationOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=IndustrialAutomationOverviewResponse)
@router.put("/overview/", response_model=IndustrialAutomationOverviewResponse)
async def update_industrial_automation_overview(
    payload: IndustrialAutomationOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Industrial Automation overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["industrial_automation_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return IndustrialAutomationOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Industrial Automation overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Industrial Automation overview section: {str(e)}"
        )

# ==========================================
# INDUSTRIAL AUTOMATION APPLICATIONS ENDPOINTS
# ==========================================

@router.get("/applications", response_model=IndustrialAutomationApplicationsResponse)
@router.get("/applications/", response_model=IndustrialAutomationApplicationsResponse)
async def get_industrial_automation_applications():
    """Public API: Retrieve Industrial Automation applications section data."""
    try:
        doc = await db["industrial_automation_page"].find_one({"section": "applications"})
        if not doc or "data" not in doc:
            return IndustrialAutomationApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        app_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(app_data, dict):
            return IndustrialAutomationApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        return IndustrialAutomationApplicationsResponse(
            success=True,
            data=IndustrialAutomationApplications(**app_data)
        )
    except Exception as e:
        print(f"Error fetching Industrial Automation applications: {str(e)}")
        return IndustrialAutomationApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)


@router.put("/applications", response_model=IndustrialAutomationApplicationsResponse)
@router.put("/applications/", response_model=IndustrialAutomationApplicationsResponse)
async def update_industrial_automation_applications(
    payload: IndustrialAutomationApplications,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Industrial Automation applications section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["industrial_automation_page"].update_one(
            {"section": "applications"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return IndustrialAutomationApplicationsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Industrial Automation applications: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Industrial Automation applications section: {str(e)}"
        )


# ==========================================
# INDUSTRIAL AUTOMATION CAPABILITIES ENDPOINTS
# ==========================================

@router.get("/capabilities", response_model=IndustrialAutomationCapabilitiesResponse)
@router.get("/capabilities/", response_model=IndustrialAutomationCapabilitiesResponse)
async def get_industrial_automation_capabilities():
    """Public API: Retrieve Industrial Automation capabilities & industries data."""
    try:
        doc = await db["industrial_automation_page"].find_one({"section": "capabilities"})
        if not doc or "data" not in doc:
            return IndustrialAutomationCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        cap_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(cap_data, dict):
            return IndustrialAutomationCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        return IndustrialAutomationCapabilitiesResponse(
            success=True,
            data=IndustrialAutomationCapabilities(**cap_data)
        )
    except Exception as e:
        print(f"Error fetching Industrial Automation capabilities: {str(e)}")
        return IndustrialAutomationCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)


@router.put("/capabilities", response_model=IndustrialAutomationCapabilitiesResponse)
@router.put("/capabilities/", response_model=IndustrialAutomationCapabilitiesResponse)
async def update_industrial_automation_capabilities(
    payload: IndustrialAutomationCapabilities,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Industrial Automation capabilities & industries content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["industrial_automation_page"].update_one(
            {"section": "capabilities"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return IndustrialAutomationCapabilitiesResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Industrial Automation capabilities: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Industrial Automation capabilities section: {str(e)}"
        )