from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.eco_physics import (
    EcoPhysicsBannerHeader,
    EcoPhysicsBannerHeaderResponse,
    EcoPhysicsOverviewData,
    EcoPhysicsOverviewResponse,
    EcoPhysicsPrecisionData,
    EcoPhysicsPrecisionResponse,
    EcoPhysicsRangeSupportData,
    EcoPhysicsRangeSupportResponse,
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(prefix="/api/eco-physics", tags=["Eco Physics Brand Page"])

DEFAULT_BANNER = EcoPhysicsBannerHeader(
    title="Eco Physics",
    subtitle="High Precision Gas Analyzers and Environmental Measurement Systems",
    bg_image="",
    bg_image_url=""
)

DEFAULT_OVERVIEW = EcoPhysicsOverviewData()

DEFAULT_PRECISION = EcoPhysicsPrecisionData()

DEFAULT_RANGE_SUPPORT = EcoPhysicsRangeSupportData()


def clean_doc_data(data: dict) -> dict:
    """Utility to strip internal MongoDB keys."""
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# ECO PHYSICS BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=EcoPhysicsBannerHeaderResponse)
@router.get("/banner/", response_model=EcoPhysicsBannerHeaderResponse)
async def get_eco_physics_banner():
    """Public API: Retrieve Eco Physics banner section data."""
    try:
        doc = await db["eco_physics_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return EcoPhysicsBannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return EcoPhysicsBannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        return EcoPhysicsBannerHeaderResponse(
            success=True,
            data=EcoPhysicsBannerHeader(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Eco Physics banner: {str(e)}")
        return EcoPhysicsBannerHeaderResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=EcoPhysicsBannerHeaderResponse)
@router.put("/banner/", response_model=EcoPhysicsBannerHeaderResponse)
async def update_eco_physics_banner(
    payload: EcoPhysicsBannerHeader,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Eco Physics banner section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["eco_physics_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return EcoPhysicsBannerHeaderResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Eco Physics banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Eco Physics banner: {str(e)}"
        )


# ==========================================
# ECO PHYSICS OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=EcoPhysicsOverviewResponse)
@router.get("/overview/", response_model=EcoPhysicsOverviewResponse)
async def get_eco_physics_overview():
    """Public API: Retrieve Eco Physics NOx Analyzers overview section data."""
    try:
        doc = await db["eco_physics_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return EcoPhysicsOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return EcoPhysicsOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return EcoPhysicsOverviewResponse(
            success=True,
            data=EcoPhysicsOverviewData(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Eco Physics overview: {str(e)}")
        return EcoPhysicsOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=EcoPhysicsOverviewResponse)
@router.put("/overview/", response_model=EcoPhysicsOverviewResponse)
async def update_eco_physics_overview(
    payload: EcoPhysicsOverviewData,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Eco Physics NOx Analyzers overview section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["eco_physics_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return EcoPhysicsOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Eco Physics overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Eco Physics overview: {str(e)}"
        )


# ==========================================
# ECO PHYSICS PRECISION SECTION ENDPOINTS
# ==========================================

@router.get("/precision", response_model=EcoPhysicsPrecisionResponse)
@router.get("/precision/", response_model=EcoPhysicsPrecisionResponse)
async def get_eco_physics_precision():
    """Public API: Retrieve Eco Physics Precision section data."""
    try:
        doc = await db["eco_physics_page"].find_one({"section": "precision"})
        if not doc or "data" not in doc:
            return EcoPhysicsPrecisionResponse(success=True, data=DEFAULT_PRECISION)

        precision_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(precision_data, dict):
            return EcoPhysicsPrecisionResponse(success=True, data=DEFAULT_PRECISION)

        return EcoPhysicsPrecisionResponse(
            success=True,
            data=EcoPhysicsPrecisionData(**precision_data)
        )
    except Exception as e:
        print(f"Error fetching Eco Physics precision section: {str(e)}")
        return EcoPhysicsPrecisionResponse(success=True, data=DEFAULT_PRECISION)


@router.put("/precision", response_model=EcoPhysicsPrecisionResponse)
@router.put("/precision/", response_model=EcoPhysicsPrecisionResponse)
async def update_eco_physics_precision(
    payload: EcoPhysicsPrecisionData,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Eco Physics Precision section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["eco_physics_page"].update_one(
            {"section": "precision"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return EcoPhysicsPrecisionResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Eco Physics precision section: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Eco Physics precision section: {str(e)}"
        )


# ==========================================
# ECO PHYSICS RANGE & SUPPORT ENDPOINTS
# ==========================================

@router.get("/range-support", response_model=EcoPhysicsRangeSupportResponse)
@router.get("/range-support/", response_model=EcoPhysicsRangeSupportResponse)
async def get_eco_physics_range_support():
    """Public API: Retrieve Eco Physics product range, support, and industries section data."""
    try:
        doc = await db["eco_physics_page"].find_one({"section": "range_support"})
        if not doc or "data" not in doc:
            return EcoPhysicsRangeSupportResponse(success=True, data=DEFAULT_RANGE_SUPPORT)

        content = clean_doc_data(doc.get("data", {}))
        if not isinstance(content, dict):
            return EcoPhysicsRangeSupportResponse(success=True, data=DEFAULT_RANGE_SUPPORT)

        return EcoPhysicsRangeSupportResponse(
            success=True,
            data=EcoPhysicsRangeSupportData(**content)
        )
    except Exception as e:
        print(f"Error fetching Eco Physics range support section: {str(e)}")
        return EcoPhysicsRangeSupportResponse(success=True, data=DEFAULT_RANGE_SUPPORT)


@router.put("/range-support", response_model=EcoPhysicsRangeSupportResponse)
@router.put("/range-support/", response_model=EcoPhysicsRangeSupportResponse)
async def update_eco_physics_range_support(
    payload: EcoPhysicsRangeSupportData,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Eco Physics product range, support, and industries section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["eco_physics_page"].update_one(
            {"section": "range_support"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return EcoPhysicsRangeSupportResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Eco Physics range support section: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update section: {str(e)}"
        )