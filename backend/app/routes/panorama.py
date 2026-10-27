from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.panorama import (
    PanoramaBanner,
    PanoramaBannerResponse,
    PanoramaOverview,
    PanoramaOverviewResponse,
    PanoramaDetails,
    PanoramaDetailsResponse,
    DEFAULT_PANORAMA_CARDS,
    DEFAULT_PANORAMA_APPLICATIONS
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(
    prefix="/api/panorama",
    tags=["Panorama System Integrator Page"]
)

DEFAULT_BANNER = PanoramaBanner(
    title="Panorama System Integrator",
    subtitle="SCADA, Industrial Automation & Process Control Solutions",
    bg_image_url=""
)


DEFAULT_BANNER = PanoramaBanner(
    title="Panorama System Integrator",
    subtitle="SCADA, Industrial Automation & Process Control Solutions",
    bg_image_url=""
)

DEFAULT_OVERVIEW = PanoramaOverview(
    title="Codra Panorama SCADA System Integration",
    paragraph_1=(
        "In today's industrial landscape, seamless visibility and control are non-negotiable. "
        "ESS-ME is a certified system integrator for Codra's Panorama SCADA, delivering powerful, "
        "scalable, and intuitive supervisory control solutions across the Middle East. We specialize "
        "in transforming complex operational data into actionable intelligence, providing you with "
        "a unified view of your entire enterprise, from a single pump station to a plant-wide network, "
        "ensuring informed decision-making and enhanced operational efficiency."
    ),
    image_url=""
)


DEFAULT_DETAILS = PanoramaDetails(
    visibility_title="Unlock Operational Visibility with Panorama SCADA",
    visibility_description=(
        "Panorama SCADA is a flexible, robust, and feature-rich platform renowned for its powerful HMI, "
        "data historization, and alarm management capabilities. Our certified expertise in Panorama allows "
        "us to build tailored solutions that are not only powerful but also intuitive for operators. We leverage "
        "Panorama's native web-client technology and open architecture to deliver future-proof systems that provide "
        "real-time insight, improve response times, and drive productivity for utilities and industries throughout the GCC."
    ),
    services_title="Panorama SCADA Integration Services",
    services_description=(
        "We provide comprehensive Panorama SCADA services, from initial concept and custom development to "
        "lifecycle support and system expansion. Our approach ensures your SCADA system is a strategic asset, "
        "designed to grow with your operational needs and technological advancements."
    ),
    cards=DEFAULT_PANORAMA_CARDS,
    advantage_title="ESS-ME Advantage in SCADA Solutions",
    advantage_description=(
        "Our partnership with Codra ensures we are at the forefront of Panorama's capabilities. We complement "
        "this with our deep understanding of regional infrastructure, offering local 24x7 support, cybersecurity "
        "hardening for industrial networks, and training programs to empower your team to leverage the full potential "
        "of your SCADA investment."
    ),
    applications_title="Industrial Applications",
    applications_list=DEFAULT_PANORAMA_APPLICATIONS
)

def clean_doc_data(data: dict) -> dict:
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# PANORAMA BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=PanoramaBannerResponse)
@router.get("/banner/", response_model=PanoramaBannerResponse)
async def get_panorama_banner():
    """Public API: Retrieve Panorama System Integrator banner section data."""
    try:
        doc = await db["panorama_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return PanoramaBannerResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return PanoramaBannerResponse(success=True, data=DEFAULT_BANNER)

        return PanoramaBannerResponse(
            success=True,
            data=PanoramaBanner(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Panorama banner: {str(e)}")
        return PanoramaBannerResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=PanoramaBannerResponse)
@router.put("/banner/", response_model=PanoramaBannerResponse)
async def update_panorama_banner(
    payload: PanoramaBanner,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Panorama System Integrator banner section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["panorama_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return PanoramaBannerResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Panorama banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Panorama banner section: {str(e)}"
        )


# ==========================================
# PANORAMA OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=PanoramaOverviewResponse)
@router.get("/overview/", response_model=PanoramaOverviewResponse)
async def get_panorama_overview():
    """Public API: Retrieve Panorama overview section data."""
    try:
        doc = await db["panorama_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return PanoramaOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return PanoramaOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return PanoramaOverviewResponse(
            success=True,
            data=PanoramaOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error fetching Panorama overview: {str(e)}")
        return PanoramaOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=PanoramaOverviewResponse)
@router.put("/overview/", response_model=PanoramaOverviewResponse)
async def update_panorama_overview(
    payload: PanoramaOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Panorama overview section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["panorama_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return PanoramaOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Panorama overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Panorama overview section: {str(e)}"
        )

# ==========================================
# PANORAMA DETAILS ENDPOINTS
# ==========================================

@router.get("/details", response_model=PanoramaDetailsResponse)
@router.get("/details/", response_model=PanoramaDetailsResponse)
async def get_panorama_details():
    """Public API: Retrieve Panorama details section data."""
    try:
        doc = await db["panorama_page"].find_one({"section": "details"})
        if not doc or "data" not in doc:
            return PanoramaDetailsResponse(success=True, data=DEFAULT_DETAILS)

        details_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(details_data, dict):
            return PanoramaDetailsResponse(success=True, data=DEFAULT_DETAILS)

        return PanoramaDetailsResponse(
            success=True,
            data=PanoramaDetails(**details_data)
        )
    except Exception as e:
        print(f"Error fetching Panorama details: {str(e)}")
        return PanoramaDetailsResponse(success=True, data=DEFAULT_DETAILS)


@router.put("/details", response_model=PanoramaDetailsResponse)
@router.put("/details/", response_model=PanoramaDetailsResponse)
async def update_panorama_details(
    payload: PanoramaDetails,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Panorama details section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["panorama_page"].update_one(
            {"section": "details"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return PanoramaDetailsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Panorama details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Panorama details section: {str(e)}"
        )

