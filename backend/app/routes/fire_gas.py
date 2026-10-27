from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.fire_gas import (
    FireGasBanner,
    FireGasBannerResponse,
    FireGasOverview,
    FireGasOverviewResponse,
    DEFAULT_FIRE_GAS_IMAGES,
    FireGasApplications,
    FireGasApplicationsResponse,
    DEFAULT_FIRE_GAS_APPLICATIONS,
    FireGasCapabilities,
    FireGasCapabilitiesResponse,
    DEFAULT_FIRE_GAS_INDUSTRIES,
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/fire-gas",
    tags=["Fire & Gas Control Systems Page"]
)

DEFAULT_BANNER = FireGasBanner(
    title="Fire & Gas Control Systems",
    subtitle="Integrated Safety & Hazard Detection Control Solutions",
    bg_image_url=""
)

DEFAULT_OVERVIEW = FireGasOverview(
    paragraph_1=(
        "A well-engineered fire and gas (F&G) control system ties detection, alarm, and shutdown logic together "
        "into a single, reliable safety layer. ESS Saudi supplies fire and gas control systems, including SIL-rated "
        "control panels, from internationally reputed manufacturers, engineered for the hazardous-area and safety-integrity "
        "requirements of oil & gas, petrochemical, and power facilities."
    ),
    paragraph_2=(
        "Our scope covers F&G logic solver panels, SIL-rated control panels, integration of flame, gas, and smoke "
        "detection field devices, and interfacing with plant emergency shutdown (ESD) and mass notification systems."
    ),
    carousel_images=DEFAULT_FIRE_GAS_IMAGES
)

DEFAULT_APPLICATIONS = FireGasApplications(
    title="Key Applications",
    applications_list=DEFAULT_FIRE_GAS_APPLICATIONS
)

DEFAULT_CAPABILITIES = FireGasCapabilities(
    industries_title="Industries served",
    industries_list=DEFAULT_FIRE_GAS_INDUSTRIES,
    why_title="Why ESS Saudi",
    why_description=(
        "ESS Saudi supplies fire and gas control systems and SIL-rated panels from "
        "internationally certified manufacturers, and offers local engineering, panel integration, "
        "and commissioning support aligned with site safety-case requirements."
    )
)

def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# FIRE & GAS BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=FireGasBannerResponse)
@router.get("/banner/", response_model=FireGasBannerResponse)
async def get_fire_gas_banner():
    """Public API: Retrieve Fire & Gas banner section data."""
    try:
        doc = await db["fire_gas_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return FireGasBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return FireGasBannerResponse(success=True, data=DEFAULT_BANNER)

        return FireGasBannerResponse(
            success=True,
            data=FireGasBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Fire & Gas banner: {str(e)}")
        return FireGasBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=FireGasBannerResponse)
@router.put("/banner/", response_model=FireGasBannerResponse)
async def update_fire_gas_banner(
    payload: FireGasBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Fire & Gas banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["fire_gas_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return FireGasBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Fire & Gas banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Fire & Gas banner section: {str(e)}"
        )


# ==========================================
# FIRE & GAS OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=FireGasOverviewResponse)
@router.get("/overview/", response_model=FireGasOverviewResponse)
async def get_fire_gas_overview():
    """Public API: Retrieve Fire & Gas overview section data."""
    try:
        doc = await db["fire_gas_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return FireGasOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return FireGasOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return FireGasOverviewResponse(
            success=True,
            data=FireGasOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Fire & Gas overview: {str(e)}")
        return FireGasOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=FireGasOverviewResponse)
@router.put("/overview/", response_model=FireGasOverviewResponse)
async def update_fire_gas_overview(
    payload: FireGasOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Fire & Gas overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["fire_gas_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return FireGasOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Fire & Gas overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Fire & Gas overview section: {str(e)}"
        )


# ==========================================
# FIRE & GAS APPLICATIONS ENDPOINTS
# ==========================================

@router.get("/applications", response_model=FireGasApplicationsResponse)
@router.get("/applications/", response_model=FireGasApplicationsResponse)
async def get_fire_gas_applications():
    """Public API: Retrieve Fire & Gas applications section data."""
    try:
        doc = await db["fire_gas_page"].find_one({"section": "applications"})
        if not doc or "data" not in doc:
            return FireGasApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        app_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(app_data, dict):
            return FireGasApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)

        return FireGasApplicationsResponse(
            success=True,
            data=FireGasApplications(**app_data)
        )
    except Exception as e:
        print(f"Error fetching Fire & Gas applications: {str(e)}")
        return FireGasApplicationsResponse(success=True, data=DEFAULT_APPLICATIONS)


@router.put("/applications", response_model=FireGasApplicationsResponse)
@router.put("/applications/", response_model=FireGasApplicationsResponse)
async def update_fire_gas_applications(
    payload: FireGasApplications,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Fire & Gas applications section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["fire_gas_page"].update_one(
            {"section": "applications"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return FireGasApplicationsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Fire & Gas applications: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Fire & Gas applications section: {str(e)}"
        )


# ==========================================
# FIRE & GAS CAPABILITIES ENDPOINTS
# ==========================================

@router.get("/capabilities", response_model=FireGasCapabilitiesResponse)
@router.get("/capabilities/", response_model=FireGasCapabilitiesResponse)
async def get_fire_gas_capabilities():
    """Public API: Retrieve Fire & Gas capabilities & industries data."""
    try:
        doc = await db["fire_gas_page"].find_one({"section": "capabilities"})
        if not doc or "data" not in doc:
            return FireGasCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        cap_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(cap_data, dict):
            return FireGasCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        return FireGasCapabilitiesResponse(
            success=True,
            data=FireGasCapabilities(**cap_data)
        )
    except Exception as e:
        print(f"Error fetching Fire & Gas capabilities: {str(e)}")
        return FireGasCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)


@router.put("/capabilities", response_model=FireGasCapabilitiesResponse)
@router.put("/capabilities/", response_model=FireGasCapabilitiesResponse)
async def update_fire_gas_capabilities(
    payload: FireGasCapabilities,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Fire & Gas capabilities & industries content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["fire_gas_page"].update_one(
            {"section": "capabilities"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return FireGasCapabilitiesResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Fire & Gas capabilities: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Fire & Gas capabilities section: {str(e)}"
        )