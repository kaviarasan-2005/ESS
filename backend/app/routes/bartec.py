from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.bartec import (
    BartecBannerHeader,
    BartecBannerHeaderResponse,
    BartecShelterOverview,
    BartecShelterOverviewResponse,
    BartecDetailsContent,
    BartecDetailsResponse,
)
from app.utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/bartec", tags=["Bartec Brand Page"])

DEFAULT_BANNER = BartecBannerHeader(
    title="Bartec",
    subtitle="Explosion Protection & Safety Systems",
    bg_image="",
    bg_image_url=""
)

DEFAULT_OVERVIEW = BartecShelterOverview(
    title="Bartec Analyzer Shelters & Sample Systems",
    description=(
        "In the demanding environments of the Middle East's oil & gas and petrochemical sectors, "
        "protecting sensitive analytical instrumentation is paramount. ESS-ME, as an expert "
        "integrator of Bartec analyzer shelters, delivers fully engineered, turnkey solutions "
        "that ensure analytical integrity. We provide more than just enclosures; we deliver complete "
        "life-support systems for your analyzers, guaranteeing reliable performance and accurate "
        "data in the face of extreme heat, sand, and corrosive atmospheres."
    ),
    image="",
    image_url=""
)


def clean_doc_data(data: dict) -> dict:
    """Utility to strip internal MongoDB keys."""
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# BARTEC BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=BartecBannerHeaderResponse)
@router.get("/banner/", response_model=BartecBannerHeaderResponse)
async def get_bartec_banner():
    """Public API: Retrieve Bartec banner section data."""
    try:
        doc = await db["bartec_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return BartecBannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return BartecBannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        return BartecBannerHeaderResponse(
            success=True,
            data=BartecBannerHeader(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Bartec banner: {str(e)}")
        return BartecBannerHeaderResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=BartecBannerHeaderResponse)
@router.put("/banner/", response_model=BartecBannerHeaderResponse)
async def update_bartec_banner(
    payload: BartecBannerHeader,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Bartec banner section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["bartec_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return BartecBannerHeaderResponse(success=True, data=payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Bartec banner: {str(e)}"
        )


# ==========================================
# BARTEC OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=BartecShelterOverviewResponse)
@router.get("/overview/", response_model=BartecShelterOverviewResponse)
async def get_bartec_overview():
    """Public API: Retrieve Bartec Overview section data."""
    try:
        doc = await db["bartec_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return BartecShelterOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return BartecShelterOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        # Synchronize image fields
        img = overview_data.get("image_url") or overview_data.get("image") or ""
        overview_data["image"] = img
        overview_data["image_url"] = img

        return BartecShelterOverviewResponse(
            success=True,
            data=BartecShelterOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Bartec overview: {str(e)}")
        return BartecShelterOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=BartecShelterOverviewResponse)
@router.put("/overview/", response_model=BartecShelterOverviewResponse)
async def update_bartec_overview(
    payload: BartecShelterOverview,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Bartec Overview section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)

        # Synchronize image fields before saving
        img = data_dict.get("image_url") or data_dict.get("image") or ""
        data_dict["image"] = img
        data_dict["image_url"] = img

        now = datetime.now(timezone.utc)

        await db["bartec_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return BartecShelterOverviewResponse(
            success=True,
            data=BartecShelterOverview(**data_dict)
        )
    except Exception as e:
        print(f"Error updating Bartec overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Bartec overview: {str(e)}"
        )

DEFAULT_DETAILS = BartecDetailsContent()

# ==========================================
# BARTEC DETAILS ENDPOINTS
# ==========================================

@router.get("/details", response_model=BartecDetailsResponse)
@router.get("/details/", response_model=BartecDetailsResponse)
async def get_bartec_details():
    """Public API: Retrieve Bartec Details & Applications section data."""
    try:
        doc = await db["bartec_page"].find_one({"section": "details"})
        if not doc or "data" not in doc:
            return BartecDetailsResponse(success=True, data=DEFAULT_DETAILS)

        details_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(details_data, dict):
            return BartecDetailsResponse(success=True, data=DEFAULT_DETAILS)

        return BartecDetailsResponse(
            success=True,
            data=BartecDetailsContent(**details_data)
        )
    except Exception as e:
        print(f"Error fetching Bartec details: {str(e)}")
        return BartecDetailsResponse(success=True, data=DEFAULT_DETAILS)


@router.put("/details", response_model=BartecDetailsResponse)
@router.put("/details/", response_model=BartecDetailsResponse)
async def update_bartec_details(
    payload: BartecDetailsContent,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Bartec Details & Applications section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["bartec_page"].update_one(
            {"section": "details"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return BartecDetailsResponse(
            success=True,
            data=BartecDetailsContent(**data_dict)
        )
    except Exception as e:
        print(f"Error updating Bartec details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Bartec details: {str(e)}"
        )