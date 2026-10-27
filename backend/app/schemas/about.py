from typing import List, Optional, Any
from pydantic import BaseModel, Field, model_validator


# --- Header Sub-model ---
class PageHeaderSection(BaseModel):
    title: Optional[str] = "About Us"
    subtitle: Optional[str] = "Learn more about our heritage and engineering capabilities."
    bg_image_url: Optional[str] = ""
    image_url: Optional[str] = ""

    @model_validator(mode="before")
    @classmethod
    def sync_image_urls(cls, values: Any) -> Any:
        """Ensures bg_image_url and image_url are synchronized safely."""
        if isinstance(values, dict):
            img = values.get("bg_image_url") or values.get("image_url") or ""
            values["bg_image_url"] = img
            values["image_url"] = img
        return values


# --- "Our Story" Sub-model ---
class AboutStorySection(BaseModel):
    tagline: Optional[str] = "ESS Saudi"
    title: Optional[str] = "Our Story: Two Decades of Trusted Partnership"
    paragraph_1: Optional[str] = (
        "For over two decades, Essential Systems & Services (ESS Saudi) has been a cornerstone "
        "of the region's industrial landscape. Managed by a team of technically qualified professionals, "
        "we bring deep-seated expertise to the Oil & Gas, Marine, and Industrial sectors across the Middle East."
    )
    paragraph_2: Optional[str] = (
        "Our strength is further amplified by our strategic association with regional industry leaders. "
        "This partnership provides us with significant stability, resources, and a shared commitment to excellence."
    )
    paragraph_3: Optional[str] = (
        "This robust combination has earned us the trust of the region's most critical industries, "
        "including major Onshore and Offshore Oil & Gas companies, Petrochemical producers, and Power Generation plants."
    )


# --- Specialized Divisions Sub-models ---
class DivisionItem(BaseModel):
    id: Optional[str] = ""
    title: str = ""
    link_url: Optional[str] = ""


def get_default_divisions() -> List[DivisionItem]:
    return [
        DivisionItem(id="div-1", title="Control & Automation"),
        DivisionItem(id="div-2", title="Analytical Systems"),
        DivisionItem(id="div-3", title="Power Backup Systems"),
        DivisionItem(id="div-4", title="Safety & Telecommunications"),
    ]


class SpecializedDivisionsSection(BaseModel):
    title: Optional[str] = (
        "To deliver comprehensive, end-to-end service, ESS Saudi is structured into specialized divisions:"
    )
    image_url: Optional[str] = ""
    divisions: Optional[List[DivisionItem]] = Field(default_factory=get_default_divisions)
    description_1: Optional[str] = (
        "This focused approach ensures expert-level knowledge and tailored solutions for every facet of your operation."
    )
    description_2: Optional[str] = (
        "We invest relentlessly in our people and infrastructure. Our engineers receive advanced factory training "
        "directly from global original equipment manufacturers."
    )
    cta_text: Optional[str] = "Start a Conversation"
    cta_url: Optional[str] = "/contact"


# --- Content & Features Sub-models ---
class AboutFeatureItem(BaseModel):
    id: Optional[str] = ""
    title: str = ""
    subtitle: Optional[str] = ""
    description: Optional[str] = ""


class AboutMainContent(BaseModel):
    tagline: Optional[str] = "ABOUT US"
    title: Optional[str] = "WELCOME TO ESSENTIAL SYSTEMS & SERVICES."
    description: Optional[str] = ""
    features: Optional[List[AboutFeatureItem]] = Field(default_factory=list)
    image_url: Optional[str] = ""
    floating_badge_title: Optional[str] = "TURNKEY PRECISION"
    floating_badge_subtitle: Optional[str] = "Full-cycle Engineering & Integration Support"


# --- Team Sub-model ---
class TeamMember(BaseModel):
    id: Optional[str] = ""
    name: str = ""
    position: str = ""
    bio: Optional[str] = ""
    image_url: Optional[str] = ""
    linkedin_url: Optional[str] = ""


# --- Complete About Page Schema ---
class AboutPageData(BaseModel):
    header: Optional[PageHeaderSection] = Field(default_factory=PageHeaderSection)
    story: Optional[AboutStorySection] = Field(default_factory=AboutStorySection)
    specialized_divisions: Optional[SpecializedDivisionsSection] = Field(
        default_factory=SpecializedDivisionsSection
    )
    content: Optional[AboutMainContent] = Field(default_factory=AboutMainContent)
    team: Optional[List[TeamMember]] = Field(default_factory=list)


# --- API Response Wrapper ---
class AboutPageResponse(BaseModel):
    success: bool = True
    data: AboutPageData