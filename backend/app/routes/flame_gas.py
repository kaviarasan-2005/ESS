from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.flame_gas import (
    FlameGasBanner,
    FlameGasBannerResponse,
    FlameGasOverview,
    FlameGasOverviewResponse,
    DEFAULT_FLAME_GAS_IMAGES,
    FlameGasApplications,
    FlameGasApplicationsResponse,
    DEFAULT_FLAME_GAS_APPLICATIONS,
    FlameGasCapabilities,
    FlameGasCapabilitiesResponse,
    DEFAULT_FLAME_GAS_INDUSTRIES,
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/flame-gas",
    tags=["Flame & Gas Detectors Page"]
)

DEFAULT_BANNER = FlameGasBanner(
    title="Flame & Gas Detectors",
    subtitle="Advanced Flame & Hazardous Gas Detection Solutions",
    bg_image_url=""
)

DEFAULT_OVERVIEW = FlameGasOverview(
    paragraph_1=(
        "Early and reliable detection of Flammable gas, Toxic gas, and flame events is fundamental "
        "to process safety in hazardous industrial environments. ESS Saudi supplies Flame and Gas "
        "detectors from leading international manufacturers, certified for use in Zone 1 and Zone 2 "
        "hazardous areas found across upstream, midstream, and downstream facilities."
    ),
    paragraph_2=(
        "Our range spans point and Open-Path gas detectors, Ultrasonic gas leak detectors, "
        "and UV/IR and Multi-Spectrum Flame Detectors, selected to match the specific hazard profile, "
        "layout, and safety-integrity requirements of each site."
    ),
    carousel_images=DEFAULT_FLAME_GAS_IMAGES
)

DEFAULT_APPLICATIONS = FlameGasApplications(
    title="Key Applications",
    applications_list=DEFAULT_FLAME_GAS_APPLICATIONS,
    industries_served="Industries Served: Oil & Gas · Petrochemical · Power Generation · Utilities"
)

DEFAULT_CAPABILITIES = FlameGasCapabilities(
    industries_title="Industries served",
    industries_list=DEFAULT_FLAME_GAS_INDUSTRIES,
    why_title="Why ESS Saudi",
    why_description=(
        "ESS Saudi partners with manufacturers holding recognized international "
        "hazardous-area and safety certifications, supplying detectors suited to "
        "Saudi Arabia's regulatory and site-safety requirements, and offers engineering "
        "support for detector layout and F&G system integration."
    )
)

def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# FLAME & GAS BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=FlameGasBannerResponse)
@router.get("/banner/", response_model=FlameGasBannerResponse)
async def get_flame_gas_banner():
    """Public API: Retrieve Flame & Gas Detectors banner section data."""
    try:
        doc = await db["flame_gas_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return FlameGasBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return FlameGasBannerResponse(success=True, data=DEFAULT_BANNER)

        return FlameGasBannerResponse(
            success=True,
            data=FlameGasBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Flame & Gas banner: {str(e)}")
        return FlameGasBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=FlameGasBannerResponse)
@router.put("/banner/", response_model=FlameGasBannerResponse)
async def update_flame_gas_banner(
    payload: FlameGasBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Flame & Gas Detectors banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["flame_gas_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return FlameGasBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Flame & Gas banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Flame & Gas banner section: {str(e)}"
        )


# ==========================================
# FLAME & GAS OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=FlameGasOverviewResponse)
@router.get("/overview/", response_model=FlameGasOverviewResponse)
async def get_flame_gas_overview():
    """Public API: Retrieve Flame & Gas Detectors overview section data."""
    try:
        doc = await db["flame_gas_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return FlameGasOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return FlameGasOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return FlameGasOverviewResponse(
            success=True,
            data=FlameGasOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Flame & Gas overview: {str(e)}")
        return FlameGasOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=FlameGasOverviewResponse)
@router.put("/overview/", response_model=FlameGasOverviewResponse)
async def update_flame_gas_overview(
    payload: FlameGasOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Flame & Gas Detectors overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["flame_gas_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return FlameGasOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Flame & Gas overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Flame & Gas overview section: {str(e)}"
        )

@router.get("/applications", response_model=FlameGasApplicationsResponse)
@router.get("/applications/", response_model=FlameGasApplicationsResponse)
async def get_flame_gas_applications():
    """Public API: Retrieve Flame & Gas Detectors applications section data."""
    try:
        doc = await db["flame_gas_page"].find_one({"section": "applications"})
        if not doc or "data" not in doc:
            return FlameGasApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        app_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(app_data, dict):
            return FlameGasApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        return FlameGasApplicationsResponse(
            success=True,
            data=FlameGasApplications(**app_data)
        )
    except Exception as e:
        print(f"Error fetching Flame & Gas applications: {str(e)}")
        return FlameGasApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)


@router.put("/applications", response_model=FlameGasApplicationsResponse)
@router.put("/applications/", response_model=FlameGasApplicationsResponse)
async def update_flame_gas_applications(
    payload: FlameGasApplications,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Flame & Gas Detectors applications section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["flame_gas_page"].update_one(
            {"section": "applications"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return FlameGasApplicationsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Flame & Gas applications: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Flame & Gas applications section: {str(e)}"
        )


# ==========================================
# FLAME & GAS CAPABILITIES ENDPOINTS
# ==========================================

@router.get("/capabilities", response_model=FlameGasCapabilitiesResponse)
@router.get("/capabilities/", response_model=FlameGasCapabilitiesResponse)
async def get_flame_gas_capabilities():
    """Public API: Retrieve Flame & Gas Detectors capabilities & industries data."""
    try:
        doc = await db["flame_gas_page"].find_one({"section": "capabilities"})
        if not doc or "data" not in doc:
            return FlameGasCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        cap_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(cap_data, dict):
            return FlameGasCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        return FlameGasCapabilitiesResponse(
            success=True,
            data=FlameGasCapabilities(**cap_data)
        )
    except Exception as e:
        print(f"Error fetching Flame & Gas capabilities: {str(e)}")
        return FlameGasCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)


@router.put("/capabilities", response_model=FlameGasCapabilitiesResponse)
@router.put("/capabilities/", response_model=FlameGasCapabilitiesResponse)
async def update_flame_gas_capabilities(
    payload: FlameGasCapabilities,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Flame & Gas Detectors capabilities & industries content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["flame_gas_page"].update_one(
            {"section": "capabilities"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return FlameGasCapabilitiesResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Flame & Gas capabilities: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Flame & Gas capabilities section: {str(e)}"
        )