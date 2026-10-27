from pydantic import BaseModel, Field, ConfigDict, model_validator
from typing import List, Optional, Any

# --- Sub-models ---     
class StatItem(BaseModel):
    label: str = ""
    value: str = ""

class FeatureItem(BaseModel):
    title: str = ""
    subtitle: Optional[str] = ""
    description: Optional[str] = ""

# --- Point / Solution Item Sub-model ---
class PointItem(BaseModel):
    id: Optional[str] = ""
    title: str = ""
    description: Optional[str] = ""

# --- Hero Slide Sub-model ---
class HeroSlide(BaseModel):
    model_config = ConfigDict(extra="allow")
    id: Optional[str] = ""
    image_url: Optional[str] = ""
    tagline: Optional[str] = ""
    title: Optional[str] = ""
    main_title: Optional[str] = ""
    subtitle: Optional[str] = ""
    description: Optional[str] = ""
    primary_btn_text: Optional[str] = ""
    primary_btn_url: Optional[str] = ""
    secondary_btn_text: Optional[str] = ""
    secondary_btn_url: Optional[str] = ""
    stats: Optional[List[StatItem]] = Field(default_factory=list)

# --- Mission & Vision Sub-models ---
class HexagonNode(BaseModel):
    model_config = ConfigDict(extra="allow")
    id: Optional[str] = ""
    title: str = "New Node"
    icon: Optional[str] = "fire"
    icon_url: Optional[str] = ""
    bg_color: Optional[str] = "#3b82f6"
    image_url: Optional[str] = ""
    image: Optional[str] = ""
    url: Optional[str] = "/products"
    link: Optional[str] = "/products"

    @model_validator(mode="before")
    @classmethod
    def sync_node_keys(cls, values: Any) -> Any:
        if isinstance(values, dict):
            # Synchronize target redirect URL
            target_path = values.get("url") or values.get("link") or "/products"
            values["url"] = target_path
            values["link"] = target_path

            # Synchronize node background image URL
            img = values.get("image_url") or values.get("image") or ""
            values["image_url"] = img
            values["image"] = img

            # Synchronize floating center badge icon URL / key
            icon_val = values.get("icon_url") or values.get("icon") or ""
            values["icon_url"] = icon_val
            values["icon"] = icon_val

        return values

class MissionVisionSection(BaseModel):
    model_config = ConfigDict(extra="allow")
    tagline: Optional[str] = "ENGEN"
    mission_title: Optional[str] = "MISSION STATEMENT"
    mission_quote: Optional[str] = '"ENGEN will deliver world-class solutions carefully designed to meet or exceed our customer requirements."'
    mission_heading: Optional[str] = ""
    mission_description: Optional[str] = ""
    mission_points: Optional[List[PointItem]] = Field(default_factory=list)
    
    vision_title: Optional[str] = "OUR VISION"
    vision_quote: Optional[str] = '"Ensuring Success through Smarter Solutions" is our vision.'
    vision_heading: Optional[str] = ""
    vision_description: Optional[str] = ""
    vision_points: Optional[List[PointItem]] = Field(default_factory=list)
    
    cta_text: Optional[str] = "DISCOVER CAPABILITIES"
    cta_url: Optional[str] = "/capabilities"
    
    center_circle_title: Optional[str] = "ESS"
    center_circle_subtitle: Optional[str] = "SYSTEMS & SERVICES"
    center_logo_url: Optional[str] = ""
    
    hexagon_nodes: Optional[List[HexagonNode]] = Field(default_factory=list)

# --- Products Sub-models ---
class ProductItem(BaseModel):
    model_config = ConfigDict(extra="allow")
    id: Optional[str] = ""
    title: Optional[str] = ""
    description: Optional[str] = ""
    spec_code: Optional[str] = ""
    image_url: Optional[str] = ""
    btn_text: Optional[str] = "View Details"
    details_url: Optional[str] = "/products"

