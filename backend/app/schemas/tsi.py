from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


class TSIBanner(BaseModel):
    title: str = Field(
        default="TSI Instruments",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Precision Measurement & Environmental Monitoring Solutions",
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
                values["title"] = "TSI Instruments"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class TSIBannerResponse(BaseModel):
    success: bool = True
    data: TSIBanner


class TSIOverview(BaseModel):
    title: str = Field(
        default="Precision TSI Instruments for Environmental, Safety & Process Monitoring",
        description="Main section title heading"
    )
    paragraph_1: str = Field(
        default=(
            "ESS-ME is the authorized distributor for TSI Instruments, a global leader in precision measurement technology, "
            "serving the Middle East's most critical industries. We supply, calibrate, and support TSI's extensive range of cutting-edge "
            "instruments for environmental monitoring, occupational health and safety, and advanced process control. From ensuring cleanroom "
            "compliance to optimizing worker safety and combustion efficiency, TSI provides the data-driven insights you need to excel."
        ),
        description="Primary overview description text"
    )
    image_url: Optional[str] = Field(
        default="",
        description="Featured brand/certification card image URL"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Precision TSI Instruments for Environmental, Safety & Process Monitoring"
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "ESS-ME is the authorized distributor for TSI Instruments, a global leader in precision measurement technology, "
                    "serving the Middle East's most critical industries. We supply, calibrate, and support TSI's extensive range of cutting-edge "
                    "instruments for environmental monitoring, occupational health and safety, and advanced process control. From ensuring cleanroom "
                    "compliance to optimizing worker safety and combustion efficiency, TSI provides the data-driven insights you need to excel."
                )
        return values


class TSIOverviewResponse(BaseModel):
    success: bool = True
    data: TSIOverview


class TSICategory(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for category block")
    title: str = Field(..., description="Category title")
    paragraph_1: str = Field(..., description="First paragraph description")
    paragraph_2: Optional[str] = Field(default="", description="Second paragraph description")


class TSIDetails(BaseModel):
    # Section 1: Intro Header
    header_title: str = Field(
        default="Trusted TSI Measurement Solutions for the Middle East",
        description="Main section title"
    )
    header_description: str = Field(
        default=(
            "For decades, TSI has been at the forefront of measurement technology, advancing solutions that remain at the industry's cutting edge. "
            "Our customers rely on TSI not just for accurate and reliable data, but also for unparalleled expertise and dedicated support. "
            "With a proven history of trust and innovation, TSI helps you make informed, data-driven decisions to enhance safety, ensure quality, and optimize operations in the demanding climates of the GCC."
        ),
        description="Main section intro description"
    )

    # Section 2: Core Product Categories
    categories_title: str = Field(
        default="Our Core TSI Product Categories & Applications",
        description="Core product categories heading"
    )
    categories: List[TSICategory] = Field(
        default_factory=list,
        description="List of product category blocks"
    )

    # Section 3: Value-Add Expertise
    expertise_title: str = Field(
        default="More Than a Supplier: Our TSI Expertise & Value-Add",
        description="Value-add section heading"
    )
    expertise_subtitle: str = Field(
        default="ESS-ME delivers more than just world-class instruments. We take pride in providing comprehensive solutions to ensure your measurement integrity from day one.",
        description="Value-add section subtitle"
    )
    expertise_list: List[str] = Field(
        default_factory=list,
        description="List of value-add bullet points"
    )

    # Section 4: TSI for Your Industry
    industries_title: str = Field(
        default="TSI for Your Industry",
        description="Industries section heading"
    )
    industries_subtitle: str = Field(
        default="While there are a variety of core applications for our TSI offerings, here are some critical ones:",
        description="Industries section subtitle"
    )
    industries_list: List[str] = Field(
        default_factory=list,
        description="List of industry bullet points"
    )

    # Section 5: CTA Card Banner
    cta_title: str = Field(
        default="Secure Your Operational Excellence With TSI Data",
        description="CTA card heading"
    )
    cta_subtitle: str = Field(
        default="Stop guessing and start measuring with precision. Partner with ESS-ME to leverage TSI's trusted technology and our local expertise.",
        description="CTA card subtitle"
    )
    cta_button_text: str = Field(
        default="Contact a TSI Application Specialist",
        description="CTA card button label"
    )
    cta_button_link: str = Field(
        default="/contact",
        description="CTA card redirect URL"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_details_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("header_title"):
                values["header_title"] = "Trusted TSI Measurement Solutions for the Middle East"
            if "categories" not in values or not values["categories"]:
                values["categories"] = DEFAULT_TSI_CATEGORIES
            if "expertise_list" not in values or not values["expertise_list"]:
                values["expertise_list"] = DEFAULT_TSI_EXPERTISE
            if "industries_list" not in values or not values["industries_list"]:
                values["industries_list"] = DEFAULT_TSI_INDUSTRIES
        return values


class TSIDetailsResponse(BaseModel):
    success: bool = True
    data: TSIDetails


# DEFAULT FALLBACK DATA
DEFAULT_TSI_CATEGORIES = [
    {
        "id": "cat_1",
        "title": "Particle Counters & Environmental Monitors",
        "paragraph_1": "Ensure the integrity of your controlled environments with TSI's industry-leading particle counters. These instruments are critical for monitoring and certifying cleanrooms in pharmaceutical manufacturing, semiconductor fabrication, and healthcare facilities.",
        "paragraph_2": "Our solutions provide real-time data on airborne particulate contamination, ensuring compliance with ISO 14644 standards and protecting your sensitive processes and products from costly contamination events."
    },
    {
        "id": "cat_2",
        "title": "Indoor Air Quality (IAQ) & Ventilation Testing Meters",
        "paragraph_1": "Create healthier, more productive building environments. TSI's IAQ meters and ventilation testers are essential tools for facilities management, HVAC contractors, and environmental consultants. Precisely measure parameters like CO2, temperature, humidity, airflow, and volatile organic compounds (VOCs) to verify HVAC system performance, ensure occupant comfort, and demonstrate adherence to WELL Building Standard and other IAQ protocols.",
        "paragraph_2": "Our solutions provide real-time data on airborne particulate contamination, ensuring compliance with ISO 14644 standards and protecting your sensitive processes and products from costly contamination events."
    },
    {
        "id": "cat_3",
        "title": "Combustion & Environmental Emission Analyzers",
        "paragraph_1": "Optimize efficiency and ensure regulatory compliance. TSI's combustion analyzers and emission testing instruments provide accurate measurements of O2, CO, NOx, SO2, and other flue gas components. This is vital for tuning boilers, furnaces, and turbines in power plants and industrial facilities across Qatar, the UAE, and Saudi Arabia, helping you reduce fuel consumption, minimize your environmental footprint, and pass stack emission tests with confidence.",
        "paragraph_2": ""
    },
    {
        "id": "cat_4",
        "title": "Occupational Health & Safety Instruments (Gas Detection, Anemometers)",
        "paragraph_1": "Protect your most valuable asset, i.e. your people. We supply TSI's robust portable gas detectors for confined space entry and personal exposure monitoring.",
        "paragraph_2": "Additionally, TSI's high-accuracy thermal anemometers and flow meters are used for safety ventilation measurements, fume hood face velocity checks, and assessing workplace exposure to airborne contaminants, ensuring a safe working environment in line with regional health and safety regulations."
    }
]

DEFAULT_TSI_EXPERTISE = [
    "Expert Application Consulting: Our technical team will help you select the perfect TSI instrument for your specific application, whether it's for a complex cleanroom validation or routine HVAC maintenance.",
    "On-Site Training & Support: We provide comprehensive on-site training for your teams, ensuring they can operate TSI equipment effectively and interpret data correctly to drive actionable results.",
    "ISO 17025 Accredited Calibration Services: Maintain the accuracy of your investment with our professional calibration services. We ensure your TSI instruments perform to manufacturer specifications, providing you with traceable and reliable data for audits and quality control.",
    "Rental & Trial Programs: Need an instrument for a short-term project? Inquire about our rental options for key TSI products, allowing you to access top-tier technology without a long-term commitment."
]

DEFAULT_TSI_INDUSTRIES = [
    "Pharmaceutical & Biotechnology: Cleanroom monitoring and certification.",
    "HVAC & Building Management: IAQ assessment and ventilation system balancing.",
    "Power Generation & Oil & Gas: Combustion analysis, emission monitoring, and safety.",
    "Healthcare & Hospitals: Infection control and operating room environmental monitoring.",
    "Environmental Consulting: Ambient air quality and stack emission testing."
]