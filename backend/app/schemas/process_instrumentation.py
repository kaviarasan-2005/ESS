from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


class ProcessInstrumentationBanner(BaseModel):
    title: str = Field(
        default="Process Instrumentation",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Precision Measurement & Industrial Process Instrumentation Solutions",
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
                values["title"] = "Process Instrumentation"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class ProcessInstrumentationBannerResponse(BaseModel):
    success: bool = True
    data: ProcessInstrumentationBanner

class ProcessInstrumentationOverviewImage(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for carousel slide")
    title: Optional[str] = Field(default="", description="Optional title or caption for the product image")
    image_url: str = Field(..., description="Product slide image URL")


class ProcessInstrumentationOverview(BaseModel):
    paragraph_1: str = Field(
        default=(
            "Reliable process instrumentation forms the foundation of safe and efficient plant operation. "
            "ESS Saudi supplies a full range of Pressure, Temperature, Flow, and Level measurement instruments "
            "from internationally reputed manufacturers, suited to the demanding conditions of hydrocarbon processing, "
            "power generation, and utility operations."
        ),
        description="First paragraph description with blue left-accent line"
    )
    paragraph_2: Optional[str] = Field(
        default=(
            "Our range spans transmitters, gauges, switches, and sensors including hazardous-area certified "
            "and SIL-rated variants which is configured to meet site-specific process, safety, and environmental requirements."
        ),
        description="Second paragraph description"
    )
    carousel_images: List[ProcessInstrumentationOverviewImage] = Field(
        default_factory=list,
        description="List of product image slides for the right-side interactive carousel"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "Reliable process instrumentation forms the foundation of safe and efficient plant operation. "
                    "ESS Saudi supplies a full range of Pressure, Temperature, Flow, and Level measurement instruments "
                    "from internationally reputed manufacturers, suited to the demanding conditions of hydrocarbon processing, "
                    "power generation, and utility operations."
                )
            if not values.get("paragraph_2"):
                values["paragraph_2"] = (
                    "Our range spans transmitters, gauges, switches, and sensors including hazardous-area certified "
                    "and SIL-rated variants which is configured to meet site-specific process, safety, and environmental requirements."
                )
            if "carousel_images" not in values or not values["carousel_images"]:
                values["carousel_images"] = DEFAULT_PROCESS_INSTRUMENTATION_IMAGES
        return values


class ProcessInstrumentationOverviewResponse(BaseModel):
    success: bool = True
    data: ProcessInstrumentationOverview


# DEFAULT FALLBACK CAROUSEL SLIDES
DEFAULT_PROCESS_INSTRUMENTATION_IMAGES = [
    {
        "id": "slide_1",
        "title": "Pressure Transmitter Unit",
        "image_url": ""
    },
    {
        "id": "slide_2",
        "title": "Flow & Temperature Sensor Assembly",
        "image_url": ""
    }

]

class ProcessInstrumentationApplications(BaseModel):
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
                values["applications_list"] = DEFAULT_PROCESS_INSTRUMENTATION_APPLICATIONS
        return values


class ProcessInstrumentationApplicationsResponse(BaseModel):
    success: bool = True
    data: ProcessInstrumentationApplications


# DEFAULT FALLBACK APPLICATIONS LIST
DEFAULT_PROCESS_INSTRUMENTATION_APPLICATIONS = [
    "Pressure and differential pressure measurement across process units",
    "Temperature monitoring for reactors, exchangers, and rotating equipment",
    "Flow measurement (custody transfer, process, and utility flows)",
    "Level measurement for tanks, vessels, and separators",
    "SIL-rated instrumentation for safety instrumented systems (SIS)"
]

class ProcessInstrumentationCapabilities(BaseModel):
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
            "ESS Saudi supplies a process instrumentation portfolio sourced from "
            "internationally certified manufacturers, and offers local engineering support "
            "for instrument selection, specification review, and site commissioning."
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
                values["industries_list"] = DEFAULT_PROCESS_INSTRUMENTATION_INDUSTRIES
            if not values.get("why_title"):
                values["why_title"] = "Why ESS Saudi"
            if not values.get("why_description"):
                values["why_description"] = (
                    "ESS Saudi supplies a process instrumentation portfolio sourced from "
                    "internationally certified manufacturers, and offers local engineering support "
                    "for instrument selection, specification review, and site commissioning."
                )
        return values


class ProcessInstrumentationCapabilitiesResponse(BaseModel):
    success: bool = True
    data: ProcessInstrumentationCapabilities


# DEFAULT FALLBACK INDUSTRIES LIST
DEFAULT_PROCESS_INSTRUMENTATION_INDUSTRIES = [
    "Oil & Gas",
    "Petrochemical",
    "Power Generation",
    "Water & Utilities"
]