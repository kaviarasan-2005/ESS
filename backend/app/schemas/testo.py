from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


class TestoBanner(BaseModel):
    title: str = Field(
        default="Testo Portable Instruments",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Precision Measuring Solutions & Portable Instrumentation",
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
                values["title"] = "Testo Portable Instruments"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class TestoBannerResponse(BaseModel):
    success: bool = True
    data: TestoBanner


class TestoOverview(BaseModel):
    title: str = Field(
        default="Testo Portable Measurement Instruments",
        description="Main overview section title heading"
    )
    paragraph_1: str = Field(
        default=(
            "From optimizing combustion efficiency to ensuring perfect indoor air quality, "
            "accurate portable data is the key to operational excellence. ESS-ME is the "
            "authorized Middle Eastern distributor for Testo portable instruments, providing "
            "maintenance teams, facility managers, and service technicians with the precise, "
            "rugged, and easy-to-use tools they need."
        ),
        description="First paragraph description text"
    )
    paragraph_2: Optional[str] = Field(
        default=(
            "We supply a comprehensive range of portable flue gas analyzers, environmental "
            "meters, and thermal imagers trusted across the GCC's industrial, HVAC, and "
            "facilities management sectors."
        ),
        description="Second paragraph description text"
    )
    image_url: Optional[str] = Field(
        default="",
        description="Featured Testo logo/brand image URL"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Testo Portable Measurement Instruments"
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "From optimizing combustion efficiency to ensuring perfect indoor air quality, "
                    "accurate portable data is the key to operational excellence. ESS-ME is the "
                    "authorized Middle Eastern distributor for Testo portable instruments, providing "
                    "maintenance teams, facility managers, and service technicians with the precise, "
                    "rugged, and easy-to-use tools they need."
                )
            if not values.get("paragraph_2"):
                values["paragraph_2"] = (
                    "We supply a comprehensive range of portable flue gas analyzers, environmental "
                    "meters, and thermal imagers trusted across the GCC's industrial, HVAC, and "
                    "facilities management sectors."
                )
        return values


class TestoOverviewResponse(BaseModel):
    success: bool = True
    data: TestoOverview


class TestoProductSolutionCard(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for card")
    title: str = Field(..., description="Card title")
    description: str = Field(..., description="Card content description")


class TestoDetails(BaseModel):
    # Section 1: Intro Header
    header_title: str = Field(
        default="Comprehensive Portable Measurement Solutions",
        description="Main section title"
    )
    header_description: str = Field(
        default=(
            "Testo has been a global leader in portable measurement technology for decades, renowned for German engineering, accuracy, and durability. "
            "Their instruments are designed for the real-world conditions of the Middle East, providing reliable data that helps you reduce energy costs, ensure compliance, "
            "extend asset life through predictive maintenance, and guarantee product quality."
        ),
        description="Main section intro description"
    )

    # Section 2: Product Solutions Cards
    solutions_title: str = Field(
        default="Our Testo Product Solutions",
        description="Product solutions heading"
    )
    solutions_description: str = Field(
        default=(
            "Our portfolio covers critical measurement parameters for a wide range of industries. "
            "Whether you need to tune a boiler, validate an HVAC system, or inspect electrical panels, we have the right Testo instrument for your application."
        ),
        description="Product solutions subsection intro"
    )
    cards: List[TestoProductSolutionCard] = Field(
        default_factory=list,
        description="List of product solution feature cards"
    )

    # Section 3: The ESS-ME Advantage
    advantage_title: str = Field(
        default="The ESS-ME Advantage: More Than a Supplier",
        description="Advantage section heading"
    )
    advantage_subtitle: str = Field(
        default="We ensure you get the most from your investment. Our value-added services include:",
        description="Advantage section subtitle"
    )
    advantage_list: List[str] = Field(
        default_factory=list,
        description="List of value-added service bullets"
    )

    # Section 4: Industries We Serve
    industries_title: str = Field(
        default="Industries We Serve",
        description="Industries served section heading"
    )
    industries_list: List[str] = Field(
        default_factory=list,
        description="List of industry bullet points"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_details_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("header_title"):
                values["header_title"] = "Comprehensive Portable Measurement Solutions"
            if "cards" not in values or not values["cards"]:
                values["cards"] = DEFAULT_TESTO_CARDS
            if "advantage_list" not in values or not values["advantage_list"]:
                values["advantage_list"] = DEFAULT_TESTO_ADVANTAGES
            if "industries_list" not in values or not values["industries_list"]:
                values["industries_list"] = DEFAULT_TESTO_INDUSTRIES
        return values


class TestoDetailsResponse(BaseModel):
    success: bool = True
    data: TestoDetails


# DEFAULT FALLBACK DATA
DEFAULT_TESTO_CARDS = [
    {
        "id": "card_1",
        "title": "Flue Gas & Combustion Analyzers",
        "description": "Maximize fuel efficiency and ensure environmental compliance. Our Testo flue gas analyzers, like the popular Testo 310 and 330 models, provide precise measurements of O2, CO, NOx, and other emissions. These are essential tools for commissioning and servicing boilers, furnaces, and turbines, helping you optimize combustion, reduce fuel costs, and meet regional emissions standards."
    },
    {
        "id": "card_2",
        "title": "Thermal Imagers & Building Diagnostics Tools",
        "description": "See problems before they cause failures. Our Testo thermal imagers are powerful tools for predictive maintenance, allowing you to detect overheated electrical components, identify building insulation leaks, and spot blocked pipes. For HVAC and facilities management, we also supply tools for measuring airflow, humidity, temperature, and light levels, ensuring optimal building performance and occupant comfort."
    },
    {
        "id": "card_3",
        "title": "Food Safety & Environmental Meters",
        "description": "Ensure quality and safety at every stage. From the Testo 270 frying oil tester for quality control in commercial kitchens to robust pH and conductivity meters for water analysis, we provide the portable tools needed for stringent quality assurance and environmental monitoring in the food & beverage and water treatment industries."
    }
]

DEFAULT_TESTO_ADVANTAGES = [
    "Expert Selection: Helping you choose the right instrument and probes for your specific tasks.",
    "Calibration Services: Maintaining your instrument's accuracy with our professional calibration lab.",
    "Training & Support: Providing on-site training and technical support to empower your teams."
]

DEFAULT_TESTO_INDUSTRIES = [
    "HVAC & Facilities Management: Combustion analysis, HVAC system balancing, Indoor air quality (IAQ) assessment.",
    "Power & Industrial Plant Maintenance: Boiler tuning, electrical inspection, emissions monitoring.",
    "Food & Beverage: Cooking oil quality control, refrigeration monitoring, hygiene compliance checks.",
    "Energy Services & Audits: Building energy loss surveys, steam trap inspections, solar panel checks."
]