from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


class VogelsangBanner(BaseModel):
    title: str = Field(
        default="Vogelsang",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Pumping, Macerating, Disintegrating & Spreading Technology",
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
                values["title"] = "Vogelsang"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class VogelsangBannerResponse(BaseModel):
    success: bool = True
    data: VogelsangBanner


class VogelsangOverview(BaseModel):
    title: str = Field(
        default="Vogelsang Wastewater Equipment",
        description="Main overview section title"
    )
    paragraph_1: str = Field(
        default=(
            "To conduct efficient wastewater and industrial processing, one needs to avoid clogs, jams, and downtime. "
            "ESS-ME supplies Vogelsang wastewater equipment, delivering German-engineered solutions specifically designed "
            "to handle the toughest solids-laden and viscous fluids."
        ),
        description="First overview paragraph text"
    )
    paragraph_2: Optional[str] = Field(
        default=(
            "Our robust chopper pumps, macerators, and rotary lobe pumps are engineered to eliminate blockages, "
            "reduce maintenance costs, and ensure continuous, reliable operation for municipal and industrial applications across the GCC."
        ),
        description="Second overview paragraph text"
    )
    image_url: Optional[str] = Field(
        default="",
        description="Featured product image/brand graphic URL"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Vogelsang Wastewater Equipment"
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "To conduct efficient wastewater and industrial processing, one needs to avoid clogs, jams, and downtime. "
                    "ESS-ME supplies Vogelsang wastewater equipment, delivering German-engineered solutions specifically designed "
                    "to handle the toughest solids-laden and viscous fluids."
                )
            if not values.get("paragraph_2"):
                values["paragraph_2"] = (
                    "Our robust chopper pumps, macerators, and rotary lobe pumps are engineered to eliminate blockages, "
                    "reduce maintenance costs, and ensure continuous, reliable operation for municipal and industrial applications across the GCC."
                )
        return values


class VogelsangOverviewResponse(BaseModel):
    success: bool = True
    data: VogelsangOverview


class VogelsangProductCard(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for product card")
    title: str = Field(..., description="Card title")
    description: str = Field(..., description="Card content description")


class VogelsangDetails(BaseModel):
    # Section 1: Intro Header
    header_title: str = Field(
        default="German Engineering for the Most Demanding Fluid Handling",
        description="Main section title"
    )
    header_description: str = Field(
        default=(
            "For nearly a century, Vogelsang has been a global specialist in developing highly engineered equipment that is both powerful and easy to maintain. "
            "Their innovative technologies, such as the rotary lobe pump with integrated chopper technology, are built to process challenging media with high solid content, "
            "fibrous materials, and abrasive slurries without failure, making them ideal for the region's demanding wastewater and industrial sectors."
        ),
        description="Main section intro description"
    )

    # Section 2: Product Line Cards
    product_line_title: str = Field(
        default="Our Vogelsang Product Line",
        description="Product line section heading"
    )
    product_line_description: str = Field(
        default=(
            "We provide a range of Vogelsang products that solve specific clogging and handling problems. "
            "From raw sewage pumping to delicate shear-sensitive fluids, our solutions ensure smooth and efficient processing from intake to discharge."
        ),
        description="Product line subsection intro"
    )
    cards: List[VogelsangProductCard] = Field(
        default_factory=list,
        description="List of product line cards"
    )

    # Section 3: ESS-ME Advantage
    advantage_title: str = Field(
        default="ESS-ME Advantage: Application-Specific Solutions",
        description="Advantage section heading"
    )
    advantage_subtitle: str = Field(
        default="We provide more than equipment; we deliver performance guarantees. Our services include:",
        description="Advantage section subtitle"
    )
    advantage_list: List[str] = Field(
        default_factory=list,
        description="List of value-added service bullets"
    )

    # Section 4: Primary Applications
    applications_title: str = Field(
        default="Primary Applications",
        description="Applications section heading"
    )
    applications_list: List[str] = Field(
        default_factory=list,
        description="List of primary application bullets"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_details_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("header_title"):
                values["header_title"] = "German Engineering for the Most Demanding Fluid Handling"
            if "cards" not in values or not values["cards"]:
                values["cards"] = DEFAULT_VOGELSANG_CARDS
            if "advantage_list" not in values or not values["advantage_list"]:
                values["advantage_list"] = DEFAULT_VOGELSANG_ADVANTAGES
            if "applications_list" not in values or not values["applications_list"]:
                values["applications_list"] = DEFAULT_VOGELSANG_APPLICATIONS
        return values


class VogelsangDetailsResponse(BaseModel):
    success: bool = True
    data: VogelsangDetails


# DEFAULT FALLBACK DATA
DEFAULT_VOGELSANG_CARDS = [
    {
        "id": "card_1",
        "title": "Chopper Pumps & Macerators",
        "description": "Eliminate ragging and clogging at the source. Vogelsang chopper pumps feature a cutting rotor that proactively shreds solids and fibrous materials like plastics, textiles, and hygiene products into fine particles before they enter the pump. This technology is essential for reliable operation in wastewater intake stations, sludge transfer, and industrial waste handling, preventing costly blockages and pump damage."
    },
    {
        "id": "card_2",
        "title": "Rotary Lobe Pumps",
        "description": "Handle viscous, abrasive, and shear-sensitive fluids with gentle efficiency. Vogelsang rotary lobe pumps offer a non-pulsating, low-shear transfer ideal for demanding industrial and biogas applications. Their robust design, reversible flow, and dry-run capability make them perfect for handling sludge, grease, food products, and chemicals with minimal product degradation and maximum reliability."
    }
]

DEFAULT_VOGELSANG_ADVANTAGES = [
    "Expert Selection: Analyzing your media to recommend the perfect Vogelsang technology.",
    "Installation & Commissioning: Ensuring your system is optimized for peak performance from day one.",
    "Local Spare Parts & Service: Minimizing downtime with rapid access to genuine wear parts and expert maintenance."
]

DEFAULT_VOGELSANG_APPLICATIONS = [
    "Municipal Wastewater: Raw sewage pumping, sludge transfer, and screenings handling.",
    "Biogas Plants: Substrate feeding, digestate transfer, and mixing.",
    "Industrial Processing: Waste handling, abrasive slurry transfer, and food product pumping.",
    "Marine & Ports: Bilge water, blackwater, and sludge handling."
]