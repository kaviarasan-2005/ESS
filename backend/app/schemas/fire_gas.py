from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


class FireGasBanner(BaseModel):
    title: str = Field(
        default="Fire & Gas Control Systems",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Integrated Safety & Hazard Detection Control Solutions",
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
                values["title"] = "Fire & Gas Control Systems"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class FireGasBannerResponse(BaseModel):
    success: bool = True
    data: FireGasBanner


class FireGasOverviewImage(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for carousel slide")
    title: Optional[str] = Field(default="", description="Optional title or caption for the product image")
    image_url: str = Field(..., description="Product slide image URL")


class FireGasOverview(BaseModel):
    paragraph_1: str = Field(
        default=(
            "A well-engineered fire and gas (F&G) control system ties detection, alarm, and shutdown logic together "
            "into a single, reliable safety layer. ESS Saudi supplies fire and gas control systems, including SIL-rated "
            "control panels, from internationally reputed manufacturers, engineered for the hazardous-area and safety-integrity "
            "requirements of oil & gas, petrochemical, and power facilities."
        ),
        description="First paragraph description with blue left-accent line"
    )
    paragraph_2: Optional[str] = Field(
        default=(
            "Our scope covers F&G logic solver panels, SIL-rated control panels, integration of flame, gas, and smoke "
            "detection field devices, and interfacing with plant emergency shutdown (ESD) and mass notification systems."
        ),
        description="Second paragraph description"
    )
    carousel_images: List[FireGasOverviewImage] = Field(
        default_factory=list,
        description="List of product image slides for the right-side interactive carousel"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "A well-engineered fire and gas (F&G) control system ties detection, alarm, and shutdown logic together "
                    "into a single, reliable safety layer. ESS Saudi supplies fire and gas control systems, including SIL-rated "
                    "control panels, from internationally reputed manufacturers, engineered for the hazardous-area and safety-integrity "
                    "requirements of oil & gas, petrochemical, and power facilities."
                )
            if not values.get("paragraph_2"):
                values["paragraph_2"] = (
                    "Our scope covers F&G logic solver panels, SIL-rated control panels, integration of flame, gas, and smoke "
                    "detection field devices, and interfacing with plant emergency shutdown (ESD) and mass notification systems."
                )
            if "carousel_images" not in values or not values["carousel_images"]:
                values["carousel_images"] = DEFAULT_FIRE_GAS_IMAGES
        return values


class FireGasOverviewResponse(BaseModel):
    success: bool = True
    data: FireGasOverview


# DEFAULT FALLBACK CAROUSEL SLIDES
DEFAULT_FIRE_GAS_IMAGES = [
    {
        "id": "slide_1",
        "title": "F&G Logic Solver Panel Enclosure",
        "image_url": ""
    },
    {
        "id": "slide_2",
        "title": "SIL-Rated Detection Control Rack",
        "image_url": ""
    }
]

class FireGasApplications(BaseModel):
    title: str = Field(
        default="Key Applications",
        description="Main section heading title"
    )
    applications_list: List[str] = Field(
        default_factory=list,
        description="List of key application bullet points"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_applications_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Key Applications"
            if "applications_list" not in values or not values["applications_list"]:
                values["applications_list"] = DEFAULT_FIRE_GAS_APPLICATIONS
        return values


class FireGasApplicationsResponse(BaseModel):
    success: bool = True
    data: FireGasApplications


# DEFAULT FALLBACK APPLICATIONS LIST
DEFAULT_FIRE_GAS_APPLICATIONS = [
    "Centralized fire and gas detection and alarm logic",
    "SIL-rated F&G control panels for hazardous process areas",
    "Integration with emergency shutdown (ESD) and mass notification systems",
    "Plant-wide fire and gas system upgrades and migrations",
    "New-build and brownfield F&G system design and commissioning"
]

class FireGasCapabilities(BaseModel):
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
            "ESS Saudi supplies fire and gas control systems and SIL-rated panels from "
            "internationally certified manufacturers, and offers local engineering, panel integration, "
            "and commissioning support aligned with site safety-case requirements."
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
                values["industries_list"] = DEFAULT_FIRE_GAS_INDUSTRIES
            if not values.get("why_title"):
                values["why_title"] = "Why ESS Saudi"
            if not values.get("why_description"):
                values["why_description"] = (
                    "ESS Saudi supplies fire and gas control systems and SIL-rated panels from "
                    "internationally certified manufacturers, and offers local engineering, panel integration, "
                    "and commissioning support aligned with site safety-case requirements."
                )
        return values


class FireGasCapabilitiesResponse(BaseModel):
    success: bool = True
    data: FireGasCapabilities


# DEFAULT FALLBACK INDUSTRIES LIST
DEFAULT_FIRE_GAS_INDUSTRIES = [
    "Oil & Gas",
    "Petrochemical",
    "Power Generation",
    "Utilities"
]