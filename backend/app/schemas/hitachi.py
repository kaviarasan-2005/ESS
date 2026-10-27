from typing import Optional, List, Any
from pydantic import BaseModel, Field, model_validator

# ==========================================
# HITACHI BANNER SCHEMAS
# ==========================================

class HitachiBannerHeader(BaseModel):
    title: Optional[str] = Field(
        default="Hitachi",
        description="Main banner header title"
    )
    subtitle: Optional[str] = Field(
        default="Industrial Automation & Advanced Technology Solutions",
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
                values["title"] = "Hitachi"

            if values.get("subtitle") is None:
                values["subtitle"] = "Industrial Automation & Advanced Technology Solutions"

            # Retain deliberate empty string without reverting to default images
            img = values.get("bg_image_url") if values.get("bg_image_url") is not None else values.get("bg_image", "")
            values["bg_image"] = img
            values["bg_image_url"] = img

        return values


class HitachiBannerHeaderResponse(BaseModel):
    success: bool = True
    data: HitachiBannerHeader


# ==========================================
# HITACHI OVERVIEW SCHEMAS
# ==========================================

class HitachiOverviewSection(BaseModel):
    title: Optional[str] = Field(
        default="Hitachi Compressors & Pumps",
        description="Main header title for Hitachi overview"
    )
    description: Optional[str] = Field(
        default="For the world's most demanding industrial environments, equipment reliability isn't just a preference—it's a prerequisite. ESS-ME is the regional supplier for Hitachi industrial compressors and pumps, delivering the pinnacle of Japanese engineering and precision to the Middle East's core sectors. We provide the high-performance heart for your critical processes, from the massive centrifugal compressors in LNG plants to the high-pressure pumps in power stations, ensuring unmatched reliability and efficiency.",
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
                values["title"] = "Hitachi Compressors & Pumps"

            img = values.get("card_image_url") if values.get("card_image_url") is not None else values.get("card_image", "")
            values["card_image"] = img
            values["card_image_url"] = img

        return values


class HitachiOverviewResponse(BaseModel):
    success: bool = True
    data: HitachiOverviewSection




class ProductCardItem(BaseModel):
    title: Optional[str] = Field(
        default="",
        description="Title of product card"
    )
    description: Optional[str] = Field(
        default="",
        description="Description paragraph of product card"
    )


class HitachiDetailsSection(BaseModel):
    precision_title: Optional[str] = Field(
        default="Precision Engineering and Technological Innovation",
        description="Main section header title"
    )
    precision_description: Optional[str] = Field(
        default="Hitachi brings over a century of manufacturing excellence to its comprehensive product lineup. Renowned for exceptional durability and advanced R&D, Hitachi equipment is designed for continuous, high-load operation with extended service life. Their extensive know-how in simulation technology, lifecycle cost reduction, and performance optimization makes them the trusted choice for projects where failure is not an option.",
        description="Precision engineering description body text"
    )

    product_range_title: Optional[str] = Field(
        default="Our Hitachi Product Range",
        description="Product range heading"
    )
    product_range_description: Optional[str] = Field(
        default="We supply Hitachi's extensive range of equipment, engineered to meet the specific demands of large-scale industrial and infrastructure projects. Our technical team provides expert support to select the ideal model for your pressure, flow, and application requirements.",
        description="Product range description body text"
    )

    compressors_card_title: Optional[str] = Field(
        default="Centrifugal & Process Gas Compressors",
        description="Card 1 title"
    )
    compressors_card_description: Optional[str] = Field(
        default="Power the core of your process with unmatched reliability. Our Hitachi centrifugal compressors are the industry benchmark for large-volume air and process gas applications. These workhorses form the heart of petrochemical plants, natural gas processing facilities, and large air separation units, delivering efficient, stable, and continuous operation under the most demanding conditions.",
        description="Card 1 description"
    )

    pumps_card_title: Optional[str] = Field(
        default="High-Pressure & Large-Capacity Industrial Pumps",
        description="Card 2 title"
    )
    pumps_card_description: Optional[str] = Field(
        default="Meet the rigorous demands of power and water infrastructure. We supply Hitachi industrial pumps engineered for critical duties, including high-temperature, high-pressure boiler feed pumps for thermal power stations, reactor coolant pumps, and large-capacity models for seawater intake, potable water supply, and sewage treatment. These pumps are built for longevity and extreme operating conditions.",
        description="Card 2 description"
    )

    lifecycle_title: Optional[str] = Field(
        default="Lifecycle Support for Major Assets",
        description="Lifecycle support header title"
    )
    lifecycle_subtitle: Optional[str] = Field(
        default="Partnering with us for Hitachi equipment means securing a long-term commitment. We provide:",
        description="Lifecycle support subtitle text"
    )
    lifecycle_items: Optional[List[str]] = Field(
        default=[
            "Technical Consulting: Front-end engineering support for optimal equipment selection and integration.",
            "Project Management: Coordinating the supply of major equipment and auxiliary systems.",
            "Lifecycle Services: Access to genuine spare parts, technical documentation, and specialized maintenance support to protect your investment for decades."
        ],
        description="Lifecycle support list items"
    )

    sectors_title: Optional[str] = Field(
        default="Key Sectors",
        description="Key sectors header title"
    )
    sector_items: Optional[List[str]] = Field(
        default=[
            "Oil, Gas & Petrochemicals: LNG liquefaction, gas processing, refinery air compression.",
            "Power Generation: Boiler feed, cooling water, flue gas desulfurization (FGD) systems.",
            "Water & Infrastructure: Large-scale water supply, seawater desalination, drainage, and irrigation.",
            "Industrial Gases: Air separation units (ASU) and gas processing."
        ],
        description="Key sector list items"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_details_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("precision_title"):
                values["precision_title"] = "Precision Engineering and Technological Innovation"
            if not values.get("product_range_title"):
                values["product_range_title"] = "Our Hitachi Product Range"
            if not values.get("lifecycle_title"):
                values["lifecycle_title"] = "Lifecycle Support for Major Assets"
            if not values.get("sectors_title"):
                values["sectors_title"] = "Key Sectors"

        return values


class HitachiDetailsResponse(BaseModel):
    success: bool = True
    data: HitachiDetailsSection