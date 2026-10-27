from typing import List, Optional
from pydantic import BaseModel, Field


class CapabilitiesHeaderSection(BaseModel):
    title: str = Field(
        default="CAPABILITIES",
        description="Main title for Capabilities banner"
    )
    subtitle: str = Field(
        default="Explore Our Technical Capabilities & Industrial Engineering Excellence",
        description="Subtitle text displayed below the main title"
    )
    bg_image_url: Optional[str] = Field(
        default="",
        description="Background overlay image URL for the banner"
    )
    image_url: Optional[str] = Field(
        default="",
        description="Alias key for backward compatibility"
    )


class CapabilitiesHeaderResponse(BaseModel):
    success: bool = True
    data: CapabilitiesHeaderSection
    message: Optional[str] = None


class CapabilitiesOverviewSection(BaseModel):
    paragraph_1: str = Field(
        default="In addition to supplying process instruments, analysers, and sampling systems from internationally recognised manufacturers, ESS Saudi provides in-house engineering and project execution from initial design through installation, testing, and commissioning. We work directly with EPC contractors and end users to deliver instrumentation, process analyser, control system, and safety system projects that meet project-specific technical requirements and applicable engineering and safety standards across Saudi Arabia.",
        description="First paragraph text for Capabilities overview"
    )
    paragraph_2: str = Field(
        default="Our in-house capabilities include basic and detailed engineering, panel and system integration, Factory Acceptance Testing and Site Acceptance Testing (FAT/SAT), and installation and commissioning support. This enables ESS Saudi to take full responsibility for the complete project scope from specification and design through to handover, rather than limiting our role to equipment supply alone.",
        description="Second paragraph text for Capabilities overview"
    )
    images: List[str] = Field(
        default=[
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80"
        ],
        description="List of image URLs for the interactive side carousel"
    )
    image_url: Optional[str] = Field(
        default="",
        description="Single image URL for backward compatibility"
    )


class CapabilitiesOverviewResponse(BaseModel):
    success: bool = True
    data: CapabilitiesOverviewSection
    message: Optional[str] = None



class ExecutionScopeSection(BaseModel):
    title: str = Field(
        default="Execution Scope",
        description="Main heading title for the section"
    )
    items: List[str] = Field(
        default=[
            "Basic and detailed engineering for instrumentation, control, and safety systems",
            "Analyser shelter, control panel, and Fire & Gas (F&G) panel design and integration",
            "Sampling system engineering for Gas and Liquid applications",
            "SIL rated safety system design per applicable safety lifecycle requirements (IEC 61511)",
            "Factory Acceptance Testing (FAT) and Site Acceptance Testing (SAT)",
            "Installation, testing, and commissioning",
            "Project documentation, as-built drawings, and handover packages",
        ],
        description="List of execution scope bullet items with checkmark badges"
    )
    standards_title: str = Field(
        default="Standards & Compliance",
        description="Title for the standards section"
    )
    standards_content: str = Field(
        default="ESS Saudi applies relevant end-user engineering requirements and recognised international safety standards including IEC 61511, IEC 61508, and applicable Saudi Aramco Engineering Standards (SAES) throughout project execution. This approach ensures that engineered systems are fully compatible with existing plant infrastructure and aligned with the site's safety and functional safety requirements.",
        description="Paragraph description for standards and compliance"
    )


class ExecutionScopeResponse(BaseModel):
    success: bool = True
    data: ExecutionScopeSection
    message: Optional[str] = None


class WhyEssSection(BaseModel):
    industries_title: str = Field(
        default="Industries Served",
        description="Heading title for the industries pill strip"
    )
    industries: List[str] = Field(
        default=[
            "Oil & Gas",
            "Petrochemical",
            "Power Generation",
            "Water & Utilities"
        ],
        description="List of pill tags for industries served"
    )
    why_title: str = Field(
        default="Why ESS Saudi",
        description="Main heading title for the Why ESS Saudi block"
    )
    why_description: str = Field(
        default="We combine access to internationally recognised instrumentation and analyser manufacturers with a dedicated in-house engineering and project execution team, giving clients a single point of responsibility from equipment selection and system design through integration, commissioning, and handover.",
        description="Narrative paragraph text explaining Why ESS Saudi"
    )


class WhyEssResponse(BaseModel):
    success: bool = True
    data: WhyEssSection
    message: Optional[str] = None