from typing import List, Optional
from pydantic import BaseModel, Field


class ProjectsServicesHeaderSection(BaseModel):
    title: str = Field(
        default="PROJECTS & SERVICES",
        description="Main uppercase title for Projects & Services banner"
    )
    subtitle: str = Field(
        default="Explore Our Industrial Projects & Specialized Services",
        description="Subtitle text displayed below the main title"
    )
    bg_image_url: Optional[str] = Field(
        default="",
        description="Background image overlay URL for the banner"
    )
    image_url: Optional[str] = Field(
        default="",
        description="Alias key for backward compatibility"
    )


class ProjectsServicesHeaderResponse(BaseModel):
    success: bool = True
    data: ProjectsServicesHeaderSection
    message: Optional[str] = None


class ProjectsServicesOverviewSection(BaseModel):
    paragraph_1: str = Field(
        default="ESS Saudi embrace a total systems approach to meet the growing operational & environmental monitoring demands of the Oil & Gas, Petrochemical & Power sector industries.",
        description="First paragraph text for Projects & Services overview"
    )
    paragraph_2: str = Field(
        default="We offer products & services which are technically proven in the field, well supported by qualified service personnel & most economical with excellent return of investment.",
        description="Second paragraph text for Projects & Services overview"
    )
    image_url: Optional[str] = Field(
        default="",
        description="Featured side image URL for Projects & Services overview"
    )
    bg_image_url: Optional[str] = Field(
        default="",
        description="Alias image key for backward compatibility"
    )
    cta_button_text: str = Field(
        default="Contact Us",
        description="Text displayed inside the call-to-action button"
    )
    cta_button_url: str = Field(
        default="/contact",
        description="Link URL destination for the call-to-action button"
    )


class ProjectsServicesOverviewResponse(BaseModel):
    success: bool = True
    data: ProjectsServicesOverviewSection
    message: Optional[str] = None


class ProjectsServicesCard(BaseModel):
    id: str = Field(..., description="Unique ID for the grid card")
    title: str = Field(..., description="Title of the project or service")
    icon_type: Optional[str] = Field(
        default="flame", description="Lucide icon identifier fallback"
    )
    logo_url: Optional[str] = Field(
        default="", description="Custom card logo image URL"
    )
    link_url: Optional[str] = Field(
        default="", description="Destination URL link for Know More button"
    )


class ProjectsServicesGridSection(BaseModel):
    cards: List[ProjectsServicesCard] = Field(
        default=[
            ProjectsServicesCard(
                id="ps-1",
                title="Moisture & Dew Point Measurement Instruments",
                icon_type="droplet",
                logo_url="",
                link_url="/projects-services/moisture-dew-point",
            ),
            ProjectsServicesCard(
                id="ps-2",
                title="Flame & Gas Detectors",
                icon_type="flame",
                logo_url="",
                link_url="/projects-services/flame-gas-detectors",
            ),
            ProjectsServicesCard(
                id="ps-3",
                title="VESDA® Aspirating Smoke Detection & Fire Alarm Devices",
                icon_type="target",
                logo_url="",
                link_url="/projects-services/vesda-smoke-detection",
            ),
            ProjectsServicesCard(
                id="ps-4",
                title="Process Analyzers",
                icon_type="layers",
                logo_url="",
                link_url="/projects-services/process-analyzers",
            ),
            ProjectsServicesCard(
                id="ps-5",
                title="Process Instrumentation",
                icon_type="disc",
                logo_url="",
                link_url="/projects-services/process-instrumentation",
            ),
            ProjectsServicesCard(
                id="ps-6",
                title="Upstream Instrumentation (Water Cut Meters)",
                icon_type="droplet",
                logo_url="",
                link_url="/projects-services/water-cut-meters",
            ),
            ProjectsServicesCard(
                id="ps-7",
                title="Beacons & Sounders",
                icon_type="bell",
                logo_url="",
                link_url="/projects-services/beacons-sounders",
            ),
        ]
    )


class ProjectsServicesGridResponse(BaseModel):
    success: bool = True
    data: ProjectsServicesGridSection
    message: Optional[str] = None