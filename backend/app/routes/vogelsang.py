from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.vogelsang import (
    VogelsangBanner,
    VogelsangBannerResponse,
    VogelsangOverview,
    VogelsangOverviewResponse,
    VogelsangDetails,
    VogelsangDetailsResponse,
    DEFAULT_VOGELSANG_CARDS,
    DEFAULT_VOGELSANG_ADVANTAGES,
    DEFAULT_VOGELSANG_APPLICATIONS
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/vogelsang",
    tags=["Vogelsang Brand Page"]
)

DEFAULT_BANNER = VogelsangBanner(
    title="Vogelsang",
    subtitle="Pumping, Macerating, Disintegrating & Spreading Technology",
    bg_image_url=""
)

DEFAULT_OVERVIEW = VogelsangOverview(
    title="Vogelsang Wastewater Equipment",
    paragraph_1=(
        "To conduct efficient wastewater and industrial processing, one needs to avoid clogs, jams, and downtime. "
        "ESS-ME supplies Vogelsang wastewater equipment, delivering German-engineered solutions specifically designed "
        "to handle the toughest solids-laden and viscous fluids."
    ),
    paragraph_2=(
        "Our robust chopper pumps, macerators, and rotary lobe pumps are engineered to eliminate blockages, "
        "reduce maintenance costs, and ensure continuous, reliable operation for municipal and industrial applications across the GCC."
    ),
    image_url=""
)

DEFAULT_DETAILS = VogelsangDetails(
    header_title="German Engineering for the Most Demanding Fluid Handling",
    header_description=(
        "For nearly a century, Vogelsang has been a global specialist in developing highly engineered equipment that is both powerful and easy to maintain. "
        "Their innovative technologies, such as the rotary lobe pump with integrated chopper technology, are built to process challenging media with high solid content, "
        "fibrous materials, and abrasive slurries without failure, making them ideal for the region's demanding wastewater and industrial sectors."
    ),
    product_line_title="Our Vogelsang Product Line",
    product_line_description=(
        "We provide a range of Vogelsang products that solve specific clogging and handling problems. "
        "From raw sewage pumping to delicate shear-sensitive fluids, our solutions ensure smooth and efficient processing from intake to discharge."
    ),
    cards=DEFAULT_VOGELSANG_CARDS,
    advantage_title="ESS-ME Advantage: Application-Specific Solutions",
    advantage_subtitle="We provide more than equipment; we deliver performance guarantees. Our services include:",
    advantage_list=DEFAULT_VOGELSANG_ADVANTAGES,
    applications_title="Primary Applications",
    applications_list=DEFAULT_VOGELSANG_APPLICATIONS
)

def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# VOGELSANG BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=VogelsangBannerResponse)
@router.get("/banner/", response_model=VogelsangBannerResponse)
async def get_vogelsang_banner():
    """Public API: Retrieve Vogelsang banner section data."""
    try:
        doc = await db["vogelsang_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return VogelsangBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return VogelsangBannerResponse(success=True, data=DEFAULT_BANNER)

        return VogelsangBannerResponse(
            success=True,
            data=VogelsangBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Vogelsang banner: {str(e)}")
        return VogelsangBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=VogelsangBannerResponse)
@router.put("/banner/", response_model=VogelsangBannerResponse)
async def update_vogelsang_banner(
    payload: VogelsangBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Vogelsang banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["vogelsang_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return VogelsangBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Vogelsang banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Vogelsang banner section: {str(e)}"
        )


# ==========================================
# VOGELSANG OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=VogelsangOverviewResponse)
@router.get("/overview/", response_model=VogelsangOverviewResponse)
async def get_vogelsang_overview():
    """Public API: Retrieve Vogelsang overview section data."""
    try:
        doc = await db["vogelsang_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return VogelsangOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return VogelsangOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return VogelsangOverviewResponse(
            success=True,
            data=VogelsangOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Vogelsang overview: {str(e)}")
        return VogelsangOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=VogelsangOverviewResponse)
@router.put("/overview/", response_model=VogelsangOverviewResponse)
async def update_vogelsang_overview(
    payload: VogelsangOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Vogelsang overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["vogelsang_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return VogelsangOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Vogelsang overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Vogelsang overview section: {str(e)}"
        )


# ==========================================
# VOGELSANG DETAILS ENDPOINTS
# ==========================================

@router.get("/details", response_model=VogelsangDetailsResponse)
@router.get("/details/", response_model=VogelsangDetailsResponse)
async def get_vogelsang_details():
    """Public API: Retrieve Vogelsang details section data."""
    try:
        doc = await db["vogelsang_page"].find_one({"section": "details"})
        if not doc or "data" not in doc:
            return VogelsangDetailsResponse(success=True, data=DEFAULT_DETAILS)

        details_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(details_data, dict):
            return VogelsangDetailsResponse(success=True, data=DEFAULT_DETAILS)

        return VogelsangDetailsResponse(
            success=True,
            data=VogelsangDetails(**details_data)
        )
    except Exception as e:
        print(f"Error fetching Vogelsang details: {str(e)}")
        return VogelsangDetailsResponse(success=True, data=DEFAULT_DETAILS)


@router.put("/details", response_model=VogelsangDetailsResponse)
@router.put("/details/", response_model=VogelsangDetailsResponse)
async def update_vogelsang_details(
    payload: VogelsangDetails,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Vogelsang details section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["vogelsang_page"].update_one(
            {"section": "details"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return VogelsangDetailsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Vogelsang details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Vogelsang details section: {str(e)}"
        )