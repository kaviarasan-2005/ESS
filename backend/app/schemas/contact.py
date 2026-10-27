import time
from pydantic import BaseModel, EmailStr, Field, model_validator
from typing import List, Optional
from datetime import datetime


# --- MAP LOCATION SUB-MODELS ---

class MapLocation(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: f"map-{int(time.time() * 1000)}")
    title: str = "Facility Location"  # e.g., 'Engineering Facility', 'Warehouse'
    address: Optional[str] = ""
    map_embed_url: str = ""  # Google Maps iframe embed URL (src)
    map_link: Optional[str] = ""  # External 'Open in Maps' URL


class MapSectionConfig(BaseModel):
    section_title: Optional[str] = "Our Locations"
    main_map_embed_url: Optional[str] = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.286812852787!2d51.5284!3d25.2693"
    main_map_link: Optional[str] = "https://maps.google.com"
    facility_maps: List[MapLocation] = Field(default_factory=lambda: [
        MapLocation(
            id="map-1",
            title="Engineering Facility",
            address="P.O. Box: 319, Street 14, Industrial Area Doha, Qatar",
            map_embed_url="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.6!2d51.44!3d25.18",
            map_link="https://maps.google.com"
        ),
        MapLocation(
            id="map-2",
            title="Warehouse",
            address="P.O. Box: 319, Street 46, Industrial Area, Doha, Qatar",
            map_embed_url="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.8!2d51.43!3d25.17",
            map_link="https://maps.google.com"
        )
    ])


# --- CMS CONTENT SUB-MODELS ---

class ContactHeader(BaseModel):
    title: Optional[str] = "Contact Us"
    subtitle: Optional[str] = "Get in touch with our expert technical support and sales team."
    bg_image: Optional[str] = ""
    bg_image_url: Optional[str] = ""

    @model_validator(mode="before")
    @classmethod
    def sync_header_bg(cls, values: dict) -> dict:
        if isinstance(values, dict):
            img = values.get("bg_image") or values.get("bg_image_url") or ""
            values["bg_image"] = img
            values["bg_image_url"] = img
        return values


class OfficeLocation(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: f"loc-{int(time.time() * 1000)}")
    title: str = "Main Office"  # e.g., 'Main Office', 'Warehouse', 'Engineering Facility'
    address: str = "P.O. Box: 319, Buzwair Commercial Building, Al Mansoura Zone: 25, Street: 330, Building: 57, Doha, Qatar."
    phone: Optional[str] = ""
    email: Optional[str] = ""
    map_url: Optional[str] = ""


class SocialMediaLink(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: f"soc-{int(time.time() * 1000)}")
    platform: str = "linkedin"  # 'linkedin', 'facebook', 'twitter', 'instagram'
    url: str = "https://linkedin.com"


# --- FORM LABELS & PANEL HEADINGS SUB-MODEL ---
class FormLabels(BaseModel):
    name_label: Optional[str] = "Name"
    name_placeholder: Optional[str] = "Your name"
    location_label: Optional[str] = "Location"
    location_placeholder: Optional[str] = "Your location"
    email_label: Optional[str] = "Email"
    email_placeholder: Optional[str] = "you@example.com"
    contact_number_label: Optional[str] = "Contact Number"
    contact_number_placeholder: Optional[str] = "+974 ..."
    products_label: Optional[str] = "Choose Products"
    message_label: Optional[str] = "Message"
    message_placeholder: Optional[str] = "Tell us about your requirements..."
    submit_btn_text: Optional[str] = "SUBMIT"
    
    # Dynamic right-side panel headings
    email_heading: Optional[str] = "Email Us"
    phone_heading: Optional[str] = "Call to Us"
    social_heading: Optional[str] = "FOLLOW OUR SOCIAL MEDIA"


class ContactMainContent(BaseModel):
    tagline: Optional[str] = "REACH US"
    title: Optional[str] = "Get in Touch."
    description: Optional[str] = "We are never out of reach and always at your service. We can't wait to growth along with you."
    
    # Locations matching image design
    locations: List[OfficeLocation] = Field(default_factory=lambda: [
        OfficeLocation(title="Main Office", address="P.O. Box: 319, Buzwair Commercial Building, Al Mansoura Zone: 25, Street: 330, Building: 57, Doha, Qatar."),
        OfficeLocation(title="Warehouse", address="P.O. Box: 319, Street 46, Industrial Area, Doha, Qatar."),
        OfficeLocation(title="Engineering Facility", address="P.O. Box: 319, Street 14, Industrial Area Doha, Qatar.")
    ])
    
    # Contact details
    email: Optional[str] = "sales@essme.com"
    phone: Optional[str] = "+974 4405 9666"
    
    # Product checkboxes array inside the contact form
    product_options: List[str] = Field(default_factory=lambda: [
        "Fire & Gas Systems",
        "Analytical Instrumentation",
        "Analyzer System Integration",
        "Industrial Automation",
        "Process Equipments"
    ])
    
    # Form labels, placeholders & right panel headings configuration
    form_labels: Optional[FormLabels] = Field(default_factory=FormLabels)
    
    # Social channels list below form
    social_links: List[SocialMediaLink] = Field(default_factory=lambda: [
        SocialMediaLink(platform="linkedin", url="https://linkedin.com")
    ])


class ContactPageData(BaseModel):
    header: Optional[ContactHeader] = Field(default_factory=ContactHeader)
    content: Optional[ContactMainContent] = Field(default_factory=ContactMainContent)
    maps_section: Optional[MapSectionConfig] = Field(default_factory=MapSectionConfig)
    offices: Optional[List[OfficeLocation]] = Field(default_factory=list)
    general_email: Optional[str] = "sales@essme.com"
    general_phone: Optional[str] = "+974 4405 9666"


class ContactPageResponse(BaseModel):
    success: bool = True
    data: ContactPageData


# --- USER ENQUIRY SUBMISSION SCHEMAS ---

class ContactSubmissionCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    location: Optional[str] = ""
    email: EmailStr
    phone: Optional[str] = ""
    contact_number: Optional[str] = ""
    subject: Optional[str] = "General Inquiry"
    selected_products: Optional[List[str]] = Field(default_factory=list)
    message: str = Field(..., min_length=2, max_length=2000)


class ContactSubmissionResponse(BaseModel):
    id: str
    name: str
    location: Optional[str] = ""
    email: EmailStr
    phone: Optional[str] = ""
    contact_number: Optional[str] = ""
    subject: Optional[str] = ""
    selected_products: Optional[List[str]] = Field(default_factory=list)
    message: str
    created_at: datetime
    is_read: bool = False