class ProductsSection(BaseModel):
    model_config = ConfigDict(extra="allow")
    tagline: Optional[str] = "MANUFACTURED HARDWARE"
    title: Optional[str] = "Our Products"
    description: Optional[str] = "Engineered to withstand extreme pressures, harsh corrosive environments, and intensive manufacturing duty cycles."
    items: Optional[List[ProductItem]] = Field(default_factory=list)

# --- Solutions Sub-models ---
class SolutionItem(BaseModel):
    model_config = ConfigDict(extra="allow")
    id: Optional[str] = ""
    icon: Optional[str] = "factory"
    title: str = ""
    description: Optional[str] = ""
    link_url: Optional[str] = "/solutions"
    link_text: Optional[str] = "Details ->"

class SolutionsCta(BaseModel):
    model_config = ConfigDict(extra="allow")
    title: Optional[str] = "Need a custom engineered solution?"
    description: Optional[str] = "Contact our specialist engineering team today for tailor-made CAD modeling and execution feasibility studies."
    btn_text: Optional[str] = "Schedule Consultation"
    btn_url: Optional[str] = "/contact"

class SolutionsSection(BaseModel):
    model_config = ConfigDict(extra="allow")
    tagline: Optional[str] = "TURNKEY SERVICES"
    title: Optional[str] = "Solutions"
    description: Optional[str] = "Custom engineered turn-key modules tailored from concept prototyping straight to site deployment."
    items: Optional[List[SolutionItem]] = Field(default_factory=list)
    cta: Optional[SolutionsCta] = Field(default_factory=SolutionsCta)

# --- Hero & Section Sub-models ---
class HeroSection(BaseModel):
    model_config = ConfigDict(extra="allow")
    tagline: Optional[str] = "THE RELIABLE FORCE IN INDUSTRIAL AUTOMATION"
    title: Optional[str] = ""
    main_title: Optional[str] = ""
    subtitle: Optional[str] = ""
    description: Optional[str] = ""
    primary_btn_text: Optional[str] = "Explore Our Services"
    primary_btn_url: Optional[str] = ""
    secondary_btn_text: Optional[str] = "Watch Overview"
    secondary_btn_url: Optional[str] = ""
    video_url: Optional[str] = None
    image_url: Optional[str] = ""
    bg_image_url: Optional[str] = ""
    slides: Optional[List[HeroSlide]] = Field(default_factory=list)
    images: Optional[List[str]] = Field(default_factory=list)
    stats: Optional[List[StatItem]] = Field(default_factory=list)
    auto_play: Optional[bool] = True
    interval_seconds: Optional[int] = 5

class AboutSection(BaseModel):
    model_config = ConfigDict(extra="allow")
    tagline: Optional[str] = "ABOUT OUR COMPANY"
    title: Optional[str] = "WELCOME TO ESSENTIAL INDUSTRIAL SERVICES."
    description: Optional[str] = ""
    secondary_description: Optional[str] = ""
    description_line_height: Optional[float] = 1.8
    description_spacing: Optional[int] = 16
    features: Optional[List[FeatureItem]] = Field(default_factory=list)
    mission_statement: Optional[str] = ""
    vision_statement: Optional[str] = ""
    image_url: Optional[str] = ""
    floating_badge_title: Optional[str] = "TURNKEY PRECISION"
    floating_badge_subtitle: Optional[str] = "Full-cycle Engineering & EPC Support"
    cta_text: Optional[str] = "Read Company Profile"
    cta_url: Optional[str] = "/about"

class CapabilityItem(BaseModel):
    model_config = ConfigDict(extra="allow")
    id: Optional[str] = ""
    title: str = ""
    subtitle: Optional[str] = ""
    image_url: Optional[str] = ""

class PartnerItem(BaseModel):
    model_config = ConfigDict(extra="allow")
    id: Optional[str] = ""
    name: str = ""
    logo_url: Optional[str] = ""
    website_url: Optional[str] = ""

