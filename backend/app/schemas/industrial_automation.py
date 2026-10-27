from typing import Optional, List,Any
from pydantic import BaseModel, Field, model_validator


class IndustrialAutomationBanner(BaseModel):
    title: str = Field(
        default="Industrial Automation & SIL-Rated Control Systems",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Integrated Safety & Process Control Solutions",
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
                values["title"] = "Industrial Automation & SIL-Rated Control Systems"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class IndustrialAutomationBannerResponse(BaseModel):
    success: bool = True
    data: IndustrialAutomationBanner


class IndustrialAutomationOverviewImage(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for carousel slide")
    title: Optional[str] = Field(default="", description="Optional title or caption for the product image")
    image_url: str = Field(..., description="Product slide image URL")


class IndustrialAutomationOverview(BaseModel):
    paragraph_1: str = Field(
        default=(
            "Modern process plants depend on robust automation and control architectures to run efficiently and safely. "
            "ESS Saudi supplies industrial automation and SIL-rated control systems including PLC and SCADA platforms from "
            "internationally reputed manufacturers. We engineer and complete the system integration to meet the "
            "safety-integrity and reliability requirements of oil & gas, petrochemical, and power facilities."
        ),
        description="First paragraph description with blue left-accent line"
    )
    paragraph_2: Optional[str] = Field(
        default=(
            "Our scope covers PLC-based control panels, SCADA and HMI systems, safety instrumented systems (SIS) up to SIL 3, "
            "and system integration services connecting field instrumentation to plant-wide control and monitoring architectures."
        ),
        description="Second paragraph description"
    )
    carousel_images: List[IndustrialAutomationOverviewImage] = Field(
        default_factory=list,
        description="List of product image slides for the right-side interactive carousel"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "Modern process plants depend on robust automation and control architectures to run efficiently and safely. "
                    "ESS Saudi supplies industrial automation and SIL-rated control systems including PLC and SCADA platforms from "
                    "internationally reputed manufacturers. We engineer and complete the system integration to meet the "
                    "safety-integrity and reliability requirements of oil & gas, petrochemical, and power facilities."
                )
            if not values.get("paragraph_2"):
                values["paragraph_2"] = (
                    "Our scope covers PLC-based control panels, SCADA and HMI systems, safety instrumented systems (SIS) up to SIL 3, "
                    "and system integration services connecting field instrumentation to plant-wide control and monitoring architectures."
                )
            if "carousel_images" not in values or not values["carousel_images"]:
                values["carousel_images"] = DEFAULT_INDUSTRIAL_AUTOMATION_IMAGES
        return values


class IndustrialAutomationOverviewResponse(BaseModel):
    success: bool = True
    data: IndustrialAutomationOverview


# DEFAULT FALLBACK CAROUSEL SLIDES
DEFAULT_INDUSTRIAL_AUTOMATION_IMAGES = [
    {
        "id": "slide_1",
        "title": "PLC & SCADA Control Panel Skid",
        "image_url": ""
    },
    {
        "id": "slide_2",
        "title": "SIL-Rated SIS Safety Enclosure",
        "image_url": ""
    }
]

class IndustrialAutomationApplications(BaseModel):
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
                values["applications_list"] = DEFAULT_INDUSTRIAL_AUTOMATION_APPLICATIONS
        return values


class IndustrialAutomationApplicationsResponse(BaseModel):
    success: bool = True
    data: IndustrialAutomationApplications


# DEFAULT FALLBACK APPLICATIONS LIST
DEFAULT_INDUSTRIAL_AUTOMATION_APPLICATIONS = [
    "Process control automation using PLC and SCADA platforms",
    "Safety instrumented systems (SIS) for emergency shutdown (ESD) and fire & gas applications",
    "SIL-rated logic solvers and control panels",
    "Remote monitoring and telemetry for pipeline and gathering facilities",
    "Plant-wide control system integration and migration/upgrade projects"
]


class IndustrialAutomationCapabilities(BaseModel):
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
            "ESS Saudi supplies automation and SIL-rated control system hardware from "
            "internationally certified manufacturers, and offers local system integration, "
            "panel engineering, and commissioning support for control and safety system projects."
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
                values["industries_list"] = DEFAULT_INDUSTRIAL_AUTOMATION_INDUSTRIES
            if not values.get("why_title"):
                values["why_title"] = "Why ESS Saudi"
            if not values.get("why_description"):
                values["why_description"] = (
                    "ESS Saudi supplies automation and SIL-rated control system hardware from "
                    "internationally certified manufacturers, and offers local system integration, "
                    "panel engineering, and commissioning support for control and safety system projects."
                )
        return values


class IndustrialAutomationCapabilitiesResponse(BaseModel):
    success: bool = True
    data: IndustrialAutomationCapabilities


# DEFAULT FALLBACK INDUSTRIES LIST
DEFAULT_INDUSTRIAL_AUTOMATION_INDUSTRIES = [
    "Oil & Gas",
    "Petrochemical",
    "Power Generation",
    "Water & Utilities"
]