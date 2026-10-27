from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.michell import (
    MichellBannerHeader,
    MichellBannerHeaderResponse,
    MichellOverview,
    MichellOverviewResponse,
    MichellDetails,
    MichellDetailsResponse,
    MichellCapabilities,
    MichellCapabilitiesResponse,
    DEFAULT_MICHELL_INDUSTRIES,
    MichellCTA,
    MichellCTAResponse,
)
from app.dependencies.auth import get_current_admin_user
from app.schemas.auth import TokenData

router = APIRouter(prefix="/api/michell", tags=["Michell Instruments Brand Page"])

DEFAULT_BANNER = MichellBannerHeader(
    title="Moisture & Dew Point Measurement Instruments",
    subtitle="Precision Moisture & Trace Gas Analysis Solutions",
    bg_image="",
    bg_image_url=""
)

DEFAULT_OVERVIEW = MichellOverview(
    paragraph_1=(
        "From optimizing industrial gas processing to ensuring precise dew point measurement, "
        "accurate moisture data is the key to operational excellence. ESS-ME is the authorized "
        "Middle Eastern distributor for Michell Instruments, providing maintenance teams, facility managers, "
        "and process engineers with the precise, rugged, and reliable trace moisture analyzers they need."
    ),
    paragraph_2=(
        "We supply a comprehensive range of chilled mirror hygrometers, impedance moisture transmitters, "
        "and hydrocarbon dew point analyzers trusted across the GCC's oil & gas, power generation, and "
        "industrial manufacturing sectors."
    ),
    main_image_url="",
    images=[]
)

DEFAULT_DETAILS_FEATURES = [
    "Multi Phase Operation (MPO): Continuous measurement and stable, repeatable readings – even during major process disturbances such as gas entrainment and solids",
    "Parameterisation, monitoring and verification via Bluetooth®",
    "Wafer design: DN10...150 / ⅜...6\"; max. PN40 / ASME Cl 300",
    "Advanced OPTICHECK technology built-in diagnostics and NAMUR NE 107 status indication via colour-coded backlit display"
]

DEFAULT_DETAILS = MichellDetails(
    section_title="Product Features & Specifications",
    features=DEFAULT_DETAILS_FEATURES
)
DEFAULT_CAPABILITIES = MichellCapabilities(
    industries_title="Industries served",
    industries_list=DEFAULT_MICHELL_INDUSTRIES,
    why_title="Why ESS Saudi",
    why_description=(
        "As a channel partner for globally recognized instrumentation manufacturers, "
        "ESS Saudi supplies certified, application-matched moisture and dew point analyzers, "
        "and offers local technical support, calibration guidance, and after-sales service "
        "across the Kingdom."
    )
)

DEFAULT_CTA = MichellCTA(
    title="Need the right analyzer for your application?",
    subtitle="Tell us your gas, pressure, and measurement range. Our team will match an analyzer to your plant.",
    button_text="Contact Us",
    button_link="/contact"
)



def clean_doc_data(data: dict) -> dict:
    """Utility to strip internal MongoDB keys."""
    if isinstance(data, dict):
        data.pop("_id", None)
    return data


# ==========================================
# MICHELL BANNER ENDPOINTS
# ==========================================

@router.get("/banner", response_model=MichellBannerHeaderResponse)
@router.get("/banner/", response_model=MichellBannerHeaderResponse)
async def get_michell_banner():
    """Public API: Retrieve Michell Instruments banner section data."""
    try:
        doc = await db["michell_page"].find_one({"section": "banner"})
        if not doc or "data" not in doc:
            return MichellBannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        banner_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(banner_data, dict):
            return MichellBannerHeaderResponse(success=True, data=DEFAULT_BANNER)

        return MichellBannerHeaderResponse(
            success=True,
            data=MichellBannerHeader(**banner_data)
        )
    except Exception as e:
        print(f"Error fetching Michell banner: {str(e)}")
        return MichellBannerHeaderResponse(success=True, data=DEFAULT_BANNER)


