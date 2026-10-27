import time
from typing import List, Optional
from pydantic import BaseModel, Field, model_validator


# --- Header Sub-model ---
class PartnerHeaderSection(BaseModel):
    title: Optional[str] = "Our Partners"
    subtitle: Optional[str] = "Collaborating with Global Industry Leaders"
    bg_image_url: Optional[str] = ""
    image_url: Optional[str] = ""

    @model_validator(mode="before")
    @classmethod
    def sync_image_urls(cls, values: dict) -> dict:
        """Syncs bg_image_url and image_url so both fields always contain the image link."""
        if isinstance(values, dict):
            img = values.get("bg_image_url") or values.get("image_url") or ""
            values["bg_image_url"] = img
            values["image_url"] = img
        return values


# --- Overview Section Sub-model ---
class PartnersOverviewSection(BaseModel):
    paragraph_1: Optional[str] = (
        "ESS Middle East embrace a total systems approach to meet the growing "
        "operational & environmental monitoring demands of the Oil & Gas, Petrochemical & Power sector industries."
    )
    paragraph_2: Optional[str] = (
        "We offer products & services which are technically proven in the field, well "
        "supported by qualified service personnel & most economical with excellent return of investment."
    )
    image_url: Optional[str] = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"


# --- CTA / ENQUIRY BANNER SUB-MODEL ---
class PartnerCtaSection(BaseModel):
    heading: Optional[str] = "Need Any Help? Let's Talk"
    button_text: Optional[str] = "ENQUIRY NOW"
    button_link: Optional[str] = "/contact"
    bg_image_url: Optional[str] = ""


# --- Partner Item Sub-model ---
class PartnerItem(BaseModel):
    id: str = Field(default_factory=lambda: f"partner-{int(time.time() * 1000)}")
    name: str = "Partner Name"
    logo_url: str = ""
    link_url: Optional[str] = ""  # EXPLICITLY DEFINED TO PREVENT MONGO DUMP STRIPPING
    website_url: Optional[str] = ""
    description: Optional[str] = ""


# --- Category Group Sub-model ---
class PartnerCategoryGroup(BaseModel):
    id: str = Field(default_factory=lambda: f"cat-{int(time.time() * 1000)}")
    category_title: str = "Division Name"
    partners: List[PartnerItem] = Field(default_factory=list)


# --- Complete Partners Page Data Schema ---
class PartnerPageData(BaseModel):
    header: PartnerHeaderSection = Field(default_factory=PartnerHeaderSection)
    overview: PartnersOverviewSection = Field(default_factory=PartnersOverviewSection)
    cta: PartnerCtaSection = Field(default_factory=PartnerCtaSection)
    category_groups: List[PartnerCategoryGroup] = Field(
        default_factory=lambda: [
            PartnerCategoryGroup(
                id="cat-fire-gas",
                category_title="Fire & Gas Systems",
                partners=[
                    PartnerItem(id="p-1", name="Honeywell", logo_url="", link_url="/products"),
                    PartnerItem(id="p-2", name="Scame Sistemi", logo_url="", link_url="/products"),
                    PartnerItem(id="p-3", name="Xtralis", logo_url="", link_url="/products"),
                    PartnerItem(id="p-4", name="Eaton MEDC", logo_url="", link_url="/products"),
                ],
            ),
            PartnerCategoryGroup(
                id="cat-analytical",
                category_title="Analytical Instrumentation",
                partners=[
                    PartnerItem(id="p-5", name="Testo", logo_url="", link_url="/products"),
                    PartnerItem(id="p-6", name="Hach", logo_url="", link_url="/products"),
                    PartnerItem(id="p-7", name="AGC Instruments", logo_url="", link_url="/products"),
                    PartnerItem(id="p-8", name="Michell Instruments", logo_url="", link_url="/products"),
                    PartnerItem(id="p-9", name="TSI", logo_url="", link_url="/products"),
                    PartnerItem(id="p-10", name="Bartec", logo_url="", link_url="/products"),
                ],
            ),
            PartnerCategoryGroup(
                id="cat-automation",
                category_title="Industrial Automation",
                partners=[
                    PartnerItem(id="p-11", name="Rockwell Automation", logo_url="", link_url="/products"),
                    PartnerItem(id="p-12", name="Emerson", logo_url="", link_url="/products"),
                    PartnerItem(id="p-13", name="Honeywell Industrial", logo_url="", link_url="/products"),
                    PartnerItem(id="p-14", name="Panorama", logo_url="", link_url="/products"),
                    PartnerItem(id="p-15", name="AVEVA", logo_url="", link_url="/products"),
                ],
            ),
            PartnerCategoryGroup(
                id="cat-process",
                category_title="Process Division",
                partners=[
                    PartnerItem(id="p-16", name="ProMinent", logo_url="", link_url="/products"),
                    PartnerItem(id="p-17", name="Akay Industries", logo_url="", link_url="/products"),
                    PartnerItem(id="p-18", name="Hyosung Pumps", logo_url="", link_url="/products"),
                    PartnerItem(id="p-19", name="Metal Samples", logo_url="", link_url="/products"),
                    PartnerItem(id="p-20", name="Vogelsang", logo_url="", link_url="/products"),
                    PartnerItem(id="p-21", name="Hitachi", logo_url="", link_url="/products"),
                ],
            ),
        ]
    )
    partners: List[PartnerItem] = Field(default_factory=list)


# --- API Response Wrapper ---
class PartnerPageResponse(BaseModel):
    success: bool = True
    data: PartnerPageData