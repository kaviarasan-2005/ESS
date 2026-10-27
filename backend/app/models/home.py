from pydantic import BaseModel
from typing import List, Optional

# --- Shared & Sub-models ---
class KeyValItem(BaseModel):
    label: str
    value: str

class FeatureItem(BaseModel):
    title: str
    subtitle: Optional[str] = ""

class SectionHeader(BaseModel):
    tagline: Optional[str] = None
    title: Optional[str] = ""
    description: Optional[str] = None

# --- Specific Page Sections ---
# --- Specific Page Sections ---
class HeroSection(BaseModel):
    tagline: Optional[str] = "THE RELIABLE FORCE IN INDUSTRIAL AUTOMATION"
    title: Optional[str] = ""
    subtitle: Optional[str] = ""
    description: Optional[str] = ""
    primary_btn_text: Optional[str] = "Explore Our Services"
    primary_btn_url: Optional[str] = ""    # ADDED to capture frontend payload
    secondary_btn_text: Optional[str] = "Watch Overview"
    secondary_btn_url: Optional[str] = ""  # ADDED to capture frontend payload
    video_url: Optional[str] = None
    image_url: Optional[str] = ""          # RENAMED from bg_image_url to match frontend
    stats: Optional[List[KeyValItem]] = []

class AboutSection(BaseModel):
    tagline: Optional[str] = "ABOUT OUR COMPANY"
    title: Optional[str] = "WELCOME TO ESSENTIAL INDUSTRIAL SERVICES."
    description: Optional[str] = ""
    image_url: Optional[str] = ""
    floating_badge_title: Optional[str] = "TURNKEY PRECISION"
    floating_badge_subtitle: Optional[str] = "Full-cycle Engineering & EPC Support"
    features: Optional[List[FeatureItem]] = []
    mission_statement: Optional[str] = ""
    vision_statement: Optional[str] = ""

class CapabilityItem(BaseModel):
    id: str
    title: str
    subtitle: str
    image_url: str

class ProductItem(BaseModel):
    id: str
    title: str
    description: str
    spec_code: str
    image_url: str

class SolutionItem(BaseModel):
    id: str
    title: str
    icon: Optional[str] = None

class PartnerItem(BaseModel):
    id: str
    name: str
    logo_url: str

class FooterInfo(BaseModel):
    address: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""

# --- Full Page Structure ---
class FullHomePageModel(BaseModel):
    hero: Optional[HeroSection] = None
    about: Optional[AboutSection] = None
    capabilities: Optional[List[CapabilityItem]] = []
    products_header: Optional[SectionHeader] = None
    products: Optional[List[ProductItem]] = []
    solutions_header: Optional[SectionHeader] = None
    solutions: Optional[List[SolutionItem]] = []
    partners: Optional[List[PartnerItem]] = []
    footer: Optional[FooterInfo] = None

class HomeDataResponse(BaseModel):
    success: bool = True
    data: FullHomePageModel