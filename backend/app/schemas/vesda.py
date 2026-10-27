from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


class VESDABanner(BaseModel):
    title: str = Field(
        default="VESDA® Aspirating Smoke Detection & Fire Alarm Devices",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Very Early Warning Aspirating Smoke Detection & Advanced Fire Alarm Systems",
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
                values["title"] = "VESDA® Aspirating Smoke Detection & Fire Alarm Devices"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class VESDABannerResponse(BaseModel):
    success: bool = True
    data: VESDABanner

class VESDAOverviewImage(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for carousel slide")
    title: Optional[str] = Field(default="", description="Optional title or caption for the product image")
    image_url: str = Field(..., description="Product slide image URL")


class VESDAOverview(BaseModel):
    paragraph_1: str = Field(
        default=(
            "For control rooms, electrical rooms, cable galleries, and other high-value or hard-to-access spaces, "
            "early smoke detection can be the difference between a minor incident and significant downtime. "
            "ESS Saudi supplies aspirating smoke detection (ASD) systems and conventional fire alarm devices "
            "from internationally recognized manufacturers, providing very-early-warning fire detection well ahead of visible smoke or flame."
        ),
        description="First paragraph description with blue left-accent line"
    )
    paragraph_2: Optional[str] = Field(
        default=(
            "Our offering includes aspirating smoke detectors, addressable fire alarm panels, detectors, call points, "
            "and notification devices, engineered to integrate with plant-wide fire and gas control systems."
        ),
        description="Second paragraph description"
    )
    carousel_images: List[VESDAOverviewImage] = Field(
        default_factory=list,
        description="List of product image slides for the right-side interactive carousel"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "For control rooms, electrical rooms, cable galleries, and other high-value or hard-to-access spaces, "
                    "early smoke detection can be the difference between a minor incident and significant downtime. "
                    "ESS Saudi supplies aspirating smoke detection (ASD) systems and conventional fire alarm devices "
                    "from internationally recognized manufacturers, providing very-early-warning fire detection well ahead of visible smoke or flame."
                )
            if not values.get("paragraph_2"):
                values["paragraph_2"] = (
                    "Our offering includes aspirating smoke detectors, addressable fire alarm panels, detectors, call points, "
                    "and notification devices, engineered to integrate with plant-wide fire and gas control systems."
                )
            if "carousel_images" not in values or not values["carousel_images"]:
                values["carousel_images"] = DEFAULT_VESDA_IMAGES
        return values


class VESDAOverviewResponse(BaseModel):
    success: bool = True
    data: VESDAOverview


# DEFAULT FALLBACK CAROUSEL SLIDES
DEFAULT_VESDA_IMAGES = [
    {
        "id": "slide_1",
        "title": "VESDA Aspirating Smoke Detector Unit",
        "image_url": ""
    },
    {
        "id": "slide_2",
        "title": "Addressable Fire Alarm Detector",
        "image_url": ""
    }
]


class VESDAApplications(BaseModel):
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
                values["applications_list"] = DEFAULT_VESDA_APPLICATIONS
        return values


class VESDAApplicationsResponse(BaseModel):
    success: bool = True
    data: VESDAApplications


# DEFAULT FALLBACK APPLICATIONS LIST
DEFAULT_VESDA_APPLICATIONS = [
    "Control room and switchgear/electrical room fire protection",
    "Cable gallery and cable tray early-warning detection",
    "Data and telecom room smoke monitoring",
    "Clean agent suppression system activation triggers",
    "Building and facility-wide fire alarm coverage"
]

class VESDACapabilities(BaseModel):
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
            "ESS Saudi supplies aspirating smoke detection and fire alarm equipment "
            "from established international manufacturers, and offers local application "
            "engineering support to design detection coverage for critical and high-value spaces."
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
                values["industries_list"] = DEFAULT_VESDA_INDUSTRIES
            if not values.get("why_title"):
                values["why_title"] = "Why ESS Saudi"
            if not values.get("why_description"):
                values["why_description"] = (
                    "ESS Saudi supplies aspirating smoke detection and fire alarm equipment "
                    "from established international manufacturers, and offers local application "
                    "engineering support to design detection coverage for critical and high-value spaces."
                )
        return values


class VESDACapabilitiesResponse(BaseModel):
    success: bool = True
    data: VESDACapabilities


# DEFAULT FALLBACK INDUSTRIES LIST
DEFAULT_VESDA_INDUSTRIES = [
    "Oil & Gas",
    "Petrochemical",
    "Power Generation",
    "Datacenters"
]