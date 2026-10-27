from typing import Optional, Any,List
from pydantic import BaseModel, Field, model_validator


class EmersonBannerHeader(BaseModel):
    title: Optional[str] = Field(
        default="Emerson",
        description="Main banner header title"
    )
    subtitle: Optional[str] = Field(
        default="Process Management, Measurement Instrumentation & Automation Solutions",
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
                values["title"] = "Emerson"

            if values.get("subtitle") is None:
                values["subtitle"] = "Process Management, Measurement Instrumentation & Automation Solutions"

            img = (
                values.get("bg_image")
                or values.get("bg_image_url")
                or values.get("image_url")
                or ""
            )
            values["bg_image"] = img
            values["bg_image_url"] = img

        return values


class EmersonBannerHeaderResponse(BaseModel):
    success: bool = True
    data: EmersonBannerHeader



class EmersonOverviewSection(BaseModel):
    title: Optional[str] = Field(
        default="Emerson Automation System Integration & Engineering Services",
        description="Main header title"
    )
    paragraph_1: Optional[str] = Field(
        default="In an era of digital transformation, leveraging the right automation platform is critical for competitive advantage. ESS-ME is a certified system integrator for Emerson Automation Solutions, providing the expertise to design, deploy, and optimize their world-class technologies.",
        description="First overview paragraph"
    )
    paragraph_2: Optional[str] = Field(
        default="We empower industries across the Middle East to achieve unprecedented levels of operational efficiency, production reliability, and safety using Emerson's comprehensive suite of control and safety systems.",
        description="Second overview paragraph"
    )
    card_image_url: Optional[str] = Field(
        default="",
        description="URL for the Emerson brand logo card image"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Emerson Automation System Integration & Engineering Services"
            
            img = (
                values.get("card_image_url")
                or values.get("image_url")
                or values.get("product_image_url")
                or ""
            )
            values["card_image_url"] = img

        return values


class EmersonOverviewResponse(BaseModel):
    success: bool = True
    data: EmersonOverviewSection



class IndustryItem(BaseModel):
    name: str = Field(..., description="Industry Name (e.g., Oil & Gas)")
    description: str = Field(..., description="Industry Description")


class EmersonDetailsSection(BaseModel):
    trusted_title: Optional[str] = Field(
        default="Trusted Emerson Automation in Qatar",
        description="Main heading for trusted partnership"
    )
    trusted_subtitle: Optional[str] = Field(
        default="Emerson is a global leader in process automation and asset management, known for its robust DeltaV DCS and PLC systems.",
        description="Lead tagline under trusted title"
    )
    trusted_description: Optional[str] = Field(
        default="Our certified partnership signifies a deep, proven capability to implement these technologies effectively. Our team of engineers possesses direct experience with Emerson's full portfolio, enabling us to deliver integrated solutions that solve complex control challenges, enhance plant visibility, and ensure long-term operational success for our clients in the GCC's core sectors.",
        description="Detailed partnership paragraph"
    )

    capabilities_title: Optional[str] = Field(
        default="Our Emerson Service Capabilities",
        description="Capabilities section heading"
    )
    capabilities_description: Optional[str] = Field(
        default="We provide end-to-end services that cover the entire automation lifecycle. From initial concept and system design to ongoing support and modernization, our Emerson-certified expertise ensures your investment delivers maximum value, scalability, and reliability for years to come.",
        description="Capabilities description"
    )

    deltav_title: Optional[str] = Field(
        default="DeltaV Distributed Control System (DCS) Integration",
        description="DeltaV section title"
    )
    deltav_description: Optional[str] = Field(
        default="As experts in the DeltaV DCS, we design and implement complete control strategies for continuous and batch processes. Our services include system architecture design, controller and I/O configuration, advanced control strategy implementation, and seamless integration with third-party PLCs and safety systems. We ensure your DeltaV system becomes the central nervous system of your plant, providing intuitive operation and powerful data analytics.",
        description="DeltaV section description"
    )

    plc_scada_title: Optional[str] = Field(
        default="PLC & SCADA System Implementation",
        description="PLC & SCADA section title"
    )
    plc_scada_description: Optional[str] = Field(
        default="For discrete and hybrid control applications, we engineer high-performance solutions using Emerson's PACSystems and RX3i PLCs. We develop robust control logic and integrate them with powerful SCADA platforms like Emerson's Movicon, creating centralized visualization and monitoring solutions that provide operators with real-time insight and control over geographically dispersed assets.",
        description="PLC & SCADA description"
    )

    sis_title: Optional[str] = Field(
        default="Safety Instrumented System (SIS) Design",
        description="SIS section title"
    )
    sis_description: Optional[str] = Field(
        default="Protect your people and assets with certified safety solutions. We design and engineer Safety Instrumented Systems (SIS) using Emerson's DeltaV SIS with CHARMs technology or dedicated Guardian safety controllers. Our engineers perform SIL verification and validation to ensure these critical systems meet IEC 61511 standards, providing you with a complete safety lifecycle management solution.",
        description="SIS section description"
    )

    implementation_title: Optional[str] = Field(
        default="Integrated Emerson Technology: Implementation & Beyond",
        description="Implementation section title"
    )
    implementation_description: Optional[str] = Field(
        default="Our partnership with Emerson allows us to offer more than just integration. We provide strategic consulting for digital transformation, system migration services from legacy platforms, and 24/7 support contracts that include proactive system health monitoring and specialist troubleshooting to minimize your operational risk.",
        description="Implementation section description"
    )

    industries_title: Optional[str] = Field(
        default="Industries we Serve",
        description="Industries section heading"
    )
    industry_items: Optional[List[IndustryItem]] = Field(
        default=[
            {"name": "Oil & Gas", "description": "Upstream production platforms, midstream pipelines, and refinery process control."},
            {"name": "Power Generation", "description": "Plant-wide DCS for conventional and renewable power facilities."},
            {"name": "Water & Wastewater", "description": "Plant automation and SCADA for pumping stations and treatment plants."},
            {"name": "Chemical & Petrochemical", "description": "Complex batch and continuous process control."}
        ],
        description="List of served industries with descriptions"
    )


class EmersonDetailsResponse(BaseModel):
    success: bool = True
    data: EmersonDetailsSection