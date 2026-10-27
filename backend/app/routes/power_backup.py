from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.power_backup import (
    PowerBackupBanner,
    PowerBackupBannerResponse,
    PowerBackupOverview,
    PowerBackupOverviewResponse,
    DEFAULT_POWER_BACKUP_IMAGES,
    PowerBackupApplications,
    PowerBackupApplicationsResponse,
    DEFAULT_POWER_BACKUP_APPLICATIONS,
    PowerBackupCapabilities,
    PowerBackupCapabilitiesResponse,
    DEFAULT_POWER_BACKUP_INDUSTRIES,
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/power-backup",
    tags=["Power Backup Systems Page"]
)

DEFAULT_BANNER = PowerBackupBanner(
    title="Power Backup Systems (UPS & Battery Charger)",
    subtitle="Uninterruptible Power Supply & Battery Charger Solutions",
    bg_image_url=""
)

DEFAULT_OVERVIEW = PowerBackupOverview(
    paragraph_1=(
        "Control, safety, and communication systems must stay powered through grid disturbances and outages. "
        "ESS Saudi supplies power backup systems, including uninterruptible power supplies (UPS) and battery chargers, "
        "from internationally reputed manufacturers, engineered to protect critical loads in oil & gas, petrochemical, "
        "and power facilities."
    ),
    paragraph_2=(
        "Our scope covers UPS systems, Battery Charger and battery bank systems, and system sizing and integration "
        "support for critical control, instrumentation, and safety system power requirements."
    ),
    carousel_images=DEFAULT_POWER_BACKUP_IMAGES
)


DEFAULT_APPLICATIONS = PowerBackupApplications(
    title="Key Applications",
    applications_list=DEFAULT_POWER_BACKUP_APPLICATIONS
)

DEFAULT_CAPABILITIES = PowerBackupCapabilities(
    industries_title="Industries served",
    industries_list=DEFAULT_POWER_BACKUP_INDUSTRIES,
    why_title="Why ESS Saudi",
    why_description=(
        "ESS Saudi supplies UPS and battery charger systems from internationally "
        "certified manufacturers, and offers local sizing, engineering, and commissioning "
        "support for critical power backup applications."
    ),
    cta_text="Contact our team to discuss power backup requirements for your critical systems.",
    cta_button_text="Request a Quote",
    cta_button_link="/contact"
)

def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# POWER BACKUP BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=PowerBackupBannerResponse)
@router.get("/banner/", response_model=PowerBackupBannerResponse)
async def get_power_backup_banner():
    """Public API: Retrieve Power Backup banner section data."""
    try:
        doc = await db["power_backup_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return PowerBackupBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return PowerBackupBannerResponse(success=True, data=DEFAULT_BANNER)

        return PowerBackupBannerResponse(
            success=True,
            data=PowerBackupBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Power Backup banner: {str(e)}")
        return PowerBackupBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=PowerBackupBannerResponse)
@router.put("/banner/", response_model=PowerBackupBannerResponse)
async def update_power_backup_banner(
    payload: PowerBackupBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Power Backup banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["power_backup_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return PowerBackupBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Power Backup banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Power Backup banner section: {str(e)}"
        )

# ==========================================
# POWER BACKUP OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=PowerBackupOverviewResponse)
@router.get("/overview/", response_model=PowerBackupOverviewResponse)
async def get_power_backup_overview():
    """Public API: Retrieve Power Backup overview section data."""
    try:
        doc = await db["power_backup_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return PowerBackupOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return PowerBackupOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return PowerBackupOverviewResponse(
            success=True,
            data=PowerBackupOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Power Backup overview: {str(e)}")
        return PowerBackupOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=PowerBackupOverviewResponse)
@router.put("/overview/", response_model=PowerBackupOverviewResponse)
async def update_power_backup_overview(
    payload: PowerBackupOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Power Backup overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["power_backup_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return PowerBackupOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Power Backup overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Power Backup overview section: {str(e)}"
        )


# ==========================================
# POWER BACKUP APPLICATIONS ENDPOINTS
# ==========================================

@router.get("/applications", response_model=PowerBackupApplicationsResponse)
@router.get("/applications/", response_model=PowerBackupApplicationsResponse)
async def get_power_backup_applications():
    """Public API: Retrieve Power Backup applications section data."""
    try:
        doc = await db["power_backup_page"].find_one({"section": "applications"})
        if not doc or "data" not in doc:
            return PowerBackupApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        app_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(app_data, dict):
            return PowerBackupApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        return PowerBackupApplicationsResponse(
            success=True,
            data=PowerBackupApplications(**app_data)
        )
    except Exception as e:
        print(f"Error fetching Power Backup applications: {str(e)}")
        return PowerBackupApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)


@router.put("/applications", response_model=PowerBackupApplicationsResponse)
@router.put("/applications/", response_model=PowerBackupApplicationsResponse)
async def update_power_backup_applications(
    payload: PowerBackupApplications,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Power Backup applications section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["power_backup_page"].update_one(
            {"section": "applications"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return PowerBackupApplicationsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Power Backup applications: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Power Backup applications section: {str(e)}"
        )


# ==========================================
# POWER BACKUP CAPABILITIES ENDPOINTS
# ==========================================

@router.get("/capabilities", response_model=PowerBackupCapabilitiesResponse)
@router.get("/capabilities/", response_model=PowerBackupCapabilitiesResponse)
async def get_power_backup_capabilities():
    """Public API: Retrieve Power Backup capabilities & industries data."""
    try:
        doc = await db["power_backup_page"].find_one({"section": "capabilities"})
        if not doc or "data" not in doc:
            return PowerBackupCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        cap_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(cap_data, dict):
            return PowerBackupCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        return PowerBackupCapabilitiesResponse(
            success=True,
            data=PowerBackupCapabilities(**cap_data)
        )
    except Exception as e:
        print(f"Error fetching Power Backup capabilities: {str(e)}")
        return PowerBackupCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)


@router.put("/capabilities", response_model=PowerBackupCapabilitiesResponse)
@router.put("/capabilities/", response_model=PowerBackupCapabilitiesResponse)
async def update_power_backup_capabilities(
    payload: PowerBackupCapabilities,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Power Backup capabilities & industries content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["power_backup_page"].update_one(
            {"section": "capabilities"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return PowerBackupCapabilitiesResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Power Backup capabilities: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Power Backup capabilities section: {str(e)}"
        )