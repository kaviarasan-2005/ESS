from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


# ==========================================
# BARTEC BANNER / HERO SCHEMAS
# ==========================================

class BartecBannerHeader(BaseModel):
    title: Optional[str] = Field(
        default="Bartec",
        description="Main banner heading title"
    )
    subtitle: Optional[str] = Field(
        default="Explosion Protection & Safety Systems",
        description="Optional subtitle or tagline"
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
    def sync_banner_bg(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Bartec"
            if values.get("subtitle") is None:
                values["subtitle"] = "Explosion Protection & Safety Systems"

            img = (
                values.get("bg_image")
                or values.get("bg_image_url")
                or values.get("image_url")
                or ""
            )
            values["bg_image"] = img
            values["bg_image_url"] = img
        return values


class BartecBannerHeaderResponse(BaseModel):
    success: bool = True
    data: BartecBannerHeader


# ==========================================
# BARTEC SHELTER & OVERVIEW SCHEMAS
# ==========================================

class BartecShelterOverview(BaseModel):
    title: Optional[str] = Field(
        default="Bartec Analyzer Shelters & Sample Systems",
        description="Main section title"
    )
    description: Optional[str] = Field(
        default=(
            "In the demanding environments of the Middle East's oil & gas and "
            "petrochemical sectors, protecting sensitive analytical instrumentation "
            "is paramount. ESS-ME, as an expert integrator of Bartec analyzer shelters, "
            "delivers fully engineered, turnkey solutions that ensure analytical integrity. "
            "We provide more than just enclosures; we deliver complete life-support systems "
            "for your analyzers, guaranteeing reliable performance and accurate data in the "
            "face of extreme heat, sand, and corrosive atmospheres."
        ),
        description="Detailed section description text"
    )
    image: Optional[str] = Field(default="", description="Uploaded image URL path")
    image_url: Optional[str] = Field(default="", description="Synced uploaded image URL path")

    @model_validator(mode="before")
    @classmethod
    def sync_overview_image(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Bartec Analyzer Shelters & Sample Systems"
            if values.get("description") is None:
                values["description"] = ""

            img = (
                values.get("image_url")
                or values.get("image")
                or values.get("bg_image")
                or ""
            )
            values["image"] = img
            values["image_url"] = img
        return values


class BartecShelterOverviewResponse(BaseModel):
    success: bool = True
    data: BartecShelterOverview


# ==========================================
# BARTEC SOLUTIONS & DETAILS SCHEMAS
# ==========================================

class BartecBulletedItem(BaseModel):
    title: str
    description: str


class BartecDetailsContent(BaseModel):
    trusted_title: str = Field(
        default="Trusted Bartec Solutions for Maximum Uptime & Data Integrity"
    )
    trusted_description: str = Field(
        default=(
            "Bartec is a global leader in explosion protection and analytical systems, setting the benchmark for safety and reliability. "
            "Our partnership ensures you receive IEC 61285 / DIN EN 61285 compliant shelters engineered with superior German technology. "
            "BARTEC's solutions ensure your production processes run faster and more cost-effectively by providing a controlled, "
            "safe environment that eliminates false readings, reduces maintenance frequency, and maximizes the uptime of your critical process analyzers."
        )
    )
    solutions_title: str = Field(
        default="Our Bartec Product & Service Solutions"
    )
    solutions_description: str = Field(
        default=(
            "Our collaboration with Bartec enables us to offer a fully integrated approach to analyzer protection and sample integrity. "
            "We provide both the engineered enclosure and the vital sample conditioning components as a unified system, ensuring every "
            "element is designed to work together flawlessly for maximum reliability and data accuracy in your specific application."
        )
    )
    shelters_title: str = Field(
        default="Analyzer Shelters & Houses"
    )
    shelters_description: str = Field(
        default=(
            "We design and fabricate analyzer shelters tailored to your specific analyzer list and site conditions. Constructed from robust "
            "materials like GRP, stainless steel, or aluminum, our shelters are equipped with integral HVAC systems, purge systems, fire and gas detection, "
            "and hazardous area electrical fittings. This creates a standalone, climate-controlled environment that actively defends your multi-million "
            "dollar analytical investment against the region's harsh climate."
        )
    )
    sample_title: str = Field(
        default="Sample Conditioning Systems"
    )
    sample_description: str = Field(
        default=(
            "The most sophisticated analyzer is useless with a poor sample. We provide complete sample conditioning systems from Bartec, "
            "including fast loops, heated probe systems, coalescing filters, pressure regulators, and stream selection panels. Our systems ensure a clean, dry, "
            "representative, and timely sample is delivered to each analyzer at the correct pressure, temperature, and flow rate, which is the foundation "
            "of data integrity and reliability."
        )
    )
    advantage_title: str = Field(
        default="The ESS-ME Turnkey Advantage"
    )
    advantage_description: str = Field(
        default="We provide single point responsibility for your entire analyzer project. Our service encompasses:"
    )
    advantage_items: List[BartecBulletedItem] = Field(
        default_factory=lambda: [
            BartecBulletedItem(
                title="Design & Compliance",
                description="Handling all engineering, including Civil Defense approval management."
            ),
            BartecBulletedItem(
                title="Fabrication & Integration",
                description="Building and pre-testing the shelter and sample panels in our facility."
            ),
            BartecBulletedItem(
                title="Installation & Commissioning",
                description="On-site placement, hook-up, and SAT to ensure full system functionality."
            )
        ]
    )
    applications_title: str = Field(
        default="Industry Applications"
    )
    application_items: List[str] = Field(
        default_factory=lambda: [
            "Refineries",
            "Petrochemical and Gas Plants",
            "Chemical Processing Facilities"
        ]
    )


class BartecDetailsResponse(BaseModel):
    success: bool = True
    data: BartecDetailsContent