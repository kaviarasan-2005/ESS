from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


class HoneywellBanner(BaseModel):
    title: str = Field(
        default="Honeywell Automation",
        description="Main banner header text"
    )
    subtitle: Optional[str] = Field(
        default="Advanced Industrial Control & Process Automation Solutions",
        description="Optional sub-heading or tagline"
    )
    bg_image_url: Optional[str] = Field(
        default="",
        description="Background overlay image or media URL"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_banner_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Honeywell Automation"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class HoneywellBannerResponse(BaseModel):
    success: bool = True
    data: HoneywellBanner


class HoneywellOverview(BaseModel):
    title: str = Field(
        default="Honeywell Automation Solutions",
        description="Main section title heading"
    )
    paragraph_1: str = Field(
        default=(
            "In complex process industries, operational excellence demands an automation partner with "
            "proven technology and deep domain expertise. ESS-ME is a certified provider of Honeywell "
            "Automation Solutions, delivering the integrated control and safety systems that define modern "
            "industrial operations. We empower refineries, petrochemical plants, and power generation facilities "
            "across the Middle East to achieve superior production reliability, enhanced safety, and seamless "
            "digital transformation with Honeywell's industry-leading technology."
        ),
        description="Primary overview description text"
    )
    image_url: Optional[str] = Field(
        default="",
        description="Featured Honeywell logo/branding visual card image URL"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Honeywell Automation Solutions"
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "In complex process industries, operational excellence demands an automation partner with "
                    "proven technology and deep domain expertise. ESS-ME is a certified provider of Honeywell "
                    "Automation Solutions, delivering the integrated control and safety systems that define modern "
                    "industrial operations. We empower refineries, petrochemical plants, and power generation facilities "
                    "across the Middle East to achieve superior production reliability, enhanced safety, and seamless "
                    "digital transformation with Honeywell's industry-leading technology."
                )
        return values


class HoneywellOverviewResponse(BaseModel):
    success: bool = True
    data: HoneywellOverview


class HoneywellServiceCard(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for service card")
    title: str = Field(..., description="Service card title")
    description: str = Field(..., description="Service description text")


class HoneywellDetails(BaseModel):
    # Section 1: Legacy Header
    legacy_title: str = Field(
        default="Honeywell's Legacy of Process Control Innovation",
        description="Top main heading"
    )
    legacy_description: str = Field(
        default=(
            "Honeywell Process Solutions sets the global standard for distributed control systems (DCS) "
            "and integrated safety. Our partnership provides you with direct access to technologies like "
            "the Experion PKS DCS and ControlEdge PLCs, platforms designed specifically for the rigor of "
            "continuous process industries. With decades of regional project experience, our engineers are "
            "adept at implementing these solutions to solve your most pressing challenges in optimization, "
            "compliance, and asset management."
        ),
        description="Top section description text"
    )

    # Section 2: Portfolio & Cards
    portfolio_title: str = Field(
        default="Honeywell Automation Service Portfolio",
        description="Portfolio section heading"
    )
    portfolio_description: str = Field(
        default=(
            "ESS-ME provides end-to-end services that span the entire automation lifecycle. "
            "From initial system architecture and deployment to ongoing optimization and support, "
            "our Honeywell-focused expertise ensures your control system is a strategic asset that drives "
            "continuous operational improvement and a rapid return on investment."
        ),
        description="Portfolio description text"
    )
    cards: List[HoneywellServiceCard] = Field(
        default_factory=list,
        description="4 service portfolio cards"
    )

    # Section 3: Value Addition
    value_title: str = Field(
        default="ESS-ME Value Addition",
        description="Value addition section title"
    )
    value_description: str = Field(
        default=(
            "Our value extends beyond implementation. We offer strategic consulting for operational excellence, "
            "24/7 support contracts with local response, and specialized services for system health checks and "
            "cybersecurity hardening. We ensure your Honeywell automation system delivers peak performance, "
            "security, and reliability year after year."
        ),
        description="Value addition description"
    )

    # Section 4: Core Industries
    industries_title: str = Field(
        default="Core Industries We Serve",
        description="Core industries section title"
    )
    industries: List[str] = Field(
        default_factory=list,
        description="List of core industries bullet points"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_details_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("legacy_title"):
                values["legacy_title"] = "Honeywell's Legacy of Process Control Innovation"
            if "cards" not in values or not values["cards"]:
                values["cards"] = DEFAULT_HONEYWELL_CARDS
            if "industries" not in values or not values["industries"]:
                values["industries"] = DEFAULT_HONEYWELL_INDUSTRIES
        return values


class HoneywellDetailsResponse(BaseModel):
    success: bool = True
    data: HoneywellDetails


# DEFAULT DATA MATCHING YOUR REFERENCE IMAGE
DEFAULT_HONEYWELL_CARDS = [
    {
        "id": "card_1",
        "title": "Experion PKS Distributed Control System (DCS) Implementation",
        "description": "As specialists in the Experion PKS DCS, we design and deploy the central nervous system for your plant. Our services include system architecture design, server and workstation configuration, HMI development, and implementation of advanced regulatory control (ARC) and procedural operations. We ensure seamless integration with third-party PLCs and safety systems, creating a unified and intuitive operator environment that maximizes production efficiency."
    },
    {
        "id": "card_2",
        "title": "PLC & Safety System Integration",
        "description": "For hybrid and safety-critical applications, we engineer robust solutions using Honeywell's ControlEdge PLCs and Safety Manager systems. We develop complex control logic and integrate these platforms seamlessly with the Experion PKS DCS, providing a unified architecture for both basic process control and Safety Instrumented Systems (SIS), ensuring full compliance with IEC 61511 standards."
    },
    {
        "id": "card_3",
        "title": "System Modernization & Legacy Migration",
        "description": "Future-proof your operations with confidence. We specialize in migrating legacy Honeywell systems (such as TDC 3000 and PlantScape) to the modern Experion PKS platform. Our proven methodology minimizes operational risk, preserves your intellectual property, and unlocks new capabilities in cybersecurity, data analytics, and remote operations, extending the life and value of your automation investment."
    },
    {
        "id": "card_4",
        "title": "Advanced Software & Cybersecurity Hardening",
        "description": "Protect and optimize your automation network. We implement Honeywell's advanced software suites alongside robust cybersecurity measures, including intrusion detection, network segregation, and patch management, safeguarding your plant assets against emerging digital threats while enabling operational insights."
    }
]

DEFAULT_HONEYWELL_INDUSTRIES = [
    "Oil & Gas Refining: Crude unit, FCCU, and hydroprocessing unit control.",
    "Petrochemicals: Olefins plants, polymer production, and complex batch control.",
    "LNG & Natural Gas Processing: Gas treatment, liquefaction, and export terminal automation.",
    "Power & Utilities: Plant-wide DCS for conventional and combined-cycle power plants."
]