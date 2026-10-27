from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.mass_notification import (
    MassNotificationBanner,
    MassNotificationBannerResponse,
    MassNotificationOverview,
    MassNotificationOverviewResponse,
    DEFAULT_MASS_NOTIFICATION_IMAGES,
    MassNotificationApplications,
    MassNotificationApplicationsResponse,
    DEFAULT_MASS_NOTIFICATION_APPLICATIONS,
    MassNotificationCapabilities,
    MassNotificationCapabilitiesResponse,
    DEFAULT_MASS_NOTIFICATION_INDUSTRIES,
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/mass-notification",
    tags=["Mass Notification Systems Page"]
)

DEFAULT_BANNER = MassNotificationBanner(
    title="Mass Notification Systems",
    subtitle="Integrated Emergency Alert & Alarm Communication Solutions",
    bg_image_url=""
)

DEFAULT_OVERVIEW = MassNotificationOverview(
    paragraph_1=(
        "In an emergency, personnel across a large industrial site need to be reliably alerted and given clear "
        "instructions within seconds. ESS Saudi supplies mass notification systems, including public address and "
        "siren systems, from internationally reputed manufacturers, engineered to provide plant-wide audible and "
        "voice alerting in high-noise and hazardous industrial environments."
    ),
    paragraph_2=(
        "Our scope covers electronic sirens, public address (PA) and voice alarm systems, and integration with "
        "fire and gas control systems for automated emergency notification triggering."
    ),
    carousel_images=DEFAULT_MASS_NOTIFICATION_IMAGES
)

DEFAULT_APPLICATIONS = MassNotificationApplications(
    title="Key Applications",
    applications_list=DEFAULT_MASS_NOTIFICATION_APPLICATIONS
)

DEFAULT_CAPABILITIES = MassNotificationCapabilities(
    industries_title="Industries served",
    industries_list=DEFAULT_MASS_NOTIFICATION_INDUSTRIES,
    why_title="Why ESS Saudi",
    why_description=(
        "ESS Saudi supplies mass notification systems and sirens from "
        "internationally certified manufacturers, and offers local system design "
        "and integration support to connect notification systems with plant safety systems."
    )
)
def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# MASS NOTIFICATION BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=MassNotificationBannerResponse)
@router.get("/banner/", response_model=MassNotificationBannerResponse)
async def get_mass_notification_banner():
    """Public API: Retrieve Mass Notification banner section data."""
    try:
        doc = await db["mass_notification_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return MassNotificationBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return MassNotificationBannerResponse(success=True, data=DEFAULT_BANNER)

        return MassNotificationBannerResponse(
            success=True,
            data=MassNotificationBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Mass Notification banner: {str(e)}")
        return MassNotificationBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=MassNotificationBannerResponse)
@router.put("/banner/", response_model=MassNotificationBannerResponse)
async def update_mass_notification_banner(
    payload: MassNotificationBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Mass Notification banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["mass_notification_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return MassNotificationBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Mass Notification banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Mass Notification banner section: {str(e)}"
        )


# ==========================================
# MASS NOTIFICATION OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=MassNotificationOverviewResponse)
@router.get("/overview/", response_model=MassNotificationOverviewResponse)
async def get_mass_notification_overview():
    """Public API: Retrieve Mass Notification overview section data."""
    try:
        doc = await db["mass_notification_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return MassNotificationOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return MassNotificationOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return MassNotificationOverviewResponse(
            success=True,
            data=MassNotificationOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Mass Notification overview: {str(e)}")
        return MassNotificationOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=MassNotificationOverviewResponse)
@router.put("/overview/", response_model=MassNotificationOverviewResponse)
async def update_mass_notification_overview(
    payload: MassNotificationOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Mass Notification overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["mass_notification_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return MassNotificationOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Mass Notification overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Mass Notification overview section: {str(e)}"
        )

# ==========================================
# MASS NOTIFICATION APPLICATIONS ENDPOINTS
# ==========================================

@router.get("/applications", response_model=MassNotificationApplicationsResponse)
@router.get("/applications/", response_model=MassNotificationApplicationsResponse)
async def get_mass_notification_applications():
    """Public API: Retrieve Mass Notification applications section data."""
    try:
        doc = await db["mass_notification_page"].find_one({"section": "applications"})
        if not doc or "data" not in doc:
            return MassNotificationApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        app_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(app_data, dict):
            return MassNotificationApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        return MassNotificationApplicationsResponse(
            success=True,
            data=MassNotificationApplications(**app_data)
        )
    except Exception as e:
        print(f"Error fetching Mass Notification applications: {str(e)}")
        return MassNotificationApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)


@router.put("/applications", response_model=MassNotificationApplicationsResponse)
@router.put("/applications/", response_model=MassNotificationApplicationsResponse)
async def update_mass_notification_applications(
    payload: MassNotificationApplications,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Mass Notification applications section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["mass_notification_page"].update_one(
            {"section": "applications"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return MassNotificationApplicationsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Mass Notification applications: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Mass Notification applications section: {str(e)}"
        )

# ==========================================
# MASS NOTIFICATION CAPABILITIES ENDPOINTS
# ==========================================

@router.get("/capabilities", response_model=MassNotificationCapabilitiesResponse)
@router.get("/capabilities/", response_model=MassNotificationCapabilitiesResponse)
async def get_mass_notification_capabilities():
    """Public API: Retrieve Mass Notification capabilities & industries data."""
    try:
        doc = await db["mass_notification_page"].find_one({"section": "capabilities"})
        if not doc or "data" not in doc:
            return MassNotificationCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        cap_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(cap_data, dict):
            return MassNotificationCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        return MassNotificationCapabilitiesResponse(
            success=True,
            data=MassNotificationCapabilities(**cap_data)
        )
    except Exception as e:
        print(f"Error fetching Mass Notification capabilities: {str(e)}")
        return MassNotificationCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)


@router.put("/capabilities", response_model=MassNotificationCapabilitiesResponse)
@router.put("/capabilities/", response_model=MassNotificationCapabilitiesResponse)
async def update_mass_notification_capabilities(
    payload: MassNotificationCapabilities,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Mass Notification capabilities & industries content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["mass_notification_page"].update_one(
            {"section": "capabilities"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return MassNotificationCapabilitiesResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Mass Notification capabilities: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Mass Notification capabilities section: {str(e)}"
        )