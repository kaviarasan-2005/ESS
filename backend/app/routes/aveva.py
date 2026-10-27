from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.aveva import (
    AVEVABannerHeader,
    AVEVABannerHeaderResponse,
    AVEVAOverview,
    AVEVAOverviewResponse,
    AVEVASolutionsDetails,
    AVEVASolutionsDetailsResponse,
)
from app.utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/aveva", tags=["AVEVA Brand Page"])

DEFAULT_BANNER = AVEVABannerHeader(
    title="Aveva",
    subtitle="Industrial Software & Digital Transformation Solutions",
    bg_image="",
    bg_image_url=""
)

DEFAULT_OVERVIEW = AVEVAOverview(
    title="AVEVA System Platform & SCADA Solutions",
    description=(
        "In the age of industrial digitalization, a SCADA system must be more than a "
        "control interface—it must be the central nervous system of your enterprise. "
        "ESS-ME is a certified system integrator for AVEVA System Platform and AVEVA "
        "Edge SCADA, delivering powerful, scalable solutions that unify control, data, "
        "and insight. We empower industries across the Middle East to break down data silos, "
        "optimize performance, and make faster, data-driven decisions with one of the world's "
        "most trusted industrial software platforms."
    ),
    image="",
    image_url=""
)

DEFAULT_SOLUTIONS_DETAILS = AVEVASolutionsDetails()


def clean_doc_data(data: dict) -> dict:
    """Utility to strip internal MongoDB keys."""
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# AVEVA BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=AVEVABannerHeaderResponse)
@router.get("/banner/", response_model=AVEVABannerHeaderResponse)
async def get_aveva_banner():
    """Public API: Retrieve AVEVA banner section data."""
    try:
        doc = await db["aveva_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return AVEVABannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return AVEVABannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        return AVEVABannerHeaderResponse(
            success=True,
            data=AVEVABannerHeader(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching AVEVA banner: {str(e)}")
        return AVEVABannerHeaderResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=AVEVABannerHeaderResponse)
@router.put("/banner/", response_model=AVEVABannerHeaderResponse)
async def update_aveva_banner(
    payload: AVEVABannerHeader,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update AVEVA banner section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["aveva_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return AVEVABannerHeaderResponse(success=True, data=payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update AVEVA banner: {str(e)}"
        )


# ==========================================
# AVEVA OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=AVEVAOverviewResponse)
@router.get("/overview/", response_model=AVEVAOverviewResponse)
async def get_aveva_overview():
    """Public API: Retrieve AVEVA Overview section data."""
    try:
        doc = await db["aveva_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return AVEVAOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return AVEVAOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        # Synchronize image fields
        img = overview_data.get("image_url") or overview_data.get("image") or ""
        overview_data["image"] = img
        overview_data["image_url"] = img

        return AVEVAOverviewResponse(
            success=True,
            data=AVEVAOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching AVEVA overview: {str(e)}")
        return AVEVAOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=AVEVAOverviewResponse)
@router.put("/overview/", response_model=AVEVAOverviewResponse)
async def update_aveva_overview(
    payload: AVEVAOverview,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update AVEVA Overview section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)

        # Synchronize image fields before saving
        img = data_dict.get("image_url") or data_dict.get("image") or ""
        data_dict["image"] = img
        data_dict["image_url"] = img

        now = datetime.now(timezone.utc)

        await db["aveva_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return AVEVAOverviewResponse(
            success=True,
            data=AVEVAOverview(**data_dict)
        )
    except Exception as e:
        print(f"Error updating AVEVA overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update AVEVA overview: {str(e)}"
        )


# ==========================================
# AVEVA SOLUTIONS & KEY APPLICATIONS ENDPOINTS
# ==========================================

@router.get("/details", response_model=AVEVASolutionsDetailsResponse)
@router.get("/details/", response_model=AVEVASolutionsDetailsResponse)
async def get_aveva_solutions_details():
    """Public API: Retrieve AVEVA solutions features and key applications."""
    try:
        doc = await db["aveva_page"].find_one({"section": "solutions_details"})
        if not doc or "data" not in doc:
            return AVEVASolutionsDetailsResponse(success=True, data=DEFAULT_SOLUTIONS_DETAILS)

        details_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(details_data, dict):
            return AVEVASolutionsDetailsResponse(success=True, data=DEFAULT_SOLUTIONS_DETAILS)

        return AVEVASolutionsDetailsResponse(
            success=True,
            data=AVEVASolutionsDetails(**details_data)
        )
    except Exception as e:
        print(f"Error fetching AVEVA solutions details: {str(e)}")
        return AVEVASolutionsDetailsResponse(success=True, data=DEFAULT_SOLUTIONS_DETAILS)


@router.put("/details", response_model=AVEVASolutionsDetailsResponse)
@router.put("/details/", response_model=AVEVASolutionsDetailsResponse)
async def update_aveva_solutions_details(
    payload: AVEVASolutionsDetails,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update AVEVA solutions features and key applications."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["aveva_page"].update_one(
            {"section": "solutions_details"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return AVEVASolutionsDetailsResponse(
            success=True,
            data=AVEVASolutionsDetails(**data_dict)
        )
    except Exception as e:
        print(f"Error updating AVEVA solutions details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update AVEVA solutions details: {str(e)}"
        )