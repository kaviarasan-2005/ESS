from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


class FlameGasBanner(BaseModel):
    title: str = Field(
        default="Flame & Gas Detectors",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Advanced Flame & Hazardous Gas Detection Solutions",
        description="Sub-heading or product line tagline"
    )
    bg_image_url: Optional[str] = Field(
        default="",
        description="Background image overlay URL"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_banner_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Flame & Gas Detectors"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class FlameGasBannerResponse(BaseModel):
    success: bool = True
    data: FlameGasBanner


class FlameGasOverviewImage(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for carousel slide")
    title: Optional[str] = Field(default="", description="Optional title or caption for the product image")
    image_url: str = Field(..., description="Product slide image URL")


class FlameGasOverview(BaseModel):
    paragraph_1: str = Field(
        default=(
            "Early and reliable detection of Flammable gas, Toxic gas, and flame events is fundamental "
            "to process safety in hazardous industrial environments. ESS Saudi supplies Flame and Gas "
            "detectors from leading international manufacturers, certified for use in Zone 1 and Zone 2 "
            "hazardous areas found across upstream, midstream, and downstream facilities."
        ),
        description="First paragraph description with blue left-accent line"
    )
    paragraph_2: Optional[str] = Field(
        default=(
            "Our range spans point and Open-Path gas detectors, Ultrasonic gas leak detectors, "
            "and UV/IR and Multi-Spectrum Flame Detectors, selected to match the specific hazard profile, "
            "layout, and safety-integrity requirements of each site."
        ),
        description="Second paragraph description"
    )
    carousel_images: List[FlameGasOverviewImage] = Field(
        default_factory=list,
        description="List of product image slides for the right-side interactive carousel"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "Early and reliable detection of Flammable gas, Toxic gas, and flame events is fundamental "
                    "to process safety in hazardous industrial environments. ESS Saudi supplies Flame and Gas "
                    "detectors from leading international manufacturers, certified for use in Zone 1 and Zone 2 "
                    "hazardous areas found across upstream, midstream, and downstream facilities."
                )
            if not values.get("paragraph_2"):
                values["paragraph_2"] = (
                    "Our range spans point and Open-Path gas detectors, Ultrasonic gas leak detectors, "
                    "and UV/IR and Multi-Spectrum Flame Detectors, selected to match the specific hazard profile, "
                    "layout, and safety-integrity requirements of each site."
                )
            if "carousel_images" not in values or not values["carousel_images"]:
                values["carousel_images"] = DEFAULT_FLAME_GAS_IMAGES
        return values


class FlameGasOverviewResponse(BaseModel):
    success: bool = True
    data: FlameGasOverview


# DEFAULT FALLBACK CAROUSEL SLIDES
DEFAULT_FLAME_GAS_IMAGES = [
    {
        "id": "slide_1",
        "title": "Flame Detector Model XP",
        "image_url": ""
    },
    {
        "id": "slide_2",
        "title": "Hazardous Gas Detector Sensor",
        "image_url": ""
    }
]

class FlameGasApplications(BaseModel):
    title: str = Field(
        default="Key Applications",
        description="Main section heading title"
    )
    applications_list: List[str] = Field(
        default_factory=list,
        description="List of key application bullet points"
    )
    industries_served: str = Field(
        default="Industries Served: Oil & Gas · Petrochemical · Power Generation · Utilities",
        description="Industries served summary text line"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_applications_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Key Applications"
            if "applications_list" not in values or not values["applications_list"]:
                values["applications_list"] = DEFAULT_FLAME_GAS_APPLICATIONS
            if not values.get("industries_served"):
                values["industries_served"] = "Industries Served: Oil & Gas · Petrochemical · Power Generation · Utilities"
        return values


class FlameGasApplicationsResponse(BaseModel):
    success: bool = True
    data: FlameGasApplications


# DEFAULT FALLBACK APPLICATIONS LIST
DEFAULT_FLAME_GAS_APPLICATIONS = [
    "Hydrocarbon and Toxic gas leak detection in process areas",
    "Flame detection for hazardous area and confined-space protection",
    "Perimeter and open-path gas monitoring for large tank farms and terminals",
    "Fire and Gas (F&G) system integration for SIL-rated safety loops",
    "Compressor station and pipeline facility protection"
]

class FlameGasCapabilities(BaseModel):
    # Section 1: Industries Served Pills
    industries_title: str = Field(
        default="Industries served",
        description="Industries section heading"
    )
    industries_list: List[str] = Field(
        default_factory=list,
        description="List of industry pill labels"
    )

    # Section 2: Why ESS Saudi
    why_title: str = Field(
        default="Why ESS Saudi",
        description="Why ESS Saudi section heading"
    )
    why_description: str = Field(
        default=(
            "ESS Saudi partners with manufacturers holding recognized international "
            "hazardous-area and safety certifications, supplying detectors suited to "
            "Saudi Arabia's regulatory and site-safety requirements, and offers engineering "
            "support for detector layout and F&G system integration."
        ),
        description="Why ESS Saudi description narrative text"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_capabilities_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("industries_title"):
                values["industries_title"] = "Industries served"
            if "industries_list" not in values or not values["industries_list"]:
                values["industries_list"] = DEFAULT_FLAME_GAS_INDUSTRIES
            if not values.get("why_title"):
                values["why_title"] = "Why ESS Saudi"
            if not values.get("why_description"):
                values["why_description"] = (
                    "ESS Saudi partners with manufacturers holding recognized international "
                    "hazardous-area and safety certifications, supplying detectors suited to "
                    "Saudi Arabia's regulatory and site-safety requirements, and offers engineering "
                    "support for detector layout and F&G system integration."
                )
        return values


class FlameGasCapabilitiesResponse(BaseModel):
    success: bool = True
    data: FlameGasCapabilities


# DEFAULT FALLBACK INDUSTRIES LIST
DEFAULT_FLAME_GAS_INDUSTRIES = [
    "Oil & Gas",
    "Petrochemical",
    "Power Generation",
    "Utilities"
]