from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


class HyosungBannerHeader(BaseModel):
    title: Optional[str] = Field(
        default="Hyosung Goodsprings",
        description="Main banner header title"
    )
    subtitle: Optional[str] = Field(
        default="Industrial Pump & Fluid Handling Solutions",
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
            if not values.get("title"):
                values["title"] = "Hyosung Goodsprings"

            if values.get("subtitle") is None:
                values["subtitle"] = "Industrial Pump & Fluid Handling Solutions"

            # Strictly preserve empty strings so no automatic fallback image is assigned
            img = values.get("bg_image_url") if values.get("bg_image_url") is not None else values.get("bg_image", "")
            values["bg_image"] = img
            values["bg_image_url"] = img

        return values


class HyosungBannerHeaderResponse(BaseModel):
    success: bool = True
    data: HyosungBannerHeader

class HyosungOverviewSection(BaseModel):
    title: Optional[str] = Field(
        default="Hyosung Goodsprings Industrial Pumps",
        description="Main header title for Hyosung overview"
    )
    description: Optional[str] = Field(
        default="From the heart of an industrial plant to the core of a city's infrastructure, reliable pumping is fundamental. ESS-ME supplies Hyosung Goodsprings industrial pumps, a comprehensive range of robust and efficient pumping solutions trusted across the Middle East. We provide the hydraulic backbone for power generation, oil & gas facilities, and large-scale building services, ensuring continuous flow and operational dependability.",
        description="Overview paragraph description"
    )
    card_image: Optional[str] = Field(
        default="",
        description="Image URL for featured brand graphic card"
    )
    card_image_url: Optional[str] = Field(
        default="",
        description="Synced Image URL for featured brand graphic card"
    )
    card_fallback_title: Optional[str] = Field(
        default="HYOSUNG GOODSPRINGS",
        description="Fallback header text rendered inside the white card when no image is uploaded"
    )
    card_fallback_subtitle: Optional[str] = Field(
        default="PUMPS & WATER",
        description="Fallback subtitle text rendered inside the white card when no image is uploaded"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Hyosung Goodsprings Industrial Pumps"

            img = values.get("card_image_url") if values.get("card_image_url") is not None else values.get("card_image", "")
            values["card_image"] = img
            values["card_image_url"] = img

            if not values.get("card_fallback_title"):
                values["card_fallback_title"] = "HYOSUNG GOODSPRINGS"
            if not values.get("card_fallback_subtitle"):
                values["card_fallback_subtitle"] = "PUMPS & WATER"

        return values


class HyosungOverviewResponse(BaseModel):
    success: bool = True
    data: HyosungOverviewSection



class HyosungDetailsSection(BaseModel):
    performance_title: Optional[str] = Field(
        default="Proven Hydraulic Performance for Industrial Applications",
        description="Main section header title"
    )
    performance_description: Optional[str] = Field(
        default="Hyosung Goodsprings has built a global reputation by manufacturing pumps that set market trends for durability and energy efficiency. Their diverse product line is engineered to deliver consistent performance under high-load conditions, making them a preferred choice for engineers and contractors who prioritize long-term reliability and lower total cost of ownership in their projects.",
        description="Performance description body text"
    )

    portfolio_title: Optional[str] = Field(
        default="Our Hyosung Goodsprings Pump Portfolio",
        description="Portfolio section heading"
    )
    portfolio_description: Optional[str] = Field(
        default="Our portfolio covers a wide spectrum of needs, from high-pressure industrial services to essential water supply and circulation. We help you navigate their extensive range to select the ideal pump for your specific duty, pressure, and application requirements.",
        description="Portfolio description body text"
    )

    card_one_title: Optional[str] = Field(
        default="Industrial Process & Plant Pumps",
        description="Card 1 title"
    )
    card_one_description: Optional[str] = Field(
        default="Engineered for the toughest environments, our Hyosung industrial plant pumps are built for continuous operation in power plants, refineries, and general industrial facilities. These robust pumps handle high-temperature water, cooling media, and various process fluids, ensuring uninterrupted production and process stability.",
        description="Card 1 description"
    )

    card_two_title: Optional[str] = Field(
        default="Water Supply, Circulation & Pressure Boosting Systems",
        description="Card 2 title"
    )
    card_two_description: Optional[str] = Field(
        default="Ensure consistent water flow for communities and facilities. We supply Hyosung pumps designed for potable water supply, sewage transfer, rainwater drainage, and irrigation. Additionally, our range includes multi-stage pressure booster systems essential for maintaining stable water pressure in high-rise buildings and large commercial complexes.",
        description="Card 2 description"
    )

    support_title: Optional[str] = Field(
        default="Application-Focused Support",
        description="Support section title"
    )
    support_description: Optional[str] = Field(
        default="We provide more than just pumps. Our focus is on delivering a holistic solution. Our team offers expert application engineering to ensure perfect pump selection and integration. Combined with our local inventory and technical support, we guarantee a seamless experience from specification to operation.",
        description="Support section body text"
    )

    uses_title: Optional[str] = Field(
        default="Common Uses",
        description="Common uses list section title"
    )
    uses_items: Optional[List[str]] = Field(
        default=[
            "Power Generation: Boiler feed, cooling water circulation, condensate transfer.",
            "Oil & Gas: Water injection, cooling loops, general service applications.",
            "Water & Wastewater: Raw water intake, sewage pumping, treatment plant circulation.",
            "Building Services: HVAC circulation, district cooling, fire fighting systems, potable water boosting."
        ],
        description="Common uses list items"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_details_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("performance_title"):
                values["performance_title"] = "Proven Hydraulic Performance for Industrial Applications"
            if not values.get("portfolio_title"):
                values["portfolio_title"] = "Our Hyosung Goodsprings Pump Portfolio"
            if not values.get("support_title"):
                values["support_title"] = "Application-Focused Support"
            if not values.get("uses_title"):
                values["uses_title"] = "Common Uses"

        return values


class HyosungDetailsResponse(BaseModel):
    success: bool = True
    data: HyosungDetailsSection