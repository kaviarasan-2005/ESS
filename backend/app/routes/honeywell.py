from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.honeywell import (
    HoneywellBanner,
    HoneywellBannerResponse,
    HoneywellOverview,
    HoneywellOverviewResponse,
    HoneywellDetails,
    HoneywellDetailsResponse,
    DEFAULT_HONEYWELL_CARDS,
    DEFAULT_HONEYWELL_INDUSTRIES
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(prefix="/api/honeywell", tags=["Honeywell Automation Page"])

# DEFAULT FALLBACK DATA
DEFAULT_BANNER = HoneywellBanner(
    title="Honeywell Automation",
    subtitle="Advanced Industrial Control & Process Automation Solutions",
    bg_image_url=""
)

DEFAULT_OVERVIEW = HoneywellOverview(
    title="Honeywell Automation Solutions",
    paragraph_1=(
        "In complex process industries, operational excellence demands an automation partner with "
        "proven technology and deep domain expertise. ESS-ME is a certified provider of Honeywell "
        "Automation Solutions, delivering the integrated control and safety systems that define modern "
        "industrial operations. We empower refineries, petrochemical plants, and power generation facilities "
        "across the Middle East to achieve superior production reliability, enhanced safety, and seamless "
        "digital transformation with Honeywell's industry-leading technology."
    ),
    image_url=""
)

DEFAULT_DETAILS = HoneywellDetails(
    legacy_title="Honeywell's Legacy of Process Control Innovation",
    legacy_description=(
        "Honeywell Process Solutions sets the global standard for distributed control systems (DCS) "
        "and integrated safety. Our partnership provides you with direct access to technologies like "
        "the Experion PKS DCS and ControlEdge PLCs, platforms designed specifically for the rigor of "
        "continuous process industries. With decades of regional project experience, our engineers are "
        "adept at implementing these solutions to solve your most pressing challenges in optimization, "
        "compliance, and asset management."
    ),
    portfolio_title="Honeywell Automation Service Portfolio",
    portfolio_description=(
        "ESS-ME provides end-to-end services that span the entire automation lifecycle. "
        "From initial system architecture and deployment to ongoing optimization and support, "
        "our Honeywell-focused expertise ensures your control system is a strategic asset that drives "
        "continuous operational improvement and a rapid return on investment."
    ),
    cards=DEFAULT_HONEYWELL_CARDS,
    value_title="ESS-ME Value Addition",
    value_description=(
        "Our value extends beyond implementation. We offer strategic consulting for operational excellence, "
        "24/7 support contracts with local response, and specialized services for system health checks and "
        "cybersecurity hardening. We ensure your Honeywell automation system delivers peak performance, "
        "security, and reliability year after year."
    ),
    industries_title="Core Industries We Serve",
    industries=DEFAULT_HONEYWELL_INDUSTRIES
)


def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# HONEYWELL BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=HoneywellBannerResponse)
@router.get("/banner/", response_model=HoneywellBannerResponse)
async def get_honeywell_banner():
    """Public API: Retrieve Honeywell Automation banner section data."""
    try:
        doc = await db["honeywell_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return HoneywellBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return HoneywellBannerResponse(success=True, data=DEFAULT_BANNER)

        return HoneywellBannerResponse(
            success=True,
            data=HoneywellBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Honeywell banner: {str(e)}")
        return HoneywellBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=HoneywellBannerResponse)
@router.put("/banner/", response_model=HoneywellBannerResponse)
async def update_honeywell_banner(
    payload: HoneywellBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Honeywell Automation banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["honeywell_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return HoneywellBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Honeywell banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Honeywell banner section: {str(e)}"
        )


# ==========================================
# HONEYWELL OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=HoneywellOverviewResponse)
@router.get("/overview/", response_model=HoneywellOverviewResponse)
async def get_honeywell_overview():
    """Public API: Retrieve Honeywell Automation overview section data."""
    try:
        doc = await db["honeywell_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return HoneywellOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return HoneywellOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return HoneywellOverviewResponse(
            success=True,
            data=HoneywellOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Honeywell overview: {str(e)}")
        return HoneywellOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=HoneywellOverviewResponse)
@router.put("/overview/", response_model=HoneywellOverviewResponse)
async def update_honeywell_overview(
    payload: HoneywellOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Honeywell Automation overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["honeywell_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return HoneywellOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Honeywell overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Honeywell overview section: {str(e)}"
        )



# ==========================================
# HONEYWELL DETAILS ENDPOINTS
# ==========================================

@router.get("/details", response_model=HoneywellDetailsResponse)
@router.get("/details/", response_model=HoneywellDetailsResponse)
async def get_honeywell_details():
    """Public API: Retrieve Honeywell Automation details section data."""
    try:
        doc = await db["honeywell_page"].find_one({"section": "details"})
        if not doc or "data" not in doc:
            return HoneywellDetailsResponse(success=True, data=DEFAULT_DETAILS)

        details_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(details_data, dict):
            return HoneywellDetailsResponse(success=True, data=DEFAULT_DETAILS)

        return HoneywellDetailsResponse(
            success=True,
            data=HoneywellDetails(**details_data)
        )
    except Exception as e:
        print(f"Error fetching Honeywell details: {str(e)}")
        return HoneywellDetailsResponse(success=True, data=DEFAULT_DETAILS)


@router.put("/details", response_model=HoneywellDetailsResponse)
@router.put("/details/", response_model=HoneywellDetailsResponse)
async def update_honeywell_details(
    payload: HoneywellDetails,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Honeywell Automation details section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["honeywell_page"].update_one(
            {"section": "details"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return HoneywellDetailsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Honeywell details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Honeywell details section: {str(e)}"
        )