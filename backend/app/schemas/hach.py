from typing import Optional, List,Any
from pydantic import BaseModel, Field, model_validator


class HachBannerHeader(BaseModel):
    title: Optional[str] = Field(
        default="HACH",
        description="Main banner header title"
    )
    subtitle: Optional[str] = Field(
        default="Water Quality Analysis & Precision Analytical Testing Solutions",
        description="Optional banner tagline or subtitle"
    )
    bg_image: Optional[str] = Field(
        default="",
        description="Background image URL path"
    )
    bg_image_url: Optional[str] = Field(
        default="",
        description="Synced background image URL path"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_banner_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "HACH"

            if values.get("subtitle") is None:
                values["subtitle"] = "Water Quality Analysis & Precision Analytical Testing Solutions"

            # Determine explicit image value without overriding deliberate empty strings
            img = values.get("bg_image_url") if values.get("bg_image_url") is not None else values.get("bg_image", "")
            values["bg_image"] = img
            values["bg_image_url"] = img

        return values


class HachBannerHeaderResponse(BaseModel):
    success: bool = True
    data: HachBannerHeader




class HachOverviewSection(BaseModel):
    title: Optional[str] = Field(
        default="HACH Water Quality Analysis Solutions",
        description="Main header title for HACH overview"
    )
    description: Optional[str] = Field(
        default="For over 80 years, Hach has been the global leader in water quality analysis. ESS-ME, as an authorized distributor, brings this legacy of precision and reliability to the Middle East, ensuring you get your water analysis right the first time, every time.",
        description="Overview paragraph description"
    )
    card_image: Optional[str] = Field(
        default="",
        description="Image URL for featured brand graphic card"
    )
    card_image_url: Optional[str] = Field(
        default="",
        description="Synced Image URL for featured brand graphic card"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "HACH Water Quality Analysis Solutions"

            img = values.get("card_image_url") if values.get("card_image_url") is not None else values.get("card_image", "")
            values["card_image"] = img
            values["card_image_url"] = img

        return values


class HachOverviewResponse(BaseModel):
    success: bool = True
    data: HachOverviewSection


class HachDetailsSection(BaseModel):
    trusted_title: Optional[str] = Field(
        default="Trusted Water Analysis Expertise",
        description="Main header title"
    )
    trusted_description: Optional[str] = Field(
        default="Hach's broad line of instrumentation, reagents, and chemistries have been carefully crafted to make water analysis better – faster, simpler, greener, and more informative. This ensures operational efficiency, regulatory compliance, and product quality.",
        description="Trusted expertise description"
    )

    product_range_title: Optional[str] = Field(
        default="Our HACH Product Range",
        description="Product range section heading"
    )
    
    online_analyzers_title: Optional[str] = Field(
        default="Online Water Quality Analyzers",
        description="Online analyzers sub-heading"
    )
    online_analyzers_description: Optional[str] = Field(
        default="For continuous monitoring of parameters like pH, conductivity, COD, BOD, TOC, and contaminants in effluent, boiler, and process water.",
        description="Online analyzers description"
    )

    portable_meters_title: Optional[str] = Field(
        default="Portable Meters & Lab Equipment",
        description="Portable meters sub-heading"
    )
    portable_meters_description: Optional[str] = Field(
        default="For precise field and laboratory testing, including spectrophotometers, turbidity meters, and a full range of test kits and reagents.",
        description="Portable meters description"
    )

    support_capabilities_title: Optional[str] = Field(
        default="Our HACH Support Capabilities",
        description="Support capabilities section heading"
    )
    support_capabilities_description: Optional[str] = Field(
        default="Our qualified service personnel provide expert support, from selecting the right instrument and method to installation, training, and preventative maintenance, ensuring your investment is protected.",
        description="Support capabilities description"
    )

    applications_title: Optional[str] = Field(
        default="Critical Applications",
        description="Critical applications section heading"
    )
    application_items: Optional[List[str]] = Field(
        default=[
            "Wastewater Treatment Plants",
            "Potable Water Monitoring",
            "Petrochemical and Chemical Processing",
            "Power Generation (boiler/feed water)",
            "Environmental Monitoring."
        ],
        description="List of critical applications"
    )


class HachDetailsResponse(BaseModel):
    success: bool = True
    data: HachDetailsSection