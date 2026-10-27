from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


class ProcessAnalyzersBanner(BaseModel):
    title: str = Field(
        default="Process Analyzers",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Advanced Online & Offline Industrial Process Analysis Solutions",
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
                values["title"] = "Process Analyzers"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class ProcessAnalyzersBannerResponse(BaseModel):
    success: bool = True
    data: ProcessAnalyzersBanner


class ProcessAnalyzersOverviewImage(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for carousel slide")
    title: Optional[str] = Field(default="", description="Optional title or caption for the product image")
    image_url: str = Field(..., description="Product slide image URL")


class ProcessAnalyzersOverview(BaseModel):
    paragraph_1: str = Field(
        default=(
            "Continuous, accurate process analysis underpins product quality, process efficiency, "
            "and environmental compliance across the hydrocarbon value chain. ESS Saudi supplies "
            "gas and liquid process analyzers from internationally reputed manufacturers, covering "
            "composition analysis, purity monitoring, and trace-level contaminant detection."
        ),
        description="First paragraph description with blue left-accent line"
    )
    paragraph_2: Optional[str] = Field(
        default=(
            "Typical technologies include gas chromatographs, moisture and O2/H2S analyzers, "
            "pH and conductivity analyzers, and continuous emissions monitoring instrumentation, "
            "selected and configured for the specific process stream and regulatory requirement."
        ),
        description="Second paragraph description"
    )
    carousel_images: List[ProcessAnalyzersOverviewImage] = Field(
        default_factory=list,
        description="List of product image slides for the right-side interactive carousel"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "Continuous, accurate process analysis underpins product quality, process efficiency, "
                    "and environmental compliance across the hydrocarbon value chain. ESS Saudi supplies "
                    "gas and liquid process analyzers from internationally reputed manufacturers, covering "
                    "composition analysis, purity monitoring, and trace-level contaminant detection."
                )
            if not values.get("paragraph_2"):
                values["paragraph_2"] = (
                    "Typical technologies include gas chromatographs, moisture and O2/H2S analyzers, "
                    "pH and conductivity analyzers, and continuous emissions monitoring instrumentation, "
                    "selected and configured for the specific process stream and regulatory requirement."
                )
            if "carousel_images" not in values or not values["carousel_images"]:
                values["carousel_images"] = DEFAULT_PROCESS_ANALYZERS_IMAGES
        return values


class ProcessAnalyzersOverviewResponse(BaseModel):
    success: bool = True
    data: ProcessAnalyzersOverview


# DEFAULT FALLBACK CAROUSEL SLIDES
DEFAULT_PROCESS_ANALYZERS_IMAGES = [
    {
        "id": "slide_1",
        "title": "Gas Chromatograph System",
        "image_url": ""
    },
    {
        "id": "slide_2",
        "title": "Continuous Emissions Monitor",
        "image_url": ""
    }
]

class ProcessAnalyzersApplications(BaseModel):
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
                values["applications_list"] = DEFAULT_PROCESS_ANALYZERS_APPLICATIONS
        return values


class ProcessAnalyzersApplicationsResponse(BaseModel):
    success: bool = True
    data: ProcessAnalyzersApplications


# DEFAULT FALLBACK APPLICATIONS LIST
DEFAULT_PROCESS_ANALYZERS_APPLICATIONS = [
    "Natural gas composition and BTU/calorific value analysis",
    "Refinery and petrochemical process stream monitoring",
    "H2S and sulfur compound detection for safety and product quality",
    "Water and effluent quality analysis",
    "Emissions and environmental compliance monitoring"
]

class ProcessAnalyzersCapabilities(BaseModel):
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
            "As a distributor of internationally recognized process analyzer brands, "
            "ESS Saudi offers analyzer selection support, sample system compatibility "
            "guidance, and local service to keep analytical instrumentation running reliably in the field."
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
                values["industries_list"] = DEFAULT_PROCESS_ANALYZERS_INDUSTRIES
            if not values.get("why_title"):
                values["why_title"] = "Why ESS Saudi"
            if not values.get("why_description"):
                values["why_description"] = (
                    "As a distributor of internationally recognized process analyzer brands, "
                    "ESS Saudi offers analyzer selection support, sample system compatibility "
                    "guidance, and local service to keep analytical instrumentation running reliably in the field."
                )
        return values


class ProcessAnalyzersCapabilitiesResponse(BaseModel):
    success: bool = True
    data: ProcessAnalyzersCapabilities


# DEFAULT FALLBACK INDUSTRIES LIST
DEFAULT_PROCESS_ANALYZERS_INDUSTRIES = [
    "Oil & Gas",
    "Petrochemical",
    "Power Generation",
    "Water & Utilities"
]