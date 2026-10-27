from pydantic import BaseModel, Field
from typing import List, Optional


# --- Sub-models ---

class SocialLink(BaseModel):
    id: Optional[str] = ""
    platform: str = "linkedin"
    url: str = ""


class FooterNavLink(BaseModel):
    id: Optional[str] = ""
    label: str = ""
    url: str = ""


class ReachUsInfo(BaseModel):
    company_name: Optional[str] = "Essential Systems and Services"
    address: Optional[str] = (
        "P.O. Box: 319, Buzwair Commercial Building, Al Mansoura, "
        "Zone: 25, Street: 330, Building: 57, Doha, Qatar."
    )
    email: Optional[str] = "sales@essme.com"
    phone: Optional[str] = "+974 4405 9666"


# --- Main Footer Schema ---

class FooterData(BaseModel):
    bg_image_url: Optional[str] = ""
    logo_url: Optional[str] = ""
    description: Optional[str] = (
        "Integrated engineering solutions, life-safety instrumentation, "
        "and industrial process control."
    )
    socials: Optional[List[SocialLink]] = Field(default_factory=list)
    quick_links: Optional[List[FooterNavLink]] = Field(default_factory=list)
    products: Optional[List[FooterNavLink]] = Field(default_factory=list)
    reach_us: Optional[ReachUsInfo] = Field(default_factory=ReachUsInfo)
    terms_label: Optional[str] = "Terms & Conditions"
    terms_url: Optional[str] = "/terms"
    privacy_label: Optional[str] = "Privacy Policy"
    privacy_url: Optional[str] = "/privacy"
    copyright_text: Optional[str] = (
        "Copyright (c) 2026 Essential Systems and Services - All rights reserved."
    )


class FooterDataResponse(BaseModel):
    success: bool = True
    data: FooterData
