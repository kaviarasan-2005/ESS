from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


class EmissionMonitoringBanner(BaseModel):
    title: str = Field(
        default="Emission Monitoring Systems",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Continuous Emission & Environmental Monitoring Solutions",
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
                values["title"] = "Emission Monitoring Systems"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class EmissionMonitoringBannerResponse(BaseModel):
    success: bool = True
    data: EmissionMonitoringBanner


class EmissionMonitoringOverviewImage(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for carousel slide")
    title: Optional[str] = Field(default="", description="Optional title or caption for the product image")
    image_url: str = Field(..., description="Product slide image URL")


class EmissionMonitoringOverview(BaseModel):
    paragraph_1: str = Field(
        default=(
            "Environmental compliance and regulatory reporting depend on accurate, continuous emissions "
            "and air quality data. ESS supplies emission monitoring systems, including Continuous "
            "Emissions Monitoring Systems (CEMS) and Ambient Air Quality Monitoring Systems (AQMS), "
            "from internationally reputed manufacturers, engineered to meet recognized environmental "
            "monitoring and reporting standards."
        ),
        description="First paragraph description with blue left-accent line"
    )
    paragraph_2: Optional[str] = Field(
        default=(
            "Our scope covers stack-mounted CEMS analyzer packages, ambient air quality monitoring stations, "
            "data acquisition and reporting systems, and integration support for regulatory compliance submissions."
        ),
        description="Second paragraph description"
    )
    carousel_images: List[EmissionMonitoringOverviewImage] = Field(
        default_factory=list,
        description="List of product image slides for the right-side interactive carousel"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "Environmental compliance and regulatory reporting depend on accurate, continuous emissions "
                    "and air quality data. ESS supplies emission monitoring systems, including Continuous "
                    "Emissions Monitoring Systems (CEMS) and Ambient Air Quality Monitoring Systems (AQMS), "
                    "from internationally reputed manufacturers, engineered to meet recognized environmental "
                    "monitoring and reporting standards."
                )
            if not values.get("paragraph_2"):
                values["paragraph_2"] = (
                    "Our scope covers stack-mounted CEMS analyzer packages, ambient air quality monitoring stations, "
                    "data acquisition and reporting systems, and integration support for regulatory compliance submissions."
                )
            if "carousel_images" not in values or not values["carousel_images"]:
                values["carousel_images"] = DEFAULT_EMISSION_MONITORING_IMAGES
        return values


class EmissionMonitoringOverviewResponse(BaseModel):
    success: bool = True
    data: EmissionMonitoringOverview


# DEFAULT FALLBACK CAROUSEL SLIDES
DEFAULT_EMISSION_MONITORING_IMAGES = [
    {
        "id": "slide_1",
        "title": "CEMS Stack Analyzer Shelter",
        "image_url": ""
    },
    {
        "id": "slide_2",
        "title": "Ambient Air Quality Monitoring Station",
        "image_url": ""
    }
]

class EmissionMonitoringApplications(BaseModel):
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
                values["applications_list"] = DEFAULT_EMISSION_MONITORING_APPLICATIONS
        return values


class EmissionMonitoringApplicationsResponse(BaseModel):
    success: bool = True
    data: EmissionMonitoringApplications


# DEFAULT FALLBACK APPLICATIONS LIST
DEFAULT_EMISSION_MONITORING_APPLICATIONS = [
    "Stack emissions monitoring for regulatory compliance reporting",
    "Ambient air quality monitoring around industrial facilities",
    "SO2, NOx, CO, particulate matter, and VOC monitoring",
    "Data acquisition and handling systems (DAHS) for emissions reporting",
    "Environmental compliance monitoring for refineries, petrochemical, and power plants"
]

class EmissionMonitoringCapabilities(BaseModel):
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
            "ESS Saudi supplies CEMS and AQMS systems from internationally "
            "certified manufacturers, and offers local system integration, data handling "
            "system support, and assistance aligning monitoring systems with Saudi environmental regulatory requirements."
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
                values["industries_list"] = DEFAULT_EMISSION_MONITORING_INDUSTRIES
            if not values.get("why_title"):
                values["why_title"] = "Why ESS Saudi"
            if not values.get("why_description"):
                values["why_description"] = (
                    "ESS Saudi supplies CEMS and AQMS systems from internationally "
                    "certified manufacturers, and offers local system integration, data handling "
                    "system support, and assistance aligning monitoring systems with Saudi environmental regulatory requirements."
                )
        return values


class EmissionMonitoringCapabilitiesResponse(BaseModel):
    success: bool = True
    data: EmissionMonitoringCapabilities


# DEFAULT FALLBACK INDUSTRIES LIST
DEFAULT_EMISSION_MONITORING_INDUSTRIES = [
    "Oil & Gas",
    "Petrochemical",
    "Power Generation",
    "Utilities"
]