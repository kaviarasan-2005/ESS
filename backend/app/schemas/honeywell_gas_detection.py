from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


class HoneywellGasDetectionBanner(BaseModel):
    title: str = Field(
        default="Honeywell",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Gas & Flame Detection Systems",
        description="Sub-heading or product line tagline"
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
                values["title"] = "Honeywell"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class HoneywellGasDetectionBannerResponse(BaseModel):
    success: bool = True
    data: HoneywellGasDetectionBanner



class HoneywellGasDetectionOverview(BaseModel):
    title: str = Field(
        default="Honeywell Gas Detection Solutions",
        description="Main overview section title heading"
    )
    paragraph_1: str = Field(
        default=(
            "In hazardous industrial environments, personnel safety and plant integrity depend on "
            "uncompromising gas detection capabilities. ESS-ME is a certified Middle Eastern distributor "
            "for Honeywell Gas Detection, providing advanced toxic and combustible gas monitors, flame detectors, "
            "and controller units. We equip industrial facilities across the GCC with rugged, high-precision safety "
            "systems engineered to deliver immediate warnings and prevent catastrophic incidents."
        ),
        description="Primary overview paragraph text"
    )
    image_url: Optional[str] = Field(
        default="",
        description="Featured brand logo visual card image URL"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Honeywell Gas Detection Solutions"
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "In hazardous industrial environments, personnel safety and plant integrity depend on "
                    "uncompromising gas detection capabilities. ESS-ME is a certified Middle Eastern distributor "
                    "for Honeywell Gas Detection, providing advanced toxic and combustible gas monitors, flame detectors, "
                    "and controller units. We equip industrial facilities across the GCC with rugged, high-precision safety "
                    "systems engineered to deliver immediate warnings and prevent catastrophic incidents."
                )
        return values


class HoneywellGasDetectionOverviewResponse(BaseModel):
    success: bool = True
    data: HoneywellGasDetectionOverview


class HoneywellGasCard(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for card")
    title: str = Field(..., description="Card title")
    description: str = Field(..., description="Card description text")


class HoneywellGasDetectionDetails(BaseModel):
    # Header
    header_title: str = Field(
        default="Trusted Honeywell Gas Detection Solutions",
        description="Main header title"
    )
    header_description: str = Field(
        default=(
            "Honeywell Analytics sets the industry benchmark for gas detection excellence, "
            "offering an unrivalled offering of technical expertise and market-leading equipment. "
            "The goal is to provide an all-embracing resource for all things gas detection and establish "
            "the highest standards of safety and reliability. Our partnership ensures you receive this "
            "world-class technology, backed by our local engineers with over two decades of regional "
            "fire and gas system experience."
        ),
        description="Main header description"
    )

    # Product Range
    range_title: str = Field(
        default="Our Honeywell Product Range",
        description="Product range section title"
    )
    range_image_url: Optional[str] = Field(
        default="",
        description="Product range section image URL"
    )
    range_paragraph_1: str = Field(
        default=(
            "We provide a complete range of Honeywell gas detection technologies, "
            "from facility-wide monitoring networks to personal protective equipment."
        ),
        description="First product range paragraph"
    )
    range_paragraph_2: str = Field(
        default=(
            "ESSME's solutions are engineered for the harsh Middle Eastern climate. "
            "We are supported by lifelong calibration and maintenance services backed by "
            "our trusted partnership with Honeywell which we leverage on to benefit our customers.\n\n"
            "Two of our major offerings are Fixed Gas Detection Systems and Portable Gas Detectors."
        ),
        description="Second product range paragraph"
    )

    # Feature Cards (2 Cards)
    cards: List[HoneywellGasCard] = Field(
        default_factory=list,
        description="List of feature cards"
    )

    # Distributor Support
    support_title: str = Field(
        default="Honeywell Analytics Distributor Support",
        description="Distributor support section title"
    )
    support_points: List[str] = Field(
        default_factory=list,
        description="Support bullet points"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_details_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("header_title"):
                values["header_title"] = "Trusted Honeywell Gas Detection Solutions"
            if "cards" not in values or not values["cards"]:
                values["cards"] = DEFAULT_HONEYWELL_GAS_CARDS
            if "support_points" not in values or not values["support_points"]:
                values["support_points"] = DEFAULT_HONEYWELL_GAS_SUPPORT
        return values


class HoneywellGasDetectionDetailsResponse(BaseModel):
    success: bool = True
    data: HoneywellGasDetectionDetails


# DEFAULT DATA MATCHING YOUR REFERENCE IMAGE
DEFAULT_HONEYWELL_GAS_CARDS = [
    {
        "id": "card_1",
        "title": "Fixed Gas Detection Systems",
        "description": "Secure your entire facility with continuous, 24/7 monitoring. Our fixed gas detection systems feature Honeywell's XNX, Manning, and Sensepoint fixed detectors to create a networked safety system for toxic gases like H2S and combustible gases (LEL). These robust systems provide early leak detection, centralized alarm management, and seamless integration with your plant's fire and safety shutdown systems, ensuring a rapid and coordinated response to any gas threat."
    },
    {
        "id": "card_2",
        "title": "Portable Gas Detectors",
        "description": "Equip your personnel with their first line of defense. Our range of portable gas detectors includes both single-gas and multi-gas monitors for confined space entry, leak investigation, and personal safety. These intrinsically safe, rugged devices provide continuous protection against H2S, CO, O2 deficiency, and LEL hazards. Featuring clear visual and audible alarms, these ensure your teams have immediate warning in potentially lethal atmospheres."
    }
]

DEFAULT_HONEYWELL_GAS_SUPPORT = [
    "System Design & Integration: We design and engineer complete gas detection networks tailored to your facility's specific layout and risks.",
    "Certified Installation: Our technicians are factory-trained to ensure your system is installed to the highest standards.",
    "Lifelong Support: We offer comprehensive service contracts, including routine calibration, bump testing, and 24/7 emergency support to guarantee your system's integrity."
]



class HoneywellGasDetectionIndustries(BaseModel):
    section_title: str = Field(
        default="Industries We Serve",
        description="Main section title heading"
    )
    intro_text: str = Field(
        default="Our Honeywell gas detection solutions protect assets and personnel in the following major areas:",
        description="Introductory text preceding the bullet list"
    )
    industry_list: List[str] = Field(
        default_factory=lambda: [
            "Major Onshore/Offshore Oil & Gas companies",
            "Petrochemical Companies",
            "Power Plants",
            "Water & Waste Water Treatment plants/operators"
        ],
        description="List of targeted industry sectors"
    )
    poster_image_url: Optional[str] = Field(
        default="",
        description="Featured poster/brochure cover image URL"
    )
    poster_caption: Optional[str] = Field(
        default="Honeywell in Oil & Gas Applications",
        description="Caption text below the poster image"
    )
    footer_text: str = Field(
        default="Our applications range all across the Middle East, especially Qatar. To understand more about our services, send an email to our Honeywell Gas detection specialists and we will reach out to you right away.",
        description="Bottom description paragraph text"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_industries_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("section_title"):
                values["section_title"] = "Industries We Serve"
            if not values.get("intro_text"):
                values["intro_text"] = "Our Honeywell gas detection solutions protect assets and personnel in the following major areas:"
            if "industry_list" not in values or not values["industry_list"]:
                values["industry_list"] = DEFAULT_HONEYWELL_GAS_INDUSTRIES
            if not values.get("poster_caption"):
                values["poster_caption"] = "Honeywell in Oil & Gas Applications"
            if not values.get("footer_text"):
                values["footer_text"] = "Our applications range all across the Middle East, especially Qatar. To understand more about our services, send an email to our Honeywell Gas detection specialists and we will reach out to you right away."
        return values


class HoneywellGasDetectionIndustriesResponse(BaseModel):
    success: bool = True
    data: HoneywellGasDetectionIndustries


# DEFAULT DATA MATCHING YOUR REFERENCE IMAGE
DEFAULT_HONEYWELL_GAS_INDUSTRIES = [
    "Major Onshore/Offshore Oil & Gas companies",
    "Petrochemical Companies",
    "Power Plants",
    "Water & Waste Water Treatment plants/operators"
]