from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


class SamplingSystemsBanner(BaseModel):
    title: str = Field(
        default="Sampling Systems",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Integrated Sampling & Analytical Measurement Solutions",
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
                values["title"] = "Sampling Systems"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class SamplingSystemsBannerResponse(BaseModel):
    success: bool = True
    data: SamplingSystemsBanner



class SamplingSystemsOverviewImage(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for carousel slide")
    title: Optional[str] = Field(default="", description="Optional title or caption for the product image")
    image_url: str = Field(..., description="Product slide image URL")


class SamplingSystemsOverview(BaseModel):
    paragraph_1: str = Field(
        default=(
            "Representative, contamination-free sampling is essential to accurate custody transfer, "
            "quality certification, and process analysis across the hydrocarbon value chain. ESS Saudi "
            "supplies sampling systems for crude oil, LNG, and natural gas applications, sourced from "
            "internationally reputed API certified manufacturers and engineered to meet recognized custody "
            "transfer and fiscal metering standards."
        ),
        description="First paragraph description with blue left-accent line"
    )
    paragraph_2: Optional[str] = Field(
        default=(
            "Our sampling system scope includes automatic and spot sampling systems, sample conditioning "
            "and probe assemblies, and fully integrated sampling skids designed to support Saudi Aramco's "
            "fiscal metering and crude oil quality control requirements."
        ),
        description="Second paragraph description"
    )
    carousel_images: List[SamplingSystemsOverviewImage] = Field(
        default_factory=list,
        description="List of product image slides for the interactive carousel"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "Representative, contamination-free sampling is essential to accurate custody transfer, "
                    "quality certification, and process analysis across the hydrocarbon value chain. ESS Saudi "
                    "supplies sampling systems for crude oil, LNG, and natural gas applications, sourced from "
                    "internationally reputed API certified manufacturers and engineered to meet recognized custody "
                    "transfer and fiscal metering standards."
                )
            if not values.get("paragraph_2"):
                values["paragraph_2"] = (
                    "Our sampling system scope includes automatic and spot sampling systems, sample conditioning "
                    "and probe assemblies, and fully integrated sampling skids designed to support Saudi Aramco's "
                    "fiscal metering and crude oil quality control requirements."
                )
            if "carousel_images" not in values or not values["carousel_images"]:
                values["carousel_images"] = DEFAULT_SAMPLING_SYSTEMS_IMAGES
        return values


class SamplingSystemsOverviewResponse(BaseModel):
    success: bool = True
    data: SamplingSystemsOverview


# DEFAULT FALLBACK CAROUSEL SLIDES
DEFAULT_SAMPLING_SYSTEMS_IMAGES = [
    {
        "id": "slide_1",
        "title": "Integrated Sampling Skid",
        "image_url": ""
    },
    {
        "id": "slide_2",
        "title": "Automatic Liquid Sampler Rack",
        "image_url": ""
    }
]

class SamplingSystemsApplications(BaseModel):
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
                values["applications_list"] = DEFAULT_SAMPLING_SYSTEMS_APPLICATIONS
        return values


class SamplingSystemsApplicationsResponse(BaseModel):
    success: bool = True
    data: SamplingSystemsApplications


# DEFAULT FALLBACK APPLICATIONS LIST
DEFAULT_SAMPLING_SYSTEMS_APPLICATIONS = [
    "Automatic crude oil sampling for custody transfer and quality certification",
    "LNG sampling for composition and quality verification",
    "Natural gas sampling supporting fiscal metering and BTU determination",
    "Sample conditioning ahead of process analyzers",
    "Terminal, refinery, and export facility sampling systems"
]

class SamplingSystemsCapabilities(BaseModel):
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
            "ESS Saudi supplies internationally engineered sampling systems as a distributor "
            "and channel partner, and offers local application support to align sampling system design "
            "with Saudi Aramco fiscal metering and quality control requirements."
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
                values["industries_list"] = DEFAULT_SAMPLING_SYSTEMS_INDUSTRIES
            if not values.get("why_title"):
                values["why_title"] = "Why ESS Saudi"
            if not values.get("why_description"):
                values["why_description"] = (
                    "ESS Saudi supplies internationally engineered sampling systems as a distributor "
                    "and channel partner, and offers local application support to align sampling system design "
                    "with Saudi Aramco fiscal metering and quality control requirements."
                )
        return values


class SamplingSystemsCapabilitiesResponse(BaseModel):
    success: bool = True
    data: SamplingSystemsCapabilities


# DEFAULT FALLBACK INDUSTRIES LIST
DEFAULT_SAMPLING_SYSTEMS_INDUSTRIES = [
    "Oil & Gas (Upstream, Midstream & Downstream)"
]