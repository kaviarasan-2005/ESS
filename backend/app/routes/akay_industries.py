from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.akay_industries import (
    AKAYBannerHeader,
    AKAYBannerHeaderResponse,
    AKAYOverview,
    AKAYOverviewResponse,
    AKAYDetailsContent,
    AKAYDetailsResponse,
    AKAYProductsSupport,
    AKAYProductsSupportResponse,
)
from app.utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/akay-industries", tags=["AKAY Industries Page"])

DEFAULT_BANNER = AKAYBannerHeader(
    title="AKAY Industries",
    subtitle="Centrifugal Pumps & Chemical Process Solutions",
    bg_image="",
    bg_image_url=""
)

DEFAULT_OVERVIEW = AKAYOverview(
    title="AKAY Industries Centrifugal Pumps",
    description=(
        "When your process depends on moving aggressive, high-purity, or "
        "temperature-sensitive fluids, you need a pump that combines robust "
        "engineering with precise performance. ESS-ME is the trusted supplier "
        "of AKAY Industries centrifugal pumps, delivering rugged reliability for "
        "the most challenging applications in the Middle East's chemical, "
        "petrochemical, and industrial sectors. We provide pumping solutions "
        "engineered to handle corrosive chemicals, cryogenic liquids, and "
        "high-temperature fluids with unwavering durability."
    ),
    image="",
    image_url=""
)

DEFAULT_DETAILS = AKAYDetailsContent(
    environment_title="Reliable in Harsh Process Environments",
    environment_description=(
        "AKAY Industries brings a passion for manufacturing high-quality centrifugal pumps "
        "that meet rigorous international standards. Their pumps are renowned for superior hydraulics, "
        "robust mechanical seals, and construction from a wide range of corrosion-resistant materials. "
        "This focus on quality and durability ensures maximum uptime, reduced lifecycle costs, "
        "and dependable performance in demanding climates across the GCC region."
    ),
    portfolio_title="Our AKAY Pumps Portfolio",
    portfolio_description=(
        "We offer a comprehensive range of AKAY pumps, each designed to excel in specific fluid handling duties. "
        "Our technical team provides expert selection support to match the pump's material of construction, "
        "seal technology, and hydraulic performance to your exact process requirements, ensuring optimal efficiency and service life."
    ),
    cards=[
        {
            "id": "card-1",
            "title": "Chemical and Process Pumps",
            "description": (
                "AKAY pumps allow you to handle corrosive and abrasive fluids with absolute confidence. "
                "Our AKAY chemical process pumps are available in a variety of metallurgies, including stainless steel (SS304/SS316), "
                "Hastelloy, and titanium, as well as non-metallic options.\n\n"
                "They are engineered for continuous duty in transferring acids, solvents, caustics, and hydrocarbons, "
                "providing a leak-free and reliable solution for your most aggressive applications."
            )
        },
        {
            "id": "card-2",
            "title": "Cryogenic Pumps",
            "description": (
                "Maintain efficiency and safety in extreme cold conditions. AKAY's cryogenic pumps are specifically designed "
                "for handling liquefied gases like LNG, liquid nitrogen, and liquid oxygen at temperatures as low as -196°C.\n\n"
                "These pumps ensure safe, vapor-free transfer critical for gas processing, storage, and transportation infrastructure, "
                "preserving product integrity and preventing energy loss."
            )
        }
    ],
    advantage_title="The ESS-ME Advantage: Your Fluid Handling Partner",
    advantage_description="We go beyond supply to ensure your pumping success. Our services include:",
    advantage_bullets=[
        {"id": "b-1", "label": "Technical Selection", "detail": "Guiding you to the perfect pump model and seal for your fluid and duty point."},
        {"id": "b-2", "label": "Local Spare Parts Support", "detail": "Ensuring rapid availability of critical components to minimize downtime."},
        {"id": "b-3", "label": "After-Sales Service", "detail": "Providing installation support, maintenance, and troubleshooting to protect your investment."}
    ],
    industries_title="Industries & Applications",
    industries_bullets=[
        {"id": "i-1", "label": "Chemical & Petrochemical", "detail": "Acid transfer, solvent circulation, reactor feed."},
        {"id": "i-2", "label": "Oil & Gas", "detail": "Produced water, glycol circulation, amine service."},
        {"id": "i-3", "label": "Industrial Gases", "detail": "LNG transfer, liquid nitrogen pumping."},
        {"id": "i-4", "label": "General Industry", "detail": "Cooling water circulation, boiler feed, filtration systems."}
    ]
)

DEFAULT_PRODUCTS_SUPPORT = AKAYProductsSupport(
    heading="AKAY Products & Comprehensive Technical Support",
    subheading="Delivering robust fluid handling systems and lifecycle field service.",
    products=[],
    support_features=[]
)


def clean_doc_data(data: dict) -> dict:
    """Utility to strip internal MongoDB keys."""
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# AKAY BANNER / HERO ENDPOINTS
# ==========================================

