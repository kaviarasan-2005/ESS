from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.vesda import (
    VESDABanner,
    VESDABannerResponse,
    VESDAOverview,
    VESDAOverviewResponse,
    DEFAULT_VESDA_IMAGES,
    VESDAApplications,
    VESDAApplicationsResponse,
    DEFAULT_VESDA_APPLICATIONS,
    VESDACapabilities,
    VESDACapabilitiesResponse,
    DEFAULT_VESDA_INDUSTRIES,
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/vesda",
    tags=["VESDA Page"]
)

DEFAULT_BANNER = VESDABanner(
    title="VESDA® Aspirating Smoke Detection & Fire Alarm Devices",
    subtitle="Very Early Warning Aspirating Smoke Detection & Advanced Fire Alarm Systems",
    bg_image_url=""
)

DEFAULT_CAPABILITIES = VESDACapabilities(
    industries_title="Industries served",
    industries_list=DEFAULT_VESDA_INDUSTRIES,
    why_title="Why ESS Saudi",
    why_description=(
        "ESS Saudi supplies aspirating smoke detection and fire alarm equipment "
        "from established international manufacturers, and offers local application "
        "engineering support to design detection coverage for critical and high-value spaces."
    )
)

DEFAULT_OVERVIEW = VESDAOverview(
    paragraph_1=(
        "For control rooms, electrical rooms, cable galleries, and other high-value or hard-to-access spaces, "
        "early smoke detection can be the difference between a minor incident and significant downtime. "
        "ESS Saudi supplies aspirating smoke detection (ASD) systems and conventional fire alarm devices "
        "from internationally recognized manufacturers, providing very-early-warning fire detection well ahead of visible smoke or flame."
    ),
    paragraph_2=(
        "Our offering includes aspirating smoke detectors, addressable fire alarm panels, detectors, call points, "
        "and notification devices, engineered to integrate with plant-wide fire and gas control systems."
    ),
    carousel_images=DEFAULT_VESDA_IMAGES
)
DEFAULT_APPLICATIONS = VESDAApplications(
    title="Key Applications",
    applications_list=DEFAULT_VESDA_APPLICATIONS
)


def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# VESDA BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=VESDABannerResponse)
@router.get("/banner/", response_model=VESDABannerResponse)
async def get_vesda_banner():
    """Public API: Retrieve VESDA banner section data."""
    try:
        doc = await db["vesda_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return VESDABannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return VESDABannerResponse(success=True, data=DEFAULT_BANNER)

        return VESDABannerResponse(
            success=True,
            data=VESDABanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching VESDA banner: {str(e)}")
        return VESDABannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=VESDABannerResponse)
@router.put("/banner/", response_model=VESDABannerResponse)
async def update_vesda_banner(
    payload: VESDABanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update VESDA banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["vesda_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return VESDABannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating VESDA banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update VESDA banner section: {str(e)}"
        )

# ==========================================
# VESDA OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=VESDAOverviewResponse)
@router.get("/overview/", response_model=VESDAOverviewResponse)
async def get_vesda_overview():
    """Public API: Retrieve VESDA overview section data."""
    try:
        doc = await db["vesda_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return VESDAOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return VESDAOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return VESDAOverviewResponse(
            success=True,
            data=VESDAOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching VESDA overview: {str(e)}")
        return VESDAOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=VESDAOverviewResponse)
@router.put("/overview/", response_model=VESDAOverviewResponse)
async def update_vesda_overview(
    payload: VESDAOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update VESDA overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["vesda_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return VESDAOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating VESDA overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update VESDA overview section: {str(e)}"
        )


# ==========================================
# VESDA APPLICATIONS ENDPOINTS
# ==========================================

@router.get("/applications", response_model=VESDAApplicationsResponse)
@router.get("/applications/", response_model=VESDAApplicationsResponse)
async def get_vesda_applications():
    """Public API: Retrieve VESDA applications section data."""
    try:
        doc = await db["vesda_page"].find_one({"section": "applications"})
        if not doc or "data" not in doc:
            return VESDAApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        app_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(app_data, dict):
            return VESDAApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        return VESDAApplicationsResponse(
            success=True,
            data=VESDAApplications(**app_data)
        )
    except Exception as e:
        print(f"Error fetching VESDA applications: {str(e)}")
        return VESDAApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)


@router.put("/applications", response_model=VESDAApplicationsResponse)
@router.put("/applications/", response_model=VESDAApplicationsResponse)
async def update_vesda_applications(
    payload: VESDAApplications,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update VESDA applications section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["vesda_page"].update_one(
            {"section": "applications"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return VESDAApplicationsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating VESDA applications: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update VESDA applications section: {str(e)}"
        )


# ==========================================
# VESDA CAPABILITIES ENDPOINTS
# ==========================================

@router.get("/capabilities", response_model=VESDACapabilitiesResponse)
@router.get("/capabilities/", response_model=VESDACapabilitiesResponse)
async def get_vesda_capabilities():
    """Public API: Retrieve VESDA capabilities & industries data."""
    try:
        doc = await db["vesda_page"].find_one({"section": "capabilities"})
        if not doc or "data" not in doc:
            return VESDACapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        cap_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(cap_data, dict):
            return VESDACapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        return VESDACapabilitiesResponse(
            success=True,
            data=VESDACapabilities(**cap_data)
        )
    except Exception as e:
        print(f"Error fetching VESDA capabilities: {str(e)}")
        return VESDACapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)


@router.put("/capabilities", response_model=VESDACapabilitiesResponse)
@router.put("/capabilities/", response_model=VESDACapabilitiesResponse)
async def update_vesda_capabilities(
    payload: VESDACapabilities,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update VESDA capabilities & industries content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["vesda_page"].update_one(
            {"section": "capabilities"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return VESDACapabilitiesResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating VESDA capabilities: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update VESDA capabilities section: {str(e)}"
        )

