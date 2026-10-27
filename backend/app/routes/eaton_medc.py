from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.eaton_medc import (
    EatonMedcBannerHeader,
    EatonMedcBannerHeaderResponse,
    EatonMedcOverview,
    EatonMedcOverviewResponse,
    EatonMedcDetailsContent,
    EatonMedcDetailsResponse,
)
from app.utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/eaton-medc", tags=["Eaton MEDC Brand Page"])

DEFAULT_BANNER = EatonMedcBannerHeader(
    title="Eaton MEDC",
    carousel_titles=[
        "Eaton MEDC",
        "Explosion-Proof Visual & Audible Signals"
    ],
    subtitle="Explosion Proof Visual & Audible Warning Signals",
    bg_image="",
    bg_image_url=""
)

DEFAULT_OVERVIEW = EatonMedcOverview(
    description=(
        "In potentially explosive atmospheres, standard electrical equipment becomes a liability. "
        "ESS-ME is the trusted supplier of Eaton explosion-proof and hazardous area equipment "
        "in the Middle East, providing certified safety solutions for the Oil & Gas, chemical, "
        "and pharmaceutical industries. We supply the robust lighting, plugs, and enclosures "
        "designed to contain internal explosions and prevent the ignition of external flammable gases, "
        "dusts, and vapors, ensuring compliance and protecting your workforce."
    ),
    image="",
    image_url=""
)

DEFAULT_DETAILS = EatonMedcDetailsContent()

def clean_doc_data(data: dict) -> dict:
    """Utility to strip internal MongoDB keys."""
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# EATON MEDC BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=EatonMedcBannerHeaderResponse)
@router.get("/banner/", response_model=EatonMedcBannerHeaderResponse)
async def get_eaton_medc_banner():
    """Public API: Retrieve Eaton MEDC banner section data."""
    try:
        doc = await db["eaton_medc_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return EatonMedcBannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return EatonMedcBannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        return EatonMedcBannerHeaderResponse(
            success=True,
            data=EatonMedcBannerHeader(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Eaton MEDC banner: {str(e)}")
        return EatonMedcBannerHeaderResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=EatonMedcBannerHeaderResponse)
@router.put("/banner/", response_model=EatonMedcBannerHeaderResponse)
async def update_eaton_medc_banner(
    payload: EatonMedcBannerHeader,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Eaton MEDC banner section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["eaton_medc_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return EatonMedcBannerHeaderResponse(success=True, data=payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Eaton MEDC banner: {str(e)}"
        )



# ==========================================
# EATON MEDC OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=EatonMedcOverviewResponse)
@router.get("/overview/", response_model=EatonMedcOverviewResponse)
async def get_eaton_medc_overview():
    """Public API: Retrieve Eaton MEDC overview section content."""
    try:
        doc = await db["eaton_medc_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return EatonMedcOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return EatonMedcOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        # Synchronize image paths
        img = overview_data.get("image_url") or overview_data.get("image") or ""
        overview_data["image"] = img
        overview_data["image_url"] = img

        return EatonMedcOverviewResponse(
            success=True,
            data=EatonMedcOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Eaton MEDC overview: {str(e)}")
        return EatonMedcOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=EatonMedcOverviewResponse)
@router.put("/overview/", response_model=EatonMedcOverviewResponse)
async def update_eaton_medc_overview(
    payload: EatonMedcOverview,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Eaton MEDC overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)

        img = data_dict.get("image_url") or data_dict.get("image") or ""
        data_dict["image"] = img
        data_dict["image_url"] = img

        now = datetime.now(timezone.utc)

        await db["eaton_medc_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return EatonMedcOverviewResponse(
            success=True,
            data=EatonMedcOverview(**data_dict)
        )
    except Exception as e:
        print(f"Error updating Eaton MEDC overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Eaton MEDC overview: {str(e)}"
        )


# ==========================================
# EATON MEDC DETAILS ENDPOINTS
# ==========================================

@router.get("/details", response_model=EatonMedcDetailsResponse)
@router.get("/details/", response_model=EatonMedcDetailsResponse)
async def get_eaton_medc_details():
    """Public API: Retrieve Eaton MEDC Details & Applications section data."""
    try:
        doc = await db["eaton_medc_page"].find_one({"section": "details"})
        if not doc or "data" not in doc:
            return EatonMedcDetailsResponse(success=True, data=DEFAULT_DETAILS)

        details_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(details_data, dict):
            return EatonMedcDetailsResponse(success=True, data=DEFAULT_DETAILS)

        return EatonMedcDetailsResponse(
            success=True,
            data=EatonMedcDetailsContent(**details_data)
        )
    except Exception as e:
        print(f"Error fetching Eaton MEDC details: {str(e)}")
        return EatonMedcDetailsResponse(success=True, data=DEFAULT_DETAILS)


@router.put("/details", response_model=EatonMedcDetailsResponse)
@router.put("/details/", response_model=EatonMedcDetailsResponse)
async def update_eaton_medc_details(
    payload: EatonMedcDetailsContent,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Eaton MEDC Details & Applications section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["eaton_medc_page"].update_one(
            {"section": "details"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return EatonMedcDetailsResponse(
            success=True,
            data=EatonMedcDetailsContent(**data_dict)
        )
    except Exception as e:
        print(f"Error updating Eaton MEDC details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Eaton MEDC details: {str(e)}"
        )