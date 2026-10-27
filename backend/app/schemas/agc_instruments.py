from pydantic import BaseModel, Field, model_validator
from typing import List, Optional

# ==========================================
# 1. AGC BANNER HEADER SCHEMAS
# ==========================================

class AGCBannerHeader(BaseModel):
    title: str = "AGC Instruments"
    subtitle: Optional[str] = "Gas Chromatographs & Analysers"
    bg_image: Optional[str] = ""
    bg_image_url: Optional[str] = ""

    @model_validator(mode="before")
    @classmethod
    def sync_banner_bg(cls, values: dict) -> dict:
        if isinstance(values, dict):
            img = (
                values.get("bg_image")
                or values.get("bg_image_url")
                or values.get("image_url")
                or ""
            )
            values["bg_image"] = img
            values["bg_image_url"] = img
        return values


class AGCBannerHeaderResponse(BaseModel):
    success: bool = True
    data: AGCBannerHeader


# ==========================================
# 2. AGC OVERVIEW SECTION SCHEMAS
# ==========================================

class AGCOverview(BaseModel):
    title: str = "AGC Instruments Gas Chromatographs & Analysers"
    description: str = (
        "In industries where gas composition directly impacts product quality, "
        "revenue, and safety, there is no room for estimation. ESS-ME is the "
        "trusted supplier of AGC Instruments gas chromatographs and process "
        "analyzers, delivering laboratory-grade precision for continuous online "
        "monitoring. We provide robust, reliable solutions for the Middle East's "
        "natural gas, petrochemical, and industrial sectors, ensuring you have "
        "the accurate, real-time data needed for custody transfer, process "
        "optimization, and quality assurance."
    )
    image_url: Optional[str] = ""
    image: Optional[str] = ""

    @model_validator(mode="before")
    @classmethod
    def sync_overview_image(cls, values: dict) -> dict:
        if isinstance(values, dict):
            img = (
                values.get("image_url")
                or values.get("image")
                or values.get("bg_image")
                or ""
            )
            values["image_url"] = img
            values["image"] = img
        return values


class AGCOverviewResponse(BaseModel):
    success: bool = True
    data: AGCOverview


# ==========================================
# 3. AGC SOLUTIONS & SUPPORT SCHEMAS
# ==========================================

class AGCProductCard(BaseModel):
    title: str
    description: str


class AGCListItem(BaseModel):
    title: str
    description: str


class AGCSolutionsSupport(BaseModel):
    precision_title: str = "Precision Gas Analysis"
    precision_description: str = (
        "AGC Instruments has built a global reputation for manufacturing gas chromatographs and analyzers "
        "that stand up to the toughest process environments. Their technology is engineered for unwavering "
        "reliability and minimal maintenance, providing definitive composition data that operators can trust for critical decision-making. "
        "From percent-level down to part-per-million (ppm) concentrations, AGC delivers the analytical certainty required for efficient and profitable plant operations."
    )
    solutions_title: str = "Our AGC Product Solutions"
    solutions_description: str = (
        "We offer a focused portfolio of AGC's leading technologies, each designed to solve specific analytical challenges. "
        "Our technical team provides expert application consulting to ensure the system you select is perfectly configured for your gas stream, measurement components, and required speed of analysis."
    )
    product_cards: List[AGCProductCard] = [
        AGCProductCard(
            title="Process Gas Chromatographs (PGCs)",
            description=(
                "Achieve detailed hydrocarbon and natural gas analysis with the industry's most reliable Process Gas Chromatographs (PGCs). "
                "AGC's PGCs are the definitive solution for applications requiring detailed component separation, such as calculating the heating value (Wobbe Index) for custody transfer, "
                "monitoring reactor feed streams in petrochemical plants, and ensuring product specification in natural gas processing and LNG facilities."
            )
        ),
        AGCProductCard(
            title="Continuous Gas Analyzers & Monitoring Systems",
            description=(
                "For applications requiring rapid, continuous measurement of specific gases, we supply AGC's dedicated continuous gas analyzers. "
                "Utilizing advanced detection technologies like NDIR and Laser, these systems provide fast-response monitoring of critical parameters such as CO, CO2, H2S, and moisture (H2O) "
                "in process streams and emissions, enabling real-time process control and environmental compliance."
            )
        )
    ]
    support_title: str = "Our Integration & Service Support"
    support_description: str = "We ensure your AGC instrument becomes a valuable, reliable asset. Our services include:"
    support_items: List[AGCListItem] = [
        AGCListItem(
            title="Application Engineering",
            description="Defining the optimal analytical technique and system configuration for your needs."
        ),
        AGCListItem(
            title="System Commissioning",
            description="Expert startup and validation to ensure the analyzer is providing accurate data from day one."
        ),
        AGCListItem(
            title="Lifelong Support",
            description="Offering calibration services, preventative maintenance, and rapid spare parts supply to maximize analyzer uptime and data integrity."
        )
    ]
    industries_title: str = "Key Industries"
    industry_items: List[AGCListItem] = [
        AGCListItem(
            title="Natural Gas Custody Transfer",
            description="Precisely measuring heating value and composition for fiscal metering."
        ),
        AGCListItem(
            title="Petrochemical Processes",
            description="Analyzing feed and product streams in ethylene, propylene, and benzene plants."
        ),
        AGCListItem(
            title="Refinery Gas Analysis",
            description="Monitoring hydrogen purity, fuel gas composition, and flare gas streams."
        ),
        AGCListItem(
            title="Industrial Gases",
            description="Ensuring product purity and specification in air separation and synthesis gas plants."
        )
    ]


class AGCSolutionsSupportResponse(BaseModel):
    success: bool = True
    data: AGCSolutionsSupport