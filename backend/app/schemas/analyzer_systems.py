from typing import Optional, List, Any
from pydantic import BaseModel, Field, model_validator


class AnalyzerSystemsBanner(BaseModel):
    title: str = Field(
        default="Analyzer Systems",
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
                values["title"] = "Analyzer Systems"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class AnalyzerSystemsBannerResponse(BaseModel):
    success: bool = True
    data: AnalyzerSystemsBanner


class AnalyzerSystemsOverviewImage(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for carousel slide")
    title: Optional[str] = Field(default="", description="Optional title or caption for the product image")
    image_url: str = Field(..., description="Product slide image URL")


class AnalyzerSystemsOverview(BaseModel):
    paragraph_1: str = Field(
        default=(
            "Process analyzers perform reliably only when properly housed, conditioned, and protected from the elements. "
            "ESS Saudi supplies complete analyzer systems right from individual analyzer packages to fully engineered analyzer "
            "shelters and cabinets designed and built for the temperature extremes, dust, and hazardous-area conditions typical "
            "of Saudi oil & gas and petrochemical sites."
        ),
        description="First paragraph description with blue left-accent line"
    )
    paragraph_2: Optional[str] = Field(
        default=(
            "Our analyzer system scope covers climate-controlled shelters, walk-in and non-walk-in cabinets, "
            "purge and pressurization systems for hazardous-area compliance, and integration of sample conditioning "
            "and analyzer racks within a single engineered enclosure."
        ),
        description="Second paragraph description"
    )
    carousel_images: List[AnalyzerSystemsOverviewImage] = Field(
        default_factory=list,
        description="List of product image slides for the right-side interactive carousel"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "Process analyzers perform reliably only when properly housed, conditioned, and protected from the elements. "
                    "ESS Saudi supplies complete analyzer systems right from individual analyzer packages to fully engineered analyzer "
                    "shelters and cabinets designed and built for the temperature extremes, dust, and hazardous-area conditions typical "
                    "of Saudi oil & gas and petrochemical sites."
                )
            if not values.get("paragraph_2"):
                values["paragraph_2"] = (
                    "Our analyzer system scope covers climate-controlled shelters, walk-in and non-walk-in cabinets, "
                    "purge and pressurization systems for hazardous-area compliance, and integration of sample conditioning "
                    "and analyzer racks within a single engineered enclosure."
                )
            if "carousel_images" not in values or not values["carousel_images"]:
                values["carousel_images"] = DEFAULT_ANALYZER_SYSTEMS_IMAGES
        return values


class AnalyzerSystemsOverviewResponse(BaseModel):
    success: bool = True
    data: AnalyzerSystemsOverview


# DEFAULT FALLBACK CAROUSEL SLIDES
DEFAULT_ANALYZER_SYSTEMS_IMAGES = [
    {
        "id": "slide_1",
        "title": "Analyzer Shelter Enclosure",
        "image_url": ""
    },
    {
        "id": "slide_2",
        "title": "Sampling System Cabinet",
        "image_url": ""
    }
]

class AnalyzerSystemsApplications(BaseModel):
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
                values["applications_list"] = DEFAULT_ANALYZER_SYSTEMS_APPLICATIONS
        return values


class AnalyzerSystemsApplicationsResponse(BaseModel):
    success: bool = True
    data: AnalyzerSystemsApplications


# DEFAULT FALLBACK APPLICATIONS LIST
DEFAULT_ANALYZER_SYSTEMS_APPLICATIONS = [
    "Housing and protection for gas chromatographs and process analyzers",
    "Hazardous-area compliant analyzer shelters (purged/pressurized enclosures)",
    "Centralized analyzer houses for tank farms, terminals, and process units",
    "Climate control for temperature-sensitive analytical equipment",
    "Skid-mounted analyzer systems for modular and brownfield projects"
]

class AnalyzerSystemsCapabilities(BaseModel):
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
            "ESS Saudi supplies analyzer systems and shelters engineered by internationally "
            "recognized manufacturers and system houses, and offers local project engineering, "
            "site integration, and commissioning support from concept through handover."
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
                values["industries_list"] = DEFAULT_ANALYZER_SYSTEMS_INDUSTRIES
            if not values.get("why_title"):
                values["why_title"] = "Why ESS Saudi"
            if not values.get("why_description"):
                values["why_description"] = (
                    "ESS Saudi supplies analyzer systems and shelters engineered by internationally "
                    "recognized manufacturers and system houses, and offers local project engineering, "
                    "site integration, and commissioning support from concept through handover."
                )
        return values


class AnalyzerSystemsCapabilitiesResponse(BaseModel):
    success: bool = True
    data: AnalyzerSystemsCapabilities


# DEFAULT FALLBACK INDUSTRIES LIST
DEFAULT_ANALYZER_SYSTEMS_INDUSTRIES = [
    "Oil & Gas",
    "Petrochemical",
    "Power Generation",
    "Utilities"
]