class PartnersSection(BaseModel):
    model_config = ConfigDict(extra="allow")
    tagline: Optional[str] = "ALLIANCES"
    title: Optional[str] = "Our Partners"
    items: Optional[List[PartnerItem]] = Field(default_factory=list)

    @model_validator(mode="before")
    @classmethod
    def normalize_partners_input(cls, values: Any) -> Any:
        if isinstance(values, list):
            return {"tagline": "ALLIANCES", "title": "Our Partners", "items": values}
        return values

# --- Enhanced Footer Sub-models ---
class SocialLink(BaseModel):
    model_config = ConfigDict(extra="allow")
    id: Optional[str] = ""
    platform: str = "linkedin"
    url: str = ""

class FooterNavLink(BaseModel):
    model_config = ConfigDict(extra="allow")
    id: Optional[str] = ""
    label: str = ""
    url: str = ""

class ReachUsInfo(BaseModel):
    model_config = ConfigDict(extra="allow")
    company_name: Optional[str] = "Essential Systems and Services"
    address: Optional[str] = "P.O. Box: 319, Buzwair Commercial Building, Al Mansoura, Zone: 25, Street: 330, Building: 57, Doha, Qatar."
    email: Optional[str] = "sales@essme.com"
    phone: Optional[str] = "+974 4405 9666"

class FooterSection(BaseModel):
    model_config = ConfigDict(extra="allow")
    bg_image_url: Optional[str] = ""
    logo_url: Optional[str] = ""
    description: Optional[str] = "Integrated engineering solutions, life-safety instrumentation, and industrial process control."
    socials: Optional[List[SocialLink]] = Field(default_factory=list)
    quick_links: Optional[List[FooterNavLink]] = Field(default_factory=list)
    products: Optional[List[FooterNavLink]] = Field(default_factory=list)
    reach_us: Optional[ReachUsInfo] = Field(default_factory=ReachUsInfo)
    terms_label: Optional[str] = "Terms & Conditions"
    terms_url: Optional[str] = "/terms"
    privacy_label: Optional[str] = "Privacy Policy"
    privacy_url: Optional[str] = "/privacy"
    copyright_text: Optional[str] = "Copyright © 2026 Essential Systems and Services - All rights reserved."

# --- Main Page Schemas ---
class FullHomePageData(BaseModel):
    model_config = ConfigDict(extra="allow")
    hero: Optional[HeroSection] = Field(default_factory=HeroSection)
    about: Optional[AboutSection] = Field(default_factory=AboutSection)
    mission_vision: Optional[MissionVisionSection] = Field(default_factory=MissionVisionSection)
    capabilities: Optional[List[CapabilityItem]] = Field(default_factory=list)
    products: Optional[ProductsSection] = Field(default_factory=ProductsSection)
    solutions: Optional[SolutionsSection] = Field(default_factory=SolutionsSection)
    partners: Optional[PartnersSection] = Field(default_factory=PartnersSection)
    footer: Optional[FooterSection] = Field(default_factory=FooterSection)

class HomeDataResponse(BaseModel):
    success: bool = True
    data: FullHomePageData

# --- Individual Section Response Models ---
class HeroSectionResponse(BaseModel):
    success: bool = True
    data: HeroSection
    message: Optional[str] = None

class AboutSectionResponse(BaseModel):
    success: bool = True
    data: AboutSection
    message: Optional[str] = None

class MissionVisionSectionResponse(BaseModel):
    success: bool = True
    data: MissionVisionSection
    message: Optional[str] = None

class ProductsSectionResponse(BaseModel):
    success: bool = True
    data: ProductsSection
    message: Optional[str] = None

class SolutionsSectionResponse(BaseModel):
    success: bool = True
    data: SolutionsSection
    message: Optional[str] = None

class PartnersSectionResponse(BaseModel):
    success: bool = True
    data: PartnersSection
    message: Optional[str] = None

class CapabilitiesSectionResponse(BaseModel):
    success: bool = True
    data: List[CapabilityItem]
    message: Optional[str] = None

class FooterSectionResponse(BaseModel):
    success: bool = True
    data: FooterSection
    message: Optional[str] = None