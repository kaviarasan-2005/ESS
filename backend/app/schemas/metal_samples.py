from typing import Optional, List, Any
from pydantic import BaseModel, Field, model_validator


class MetalSamplesBanner(BaseModel):
    title: str = Field(
        default="Metal Samples",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Corrosion Monitoring & Material Evaluation Systems",
        description="Sub-heading or tagline"
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
                values["title"] = "Metal Samples"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class MetalSamplesBannerResponse(BaseModel):
    success: bool = True
    data: MetalSamplesBanner


class MetalSamplesOverview(BaseModel):
    title: str = Field(
        default="Metal Samples Corrosion Monitoring Products",
        description="Main overview section title heading"
    )
    paragraph_1: str = Field(
        default=(
            "Corrosion is a constant threat to your pipelines, vessels, and process equipment, "
            "leading to costly downtime, safety hazards, and catastrophic failures. ESS-ME is the "
            "authorized supplier of Metal Samples corrosion monitoring products, providing the essential "
            "tools for a proactive, data-driven asset integrity strategy. We equip industries across the "
            "Middle East with reliable solutions to measure, monitor, and mitigate corrosion, "
            "transforming your maintenance from reactive to predictive."
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
                values["title"] = "Metal Samples Corrosion Monitoring Products"
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "Corrosion is a constant threat to your pipelines, vessels, and process equipment, "
                    "leading to costly downtime, safety hazards, and catastrophic failures. ESS-ME is the "
                    "authorized supplier of Metal Samples corrosion monitoring products, providing the essential "
                    "tools for a proactive, data-driven asset integrity strategy. We equip industries across the "
                    "Middle East with reliable solutions to measure, monitor, and mitigate corrosion, "
                    "transforming your maintenance from reactive to predictive."
                )
        return values


class MetalSamplesOverviewResponse(BaseModel):
    success: bool = True
    data: MetalSamplesOverview


class MetalCard(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for card")
    title: str = Field(..., description="Card title")
    description: str = Field(..., description="Card description text")


class MetalSamplesDetails(BaseModel):
    # Section 1: Global Standard Header
    global_title: str = Field(
        default="Global Standard in Corrosion/Erosion Monitoring",
        description="Global standard heading"
    )
    global_description: str = Field(
        default=(
            "For over four decades, Metal Samples has been the industry benchmark for corrosion and erosion monitoring technology. "
            "Trusted by chemical plants, water treatment facilities, and oil & gas operators worldwide, their products deliver the "
            "accurate, actionable data needed to optimize chemical treatment programs, validate materials performance, and schedule "
            "maintenance proactively, ultimately extending asset life and ensuring operational safety."
        ),
        description="Global standard section description"
    )

    # Section 2: Product Range & 2 Cards
    range_title: str = Field(
        default="Our Metal Samples Product Range",
        description="Product range heading"
    )
    range_description: str = Field(
        default=(
            "We provide a complete range of monitoring tools, from simple, cost-effective coupons for periodic checks to "
            "sophisticated electronic systems for real-time insight. Our experts help you design a monitoring program that fits your "
            "risk profile and data requirements."
        ),
        description="Product range description text"
    )
    cards: List[MetalCard] = Field(
        default_factory=list,
        description="Fixed list of 2 product range feature cards"
    )

    # Section 3: ESS-ME Advantage
    advantage_title: str = Field(
        default="ESS-ME Advantage: From Data to Decision",
        description="ESS-ME advantage section title"
    )
    advantage_intro: str = Field(
        default="We partner with you to build an effective corrosion management program. Our services include:",
        description="ESS-ME advantage introductory sentence"
    )
    advantage_points: List[str] = Field(
        default_factory=list,
        description="List of advantage bullet points"
    )

    # Section 4: Industries Reliant
    industries_title: str = Field(
        default="Industries Reliant on This Technology",
        description="Industries section heading"
    )
    industries_list: List[str] = Field(
        default_factory=list,
        description="List of industries bullet points"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_details_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("global_title"):
                values["global_title"] = "Global Standard in Corrosion/Erosion Monitoring"
            if "cards" not in values or not values["cards"]:
                values["cards"] = DEFAULT_METAL_CARDS
            if "advantage_points" not in values or not values["advantage_points"]:
                values["advantage_points"] = DEFAULT_METAL_ADVANTAGE_POINTS
            if "industries_list" not in values or not values["industries_list"]:
                values["industries_list"] = DEFAULT_METAL_INDUSTRIES
        return values


class MetalSamplesDetailsResponse(BaseModel):
    success: bool = True
    data: MetalSamplesDetails


# DEFAULT DATA MATCHING YOUR REFERENCE IMAGE
DEFAULT_METAL_CARDS = [
    {
        "id": "card_1",
        "title": "Corrosion Coupons & Weight Loss Analysis",
        "description": "Establish a reliable baseline for corrosion rates with the industry-standard method. Metal Samples corrosion coupons are precisely manufactured test specimens installed directly in your process stream. After a typical 90-day exposure, we facilitate expert analysis to determine the exact corrosion rate (in mils per year) and identify the type of attack, providing a proven record for integrity management and compliance."
    },
    {
        "id": "card_2",
        "title": "Electronic Corrosion Probes & Real-Time Monitoring",
        "description": "Move from periodic checks to continuous surveillance. Our electronic corrosion probes, including Electrical Resistance (ER) and Linear Polarization Resistance (LPR) probes, provide immediate, real-time data on corrosion rates. This enables instant detection of upsets in your process or chemical treatment program, allowing for immediate corrective action before significant damage occurs."
    }
]

DEFAULT_METAL_ADVANTAGE_POINTS = [
    "Program Design: Helping you determine optimal monitoring locations and techniques.",
    "Coupon Analysis & Reporting: Managing the entire coupon lifecycle and providing clear, actionable reports.",
    "System Integration: Setting up real-time probe data integration into your control or asset management system."
]

DEFAULT_METAL_INDUSTRIES = [
    "Oil & Gas Production: Monitoring corrosion in pipelines, wellheads, and separators.",
    "Chemical Processing: Tracking corrosion in reactors, heat exchangers, and distillation columns.",
    "Water & Wastewater: Assessing corrosivity in cooling water, effluent, and desalination plants.",
    "Power Generation: Protecting boiler feedwater systems and condensate return lines."
]