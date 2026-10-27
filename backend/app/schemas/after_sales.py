from typing import List, Optional
from pydantic import BaseModel, Field


class AfterSalesHeaderSection(BaseModel):
    title: str = Field(
        default="After-Sales & Warranty Services",
        description="Main uppercase title for After-Sales & Warranty Services banner"
    )
    subtitle: str = Field(
        default="Comprehensive Technical Support, Maintenance & Lifecycle Warranty Services",
        description="Subtitle text displayed below the main title"
    )
    bg_image_url: Optional[str] = Field(
        default="",
        description="Background overlay image URL for the banner"
    )
    image_url: Optional[str] = Field(
        default="",
        description="Alias image key for backward compatibility"
    )


class AfterSalesHeaderResponse(BaseModel):
    success: bool = True
    data: AfterSalesHeaderSection
    message: Optional[str] = None


class AfterSalesOverviewSection(BaseModel):
    paragraph_1: str = Field(
        default="In addition to supplying process instruments, analysers, and sampling systems from internationally recognised manufacturers, ESS Saudi provides in-house engineering and project execution from initial design through installation, testing, and commissioning. We work directly with EPC contractors and end users to deliver instrumentation, process analyser, control system, and safety system projects that meet project-specific technical requirements and applicable engineering and safety standards across Saudi Arabia.",
        description="First paragraph text for After-Sales overview"
    )
    paragraph_2: str = Field(
        default="Our in-house capabilities include basic and detailed engineering, panel and system integration, Factory Acceptance Testing and Site Acceptance Testing (FAT/SAT), and installation and commissioning support. This enables ESS Saudi to take full responsibility for the complete project scope from specification and design through to handover, rather than limiting our role to equipment supply alone.",
        description="Second paragraph text for After-Sales overview"
    )
    image_url: Optional[str] = Field(
        default="",
        description="Featured side image URL for After-Sales overview"
    )
    bg_image_url: Optional[str] = Field(
        default="",
        description="Alias image key for backward compatibility"
    )


class AfterSalesOverviewResponse(BaseModel):
    success: bool = True
    data: AfterSalesOverviewSection
    message: Optional[str] = None

class AfterSalesOverviewSection(BaseModel):
    paragraph_1: str = Field(
        default="In addition to supplying process instruments, analysers, and sampling systems from internationally recognised manufacturers, ESS Saudi provides in-house engineering and project execution from initial design through installation, testing, and commissioning. We work directly with EPC contractors and end users to deliver instrumentation, process analyser, control system, and safety system projects that meet project-specific technical requirements and applicable engineering and safety standards across Saudi Arabia.",
        description="First paragraph text for After-Sales overview"
    )
    paragraph_2: str = Field(
        default="Our in-house capabilities include basic and detailed engineering, panel and system integration, Factory Acceptance Testing and Site Acceptance Testing (FAT/SAT), and installation and commissioning support. This enables ESS Saudi to take full responsibility for the complete project scope from specification and design through to handover, rather than limiting our role to equipment supply alone.",
        description="Second paragraph text for After-Sales overview"
    )
    images: List[str] = Field(
        default=[
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80"
        ],
        description="List of image URLs for the interactive side carousel gallery"
    )
    image_url: Optional[str] = Field(
        default="",
        description="Single image URL for backward compatibility"
    )


class AfterSalesOverviewResponse(BaseModel):
    success: bool = True
    data: AfterSalesOverviewSection


class AfterSalesServiceScopeSection(BaseModel):
    title: str = Field(
        default="Service Scope",
        description="Main heading title for After-Sales service scope section"
    )
    items: List[str] = Field(
        default=[
            "Warranty service and claim support for supplied instruments and systems",
            "Preventive maintenance and corrective maintenance",
            "Calibration services for process instrumentation and analysers",
            "Troubleshooting and fault diagnosis with on-site and remote support options",
            "Spare parts identification, sourcing, and supply",
            "Annual Maintenance Contracts (AMC) for long-term service coverage",
        ],
        description="List of service scope items with checkmark badges"
    )
    engineers_title: str = Field(
        default="Factory Trained & OEM Certified Engineers",
        description="Title for the engineers section"
    )
    engineers_content: str = Field(
        default="ESS Saudi's service engineers complete manufacturer led training and certification programmes at OEM facilities, covering installation, commissioning, calibration, and maintenance procedures specific to each product line. This ensures that service delivered in the Kingdom consistently meets manufacturer direct quality standards, with the added advantage of local accessibility and rapid response.",
        description="Description paragraph for OEM certified engineers"
    )


class AfterSalesServiceScopeResponse(BaseModel):
    success: bool = True
    data: AfterSalesServiceScopeSection
    message: Optional[str] = None



class AfterSalesWhyUsSection(BaseModel):
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
        default="Why Choose Us",
        description="Main heading title for the value proposition block"
    )
    why_description: str = Field(
        default="As the authorised local channel partner for the instrumentation and analyser brands we represent, ESS Saudi delivers factory certified after-sales and warranty services across the Kingdom. Clients benefit from reduced equipment downtime, faster response, and the confidence of OEM standard service without the delays and costs associated with routing support requests through overseas manufacturers.",
        description="Narrative paragraph text explaining the After-Sales value proposition"
    )


class AfterSalesWhyUsResponse(BaseModel):
    success: bool = True
    data: AfterSalesWhyUsSection
    message: Optional[str] = None