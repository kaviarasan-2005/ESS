from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


class ProminentMeteringBanner(BaseModel):
    title: str = Field(
        default="Prominent Metering",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Precision Chemical Dosing & Metering Pump Solutions",
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
                values["title"] = "Prominent Metering"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class ProminentMeteringBannerResponse(BaseModel):
    success: bool = True
    data: ProminentMeteringBanner



class ProminentMeteringOverview(BaseModel):
    title: str = Field(
        default="ProMinent Metering Pumps & Water Treatment",
        description="Main overview section title heading"
    )
    paragraph_1: str = Field(
        default=(
            "In industrial processes where chemical accuracy is critical to efficiency and safety, "
            "precision is non-negotiable. ESS-ME is the authorized Middle Eastern distributor for ProMinent "
            "Metering Pumps, the global leader in chemical dosing technology. We provide complete dosing solutions "
            "that deliver unmatched accuracy, reliability, and control for water treatment, oil & gas, and chemical "
            "processing applications across the GCC, ensuring optimal chemical usage, cost savings, and process integrity."
        ),
        description="Primary overview paragraph description text"
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
                values["title"] = "ProMinent Metering Pumps & Water Treatment"
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "In industrial processes where chemical accuracy is critical to efficiency and safety, "
                    "precision is non-negotiable. ESS-ME is the authorized Middle Eastern distributor for ProMinent "
                    "Metering Pumps, the global leader in chemical dosing technology. We provide complete dosing solutions "
                    "that deliver unmatched accuracy, reliability, and control for water treatment, oil & gas, and chemical "
                    "processing applications across the GCC, ensuring optimal chemical usage, cost savings, and process integrity."
                )
        return values


class ProminentMeteringOverviewResponse(BaseModel):
    success: bool = True
    data: ProminentMeteringOverview


class ProminentProductCategory(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for product category")
    title: str = Field(..., description="Category title")
    description: str = Field(..., description="Category detailed description")


class ProminentMeteringDetails(BaseModel):
    # Section 1: Header & Intro
    header_title: str = Field(
        default="Engineered Dosing Excellence with ProMinent Technology",
        description="Main section title"
    )
    header_description: str = Field(
        default=(
            "The ProMinent Group has established a global benchmark in metering pump innovation for over five decades. "
            "Their extensive portfolio—ranging from robust hydraulic diaphragm pumps to intelligent multi-parameter "
            "controllers—is built for peak reliability in demanding industrial environments. Partnering with ProMinent "
            "enables us to supply chemical dosing systems that maintain precise chemical proportions, reduce waste, "
            "and protect critical assets from scaling, corrosion, and fouling."
        ),
        description="Main header description"
    )

    # Section 2: Product Range Overview & Categories
    range_title: str = Field(
        default="Our ProMinent Product Range",
        description="Product range section title"
    )
    range_description: str = Field(
        default=(
            "We offer complete fluid management solutions beyond individual pumps. From single injection point pumps "
            "to fully automated, skid-mounted systems equipped with integrated sensors and controllers, our expertise "
            "ensures a dosing solution tailored to your operational requirements."
        ),
        description="Product range section description"
    )
    categories: List[ProminentProductCategory] = Field(
        default_factory=list,
        description="List of core product category descriptions"
    )

    # Section 3: Total Dosing System Support
    support_title: str = Field(
        default="ESS-ME's Total Dosing System Support",
        description="Support section title"
    )
    support_description: str = Field(
        default=(
            "Our partnership with ProMinent is backed by robust local engineering and service capabilities. We offer "
            "expert application analysis, system design, installation supervision, and complete lifecycle support—including "
            "calibration services and genuine spare parts supply."
        ),
        description="Support section description"
    )

    # Section 4: Industries Served
    industries_title: str = Field(
        default="Industries Served",
        description="Industries served heading"
    )
    industries_list: List[str] = Field(
        default_factory=list,
        description="List of key industry bullet points"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_details_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("header_title"):
                values["header_title"] = "Engineered Dosing Excellence with ProMinent Technology"
            if "categories" not in values or not values["categories"]:
                values["categories"] = DEFAULT_PROMINENT_CATEGORIES
            if "industries_list" not in values or not values["industries_list"]:
                values["industries_list"] = DEFAULT_PROMINENT_INDUSTRIES
        return values


class ProminentMeteringDetailsResponse(BaseModel):
    success: bool = True
    data: ProminentMeteringDetails


# DEFAULT FALLBACK DATA
DEFAULT_PROMINENT_CATEGORIES = [
    {
        "id": "cat_1",
        "title": "Hydraulic Diaphragm & Peristaltic Metering Pumps",
        "description": "We supply high-accuracy metering pumps engineered for high-pressure operations and abrasive or shear-sensitive fluids. Our team assists in selecting optimal pump technologies, capacity configurations, and materials of construction (such as PVC, PVDF, and SS316) for long-term, maintenance-free precision control."
    },
    {
        "id": "cat_2",
        "title": "Complete Skid-Mounted Dosing & Water Treatment Systems",
        "description": "We design and fabricate custom skid-mounted dosing units integrating pumps with tanks, mixers, level sensors, and controllers. These pre-tested, plug-and-play solutions are tailored for applications such as chlorine dioxide disinfection, pH correction, and coagulant dosing in water treatment facilities."
    },
    {
        "id": "cat_3",
        "title": "Digital Control & Water Quality Monitoring",
        "description": "Upgrade from manual to smart dosing systems. We provide measurement and control technologies—including pH, ORP, and conductivity sensors paired with multi-channel controllers—to enable demand-based dosing that optimizes treatment efficiency and minimizes chemical consumption."
    }
]

DEFAULT_PROMINENT_INDUSTRIES = [
    "Water & Wastewater Treatment: Disinfection, pH neutralization, coagulation, and phosphate dosing.",
    "Oil & Gas: Scale and corrosion inhibitor injection, demulsifier dosing, and glycol dehydration.",
    "Power Generation: Boiler water treatment (oxygen scavengers, alkalinity builders) and cooling water conditioning.",
    "Chemical Processing: Precise reagent addition for reactors, neutralization, and product finishing."
]
