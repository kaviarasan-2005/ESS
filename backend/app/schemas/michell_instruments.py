from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


class MichellInstrumentsBanner(BaseModel):
    title: str = Field(
        default="Michell Instruments",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Dew Point, Humidity, and Oxygen Measurement Systems",
        description="Sub-heading or product line tagline"
    )
    bg_image_url: Optional[str] = Field(
        default="",
        description="Background overlay image URL"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_banner_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Michell Instruments"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class MichellInstrumentsBannerResponse(BaseModel):
    success: bool = True
    data: MichellInstrumentsBanner

class MichellInstrumentsOverview(BaseModel):
    title: str = Field(
        default="Michell Instruments Moisture & Dew Point Analyzers",
        description="Main overview section title heading"
    )
    paragraph_1: str = Field(
        default=(
            "In countless industrial processes, water vapor is more than just a contaminant—it's a direct threat "
            "to product quality, operational safety, and asset integrity. ESS-ME is the regional supplier for Michell "
            "Instruments moisture and dew point analyzers, providing the gold standard in water vapor measurement for "
            "the Middle East's oil & gas, industrial, and manufacturing sectors. We deliver the precise, reliable "
            "data needed to prevent icing, corrosion, and product spoilage in your most critical applications."
        ),
        description="Primary overview paragraph text"
    )
    image_url: Optional[str] = Field(
        default="",
        description="Featured brand product/logo image URL"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Michell Instruments Moisture & Dew Point Analyzers"
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "In countless industrial processes, water vapor is more than just a contaminant—it's a direct threat "
                    "to product quality, operational safety, and asset integrity. ESS-ME is the regional supplier for Michell "
                    "Instruments moisture and dew point analyzers, providing the gold standard in water vapor measurement for "
                    "the Middle East's oil & gas, industrial, and manufacturing sectors. We deliver the precise, reliable "
                    "data needed to prevent icing, corrosion, and product spoilage in your most critical applications."
                )
        return values


class MichellInstrumentsOverviewResponse(BaseModel):
    success: bool = True
    data: MichellInstrumentsOverview





class MichellCard(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for card")
    title: str = Field(..., description="Card title")
    description: str = Field(..., description="Card description text")


class MichellInstrumentsDetails(BaseModel):
    # Section 1: Importance Header
    importance_title: str = Field(
        default="Importance of Moisture Measurement",
        description="Importance section heading"
    )
    importance_description: str = Field(
        default=(
            "For decades, Michell Instruments has been the definitive name in moisture analysis, "
            "setting the benchmark for accuracy, reliability, and innovation. Their sensors and "
            "analyzers are engineered to deliver trustworthy data in the most challenging conditions, "
            "from the high pressures of natural gas pipelines to the dry environments of instrument air "
            "systems. Partnering with Michell ensures you have a measurement you can base critical decisions on."
        ),
        description="Importance section description"
    )

    # Section 2: Product Solutions & 2 Cards
    solutions_title: str = Field(
        default="Our Michell Instruments Product Solutions",
        description="Product solutions heading"
    )
    solutions_description: str = Field(
        default=(
            "We provide a comprehensive range of Michell's industry-leading technologies, each designed to "
            "excel in specific moisture measurement applications. Our experts will help you select the correct "
            "sensor technology and analyzer for your pressure, temperature, and required measurement range."
        ),
        description="Product solutions description text"
    )
    cards: List[MichellCard] = Field(
        default_factory=list,
        description="Fixed list of 2 product solution feature cards"
    )

    # Section 3: Expert Application Support
    support_title: str = Field(
        default="Expert Application Support",
        description="Support section title"
    )
    support_intro: str = Field(
        default="We provide more than just an instrument; we deliver a solution tailored to your process. Our services include:",
        description="Support section introductory sentence"
    )
    support_points: List[str] = Field(
        default_factory=list,
        description="List of support bullet points"
    )

    # Section 4: Typical Applications
    applications_title: str = Field(
        default="Typical Applications",
        description="Applications section heading"
    )
    applications_list: List[str] = Field(
        default_factory=list,
        description="List of typical applications bullet points"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_details_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("importance_title"):
                values["importance_title"] = "Importance of Moisture Measurement"
            if "cards" not in values or not values["cards"]:
                values["cards"] = DEFAULT_MICHELL_CARDS
            if "support_points" not in values or not values["support_points"]:
                values["support_points"] = DEFAULT_MICHELL_SUPPORT_POINTS
            if "applications_list" not in values or not values["applications_list"]:
                values["applications_list"] = DEFAULT_MICHELL_APPLICATIONS
        return values


class MichellInstrumentsDetailsResponse(BaseModel):
    success: bool = True
    data: MichellInstrumentsDetails


# DEFAULT DATA MATCHING YOUR REFERENCE IMAGE
DEFAULT_MICHELL_CARDS = [
    {
        "id": "card_1",
        "title": "Dew Point Transmitters & Analyzers",
        "description": "Prevent condensation and its costly consequences with precise dew point measurement. Michell's dew point transmitters are the most common and critical parameter for ensuring gas streams remain free of liquid water. We supply a range of models, from robust, cost-effective instruments for general compressed air monitoring to high-accuracy, certified analyzers for natural gas custody transfer, where measurement integrity is paramount for fiscal calculations."
    },
    {
        "id": "card_2",
        "title": "Trace Moisture Analyzers for Ultra-Dry Gases",
        "description": "Protect sensitive processes where even ppm-level moisture can cause damage. Our trace moisture analyzers are essential for applications in industrial gas production (e.g., nitrogen, oxygen), petrochemical cracking, and power transformer monitoring. These sophisticated instruments detect water vapor concentrations at parts-per-million (ppm) and even parts-per-billion (ppb) levels, safeguarding catalysts, preventing ice formation in cryogenic systems, and ensuring dielectric strength."
    }
]

DEFAULT_MICHELL_SUPPORT_POINTS = [
    "Technical Selection: Guiding you to the right technology for your specific gas matrix and moisture range.",
    "Commissioning & Calibration: Ensuring your analyzer is installed correctly and providing accurate, traceable data from day one.",
    "Support & Service: Offering maintenance, sensor replacement, and recalibration services to ensure long-term reliability."
]

DEFAULT_MICHELL_APPLICATIONS = [
    "Natural Gas Drying: Monitoring the output of glycol dehydrators and desiccant dryers.",
    "Instrument Air Systems: Ensuring compressed air is dry enough to prevent corrosion in pneumatic instruments.",
    "Industrial Gas Production: Controlling moisture levels in nitrogen, oxygen, and argon production.",
    "Petrochemicals: Monitoring reactor feed gases and protecting sensitive catalysts from moisture poisoning."
]