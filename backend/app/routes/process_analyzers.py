from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.process_analyzers import (
    ProcessAnalyzersBanner,
    ProcessAnalyzersBannerResponse,
    ProcessAnalyzersOverview,
    ProcessAnalyzersOverviewResponse,
    DEFAULT_PROCESS_ANALYZERS_IMAGES,
    ProcessAnalyzersApplications,
    ProcessAnalyzersApplicationsResponse,
    DEFAULT_PROCESS_ANALYZERS_APPLICATIONS,
    ProcessAnalyzersCapabilities,
    ProcessAnalyzersCapabilitiesResponse,
    DEFAULT_PROCESS_ANALYZERS_INDUSTRIES,
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/process-analyzers",
    tags=["Process Analyzers Page"]
)

DEFAULT_BANNER = ProcessAnalyzersBanner(
    title="Process Analyzers",
    subtitle="Advanced Online & Offline Industrial Process Analysis Solutions",
    bg_image_url=""
)

DEFAULT_OVERVIEW = ProcessAnalyzersOverview(
    paragraph_1=(
        "Continuous, accurate process analysis underpins product quality, process efficiency, "
        "and environmental compliance across the hydrocarbon value chain. ESS Saudi supplies "
        "gas and liquid process analyzers from internationally reputed manufacturers, covering "
        "composition analysis, purity monitoring, and trace-level contaminant detection."
    ),
    paragraph_2=(
        "Typical technologies include gas chromatographs, moisture and O2/H2S analyzers, "
        "pH and conductivity analyzers, and continuous emissions monitoring instrumentation, "
        "selected and configured for the specific process stream and regulatory requirement."
    ),
    carousel_images=DEFAULT_PROCESS_ANALYZERS_IMAGES
)
DEFAULT_APPLICATIONS = ProcessAnalyzersApplications(
    title="Key Applications",
    applications_list=DEFAULT_PROCESS_ANALYZERS_APPLICATIONS
)

DEFAULT_CAPABILITIES = ProcessAnalyzersCapabilities(
    industries_title="Industries served",
    industries_list=DEFAULT_PROCESS_ANALYZERS_INDUSTRIES,
    why_title="Why ESS Saudi",
    why_description=(
        "As a distributor of internationally recognized process analyzer brands, "
        "ESS Saudi offers analyzer selection support, sample system compatibility "
        "guidance, and local service to keep analytical instrumentation running reliably in the field."
    )
)

def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# PROCESS ANALYZERS BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=ProcessAnalyzersBannerResponse)
@router.get("/banner/", response_model=ProcessAnalyzersBannerResponse)
async def get_process_analyzers_banner():
    """Public API: Retrieve Process Analyzers banner section data."""
    try:
        doc = await db["process_analyzers_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return ProcessAnalyzersBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return ProcessAnalyzersBannerResponse(success=True, data=DEFAULT_BANNER)

        return ProcessAnalyzersBannerResponse(
            success=True,
            data=ProcessAnalyzersBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Process Analyzers banner: {str(e)}")
        return ProcessAnalyzersBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=ProcessAnalyzersBannerResponse)
@router.put("/banner/", response_model=ProcessAnalyzersBannerResponse)
async def update_process_analyzers_banner(
    payload: ProcessAnalyzersBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Process Analyzers banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["process_analyzers_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return ProcessAnalyzersBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Process Analyzers banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Process Analyzers banner section: {str(e)}"
        )


# ==========================================
# PROCESS ANALYZERS OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=ProcessAnalyzersOverviewResponse)
@router.get("/overview/", response_model=ProcessAnalyzersOverviewResponse)
async def get_process_analyzers_overview():
    """Public API: Retrieve Process Analyzers overview section data."""
    try:
        doc = await db["process_analyzers_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return ProcessAnalyzersOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return ProcessAnalyzersOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return ProcessAnalyzersOverviewResponse(
            success=True,
            data=ProcessAnalyzersOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Process Analyzers overview: {str(e)}")
        return ProcessAnalyzersOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=ProcessAnalyzersOverviewResponse)
@router.put("/overview/", response_model=ProcessAnalyzersOverviewResponse)
async def update_process_analyzers_overview(
    payload: ProcessAnalyzersOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Process Analyzers overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["process_analyzers_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return ProcessAnalyzersOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Process Analyzers overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Process Analyzers overview section: {str(e)}"
        )


# ==========================================
# PROCESS ANALYZERS APPLICATIONS ENDPOINTS
# ==========================================

@router.get("/applications", response_model=ProcessAnalyzersApplicationsResponse)
@router.get("/applications/", response_model=ProcessAnalyzersApplicationsResponse)
async def get_process_analyzers_applications():
    """Public API: Retrieve Process Analyzers applications section data."""
    try:
        doc = await db["process_analyzers_page"].find_one({"section": "applications"})
        if not doc or "data" not in doc:
            return ProcessAnalyzersApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        app_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(app_data, dict):
            return ProcessAnalyzersApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        return ProcessAnalyzersApplicationsResponse(
            success=True,
            data=ProcessAnalyzersApplications(**app_data)
        )
    except Exception as e:
        print(f"Error fetching Process Analyzers applications: {str(e)}")
        return ProcessAnalyzersApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)


@router.put("/applications", response_model=ProcessAnalyzersApplicationsResponse)
@router.put("/applications/", response_model=ProcessAnalyzersApplicationsResponse)
async def update_process_analyzers_applications(
    payload: ProcessAnalyzersApplications,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Process Analyzers applications section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["process_analyzers_page"].update_one(
            {"section": "applications"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return ProcessAnalyzersApplicationsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Process Analyzers applications: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Process Analyzers applications section: {str(e)}"
        )


# ==========================================
# PROCESS ANALYZERS CAPABILITIES ENDPOINTS
# ==========================================

@router.get("/capabilities", response_model=ProcessAnalyzersCapabilitiesResponse)
@router.get("/capabilities/", response_model=ProcessAnalyzersCapabilitiesResponse)
async def get_process_analyzers_capabilities():
    """Public API: Retrieve Process Analyzers capabilities & industries data."""
    try:
        doc = await db["process_analyzers_page"].find_one({"section": "capabilities"})
        if not doc or "data" not in doc:
            return ProcessAnalyzersCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        cap_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(cap_data, dict):
            return ProcessAnalyzersCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        return ProcessAnalyzersCapabilitiesResponse(
            success=True,
            data=ProcessAnalyzersCapabilities(**cap_data)
        )
    except Exception as e:
        print(f"Error fetching Process Analyzers capabilities: {str(e)}")
        return ProcessAnalyzersCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)


@router.put("/capabilities", response_model=ProcessAnalyzersCapabilitiesResponse)
@router.put("/capabilities/", response_model=ProcessAnalyzersCapabilitiesResponse)
async def update_process_analyzers_capabilities(
    payload: ProcessAnalyzersCapabilities,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Process Analyzers capabilities & industries content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["process_analyzers_page"].update_one(
            {"section": "capabilities"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return ProcessAnalyzersCapabilitiesResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Process Analyzers capabilities: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Process Analyzers capabilities section: {str(e)}"
        )