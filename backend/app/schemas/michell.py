from typing import Optional,List, Any
from pydantic import BaseModel, Field, model_validator


class MichellBannerHeader(BaseModel):
    title: Optional[str] = Field(
        default="Moisture & Dew Point Measurement Instruments",
        description="Main banner header title"
    )
    subtitle: Optional[str] = Field(
        default="Precision Moisture & Trace Gas Analysis Solutions",
        description="Optional banner tagline or subtitle"
    )
    bg_image: Optional[str] = Field(
        default="",
        description="Background image URL path"
    )
    bg_image_url: Optional[str] = Field(
        default="",
        description="Synced background image URL path"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_banner_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Moisture & Dew Point Measurement Instruments"

            if values.get("subtitle") is None:
                values["subtitle"] = "Precision Moisture & Trace Gas Analysis Solutions"

            # Strictly preserve empty strings so no automatic fallback image is assigned
            img = values.get("bg_image_url") if values.get("bg_image_url") is not None else values.get("bg_image", "")
            values["bg_image"] = img
            values["bg_image_url"] = img

        return values


class MichellBannerHeaderResponse(BaseModel):
    success: bool = True
    data: MichellBannerHeader


class ImageItem(BaseModel):
    url: str = Field(default="", description="Image URL")
    caption: Optional[str] = Field(default="", description="Image title or caption text")


class MichellOverview(BaseModel):
    paragraph_1: str = Field(
        default=(
            "From optimizing industrial gas processing to ensuring precise dew point measurement, "
            "accurate moisture data is the key to operational excellence. ESS-ME is the authorized "
            "Middle Eastern distributor for Michell Instruments, providing maintenance teams, facility managers, "
            "and process engineers with the precise, rugged, and reliable trace moisture analyzers they need."
        ),
        description="First paragraph description text",
    )
    paragraph_2: str = Field(
        default=(
            "We supply a comprehensive range of chilled mirror hygrometers, impedance moisture transmitters, "
            "and hydrocarbon dew point analyzers trusted across the GCC's oil & gas, power generation, and "
            "industrial manufacturing sectors."
        ),
        description="Second paragraph description text",
    )

    # Double Image / Gallery fields
    main_image_url: Optional[str] = Field(
        default="",
        description="Primary large image URL to display prominently in the UI",
    )
    images: Optional[List[ImageItem]] = Field(
        default_factory=list,
        description="List of uploaded images (e.g., dual images/thumbnails with optional captions)",
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            # Fallback defaults for paragraph fields if empty or None
            if not values.get("paragraph_1"):
                values["paragraph_1"] = (
                    "From optimizing industrial gas processing to ensuring precise dew point measurement, "
                    "accurate moisture data is the key to operational excellence. ESS-ME is the authorized "
                    "Middle Eastern distributor for Michell Instruments, providing maintenance teams, facility managers, "
                    "and process engineers with the precise, rugged, and reliable trace moisture analyzers they need."
                )
            if not values.get("paragraph_2"):
                values["paragraph_2"] = (
                    "We supply a comprehensive range of chilled mirror hygrometers, impedance moisture transmitters, "
                    "and hydrocarbon dew point analyzers trusted across the GCC's oil & gas, power generation, and "
                    "industrial manufacturing sectors."
                )

            # Backward compatibility: if single `image_url` was passed, sync it to `main_image_url` and `images`
            legacy_image_url = values.get("image_url")
            if legacy_image_url and not values.get("main_image_url"):
                values["main_image_url"] = legacy_image_url

            # Ensure main_image_url defaults to the first image if available
            images = values.get("images") or []
            if images and not values.get("main_image_url"):
                if isinstance(images[0], dict):
                    values["main_image_url"] = images[0].get("url", "")
                elif hasattr(images[0], "url"):
                    values["main_image_url"] = images[0].url

        return values


class MichellOverviewResponse(BaseModel):
    success: bool = True
    data: MichellOverview



class MichellDetails(BaseModel):
    section_title: str = Field(
        default="Product Features & Specifications",
        description="Main heading for the features section"
    )
    features: List[str] = Field(
        default_factory=list,
        description="List of feature bullet points"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_details_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("section_title"):
                values["section_title"] = "Product Features & Specifications"
            if "features" not in values or not values["features"]:
                values["features"] = DEFAULT_DETAILS_FEATURES
        return values


class MichellDetailsResponse(BaseModel):
    success: bool = True
    data: MichellDetails


# DEFAULT FEATURES LIST
DEFAULT_DETAILS_FEATURES = [
    "Multi Phase Operation (MPO): Continuous measurement and stable, repeatable readings – even during major process disturbances such as gas entrainment and solids",
    "Parameterisation, monitoring and verification via Bluetooth®",
    "Wafer design: DN10...150 / ⅜...6\"; max. PN40 / ASME Cl 300",
    "Advanced OPTICHECK technology built-in diagnostics and NAMUR NE 107 status indication via colour-coded backlit display"
]



class MichellCapabilities(BaseModel):
    # Section 1: Industries Served
    industries_title: str = Field(
        default="Industries served",
        description="Heading for the industries served section"
    )
    industries_list: List[str] = Field(
        default_factory=list,
        description="Pill list of targeted industry sectors"
    )

    # Section 2: Why ESS Saudi
    why_title: str = Field(
        default="Why ESS Saudi",
        description="Heading for channel partnership overview"
    )
    why_description: str = Field(
        default=(
            "As a channel partner for globally recognized instrumentation manufacturers, "
            "ESS Saudi supplies certified, application-matched moisture and dew point analyzers, "
            "and offers local technical support, calibration guidance, and after-sales service "
            "across the Kingdom."
        ),
        description="Description paragraph explaining channel partnership capabilities"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_capability_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("industries_title"):
                values["industries_title"] = "Industries served"
            if "industries_list" not in values or not values["industries_list"]:
                values["industries_list"] = DEFAULT_MICHELL_INDUSTRIES
            if not values.get("why_title"):
                values["why_title"] = "Why ESS Saudi"
            if not values.get("why_description"):
                values["why_description"] = (
                    "As a channel partner for globally recognized instrumentation manufacturers, "
                    "ESS Saudi supplies certified, application-matched moisture and dew point analyzers, "
                    "and offers local technical support, calibration guidance, and after-sales service "
                    "across the Kingdom."
                )
        return values


class MichellCapabilitiesResponse(BaseModel):
    success: bool = True
    data: MichellCapabilities


# DEFAULT FALLBACK DATA
DEFAULT_MICHELL_INDUSTRIES = [
    "Oil & Gas",
    "Petrochemical",
    "Power Generation",
    "Gas Utilities"
]

class MichellCTA(BaseModel):
    title: str = Field(
        default="Need the right analyzer for your application?",
        description="Main CTA banner heading text"
    )
    subtitle: str = Field(
        default="Tell us your gas, pressure, and measurement range. Our team will match an analyzer to your plant.",
        description="Sub-heading description text"
    )
    button_text: str = Field(
        default="Contact Us",
        description="Call-to-action button label text"
    )
    button_link: str = Field(
        default="/contact",
        description="Target page route link"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_cta_fields(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Need the right analyzer for your application?"
            if not values.get("subtitle"):
                values["subtitle"] = "Tell us your gas, pressure, and measurement range. Our team will match an analyzer to your plant."
            if not values.get("button_text"):
                values["button_text"] = "Contact Us"
            if not values.get("button_link"):
                values["button_link"] = "/contact"
        return values


class MichellCTAResponse(BaseModel):
    success: bool = True
    data: MichellCTA