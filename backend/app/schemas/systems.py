from typing import Optional,List
from pydantic import BaseModel, Field


class SystemsHeaderSection(BaseModel):
    title: str = Field(
        default="SYSTEMS & SOLUTIONS",
        description="Main headline title for Systems & Solutions banner"
    )
    subtitle: str = Field(
        default="Explore Our Industrial Grade Systems & Solutions",
        description="Subtitle text displayed below the main header"
    )
    bg_image_url: Optional[str] = Field(
        default="",
        description="Background banner image URL"
    )
    image_url: Optional[str] = Field(
        default="",
        description="Dual-key alias for bg_image_url"
    )


class SystemsHeaderResponse(BaseModel):
    success: bool = True
    data: SystemsHeaderSection
    message: Optional[str] = None


from typing import Optional
from pydantic import BaseModel, Field

class SystemsOverviewSection(BaseModel):
    paragraph_1: str = Field(
        default="ESS Saudi embrace a total systems approach to meet the growing operational & environmental monitoring demands of the Oil & Gas, Petrochemical & Power sector industries.",
        description="First paragraph text for systems overview"
    )
    paragraph_2: str = Field(
        default="We offer products & services which are technically proven in the field, well supported by qualified service personnel & most economical with excellent return of investment.",
        description="Second paragraph text for systems overview"
    )
    image_url: Optional[str] = Field(
        default="",
        description="Featured side image URL for systems overview"
    )
    cta_button_text: str = Field(
        default="Contact Us",
        description="Text displayed inside the call-to-action button"
    )
    cta_button_url: str = Field(
        default="/contact",
        description="Link URL destination for the call-to-action button"
    )


class SystemsOverviewResponse(BaseModel):
    success: bool = True
    data: SystemsOverviewSection
    message: Optional[str] = None


class SolutionCard(BaseModel):
    id: str = Field(..., description="Unique identifier for the card")
    title: str = Field(..., description="Title of the solution")
    icon_type: Optional[str] = Field(default="flame", description="Lucide icon fallback identifier")
    logo_url: Optional[str] = Field(default="", description="Custom card logo image URL")
    link_url: Optional[str] = Field(default="", description="Link URL for Know More button")

class SystemsSolutionsGridSection(BaseModel):
    cards: List[SolutionCard] = Field(
        default=[
            SolutionCard(id="sol-1", title="Moisture & Dew Point Measurement Instruments", icon_type="droplet", logo_url="", link_url="/systems/moisture-dew-point"),
            SolutionCard(id="sol-2", title="Flame & Gas Detectors", icon_type="flame", logo_url="", link_url="/systems/flame-gas-detectors"),
            SolutionCard(id="sol-3", title="VESDA® Aspirating Smoke Detection & Fire Alarm Devices", icon_type="target", logo_url="", link_url="/systems/vesda-smoke-detection"),
            SolutionCard(id="sol-4", title="Process Analyzers", icon_type="layers", logo_url="", link_url="/systems/process-analyzers"),
            SolutionCard(id="sol-5", title="Process Instrumentation", icon_type="disc", logo_url="", link_url="/systems/process-instrumentation"),
            SolutionCard(id="sol-6", title="Upstream Instrumentation (Water Cut Meters)", icon_type="droplet", logo_url="", link_url="/systems/water-cut-meters"),
            SolutionCard(id="sol-7", title="Beacons & Sounders", icon_type="bell", logo_url="", link_url="/systems/beacons-sounders"),
        ]
    )

class SystemsSolutionsGridResponse(BaseModel):
    success: bool = True
    data: SystemsSolutionsGridSection
    message: Optional[str] = None