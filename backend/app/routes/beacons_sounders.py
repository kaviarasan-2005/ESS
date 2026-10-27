from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.beacons_sounders import (
    BeaconsSoundersBanner,
    BeaconsSoundersBannerResponse,
    BeaconsSoundersOverview,
    BeaconsSoundersOverviewResponse,
    DEFAULT_BEACONS_SOUNDERS_IMAGES,
    BeaconsSoundersApplications,
    BeaconsSoundersApplicationsResponse,
    DEFAULT_BEACONS_SOUNDERS_APPLICATIONS,
    BeaconsSoundersCapabilities,
    BeaconsSoundersCapabilitiesResponse,
    DEFAULT_BEACONS_SOUNDERS_INDUSTRIES,
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/beacons-sounders",
    tags=["Beacons & Sounders Page"]
)

DEFAULT_BANNER = BeaconsSoundersBanner(
    title="Beacons & Sounders",
    subtitle="Audible & Visual Signaling Devices for Hazardous Areas",
    bg_image_url=""
)

DEFAULT_OVERVIEW = BeaconsSoundersOverview(
    paragraph_1=(
        "Clear, reliable visual and audible alarms are essential for alerting personnel "
        "to hazardous conditions in industrial environments, especially in high-noise or visually obstructed areas. "
        "ESS Saudi supplies beacons, sounders, and combined sounder-beacon units from internationally reputed manufacturers, "
        "certified for use in hazardous (Zone 1/Zone 2) and industrial outdoor environments."
    ),
    paragraph_2=(
        "Our range includes LED and Xenon beacons, weatherproof sounders, and multi-tone combined units, "
        "selected to match a site's noise levels, visibility conditions, and hazardous-area classification."
    ),
    carousel_images=DEFAULT_BEACONS_SOUNDERS_IMAGES
)
DEFAULT_APPLICATIONS = BeaconsSoundersApplications(
    title="Key Applications",
    applications_list=DEFAULT_BEACONS_SOUNDERS_APPLICATIONS
)

DEFAULT_CAPABILITIES = BeaconsSoundersCapabilities(
    industries_title="Industries served",
    industries_list=DEFAULT_BEACONS_SOUNDERS_INDUSTRIES,
    why_title="Why ESS Saudi",
    why_description=(
        "ESS Saudi supplies beacons and sounders from internationally certified manufacturers, "
        "and offers local support for hazardous-area classification review and system integration "
        "into plant-wide fire and gas or ESD systems."
    )
)


def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# BEACONS & SOUNDERS BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=BeaconsSoundersBannerResponse)
@router.get("/banner/", response_model=BeaconsSoundersBannerResponse)
async def get_beacons_sounders_banner():
    """Public API: Retrieve Beacons & Sounders banner section data."""
    try:
        doc = await db["beacons_sounders_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return BeaconsSoundersBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return BeaconsSoundersBannerResponse(success=True, data=DEFAULT_BANNER)

        return BeaconsSoundersBannerResponse(
            success=True,
            data=BeaconsSoundersBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Beacons & Sounders banner: {str(e)}")
        return BeaconsSoundersBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=BeaconsSoundersBannerResponse)
@router.put("/banner/", response_model=BeaconsSoundersBannerResponse)
async def update_beacons_sounders_banner(
    payload: BeaconsSoundersBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Beacons & Sounders banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["beacons_sounders_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return BeaconsSoundersBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Beacons & Sounders banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Beacons & Sounders banner section: {str(e)}"
        )


# ==========================================
# BEACONS & SOUNDERS OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=BeaconsSoundersOverviewResponse)
@router.get("/overview/", response_model=BeaconsSoundersOverviewResponse)
async def get_beacons_sounders_overview():
    """Public API: Retrieve Beacons & Sounders overview section data."""
    try:
        doc = await db["beacons_sounders_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return BeaconsSoundersOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return BeaconsSoundersOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return BeaconsSoundersOverviewResponse(
            success=True,
            data=BeaconsSoundersOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Beacons & Sounders overview: {str(e)}")
        return BeaconsSoundersOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=BeaconsSoundersOverviewResponse)
@router.put("/overview/", response_model=BeaconsSoundersOverviewResponse)
async def update_beacons_sounders_overview(
    payload: BeaconsSoundersOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Beacons & Sounders overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["beacons_sounders_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return BeaconsSoundersOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Beacons & Sounders overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Beacons & Sounders overview section: {str(e)}"
        )


# ==========================================
# BEACONS & SOUNDERS APPLICATIONS ENDPOINTS
# ==========================================

@router.get("/applications", response_model=BeaconsSoundersApplicationsResponse)
@router.get("/applications/", response_model=BeaconsSoundersApplicationsResponse)
async def get_beacons_sounders_applications():
    """Public API: Retrieve Beacons & Sounders applications section data."""
    try:
        doc = await db["beacons_sounders_page"].find_one({"section": "applications"})
        if not doc or "data" not in doc:
            return BeaconsSoundersApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        app_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(app_data, dict):
            return BeaconsSoundersApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        return BeaconsSoundersApplicationsResponse(
            success=True,
            data=BeaconsSoundersApplications(**app_data)
        )
    except Exception as e:
        print(f"Error fetching Beacons & Sounders applications: {str(e)}")
        return BeaconsSoundersApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)


@router.put("/applications", response_model=BeaconsSoundersApplicationsResponse)
@router.put("/applications/", response_model=BeaconsSoundersApplicationsResponse)
async def update_beacons_sounders_applications(
    payload: BeaconsSoundersApplications,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Beacons & Sounders applications section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["beacons_sounders_page"].update_one(
            {"section": "applications"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return BeaconsSoundersApplicationsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Beacons & Sounders applications: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Beacons & Sounders applications section: {str(e)}"
        )


# ==========================================
# BEACONS & SOUNDERS CAPABILITIES ENDPOINTS
# ==========================================

@router.get("/capabilities", response_model=BeaconsSoundersCapabilitiesResponse)
@router.get("/capabilities/", response_model=BeaconsSoundersCapabilitiesResponse)
async def get_beacons_sounders_capabilities():
    """Public API: Retrieve Beacons & Sounders capabilities & industries data."""
    try:
        doc = await db["beacons_sounders_page"].find_one({"section": "capabilities"})
        if not doc or "data" not in doc:
            return BeaconsSoundersCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        cap_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(cap_data, dict):
            return BeaconsSoundersCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        return BeaconsSoundersCapabilitiesResponse(
            success=True,
            data=BeaconsSoundersCapabilities(**cap_data)
        )
    except Exception as e:
        print(f"Error fetching Beacons & Sounders capabilities: {str(e)}")
        return BeaconsSoundersCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)


@router.put("/capabilities", response_model=BeaconsSoundersCapabilitiesResponse)
@router.put("/capabilities/", response_model=BeaconsSoundersCapabilitiesResponse)
async def update_beacons_sounders_capabilities(
    payload: BeaconsSoundersCapabilities,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Beacons & Sounders capabilities & industries content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["beacons_sounders_page"].update_one(
            {"section": "capabilities"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return BeaconsSoundersCapabilitiesResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Beacons & Sounders capabilities: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Beacons & Sounders capabilities section: {str(e)}"
        )

    