@router.get("/banner", response_model=AKAYBannerHeaderResponse)
@router.get("/banner/", response_model=AKAYBannerHeaderResponse)
async def get_akay_banner():
    """Public API: Retrieve AKAY Industries banner data."""
    try:
        doc = await db["akay_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return AKAYBannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return AKAYBannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        return AKAYBannerHeaderResponse(
            success=True,
            data=AKAYBannerHeader(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching AKAY banner: {str(e)}")
        return AKAYBannerHeaderResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=AKAYBannerHeaderResponse)
@router.put("/banner/", response_model=AKAYBannerHeaderResponse)
async def update_akay_banner(
    payload: AKAYBannerHeader,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update AKAY Industries banner data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["akay_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return AKAYBannerHeaderResponse(success=True, data=payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update AKAY banner: {str(e)}"
        )


# ==========================================
# AKAY OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=AKAYOverviewResponse)
@router.get("/overview/", response_model=AKAYOverviewResponse)
async def get_akay_overview():
    """Public API: Retrieve AKAY Industries Overview section data."""
    try:
        doc = await db["akay_page"].find_one({"section": "overview"})
        
        if not doc or "data" not in doc or not isinstance(doc["data"], dict):
            return AKAYOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))

        # Ensure image / image_url keys are synchronized
        img = overview_data.get("image_url") or overview_data.get("image") or ""
        overview_data["image"] = img
        overview_data["image_url"] = img

        return AKAYOverviewResponse(
            success=True,
            data=AKAYOverview(**overview_data)
        )
    except Exception as e:
        print(f"Error reading AKAY Overview from DB: {str(e)}")
        return AKAYOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=AKAYOverviewResponse)
@router.put("/overview/", response_model=AKAYOverviewResponse)
async def update_akay_overview(
    payload: AKAYOverview,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update AKAY Industries Overview section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)

        # Synchronize image fields
        img = data_dict.get("image_url") or data_dict.get("image") or ""
        data_dict["image"] = img
        data_dict["image_url"] = img

        now = datetime.now(timezone.utc)

        await db["akay_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return AKAYOverviewResponse(
            success=True,
            data=AKAYOverview(**data_dict)
        )
    except Exception as e:
        print(f"Error updating AKAY overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update AKAY overview: {str(e)}"
        )


# ==========================================
# AKAY DETAILS & PORTFOLIO ENDPOINTS (ADDED)
# ==========================================

@router.get("/details", response_model=AKAYDetailsResponse)
@router.get("/details/", response_model=AKAYDetailsResponse)
async def get_akay_details():
    """Public API: Retrieve AKAY Industries full portfolio details & application list."""
    try:
        doc = await db["akay_page"].find_one({"section": "details"})
        if not doc or "data" not in doc or not isinstance(doc["data"], dict):
            return AKAYDetailsResponse(success=True, data=DEFAULT_DETAILS)

        details_data = clean_doc_data(doc.get("data", {}))
        return AKAYDetailsResponse(
            success=True,
            data=AKAYDetailsContent(**details_data)
        )
    except Exception as e:
        print(f"Error reading AKAY Details from DB: {str(e)}")
        return AKAYDetailsResponse(success=True, data=DEFAULT_DETAILS)


@router.put("/details", response_model=AKAYDetailsResponse)
@router.put("/details/", response_model=AKAYDetailsResponse)
async def update_akay_details(
    payload: AKAYDetailsContent,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update AKAY Industries portfolio, cards, bullets & application section."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["akay_page"].update_one(
            {"section": "details"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return AKAYDetailsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating AKAY details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update AKAY details: {str(e)}"
        )


# ==========================================
# AKAY PRODUCTS & SUPPORT ENDPOINTS
# ==========================================

@router.get("/products-support", response_model=AKAYProductsSupportResponse)
@router.get("/products-support/", response_model=AKAYProductsSupportResponse)
async def get_akay_products_support():
    """Public API: Retrieve AKAY Industries Products & Support section data."""
    try:
        doc = await db["akay_page"].find_one({"section": "products_support"})
        if not doc or "data" not in doc or not isinstance(doc["data"], dict):
            return AKAYProductsSupportResponse(success=True, data=DEFAULT_PRODUCTS_SUPPORT)

        ps_data = clean_doc_data(doc.get("data", {}))
        return AKAYProductsSupportResponse(
            success=True,
            data=AKAYProductsSupport(**ps_data)
        )
    except Exception as e:
        print(f"Error reading AKAY Products & Support from DB: {str(e)}")
        return AKAYProductsSupportResponse(success=True, data=DEFAULT_PRODUCTS_SUPPORT)


@router.put("/products-support", response_model=AKAYProductsSupportResponse)
@router.put("/products-support/", response_model=AKAYProductsSupportResponse)
async def update_akay_products_support(
    payload: AKAYProductsSupport,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update AKAY Industries Products & Support section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["akay_page"].update_one(
            {"section": "products_support"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return AKAYProductsSupportResponse(success=True, data=payload)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update AKAY products & support: {str(e)}"
        )