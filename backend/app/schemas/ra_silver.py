from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


class RASilverBanner(BaseModel):
    title: str = Field(
        default="RA Silver System Integrator",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Rockwell Automation Certified Silver System Integrator Partner",
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
                values["title"] = "RA Silver System Integrator"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class RASilverBannerResponse(BaseModel):
    success: bool = True
    data: RASilverBanner


class RASilverOverview(BaseModel):
    title: str = Field(
        default="Rockwell Automation System Integration",
        description="Main overview section title heading"
    )
    paragraph_1: str = Field(
        default=(
            "As a certified Silver Level System Integrator for Rockwell Automation, "
            "ESS-ME delivers expert engineering, proven project execution, and unparalleled support for "
            "ControlLogix, PlantPAx, and other Allen-Bradley platforms across the Middle East."
        ),
        description="Primary overview description text"
    )
    image_url: Optional[str] = Field(
        default="",
        description="Featured partner logo/certification badge image URL"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Rockwell Automation System Integration"
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "As a certified Silver Level System Integrator for Rockwell Automation, "
                    "ESS-ME delivers expert engineering, proven project execution, and unparalleled support for "
                    "ControlLogix, PlantPAx, and other Allen-Bradley platforms across the Middle East."
                )
        return values


class RASilverOverviewResponse(BaseModel):
    success: bool = True
    data: RASilverOverview


class RASilverFeature(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for service section")
    title: str = Field(..., description="Service section title")
    description: str = Field(..., description="Service section description paragraph(s)")


class RASilverDetails(BaseModel):
    # Section 1: Certified Rockwell Automation Expertise
    expertise_title: str = Field(
        default="Certified Rockwell Automation Expertise",
        description="Main section header"
    )
    expertise_description: str = Field(
        default=(
            "Our Silver System Integrator status is a testament to our proven capability and a commitment to excellence validated by Rockwell Automation itself. "
            "This partnership grants us priority access to technical resources, advanced training, and beta programs, ensuring we deliver solutions that leverage the very latest in automation technology.\n\n"
            "Furthermore, our in-house team includes engineers with direct OEM experience at Rockwell Automation, providing you with an unparalleled level of insight and expertise that goes beyond standard certification."
        ),
        description="Expertise section narrative text"
    )

    # Section 2: Our Rockwell Automation Services & Features
    services_title: str = Field(
        default="Our Rockwell Automation Services",
        description="Services section heading"
    )
    services_description: str = Field(
        default=(
            "As a Rockwell Automation Silver System Integrator, our certification is more than a status. It's a guarantee of deep technical proficiency and a commitment to best practices. "
            "We leverage the full power of the Rockwell ecosystem, from ControlLogix and PlantPAx to FactoryTalk, to deliver solutions that drive operational excellence, enhance safety, and provide a clear return on investment for your automation projects."
        ),
        description="Services section description"
    )
    features: List[RASilverFeature] = Field(
        default_factory=list,
        description="List of core automation service feature blocks"
    )

    # Section 3: The ESS-ME Difference
    difference_title: str = Field(
        default="The ESS-ME Difference",
        description="ESS-ME Difference heading"
    )
    difference_description: str = Field(
        default=(
            "We are one of the only system integrators in Qatar with compliance to IEC 61508 FSM and have FS certified engineers. "
            "Our team is locally available with sizeable experience across Oil & Gas, Water, Chemicals, and Petrochemicals."
        ),
        description="ESS-ME Difference description text"
    )

    # Section 4: Industries We Serve
    industries_title: str = Field(
        default="Industries We Serve",
        description="Industries served section heading"
    )
    industries_list: List[str] = Field(
        default_factory=list,
        description="List of target industry bullet points"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_details_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("expertise_title"):
                values["expertise_title"] = "Certified Rockwell Automation Expertise"
            if "features" not in values or not values["features"]:
                values["features"] = DEFAULT_RA_SILVER_FEATURES
            if "industries_list" not in values or not values["industries_list"]:
                values["industries_list"] = DEFAULT_RA_SILVER_INDUSTRIES
        return values


class RASilverDetailsResponse(BaseModel):
    success: bool = True
    data: RASilverDetails


# DEFAULT FALLBACK DATA MATCHING REFERENCE DESIGN
DEFAULT_RA_SILVER_FEATURES = [
    {
        "id": "feat_1",
        "title": "Turnkey Automation Solutions",
        "description": "We take complete ownership of your project, from initial concept to final commissioning. For Greenfield projects, we design and deploy new control architectures using Rockwell's Integrated Architecture, including ControlLogix PLCs, PlantPAx DCS, and PowerFlex drives.\n\nFor Brownfield upgrades, we specialize in the seamless migration of legacy systems (including Allen-Bradley PLC-5 and SLC 500) to modern ControlLogix or CompactLogix platforms, minimizing disruption and extending the life of your assets. Our service includes detailed design, panel building in our certified facility, software development, installation, and SAT (Site Acceptance Testing)."
    },
    {
        "id": "feat_2",
        "title": "PLC & SCADA System Support",
        "description": "Maximize your system's uptime and performance with our proactive support services. Our Rockwell-certified engineers provide rapid-response troubleshooting to diagnose and resolve complex issues with ControlLogix, GuardLogix, and FactoryTalk View SE systems.\n\nWe offer scheduled preventative maintenance contracts that include system health checks, firmware updates, and backup verification. This proactive approach prevents unexpected failures, ensures data integrity, and secures your process continuity."
    },
    {
        "id": "feat_3",
        "title": "Functional Safety",
        "description": "Mitigate risk and achieve the highest levels of operational safety with our certified functional safety services. Our in-house TÜV-certified engineers perform SIL (Safety Integrity Level) assessments and design, validate, and commission Safety Instrumented Systems (SIS) using Rockwell's GuardLogix and dedicated safety relays. We ensure full compliance with IEC 61508/61511 standards, providing all necessary documentation for your safety case and audits, protecting your personnel, and safeguarding your critical infrastructure."
    }
]

DEFAULT_RA_SILVER_INDUSTRIES = [
    "Oil & Gas",
    "Water & Waste Water",
    "Chemicals",
    "Petrochemicals",
    "District Cooling",
    "Food & Beverages",
    "Metals"
]