from typing import Optional, List, Any
from pydantic import BaseModel, Field, model_validator


# ==========================================
# EATON MEDC BANNER SCHEMAS
# ==========================================

class EatonMedcBannerHeader(BaseModel):
    title: Optional[str] = Field(
        default="Eaton MEDC",
        description="Primary main banner header title"
    )
    carousel_titles: List[str] = Field(
        default_factory=lambda: [
            "Eaton MEDC",
            "Explosion-Proof Visual & Audible Signals"
        ],
        description="Two-title text carousel list for rotating hero header text"
    )
    subtitle: Optional[str] = Field(
        default="Explosion Proof Visual & Audible Warning Signals",
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
            # Ensure primary title
            if not values.get("title"):
                values["title"] = "Eaton MEDC"

            # Ensure two-title carousel array
            carousel = values.get("carousel_titles")
            if not carousel or not isinstance(carousel, list) or len(carousel) == 0:
                values["carousel_titles"] = [
                    values.get("title") or "Eaton MEDC",
                    "Explosion-Proof Visual & Audible Signals"
                ]
            elif len(carousel) == 1:
                values["carousel_titles"] = [
                    carousel[0],
                    "Explosion-Proof Visual & Audible Signals"
                ]

            if values.get("subtitle") is None:
                values["subtitle"] = "Explosion Proof Visual & Audible Warning Signals"

            # Sync background image fields
            img = (
                values.get("bg_image")
                or values.get("bg_image_url")
                or values.get("image_url")
                or ""
            )
            values["bg_image"] = img
            values["bg_image_url"] = img

        return values


class EatonMedcBannerHeaderResponse(BaseModel):
    success: bool = True
    data: EatonMedcBannerHeader


# from typing import Optional, List, Any
# from pydantic import BaseModel, Field, model_validator


# ==========================================
# EATON MEDC OVERVIEW SCHEMAS
# ==========================================

class EatonMedcOverview(BaseModel):
    description: Optional[str] = Field(
        default=(
            "In potentially explosive atmospheres, standard electrical equipment becomes a liability. "
            "ESS-ME is the trusted supplier of Eaton explosion-proof and hazardous area equipment "
            "in the Middle East, providing certified safety solutions for the Oil & Gas, chemical, "
            "and pharmaceutical industries. We supply the robust lighting, plugs, and enclosures "
            "designed to contain internal explosions and prevent the ignition of external flammable gases, "
            "dusts, and vapors, ensuring compliance and protecting your workforce."
        ),
        description="Main overview section text description"
    )
    image: Optional[str] = Field(default="", description="Uploaded image URL path")
    image_url: Optional[str] = Field(default="", description="Synced uploaded image URL path")

    @model_validator(mode="before")
    @classmethod
    def sync_overview_image(cls, values: Any) -> Any:
        if isinstance(values, dict):
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


class EatonMedcOverviewResponse(BaseModel):
    success: bool = True
    data: EatonMedcOverview



# ==========================================
# EATON MEDC DETAILS SCHEMAS
# ==========================================
class EatonProductCard(BaseModel):
    title: str = Field(default="", description="Card heading")
    description: str = Field(default="", description="Card body text")


class EatonBulletedItem(BaseModel):
    title: str = Field(default="", description="Item title/label")
    description: str = Field(default="", description="Item detail description")


class EatonMedcDetailsContent(BaseModel):
    safety_title: str = Field(
        default="Safety in Hazardous Environments"
    )
    safety_description: str = Field(
        default=(
            "Eaton's Crouse-Hinds series is globally recognized for setting the standard in hazardous location technology. "
            "Their products are engineered with rugged integrity and are certified to international standards (ATEX, IECEx) "
            "for use in Zone 1, Zone 2, and Division 1 & 2 areas. This ensures complete reliability in the challenging and "
            "volatile environments prevalent across the GCC's energy and processing sectors."
        )
    )
    range_title: str = Field(
        default="Our Eaton (MEDC) Product Range"
    )
    range_description: str = Field(
        default=(
            "We provide a comprehensive range of Eaton's engineered solutions, forming a complete ecosystem for safe electrical "
            "distribution and illumination in classified areas. Our experts help you select the correct equipment for your specific "
            "area classification and environmental conditions."
        )
    )
    product_cards: List[EatonProductCard] = Field(
        default_factory=lambda: [
            EatonProductCard(
                title="Explosion-Proof Lighting & Lighting Systems",
                description=(
                    "Ensure safe visibility without compromising safety. Our range of Eaton explosion-proof lighting includes "
                    "LED light fixtures, floodlights, and emergency luminaires designed to operate safely and efficiently in "
                    "hazardous locations. These fixtures prevent internal arcs or sparks from igniting the surrounding atmosphere, "
                    "providing reliable illumination for offshore platforms, refinery process areas, and chemical plant walkways."
                )
            ),
            EatonProductCard(
                title="Industrial Plugs, Sockets & Connectors",
                description=(
                    "Enable safe and versatile power and data connectivity. We supply Eaton industrial plugs and sockets that are "
                    "designed to be mate-under-load and have interlocked switches for absolute safety. These durable, color-coded connectors "
                    "prevent disconnection under load and are essential for portable equipment, machinery, and tools used in Zone 1 and 2 areas."
                )
            ),
            EatonProductCard(
                title="Junction Boxes, Enclosures & Control Stations",
                description=(
                    "Protect your electrical connections and control devices. Our Eaton explosion-proof junction boxes and control stations "
                    "are constructed from robust materials like copper-free aluminum and stainless steel to withstand corrosion. They house "
                    "electrical components safely, containing any potential internal ignition and protecting against environmental ingress with high IP ratings."
                )
            )
        ]
    )
    advantage_title: str = Field(
        default="The ESS-ME Advantage: Your Safety Compliance Partner"
    )
    advantage_description: str = Field(
        default="We provide more than just products; we offer assurance. Our services include:"
    )
    advantage_items: List[EatonBulletedItem] = Field(
        default_factory=lambda: [
            EatonBulletedItem(
                title="Area Classification Review",
                description="Assisting in selecting the right equipment for your specific hazardous zone."
            ),
            EatonBulletedItem(
                title="Technical Support",
                description="Providing guidance on installation best practices to maintain certification integrity."
            ),
            EatonBulletedItem(
                title="Local Inventory",
                description="Ensuring rapid availability of critical safety components to minimize project delays and maintenance downtime."
            )
        ]
    )
    industries_title: str = Field(
        default="Industries Served"
    )
    industry_items: List[EatonBulletedItem] = Field(
        default_factory=lambda: [
            EatonBulletedItem(
                title="Oil & Gas",
                description="Offshore platforms, onshore gas plants, refineries, and pipeline stations."
            ),
            EatonBulletedItem(
                title="Chemical & Pharmaceutical",
                description="Chemical processing plants, solvent storage areas, and batch production facilities."
            ),
            EatonBulletedItem(
                title="Water & Wastewater",
                description="Pump stations and treatment areas where flammable gases may be present."
            ),
            EatonBulletedItem(
                title="Mining & Bulk Handling",
                description="Grain silos, coal handling plants, and other dust-laden environments."
            )
        ]
    )


class EatonMedcDetailsResponse(BaseModel):
    success: bool = True
    data: EatonMedcDetailsContent