from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.process_instrumentation import (
    ProcessInstrumentationBanner,
    ProcessInstrumentationBannerResponse,
    ProcessInstrumentationOverview,
    ProcessInstrumentationOverviewResponse,
    DEFAULT_PROCESS_INSTRUMENTATION_IMAGES,
    ProcessInstrumentationApplications,
    ProcessInstrumentationApplicationsResponse,
    DEFAULT_PROCESS_INSTRUMENTATION_APPLICATIONS,
    ProcessInstrumentationCapabilities,
    ProcessInstrumentationCapabilitiesResponse,
    DEFAULT_PROCESS_INSTRUMENTATION_INDUSTRIES,
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/process-instrumentation",
    tags=["Process Instrumentation Page"]
)

DEFAULT_BANNER = ProcessInstrumentationBanner(
    title="Process Instrumentation",
    subtitle="Precision Measurement & Industrial Process Instrumentation Solutions",
    bg_image_url=""
)

DEFAULT_OVERVIEW = ProcessInstrumentationOverview(
    paragraph_1=(
        "Reliable process instrumentation forms the foundation of safe and efficient plant operation. "
        "ESS Saudi supplies a full range of Pressure, Temperature, Flow, and Level measurement instruments "
        "from internationally reputed manufacturers, suited to the demanding conditions of hydrocarbon processing, "
        "power generation, and utility operations."
    ),
    paragraph_2=(
        "Our range spans transmitters, gauges, switches, and sensors including hazardous-area certified "
        "and SIL-rated variants which is configured to meet site-specific process, safety, and environmental requirements."
    ),
    carousel_images=DEFAULT_PROCESS_INSTRUMENTATION_IMAGES
)
DEFAULT_APPLICATIONS = ProcessInstrumentationApplications(
    title="Key Applications",
    applications_list=DEFAULT_PROCESS_INSTRUMENTATION_APPLICATIONS
)

DEFAULT_CAPABILITIES = ProcessInstrumentationCapabilities(
    industries_title="Industries served",
    industries_list=DEFAULT_PROCESS_INSTRUMENTATION_INDUSTRIES,
    why_title="Why ESS Saudi",
    why_description=(
        "ESS Saudi supplies a process instrumentation portfolio sourced from "
        "internationally certified manufacturers, and offers local engineering support "
        "for instrument selection, specification review, and site commissioning."
    )
)


def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# PROCESS INSTRUMENTATION BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=ProcessInstrumentationBannerResponse)
@router.get("/banner/", response_model=ProcessInstrumentationBannerResponse)
async def get_process_instrumentation_banner():
    """Public API: Retrieve Process Instrumentation banner section data."""
    try:
        doc = await db["process_instrumentation_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return ProcessInstrumentationBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return ProcessInstrumentationBannerResponse(success=True, data=DEFAULT_BANNER)

        return ProcessInstrumentationBannerResponse(
            success=True,
            data=ProcessInstrumentationBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Process Instrumentation banner: {str(e)}")
        return ProcessInstrumentationBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=ProcessInstrumentationBannerResponse)
@router.put("/banner/", response_model=ProcessInstrumentationBannerResponse)
async def update_process_instrumentation_banner(
    payload: ProcessInstrumentationBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Process Instrumentation banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["process_instrumentation_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return ProcessInstrumentationBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Process Instrumentation banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Process Instrumentation banner section: {str(e)}"
        )

# ==========================================
# PROCESS INSTRUMENTATION OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=ProcessInstrumentationOverviewResponse)
@router.get("/overview/", response_model=ProcessInstrumentationOverviewResponse)
async def get_process_instrumentation_overview():
    """Public API: Retrieve Process Instrumentation overview section data."""
    try:
        doc = await db["process_instrumentation_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return ProcessInstrumentationOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return ProcessInstrumentationOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return ProcessInstrumentationOverviewResponse(
            success=True,
            data=ProcessInstrumentationOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Process Instrumentation overview: {str(e)}")
        return ProcessInstrumentationOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=ProcessInstrumentationOverviewResponse)
@router.put("/overview/", response_model=ProcessInstrumentationOverviewResponse)
async def update_process_instrumentation_overview(
    payload: ProcessInstrumentationOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Process Instrumentation overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["process_instrumentation_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return ProcessInstrumentationOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Process Instrumentation overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Process Instrumentation overview section: {str(e)}"
        )

# ==========================================
# PROCESS INSTRUMENTATION APPLICATIONS ENDPOINTS
# ==========================================

@router.get("/applications", response_model=ProcessInstrumentationApplicationsResponse)
@router.get("/applications/", response_model=ProcessInstrumentationApplicationsResponse)
async def get_process_instrumentation_applications():
    """Public API: Retrieve Process Instrumentation applications section data."""
    try:
        doc = await db["process_instrumentation_page"].find_one({"section": "applications"})
        if not doc or "data" not in doc:
            return ProcessInstrumentationApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        app_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(app_data, dict):
            return ProcessInstrumentationApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        return ProcessInstrumentationApplicationsResponse(
            success=True,
            data=ProcessInstrumentationApplications(**app_data)
        )
    except Exception as e:
        print(f"Error fetching Process Instrumentation applications: {str(e)}")
        return ProcessInstrumentationApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)


@router.put("/applications", response_model=ProcessInstrumentationApplicationsResponse)
@router.put("/applications/", response_model=ProcessInstrumentationApplicationsResponse)
async def update_process_instrumentation_applications(
    payload: ProcessInstrumentationApplications,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Process Instrumentation applications section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["process_instrumentation_page"].update_one(
            {"section": "applications"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return ProcessInstrumentationApplicationsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Process Instrumentation applications: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Process Instrumentation applications section: {str(e)}"
        )


# ==========================================
# PROCESS INSTRUMENTATION CAPABILITIES ENDPOINTS
# ==========================================

@router.get("/capabilities", response_model=ProcessInstrumentationCapabilitiesResponse)
@router.get("/capabilities/", response_model=ProcessInstrumentationCapabilitiesResponse)
async def get_process_instrumentation_capabilities():
    """Public API: Retrieve Process Instrumentation capabilities & industries data."""
    try:
        doc = await db["process_instrumentation_page"].find_one({"section": "capabilities"})
        if not doc or "data" not in doc:
            return ProcessInstrumentationCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        cap_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(cap_data, dict):
            return ProcessInstrumentationCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        return ProcessInstrumentationCapabilitiesResponse(
            success=True,
            data=ProcessInstrumentationCapabilities(**cap_data)
        )
    except Exception as e:
        print(f"Error fetching Process Instrumentation capabilities: {str(e)}")
        return ProcessInstrumentationCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)


@router.put("/capabilities", response_model=ProcessInstrumentationCapabilitiesResponse)
@router.put("/capabilities/", response_model=ProcessInstrumentationCapabilitiesResponse)
async def update_process_instrumentation_capabilities(
    payload: ProcessInstrumentationCapabilities,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Process Instrumentation capabilities & industries content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["process_instrumentation_page"].update_one(
            {"section": "capabilities"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return ProcessInstrumentationCapabilitiesResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Process Instrumentation capabilities: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Process Instrumentation capabilities section: {str(e)}"
        )