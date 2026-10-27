import time
from typing import List, Optional
from pydantic import BaseModel, Field, model_validator


# --- Product Item / Card Schema (Matches 5 Division Cards) ---
class ProductItem(BaseModel):
    id: str = Field(default_factory=lambda: f"prod-{int(time.time() * 1000)}")
    title: str = "Fire & Gas Systems"
    icon_name: Optional[str] = "Flame"         # Supports Lucide icons (Flame, Users, CircleDot, Layers, Share2)
    icon_url: Optional[str] = ""              # Supports custom uploaded SVG/Image icons
    button_text: Optional[str] = "KNOW MORE"   # Matches yellow button text in UI
    button_link: Optional[str] = ""
    description: Optional[str] = ""
    category: Optional[str] = "General"


# --- Header Sub-model ---
class ProductHeader(BaseModel):
    title: str = "Products"
    subtitle: Optional[str] = "Explore Our Industrial Grade Hardware & Equipment"
    bg_image: Optional[str] = ""      # Main hero background image URL
    bg_url: Optional[str] = ""         # Fallback alias for legacy compatibility
    image_url: Optional[str] = ""      # Fallback alias for legacy compatibility
    bg_color: Optional[str] = "#0b1727"

    @model_validator(mode="before")
    @classmethod
    def sync_header_image_urls(cls, values: dict) -> dict:
        """Ensures bg_image, bg_url, and image_url all share the uploaded image string."""
        if isinstance(values, dict):
            img = (
                values.get("bg_image")
                or values.get("bg_url")
                or values.get("image_url")
                or ""
            )
            values["bg_image"] = img
            values["bg_url"] = img
            values["image_url"] = img
        return values


# --- Overview/Content Section Sub-model ---
class ProductOverviewContent(BaseModel):
    paragraph_1: Optional[str] = (
        "ESS Middle East embrace a total systems approach to meet the growing operational & "
        "environmental monitoring demands of the Oil & Gas, Petrochemical & Power sector industries."
    )
    paragraph_2: Optional[str] = (
        "We offer products & services which are technically proven in the field, well supported by "
        "qualified service personnel & most economical with excellent return of investment."
    )
    button_text: Optional[str] = "Contact Us"
    button_link: Optional[str] = "/contact"
    image_url: Optional[str] = ""


# --- Complete Products Page Data Schema ---
class ProductPageData(BaseModel):
    header: ProductHeader = Field(default_factory=ProductHeader)
    content: ProductOverviewContent = Field(default_factory=ProductOverviewContent)
    items: List[ProductItem] = Field(default_factory=list)


# --- API Response Wrapper ---
class ProductPageResponse(BaseModel):
    success: bool = True
    data: ProductPageData