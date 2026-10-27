from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


class UpstreamInstrumentationBanner(BaseModel):
    title: str = Field(
        default="Upstream Instrumentation (Water Cut Meters)",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Precision Real-Time Water Cut & Multiphase Measurement Solutions",
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
                values["title"] = "Upstream Instrumentation (Water Cut Meters)"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class UpstreamInstrumentationBannerResponse(BaseModel):
    success: bool = True
    data: UpstreamInstrumentationBanner


class UpstreamInstrumentationOverviewImage(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for carousel slide")
    title: Optional[str] = Field(default="", description="Optional title or caption for the product image")
    image_url: str = Field(..., description="Product slide image URL")


class UpstreamInstrumentationOverview(BaseModel):
    paragraph_1: str = Field(
        default=(
            "Accurate water cut measurement is essential to production allocation, well testing, "
            "and fiscal metering across upstream and midstream operations. ESS Saudi supplies water cut meters "
            "and related upstream instrumentation from internationally reputed manufacturers, engineered for the wide "
            "range of flow, viscosity, and salinity conditions found in Saudi oilfield production."
        ),
        description="First paragraph description with blue left-accent line"
    )
    paragraph_2: Optional[str] = Field(
        default=(
            "Our upstream instrumentation portfolio supports well testing, production allocation metering, "
            "and fiscal metering applications, and is aligned with Saudi Aramco's In-Kingdom Total Value Add (IKTVA) "
            "localization program."
        ),
        description="Second paragraph description"
    )
    carousel_images: List[UpstreamInstrumentationOverviewImage] = Field(
        default_factory=list,
        description="List of product image slides for the right-side interactive carousel"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "Accurate water cut measurement is essential to production allocation, well testing, "
                    "and fiscal metering across upstream and midstream operations. ESS Saudi supplies water cut meters "
                    "and related upstream instrumentation from internationally reputed manufacturers, engineered for the wide "
                    "range of flow, viscosity, and salinity conditions found in Saudi oilfield production."
                )
            if not values.get("paragraph_2"):
                values["paragraph_2"] = (
                    "Our upstream instrumentation portfolio supports well testing, production allocation metering, "
                    "and fiscal metering applications, and is aligned with Saudi Aramco's In-Kingdom Total Value Add (IKTVA) "
                    "localization program."
                )
            if "carousel_images" not in values or not values["carousel_images"]:
                values["carousel_images"] = DEFAULT_UPSTREAM_INSTRUMENTATION_IMAGES
        return values


class UpstreamInstrumentationOverviewResponse(BaseModel):
    success: bool = True
    data: UpstreamInstrumentationOverview


# DEFAULT FALLBACK CAROUSEL SLIDES
DEFAULT_UPSTREAM_INSTRUMENTATION_IMAGES = [
    {
        "id": "slide_1",
        "title": "Water Cut Meter Unit",
        "image_url": ""
    },
    {
        "id": "slide_2",
        "title": "Multiphase Measurement System",
        "image_url": ""
    }
]

class UpstreamInstrumentationApplications(BaseModel):
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
                values["applications_list"] = DEFAULT_UPSTREAM_INSTRUMENTATION_APPLICATIONS
        return values


class UpstreamInstrumentationApplicationsResponse(BaseModel):
    success: bool = True
    data: UpstreamInstrumentationApplications


# DEFAULT FALLBACK APPLICATIONS LIST
DEFAULT_UPSTREAM_INSTRUMENTATION_APPLICATIONS = [
    "Online water cut measurement for well testing and production monitoring",
    "Production allocation and fiscal metering",
    "Crude oil quality verification ahead of export or custody transfer",
    "Multiphase flow measurement support",
    "Wellhead and gathering station instrumentation"
]

class UpstreamInstrumentationCapabilities(BaseModel):
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
            "ESS Saudi supplies internationally proven water cut and upstream measurement "
            "technologies as a distributor and channel partner, and offers in-Kingdom technical support "
            "and service capability aligned with Saudi Aramco's localization objectives."
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
                values["industries_list"] = DEFAULT_UPSTREAM_INSTRUMENTATION_INDUSTRIES
            if not values.get("why_title"):
                values["why_title"] = "Why ESS Saudi"
            if not values.get("why_description"):
                values["why_description"] = (
                    "ESS Saudi supplies internationally proven water cut and upstream measurement "
                    "technologies as a distributor and channel partner, and offers in-Kingdom technical support "
                    "and service capability aligned with Saudi Aramco's localization objectives."
                )
        return values


class UpstreamInstrumentationCapabilitiesResponse(BaseModel):
    success: bool = True
    data: UpstreamInstrumentationCapabilities


# DEFAULT FALLBACK INDUSTRIES LIST
DEFAULT_UPSTREAM_INSTRUMENTATION_INDUSTRIES = [
    "Oil & Gas (Upstream & Midstream)"
]