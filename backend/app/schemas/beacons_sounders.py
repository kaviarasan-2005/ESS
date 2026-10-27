from typing import Optional, List,Any
from pydantic import BaseModel, Field, model_validator


class BeaconsSoundersBanner(BaseModel):
    title: str = Field(
        default="Beacons & Sounders",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Audible & Visual Signaling Devices for Hazardous Areas",
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
                values["title"] = "Beacons & Sounders"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class BeaconsSoundersBannerResponse(BaseModel):
    success: bool = True
    data: BeaconsSoundersBanner

class BeaconsSoundersOverviewImage(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for carousel slide")
    title: Optional[str] = Field(default="", description="Optional title or caption for the product image")
    image_url: str = Field(..., description="Product slide image URL")


class BeaconsSoundersOverview(BaseModel):
    paragraph_1: str = Field(
        default=(
            "Clear, reliable visual and audible alarms are essential for alerting personnel "
            "to hazardous conditions in industrial environments, especially in high-noise or visually obstructed areas. "
            "ESS Saudi supplies beacons, sounders, and combined sounder-beacon units from internationally reputed manufacturers, "
            "certified for use in hazardous (Zone 1/Zone 2) and industrial outdoor environments."
        ),
        description="First paragraph description with blue left-accent line"
    )
    paragraph_2: Optional[str] = Field(
        default=(
            "Our range includes LED and Xenon beacons, weatherproof sounders, and multi-tone combined units, "
            "selected to match a site's noise levels, visibility conditions, and hazardous-area classification."
        ),
        description="Second paragraph description"
    )
    carousel_images: List[BeaconsSoundersOverviewImage] = Field(
        default_factory=list,
        description="List of product image slides for the right-side interactive carousel"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "Clear, reliable visual and audible alarms are essential for alerting personnel "
                    "to hazardous conditions in industrial environments, especially in high-noise or visually obstructed areas. "
                    "ESS Saudi supplies beacons, sounders, and combined sounder-beacon units from internationally reputed manufacturers, "
                    "certified for use in hazardous (Zone 1/Zone 2) and industrial outdoor environments."
                )
            if not values.get("paragraph_2"):
                values["paragraph_2"] = (
                    "Our range includes LED and Xenon beacons, weatherproof sounders, and multi-tone combined units, "
                    "selected to match a site's noise levels, visibility conditions, and hazardous-area classification."
                )
            if "carousel_images" not in values or not values["carousel_images"]:
                values["carousel_images"] = DEFAULT_BEACONS_SOUNDERS_IMAGES
        return values


class BeaconsSoundersOverviewResponse(BaseModel):
    success: bool = True
    data: BeaconsSoundersOverview


# DEFAULT FALLBACK CAROUSEL SLIDES
DEFAULT_BEACONS_SOUNDERS_IMAGES = [
    {
        "id": "slide_1",
        "title": "Hazardous Area Beacon Unit",
        "image_url": ""
    },
    {
        "id": "slide_2",
        "title": "Industrial Sounder-Beacon Combo",
        "image_url": ""
    }
]

class BeaconsSoundersApplications(BaseModel):
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
                values["applications_list"] = DEFAULT_BEACONS_SOUNDERS_APPLICATIONS
        return values


class BeaconsSoundersApplicationsResponse(BaseModel):
    success: bool = True
    data: BeaconsSoundersApplications


# DEFAULT FALLBACK APPLICATIONS LIST
DEFAULT_BEACONS_SOUNDERS_APPLICATIONS = [
    "Fire and gas (F&G) system alarm notification",
    "Process alarm and emergency shutdown (ESD) signaling",
    "Hazardous-area visual and audible warning",
    "Plant-wide mass notification support",
    "Outdoor and offshore alarm applications"
]

class BeaconsSoundersCapabilities(BaseModel):
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
            "ESS Saudi supplies beacons and sounders from internationally certified manufacturers, "
            "and offers local support for hazardous-area classification review and system integration "
            "into plant-wide fire and gas or ESD systems."
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
                values["industries_list"] = DEFAULT_BEACONS_SOUNDERS_INDUSTRIES
            if not values.get("why_title"):
                values["why_title"] = "Why ESS Saudi"
            if not values.get("why_description"):
                values["why_description"] = (
                    "ESS Saudi supplies beacons and sounders from internationally certified manufacturers, "
                    "and offers local support for hazardous-area classification review and system integration "
                    "into plant-wide fire and gas or ESD systems."
                )
        return values


class BeaconsSoundersCapabilitiesResponse(BaseModel):
    success: bool = True
    data: BeaconsSoundersCapabilities


# DEFAULT FALLBACK INDUSTRIES LIST
DEFAULT_BEACONS_SOUNDERS_INDUSTRIES = [
    "Oil & Gas",
    "Petrochemical",
    "Power Generation",
    "Utilities"
]