@router.put("/banner", response_model=MichellBannerHeaderResponse)
@router.put("/banner/", response_model=MichellBannerHeaderResponse)
async def update_michell_banner(
    payload: MichellBannerHeader,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Michell Instruments banner section data."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["michell_page"].update_one(
            {"section": "banner"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return MichellBannerHeaderResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Michell banner: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Michell banner: {str(e)}"
        )


# ==========================================
# MICHELL OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=MichellOverviewResponse)
@router.get("/overview/", response_model=MichellOverviewResponse)
async def get_michell_overview():
    """Public API: Retrieve Michell Instruments overview section data."""
    try:
        doc = await db["michell_page"].find_one({"section": "overview"})
        if not doc or "data" not in doc:
            return MichellOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        overview_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(overview_data, dict):
            return MichellOverviewResponse(success=True, data=DEFAULT_OVERVIEW)

        return MichellOverviewResponse(
            success=True,
            data=MichellOverview.model_validate(overview_data)
        )
    except Exception as e:
        print(f"Error fetching Michell overview: {str(e)}")
        return MichellOverviewResponse(success=True, data=DEFAULT_OVERVIEW)


@router.put("/overview", response_model=MichellOverviewResponse)
@router.put("/overview/", response_model=MichellOverviewResponse)
async def update_michell_overview(
    payload: MichellOverview,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Michell Instruments overview section content."""
    try:
        data_dict = payload.model_dump(mode="json")
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["michell_page"].update_one(
            {"section": "overview"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return MichellOverviewResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Michell overview: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Michell overview section: {str(e)}"
        )


# ==========================================
# MICHELL DETAILS / FEATURES ENDPOINTS
# ==========================================

@router.get("/details", response_model=MichellDetailsResponse)
@router.get("/details/", response_model=MichellDetailsResponse)
async def get_michell_details():
    """Public API: Retrieve Michell Instruments details/features section data."""
    try:
        doc = await db["michell_page"].find_one({"section": "details"})
        if not doc or "data" not in doc:
            return MichellDetailsResponse(success=True, data=DEFAULT_DETAILS)

        details_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(details_data, dict):
            return MichellDetailsResponse(success=True, data=DEFAULT_DETAILS)

        return MichellDetailsResponse(
            success=True,
            data=MichellDetails(**details_data)
        )
    except Exception as e:
        print(f"Error fetching Michell details: {str(e)}")
        return MichellDetailsResponse(success=True, data=DEFAULT_DETAILS)


@router.put("/details", response_model=MichellDetailsResponse)
@router.put("/details/", response_model=MichellDetailsResponse)
async def update_michell_details(
    payload: MichellDetails,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Michell Instruments details/features section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["michell_page"].update_one(
            {"section": "details"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return MichellDetailsResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Michell details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Michell details section: {str(e)}"
        )


# ==========================================
# MICHELL CAPABILITIES ENDPOINTS
# ==========================================

@router.get("/capabilities", response_model=MichellCapabilitiesResponse)
@router.get("/capabilities/", response_model=MichellCapabilitiesResponse)
async def get_michell_capabilities():
    """Public API: Retrieve Michell Instruments capabilities & industries section data."""
    try:
        doc = await db["michell_page"].find_one({"section": "capabilities"})
        if not doc or "data" not in doc:
            return MichellCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        capabilities_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(capabilities_data, dict):
            return MichellCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)

        return MichellCapabilitiesResponse(
            success=True,
            data=MichellCapabilities(**capabilities_data)
        )
    except Exception as e:
        print(f"Error fetching Michell capabilities: {str(e)}")
        return MichellCapabilitiesResponse(success=True, data=DEFAULT_CAPABILITIES)


@router.put("/capabilities", response_model=MichellCapabilitiesResponse)
@router.put("/capabilities/", response_model=MichellCapabilitiesResponse)
async def update_michell_capabilities(
    payload: MichellCapabilities,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Michell Instruments capabilities & industries section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["michell_page"].update_one(
            {"section": "capabilities"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return MichellCapabilitiesResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Michell capabilities: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Michell capabilities section: {str(e)}"
        )

# ==========================================
# MICHELL CTA ENDPOINTS
# ==========================================

@router.get("/cta", response_model=MichellCTAResponse)
@router.get("/cta/", response_model=MichellCTAResponse)
async def get_michell_cta():
    """Public API: Retrieve Michell Instruments call-to-action section data."""
    try:
        doc = await db["michell_page"].find_one({"section": "cta"})
        if not doc or "data" not in doc:
            return MichellCTAResponse(success=True, data=DEFAULT_CTA)

        cta_data = clean_doc_data(doc.get("data", {}))
        if not isinstance(cta_data, dict):
            return MichellCTAResponse(success=True, data=DEFAULT_CTA)

        return MichellCTAResponse(
            success=True,
            data=MichellCTA(**cta_data)
        )
    except Exception as e:
        print(f"Error fetching Michell CTA: {str(e)}")
        return MichellCTAResponse(success=True, data=DEFAULT_CTA)


@router.put("/cta", response_model=MichellCTAResponse)
@router.put("/cta/", response_model=MichellCTAResponse)
async def update_michell_cta(
    payload: MichellCTA,
    current_admin: TokenData = Depends(get_current_admin_user)
):
    """Admin API: Update Michell Instruments call-to-action section content."""
    try:
        data_dict = payload.model_dump()
        clean_doc_data(data_dict)
        now = datetime.now(timezone.utc)

        await db["michell_page"].update_one(
            {"section": "cta"},
            {
                "$set": {
                    "data": data_dict,
                    "updated_at": now
                }
            },
            upsert=True
        )

        return MichellCTAResponse(success=True, data=payload)
    except Exception as e:
        print(f"Error updating Michell CTA: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Michell CTA section: {str(e)}"
        )