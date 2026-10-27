from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


class PanoramaBanner(BaseModel):
    title: str = Field(
        default="Panorama System Integrator",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="SCADA, Industrial Automation & Process Control Solutions",
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
                values["title"] = "Panorama System Integrator"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class PanoramaBannerResponse(BaseModel):
    success: bool = True
    data: PanoramaBanner



class PanoramaOverview(BaseModel):
    title: str = Field(
        default="Codra Panorama SCADA System Integration",
        description="Main section title"
    )
    paragraph_1: str = Field(
        default=(
            "In today's industrial landscape, seamless visibility and control are non-negotiable. "
            "ESS-ME is a certified system integrator for Codra's Panorama SCADA, delivering powerful, "
            "scalable, and intuitive supervisory control solutions across the Middle East. We specialize "
            "in transforming complex operational data into actionable intelligence, providing you with "
            "a unified view of your entire enterprise, from a single pump station to a plant-wide network, "
            "ensuring informed decision-making and enhanced operational efficiency."
        ),
        description="Primary overview paragraph"
    )
    image_url: Optional[str] = Field(
        default="",
        description="Featured brand/certification visual card image URL"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Codra Panorama SCADA System Integration"
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "In today's industrial landscape, seamless visibility and control are non-negotiable. "
                    "ESS-ME is a certified system integrator for Codra's Panorama SCADA, delivering powerful, "
                    "scalable, and intuitive supervisory control solutions across the Middle East. We specialize "
                    "in transforming complex operational data into actionable intelligence, providing you with "
                    "a unified view of your entire enterprise, from a single pump station to a plant-wide network, "
                    "ensuring informed decision-making and enhanced operational efficiency."
                )
        return values


class PanoramaOverviewResponse(BaseModel):
    success: bool = True
    data: PanoramaOverview


class PanoramaCard(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for card")
    title: str = Field(..., description="Card title")
    description: str = Field(..., description="Card description text")


class PanoramaDetails(BaseModel):
    # Section 1: Unlock Operational Visibility Header
    visibility_title: str = Field(
        default="Unlock Operational Visibility with Panorama SCADA",
        description="Visibility section title heading"
    )
    visibility_description: str = Field(
        default=(
            "Panorama SCADA is a flexible, robust, and feature-rich platform renowned for its powerful HMI, "
            "data historization, and alarm management capabilities. Our certified expertise in Panorama allows "
            "us to build tailored solutions that are not only powerful but also intuitive for operators. We leverage "
            "Panorama's native web-client technology and open architecture to deliver future-proof systems that provide "
            "real-time insight, improve response times, and drive productivity for utilities and industries throughout the GCC."
        ),
        description="Visibility section description text"
    )

    # Section 2: Integration Services & 4 Cards
    services_title: str = Field(
        default="Panorama SCADA Integration Services",
        description="Integration services section heading"
    )
    services_description: str = Field(
        default=(
            "We provide comprehensive Panorama SCADA services, from initial concept and custom development to "
            "lifecycle support and system expansion. Our approach ensures your SCADA system is a strategic asset, "
            "designed to grow with your operational needs and technological advancements."
        ),
        description="Integration services section description"
    )
    cards: List[PanoramaCard] = Field(
        default_factory=list,
        description="List of 4 SCADA integration service cards"
    )

    # Section 3: ESS-ME Advantage
    advantage_title: str = Field(
        default="ESS-ME Advantage in SCADA Solutions",
        description="ESS-ME Advantage title"
    )
    advantage_description: str = Field(
        default=(
            "Our partnership with Codra ensures we are at the forefront of Panorama's capabilities. We complement "
            "this with our deep understanding of regional infrastructure, offering local 24x7 support, cybersecurity "
            "hardening for industrial networks, and training programs to empower your team to leverage the full potential "
            "of your SCADA investment."
        ),
        description="ESS-ME Advantage description paragraph"
    )

    # Section 4: Industrial Applications
    applications_title: str = Field(
        default="Industrial Applications",
        description="Industrial applications heading"
    )
    applications_list: List[str] = Field(
        default_factory=list,
        description="List of industrial applications bullet points"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_details_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("visibility_title"):
                values["visibility_title"] = "Unlock Operational Visibility with Panorama SCADA"
            if "cards" not in values or not values["cards"]:
                values["cards"] = DEFAULT_PANORAMA_CARDS
            if "applications_list" not in values or not values["applications_list"]:
                values["applications_list"] = DEFAULT_PANORAMA_APPLICATIONS
        return values


class PanoramaDetailsResponse(BaseModel):
    success: bool = True
    data: PanoramaDetails


# DEFAULT DATA MATCHING YOUR REFERENCE IMAGE
DEFAULT_PANORAMA_CARDS = [
    {
        "id": "card_1",
        "title": "Custom SCADA and HMI Application Development",
        "description": "We design and develop bespoke SCADA applications tailored to your specific operational workflows. Our services include creating intuitive Human-Machine Interface (HMI) screens, configuring advanced alarm management systems, and developing complex scripting for specialized automation sequences. We ensure the final system is user-friendly, reduces operator error, and provides clear visualization of your entire process."
    },
    {
        "id": "card_2",
        "title": "System Integration and Data Connectivity",
        "description": "A SCADA system's power lies in its connectivity. We excel at integrating Panorama SCADA with a vast array of devices and platforms. This includes seamless communication with PLCs (from Allen-Bradley, Siemens, etc.), RTUs, variable frequency drives, and existing databases. We create a unified data layer, breaking down information silos and providing a single source of truth for your operation."
    },
    {
        "id": "card_3",
        "title": "Legacy System Migration & Modernization",
        "description": "Upgrade your outdated control room with confidence. We specialize in migrating legacy SCADA and HMI systems to the modern, secure, and more capable Panorama platform. This process future-proofs your operations, enhances cybersecurity, improves maintenance support, and unlocks new functionalities, all while preserving your historical data and minimizing operational disruption."
    },
    {
        "id": "card_4",
        "title": "...and more!",
        "description": "From enterprise historian integration to web-based dashboards and mobile monitoring, we provide end-to-end SCADA solutions tailored to your infrastructure requirements."
    }
]

DEFAULT_PANORAMA_APPLICATIONS = [
    "Water & Wastewater SCADA: Pump station control, reservoir level monitoring, treatment plant automation.",
    "Oil & Gas: Pipeline monitoring, wellhead control, tank farm management.",
    "Power & Utilities: Electrical substation automation, district cooling plant control, renewable energy monitoring.",
    "Building Management: Integrated control for large facility complexes."
]