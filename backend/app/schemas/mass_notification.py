from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


class MassNotificationBanner(BaseModel):
    title: str = Field(
        default="Mass Notification Systems",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Integrated Emergency Alert & Alarm Communication Solutions",
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
                values["title"] = "Mass Notification Systems"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class MassNotificationBannerResponse(BaseModel):
    success: bool = True
    data: MassNotificationBanner


class MassNotificationOverviewImage(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for carousel slide")
    title: Optional[str] = Field(default="", description="Optional title or caption for the product image")
    image_url: str = Field(..., description="Product slide image URL")


class MassNotificationOverview(BaseModel):
    paragraph_1: str = Field(
        default=(
            "In an emergency, personnel across a large industrial site need to be reliably alerted and given clear "
            "instructions within seconds. ESS Saudi supplies mass notification systems, including public address and "
            "siren systems, from internationally reputed manufacturers, engineered to provide plant-wide audible and "
            "voice alerting in high-noise and hazardous industrial environments."
        ),
        description="First paragraph description with blue left-accent line"
    )
    paragraph_2: Optional[str] = Field(
        default=(
            "Our scope covers electronic sirens, public address (PA) and voice alarm systems, and integration with "
            "fire and gas control systems for automated emergency notification triggering."
        ),
        description="Second paragraph description"
    )
    carousel_images: List[MassNotificationOverviewImage] = Field(
        default_factory=list,
        description="List of product image slides for the right-side interactive carousel"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "In an emergency, personnel across a large industrial site need to be reliably alerted and given clear "
                    "instructions within seconds. ESS Saudi supplies mass notification systems, including public address and "
                    "siren systems, from internationally reputed manufacturers, engineered to provide plant-wide audible and "
                    "voice alerting in high-noise and hazardous industrial environments."
                )
            if not values.get("paragraph_2"):
                values["paragraph_2"] = (
                    "Our scope covers electronic sirens, public address (PA) and voice alarm systems, and integration with "
                    "fire and gas control systems for automated emergency notification triggering."
                )
            if "carousel_images" not in values or not values["carousel_images"]:
                values["carousel_images"] = DEFAULT_MASS_NOTIFICATION_IMAGES
        return values


class MassNotificationOverviewResponse(BaseModel):
    success: bool = True
    data: MassNotificationOverview


# DEFAULT FALLBACK CAROUSEL SLIDES
DEFAULT_MASS_NOTIFICATION_IMAGES = [
    {
        "id": "slide_1",
        "title": "Industrial Electronic Siren Stack",
        "image_url": ""
    },
    {
        "id": "slide_2",
        "title": "Public Address & Voice Alarm Rack",
        "image_url": ""
    }
]

class MassNotificationApplications(BaseModel):
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
                values["applications_list"] = DEFAULT_MASS_NOTIFICATION_APPLICATIONS
        return values


class MassNotificationApplicationsResponse(BaseModel):
    success: bool = True
    data: MassNotificationApplications


# DEFAULT FALLBACK APPLICATIONS LIST
DEFAULT_MASS_NOTIFICATION_APPLICATIONS = [
    "Plant-wide emergency alerting and evacuation notification",
    "Integration with fire & gas and ESD systems for automated alarm triggering",
    "Public address and voice instruction systems for large facilities",
    "Hazardous-area and offshore-rated siren and notification devices",
    "Perimeter and community-alerting siren systems"
]


class MassNotificationCapabilities(BaseModel):
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
            "ESS Saudi supplies mass notification systems and sirens from "
            "internationally certified manufacturers, and offers local system design "
            "and integration support to connect notification systems with plant safety systems."
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
                values["industries_list"] = DEFAULT_MASS_NOTIFICATION_INDUSTRIES
            if not values.get("why_title"):
                values["why_title"] = "Why ESS Saudi"
            if not values.get("why_description"):
                values["why_description"] = (
                    "ESS Saudi supplies mass notification systems and sirens from "
                    "internationally certified manufacturers, and offers local system design "
                    "and integration support to connect notification systems with plant safety systems."
                )
        return values


class MassNotificationCapabilitiesResponse(BaseModel):
    success: bool = True
    data: MassNotificationCapabilities


# DEFAULT FALLBACK INDUSTRIES LIST
DEFAULT_MASS_NOTIFICATION_INDUSTRIES = [
    "Oil & Gas",
    "Petrochemical",
    "Power Generation",
    "Utilities"
]