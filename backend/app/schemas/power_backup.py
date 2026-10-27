from typing import Optional, List,Any
from pydantic import BaseModel, Field, model_validator


class PowerBackupBanner(BaseModel):
    title: str = Field(
        default="Power Backup Systems (UPS & Battery Charger)",
        description="Main banner heading text"
    )
    subtitle: Optional[str] = Field(
        default="Uninterruptible Power Supply & Battery Charger Solutions",
        description="Sub-heading or product line tagline"
    )
    bg_image_url: Optional[str] = Field(
        default="",
        description="Background image overlay URL"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_banner_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Power Backup Systems (UPS & Battery Charger)"
            if "bg_image" in values and not values.get("bg_image_url"):
                values["bg_image_url"] = values["bg_image"]
        return values


class PowerBackupBannerResponse(BaseModel):
    success: bool = True
    data: PowerBackupBanner


class PowerBackupOverviewImage(BaseModel):
    id: Optional[str] = Field(default="", description="Unique identifier for carousel slide")
    title: Optional[str] = Field(default="", description="Optional title or caption for the product image")
    image_url: str = Field(..., description="Product slide image URL")


class PowerBackupOverview(BaseModel):
    paragraph_1: str = Field(
        default=(
            "Control, safety, and communication systems must stay powered through grid disturbances and outages. "
            "ESS Saudi supplies power backup systems, including uninterruptible power supplies (UPS) and battery chargers, "
            "from internationally reputed manufacturers, engineered to protect critical loads in oil & gas, petrochemical, "
            "and power facilities."
        ),
        description="First paragraph description with blue left-accent line"
    )
    paragraph_2: Optional[str] = Field(
        default=(
            "Our scope covers UPS systems, Battery Charger and battery bank systems, and system sizing and integration "
            "support for critical control, instrumentation, and safety system power requirements."
        ),
        description="Second paragraph description"
    )
    carousel_images: List[PowerBackupOverviewImage] = Field(
        default_factory=list,
        description="List of product image slides for the right-side interactive carousel"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "Control, safety, and communication systems must stay powered through grid disturbances and outages. "
                    "ESS Saudi supplies power backup systems, including uninterruptible power supplies (UPS) and battery chargers, "
                    "from internationally reputed manufacturers, engineered to protect critical loads in oil & gas, petrochemical, "
                    "and power facilities."
                )
            if not values.get("paragraph_2"):
                values["paragraph_2"] = (
                    "Our scope covers UPS systems, Battery Charger and battery bank systems, and system sizing and integration "
                    "support for critical control, instrumentation, and safety system power requirements."
                )
            if "carousel_images" not in values or not values["carousel_images"]:
                values["carousel_images"] = DEFAULT_POWER_BACKUP_IMAGES
        return values


class PowerBackupOverviewResponse(BaseModel):
    success: bool = True
    data: PowerBackupOverview


# DEFAULT FALLBACK CAROUSEL SLIDES
DEFAULT_POWER_BACKUP_IMAGES = [
    {
        "id": "slide_1",
        "title": "Industrial UPS Power Cabinet",
        "image_url": ""
    },
    {
        "id": "slide_2",
        "title": "Industrial Battery Charger System",
        "image_url": ""
    }
]

class PowerBackupApplications(BaseModel):
    title: str = Field(
        default="Key Applications",
        description="Main section heading title"
    )
    applications_list: List[str] = Field(
        default_factory=list,
        description="List of key application bullet points"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_applications_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Key Applications"
            if "applications_list" not in values or not values["applications_list"]:
                values["applications_list"] = DEFAULT_POWER_BACKUP_APPLICATIONS
        return values


class PowerBackupApplicationsResponse(BaseModel):
    success: bool = True
    data: PowerBackupApplications


# DEFAULT FALLBACK APPLICATIONS LIST
DEFAULT_POWER_BACKUP_APPLICATIONS = [
    "Uninterrupted power for DCS, PLC, and SCADA control systems",
    "Battery backup for fire & gas and emergency shutdown (ESD) systems",
    "DC power systems for telecom, instrumentation, and switchgear",
    "Battery charger systems for standby and emergency power",
    "Power backup for control rooms and critical facility loads"
]

class PowerBackupCapabilities(BaseModel):
    # Section 1: Industries Served Pills
    industries_title: str = Field(
        default="Industries served",
        description="Industries section heading"
    )
    industries_list: List[str] = Field(
        default_factory=list,
        description="List of industry pill labels"
    )

    # Section 2: Why ESS Saudi
    why_title: str = Field(
        default="Why ESS Saudi",
        description="Why ESS Saudi section heading"
    )
    why_description: str = Field(
        default=(
            "ESS Saudi supplies UPS and battery charger systems from internationally "
            "certified manufacturers, and offers local sizing, engineering, and commissioning "
            "support for critical power backup applications."
        ),
        description="Why ESS Saudi description narrative text"
    )

    # Section 3: Call to Action (CTA)
    cta_text: Optional[str] = Field(
        default="Contact our team to discuss power backup requirements for your critical systems.",
        description="CTA prompt text"
    )
    cta_button_text: Optional[str] = Field(
        default="Request a Quote",
        description="CTA button label"
    )
    cta_button_link: Optional[str] = Field(
        default="/contact",
        description="CTA button target link"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_capabilities_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("industries_title"):
                values["industries_title"] = "Industries served"
            if "industries_list" not in values or not values["industries_list"]:
                values["industries_list"] = DEFAULT_POWER_BACKUP_INDUSTRIES
            if not values.get("why_title"):
                values["why_title"] = "Why ESS Saudi"
            if not values.get("why_description"):
                values["why_description"] = (
                    "ESS Saudi supplies UPS and battery charger systems from internationally "
                    "certified manufacturers, and offers local sizing, engineering, and commissioning "
                    "support for critical power backup applications."
                )
            if not values.get("cta_text"):
                values["cta_text"] = "Contact our team to discuss power backup requirements for your critical systems."
            if not values.get("cta_button_text"):
                values["cta_button_text"] = "Request a Quote"
            if not values.get("cta_button_link"):
                values["cta_button_link"] = "/contact"
        return values


class PowerBackupCapabilitiesResponse(BaseModel):
    success: bool = True
    data: PowerBackupCapabilities


# DEFAULT FALLBACK INDUSTRIES LIST
DEFAULT_POWER_BACKUP_INDUSTRIES = [
    "Oil & Gas",
    "Petrochemical",
    "Power Generation",
    "Utilities"
]