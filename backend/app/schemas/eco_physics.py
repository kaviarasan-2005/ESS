from typing import Optional, Any, List
from pydantic import BaseModel, Field, model_validator


# ==========================================
# ECO PHYSICS BANNER SCHEMAS
# ==========================================

class EcoPhysicsBannerHeader(BaseModel):
    title: Optional[str] = Field(
        default="Eco Physics",
        description="Main banner header title"
    )
    subtitle: Optional[str] = Field(
        default="High Precision Gas Analyzers and Environmental Measurement Systems",
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
                values["title"] = "Eco Physics"

            if values.get("subtitle") is None:
                values["subtitle"] = "High Precision Gas Analyzers and Environmental Measurement Systems"

            img = (
                values.get("bg_image")
                or values.get("bg_image_url")
                or values.get("image_url")
                or ""
            )
            values["bg_image"] = img
            values["bg_image_url"] = img

        return values


class EcoPhysicsBannerHeaderResponse(BaseModel):
    success: bool = True
    data: EcoPhysicsBannerHeader


# ==========================================
# ECO PHYSICS OVERVIEW / NOx ANALYZERS SCHEMAS
# ==========================================

class EcoPhysicsOverviewData(BaseModel):
    title: Optional[str] = Field(
        default="Eco Physics Nitrogen Oxide (NOx) Analyzers",
        description="Main section header title"
    )
    description: Optional[str] = Field(
        default="ESS-ME is the authorized Middle Eastern distributor for ECO Physics, a global pioneer in ultra-precise nitrogen oxide (NOx) analyzers. For industries and research institutions where accuracy is non-negotiable, ECO Physics provides the definitive solution. Our analyzers deliver unmatched reliability for the most demanding applications, from stringent continuous emissions monitoring systems (CEMS) in industrial stacks to sensitive ambient air quality networks and advanced atmospheric research across the GCC region.",
        description="Detailed body paragraph describing NOx analyzers"
    )
    product_image_url: Optional[str] = Field(
        default="",
        description="Product analyzer image path"
    )
    brand_logo_url: Optional[str] = Field(
        default="",
        description="Eco Physics brand logo image path"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Eco Physics Nitrogen Oxide (NOx) Analyzers"

            if not values.get("description"):
                values["description"] = (
                    "ESS-ME is the authorized Middle Eastern distributor for ECO Physics, "
                    "a global pioneer in ultra-precise nitrogen oxide (NOx) analyzers. "
                    "For industries and research institutions where accuracy is non-negotiable, "
                    "ECO Physics provides the definitive solution. Our analyzers deliver "
                    "unmatched reliability for the most demanding applications, from stringent "
                    "continuous emissions monitoring systems (CEMS) in industrial stacks to "
                    "sensitive ambient air quality networks and advanced atmospheric research "
                    "across the GCC region."
                )

            # Sync flexible field naming for product image
            product_img = (
                values.get("product_image_url")
                or values.get("product_image")
                or values.get("image_url")
                or ""
            )
            values["product_image_url"] = product_img

            # Sync flexible field naming for brand logo
            logo_img = (
                values.get("brand_logo_url")
                or values.get("brand_logo")
                or values.get("logo_url")
                or ""
            )
            values["brand_logo_url"] = logo_img

        return values


class EcoPhysicsOverviewResponse(BaseModel):
    success: bool = True
    data: EcoPhysicsOverviewData


# ==========================================
# ECO PHYSICS PRECISION SECTION SCHEMAS
# ==========================================

class EcoPhysicsPrecisionData(BaseModel):
    title: str = Field(
        default="Unmatched Precision in NOx Analysis",
        description="Main heading title for the precision section"
    )
    paragraph_1: str = Field(
        default="ECO Physics sets the industry benchmark for accuracy and range in NOx detection. Utilizing the gold-standard Chemiluminescence detection method (CLD), these analyzers provide definitive measurements that other technologies cannot match.",
        description="First paragraph text"
    )
    paragraph_2: str = Field(
        default="They are engineered to handle challenging sample conditions, including high humidity and complex gas matrices, ensuring data integrity you can trust for compliance reporting and critical research. With measurement capabilities spanning an incredible range—from trace-level 1 ppt (parts-per-trillion) to high-concentration 10,000 ppm (parts-per-million)—a single ECO Physics analyzer can be configured for virtually any application.",
        description="Second paragraph text"
    )
    image_url: str = Field(
        default="",
        description="URL for the chemiluminescence analyzer product graphic"
    )
    image_caption: str = Field(
        default="Chemiluminescence Detection Method based Eco Physics Analyzers",
        description="Caption text displayed directly below the image"
    )


class EcoPhysicsPrecisionResponse(BaseModel):
    success: bool = True
    data: EcoPhysicsPrecisionData


# ==========================================
# ECO PHYSICS RANGE & SUPPORT SCHEMAS
# ==========================================

class ProductRangeCard(BaseModel):
    title: str
    description: str


class IndustryItem(BaseModel):
    label: str
    detail: str


class EcoPhysicsRangeSupportData(BaseModel):
    # Section 1: Product Range
    product_range_title: str = Field(default="Our Eco Physics Product Range")
    product_range_subtitle: str = Field(
        default="ECO Physics offers a specialized portfolio of analyzers, with each series engineered to excel in specific environments and applications. Whether your priority is rugged reliability for continuous industrial monitoring or ultra-high sensitivity for research, we provide the precise tool to meet your measurement challenges and data quality objectives."
    )
    card_1_title: str = Field(default="CEMS & Industrial Emissions Monitoring Analyzers")
    card_1_desc: str = Field(
        default="Ensure 100% compliance with regional environmental regulations. Our robust NOx analyzers for CEMS are designed for continuous, unattended operation in harsh industrial environments. They deliver the precise, drift-free data required for regulatory reporting in power plants, refineries, and large combustion facilities. These systems are built to withstand the demanding conditions of automotive, aviation, and marine engine test stands, providing accurate data for engine development and certification."
    )
    card_2_title: str = Field(default="Ambient Air & Research-Grade NOx Analyzers")
    card_2_desc: str = Field(
        default="To protect public health and advance scientific understanding, ECO Physics' sensitive ambient air quality analyzers come in extremely handy. These instruments are deployed in government monitoring networks, urban air quality stations, and indoor air quality assessments to detect pollution at its source. Furthermore, ECO Physics is the preferred choice for advanced atmospheric research and cleanroom monitoring, where detecting ultratrace, part-per-trillion concentrations of NOx is critical for groundbreaking studies and protecting sensitive manufacturing processes."
    )

    # Section 2: Technical Expertise & Support
    support_title: str = Field(default="Technical Expertise & Support")
    support_para_1: str = Field(
        default="We provide complete solutions, not just instruments. Our technical team offers expert application consulting to select the perfect analyzer for your specific needs. We manage the entire process, including system integration, installation, and commissioning."
    )
    support_para_2: str = Field(
        default="To protect your investment, we provide ISO 17025 accredited calibration services and comprehensive maintenance contracts, ensuring your ECO Physics analyzer maintains its certified accuracy and performance for years to come, with full data traceability for audits."
    )

    # Section 3: Industries We Serve
    industries_title: str = Field(default="Industries We Serve")
    industries_intro: str = Field(
        default="ECO Physics solutions find usage in the following major applications:"
    )
    industry_list: List[IndustryItem] = Field(
        default=[
            IndustryItem(
                label="Continuous Emission Monitoring (CEMS)",
                detail="For stack emissions compliance in power and industrial plants."
            ),
            IndustryItem(
                label="Engine & Turbine Testing",
                detail="For development and emissions certification in the automotive and aerospace sectors."
            ),
            IndustryItem(
                label="Ambient Air Monitoring Networks",
                detail="For urban air quality and environmental impact studies."
            ),
            IndustryItem(
                label="Catalyst Research & Development",
                detail="For evaluating the performance of catalytic converters and SCR systems."
            ),
            IndustryItem(
                label="Indoor & Cleanroom Air Quality",
                detail="Ensuring safety in sensitive environments."
            ),
        ]
    )
    industry_image_url: str = Field(default="")
    industry_image_caption: str = Field(
        default="Eco Physics Analyzers used in Oil & Gas Industries"
    )

    # Section 4: Email CTA & Footer Statements
    footer_text: str = Field(
        default="ECO Physics product applications across Doha and other places in the Middle East has been soaring of late. To know more about our offerings, send an email to our ECO Physics product experts and we will reach out to you right away."
    )
    contact_email: str = Field(
        default="info@ess-me.com",
        description="Destination email address for the mailto anchor"
    )
    link_text: str = Field(
        default="send an email to our ECO Physics product experts",
        description="Clickable text displayed for the email link"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_range_support_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("contact_email"):
                values["contact_email"] = "info@ess-me.com"

            if not values.get("link_text"):
                values["link_text"] = "send an email to our ECO Physics product experts"

        return values


class EcoPhysicsRangeSupportResponse(BaseModel):
    success: bool = True
    data: EcoPhysicsRangeSupportData