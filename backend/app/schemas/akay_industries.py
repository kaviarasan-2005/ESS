from typing import Optional, List, Any
from pydantic import BaseModel, Field, model_validator


# ==========================================
# AKAY BANNER / HERO SCHEMAS
# ==========================================

class AKAYBannerHeader(BaseModel):
    title: Optional[str] = Field(
        default="AKAY Industries",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Centrifugal Pumps & Chemical Process Solutions",
        description="Optional subtitle or tagline displayed below the title"
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
        """Ensure image field compatibility across legacy field naming."""
        if isinstance(values, dict):
            if values.get("title") is None:
                values["title"] = "AKAY Industries"
            if values.get("subtitle") is None:
                values["subtitle"] = "Centrifugal Pumps & Chemical Process Solutions"

            img = (
                values.get("bg_image")
                or values.get("bg_image_url")
                or values.get("image_url")
                or ""
            )
            values["bg_image"] = img
            values["bg_image_url"] = img
        return values


class AKAYBannerHeaderResponse(BaseModel):
    success: bool = True
    data: AKAYBannerHeader


# ==========================================
# AKAY OVERVIEW SCHEMAS
# ==========================================

class AKAYOverview(BaseModel):
    title: Optional[str] = Field(
        default="AKAY Industries Centrifugal Pumps",
        description="Overview section main heading"
    )
    description: Optional[str] = Field(
        default=(
            "When your process depends on moving aggressive, high-purity, or "
            "temperature-sensitive fluids, you need a pump that combines robust "
            "engineering with precise performance. ESS-ME is the trusted supplier "
            "of AKAY Industries centrifugal pumps, delivering rugged reliability for "
            "the most challenging applications in the Middle East's chemical, "
            "petrochemical, and industrial sectors. We provide pumping solutions "
            "engineered to handle corrosive chemicals, cryogenic liquids, and "
            "high-temperature fluids with unwavering durability."
        ),
        description="Detailed overview text describing AKAY centrifugal pumps"
    )
    image: Optional[str] = Field(
        default="",
        description="Featured image URL path"
    )
    image_url: Optional[str] = Field(
        default="",
        description="Synced featured image URL path"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_image(cls, values: Any) -> Any:
        if isinstance(values, dict):
            # Handle null values gracefully
            if values.get("title") is None:
                values["title"] = "AKAY Industries Centrifugal Pumps"
            if values.get("description") is None:
                values["description"] = ""
                
            img = values.get("image_url") or values.get("image") or ""
            values["image"] = img
            values["image_url"] = img
        return values


class AKAYOverviewResponse(BaseModel):
    success: bool = True
    data: AKAYOverview


# ==========================================
# AKAY PUMP PORTFOLIO & DETAILS SCHEMAS
# ==========================================

class PortfolioCard(BaseModel):
    id: Optional[str] = ""
    title: str = ""
    description: Optional[str] = ""

    @model_validator(mode="before")
    @classmethod
    def sanitize_card(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if values.get("title") is None:
                values["title"] = ""
            if values.get("description") is None:
                values["description"] = ""
        return values


class KeyBulletItem(BaseModel):
    id: Optional[str] = ""
    label: str = ""
    detail: Optional[str] = ""


class AKAYDetailsContent(BaseModel):
    environment_title: Optional[str] = Field(
        default="Reliable in Harsh Process Environments",
        description="Top main heading"
    )
    environment_description: Optional[str] = Field(
        default=(
            "AKAY Industries brings a passion for manufacturing high-quality centrifugal pumps "
            "that meet rigorous international standards. Their pumps are renowned for superior hydraulics, "
            "robust mechanical seals, and construction from a wide range of corrosion-resistant materials."
        ),
        description="Top environment description text"
    )
    portfolio_title: Optional[str] = Field(
        default="Our AKAY Pumps Portfolio",
        description="Portfolio sub-section heading"
    )
    portfolio_description: Optional[str] = Field(
        default=(
            "We offer a comprehensive range of AKAY pumps, each designed to excel in specific fluid handling duties. "
            "Our technical team provides expert selection support to match the pump's material of construction, seal technology, "
            "and hydraulic performance to your exact process requirements."
        ),
        description="Portfolio description text"
    )
    cards: Optional[List[PortfolioCard]] = Field(default_factory=list)
    advantage_title: Optional[str] = Field(
        default="The ESS-ME Advantage: Your Fluid Handling Partner",
        description="Partner section heading"
    )
    advantage_description: Optional[str] = Field(
        default="We go beyond supply to ensure your pumping success. Our services include:",
        description="Partner intro text"
    )
    advantage_bullets: Optional[List[KeyBulletItem]] = Field(default_factory=list)
    industries_title: Optional[str] = Field(
        default="Industries & Applications",
        description="Industries section heading"
    )
    industries_bullets: Optional[List[KeyBulletItem]] = Field(default_factory=list)

    @model_validator(mode="before")
    @classmethod
    def sync_details(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if values.get("environment_title") is None:
                values["environment_title"] = "Reliable in Harsh Process Environments"
            if values.get("portfolio_title") is None:
                values["portfolio_title"] = "Our AKAY Pumps Portfolio"
            if values.get("advantage_title") is None:
                values["advantage_title"] = "The ESS-ME Advantage: Your Fluid Handling Partner"
            if values.get("industries_title") is None:
                values["industries_title"] = "Industries & Applications"

            if not isinstance(values.get("cards"), list):
                values["cards"] = []
            if not isinstance(values.get("advantage_bullets"), list):
                values["advantage_bullets"] = []
            if not isinstance(values.get("industries_bullets"), list):
                values["industries_bullets"] = []
        return values


class AKAYDetailsResponse(BaseModel):
    success: bool = True
    data: AKAYDetailsContent


# ==========================================
# AKAY PRODUCTS & SUPPORT SCHEMAS
# ==========================================

class AKAYProductItem(BaseModel):
    id: Optional[str] = ""
    title: str = ""
    subtitle: Optional[str] = ""
    description: Optional[str] = ""
    image_url: Optional[str] = ""

    @model_validator(mode="before")
    @classmethod
    def sync_product_item(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if values.get("title") is None:
                values["title"] = ""
            if values.get("description") is None:
                values["description"] = ""
            img = values.get("image_url") or values.get("image") or ""
            values["image_url"] = img
        return values


class AKAYSupportFeature(BaseModel):
    id: Optional[str] = ""
    title: str = ""
    description: Optional[str] = ""
    icon: Optional[str] = "shield"


class AKAYProductsSupport(BaseModel):
    heading: Optional[str] = Field(
        default="AKAY Products & Comprehensive Technical Support",
        description="Section main heading"
    )
    subheading: Optional[str] = Field(
        default="Delivering robust fluid handling systems and lifecycle field service.",
        description="Section subheading"
    )
    products: Optional[List[AKAYProductItem]] = Field(default_factory=list)
    support_features: Optional[List[AKAYSupportFeature]] = Field(default_factory=list)

    @model_validator(mode="before")
    @classmethod
    def sync_products_support(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if values.get("heading") is None:
                values["heading"] = "AKAY Products & Comprehensive Technical Support"
            if values.get("subheading") is None:
                values["subheading"] = "Delivering robust fluid handling systems and lifecycle field service."
            if not isinstance(values.get("products"), list):
                values["products"] = []
            if not isinstance(values.get("support_features"), list):
                values["support_features"] = []
        return values


class AKAYProductsSupportResponse(BaseModel):
    success: bool = True
    data: AKAYProductsSupport