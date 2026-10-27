from typing import List, Optional, Any
from pydantic import BaseModel, Field, model_validator


# ==========================================
# AVEVA BANNER / HERO SCHEMAS
# ==========================================

class AVEVABannerHeader(BaseModel):
    title: Optional[str] = Field(
        default="Aveva",
        description="Main banner heading title"
    )
    subtitle: Optional[str] = Field(
        default="Industrial Software & Digital Transformation Solutions",
        description="Optional subtitle or tagline"
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
    def sync_banner_bg(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "Aveva"
            if values.get("subtitle") is None:
                values["subtitle"] = "Industrial Software & Digital Transformation Solutions"

            img = (
                values.get("bg_image")
                or values.get("bg_image_url")
                or values.get("image_url")
                or ""
            )
            values["bg_image"] = img
            values["bg_image_url"] = img
        return values


class AVEVABannerHeaderResponse(BaseModel):
    success: bool = True
    data: AVEVABannerHeader


# ==========================================
# AVEVA OVERVIEW SECTION SCHEMAS
# ==========================================

class AVEVAOverview(BaseModel):
    title: Optional[str] = Field(
        default="AVEVA System Platform & SCADA\nSolutions",
        description="Main overview section title"
    )
    description: Optional[str] = Field(
        default=(
            "In the age of industrial digitalization, a SCADA system must be more than a "
            "control interface—it must be the central nervous system of your enterprise. "
            "ESS-ME is a certified system integrator for AVEVA System Platform and AVEVA "
            "Edge SCADA, delivering powerful, scalable solutions that unify control, data, "
            "and insight. We empower industries across the Middle East to break down data silos, "
            "optimize performance, and make faster, data-driven decisions with one of the world's "
            "most trusted industrial software platforms."
        ),
        description="Main overview description body text"
    )
    image: Optional[str] = Field(
        default="",
        description="Featured overview image URL path"
    )
    image_url: Optional[str] = Field(
        default="",
        description="Synced featured overview image URL path"
    )

    @model_validator(mode="before")
    @classmethod
    def sync_overview_image(cls, values: Any) -> Any:
        if isinstance(values, dict):
            if not values.get("title"):
                values["title"] = "AVEVA System Platform & SCADA\nSolutions"
            if values.get("description") is None:
                values["description"] = ""

            img = (
                values.get("image")
                or values.get("image_url")
                or values.get("bg_image")
                or ""
            )
            values["image"] = img
            values["image_url"] = img
        return values


class AVEVAOverviewResponse(BaseModel):
    success: bool = True
    data: AVEVAOverview


# ==========================================
# AVEVA SOLUTIONS & KEY APPLICATIONS SCHEMAS
# ==========================================

class AVEVASolutionFeature(BaseModel):
    id: Optional[str] = ""
    title: str = Field(..., description="Feature section heading")
    description: str = Field(..., description="Feature paragraph description")


class AVEVAKeyApplicationItem(BaseModel):
    id: Optional[str] = ""
    industry: str = Field(..., description="Industry category e.g. 'Oil & Gas'")
    details: str = Field(..., description="Application breakdown details")


class AVEVASolutionsDetails(BaseModel):
    features: List[AVEVASolutionFeature] = Field(
        default_factory=lambda: [
            AVEVASolutionFeature(
                id="feat-1",
                title="AVEVA's Unified Architecture for Operational Excellence",
                description="AVEVA provides an unparalleled industrial software ecosystem, from the plant-floor HMI to the boardroom dashboard. Our expertise in the AVEVA System Platform allows us to build truly object-oriented, enterprise-wide SCADA systems that ensure consistency, reduce engineering time, and simplify maintenance. For smaller or distributed applications, we implement the robust and flexible AVEVA Edge SCADA, ensuring the right solution for every scale and budget, all within the AVEVA family."
            ),
            AVEVASolutionFeature(
                id="feat-2",
                title="Our AVEVA Integration & Development Services",
                description="We deliver the full spectrum of AVEVA services, from strategic system design and custom development to long-term support and expansion. Our methodology ensures your AVEVA deployment is a strategic investment that enhances operational intelligence, improves asset reliability, and scales with your business growth."
            ),
            AVEVASolutionFeature(
                id="feat-3",
                title="Enterprise SCADA & HMI Development with System Platform",
                description="We design and deploy high-performance SCADA systems using AVEVA System Platform, the industry benchmark for large-scale, mission-critical applications. Our services include developing standardized object-based graphics and templates, configuring complex alarm management, and implementing global deployment strategies. This creates a unified operational environment across multiple sites, ensuring best practices are enforced and operational knowledge is centralized."
            ),
            AVEVASolutionFeature(
                id="feat-4",
                title="AVEVA Historian & Industrial Data Management",
                description="Transform raw data into actionable intelligence. We implement AVEVA Historian (formerly Wonderware Historian) to capture, store, and distribute high-fidelity time-series data from across your operation. Coupled with AVEVA's analytical tools, this provides the foundation for performance monitoring, asset optimization, and advanced analytics, enabling you to identify inefficiencies, predict maintenance needs, and improve overall equipment effectiveness (OEE)."
            ),
            AVEVASolutionFeature(
                id="feat-5",
                title="System Modernization & IIoT Integration",
                description="Future-proof your operations by modernizing legacy systems or extending their capabilities. We specialize in migrating older SCADA platforms to the modern AVEVA ecosystem. Furthermore, we integrate AVEVA systems with IIoT platforms and cloud services, enabling new levels of connectivity, remote monitoring, and advanced analytics that drive your digital transformation journey forward."
            ),
            AVEVASolutionFeature(
                id="feat-6",
                title="ESS-ME Advantage in AVEVA Solutions",
                description="Our partnership with AVEVA is backed by our deep domain knowledge of Middle Eastern industries. We provide localized 24/7 support, cybersecurity services tailored for industrial control systems (ICS), and comprehensive operator training. We ensure your AVEVA system is not only implemented correctly but also delivers maximum value and a strong return on investment throughout its entire lifecycle."
            )
        ]
    )
    applications_title: str = Field(default="Key Applications")
    key_applications: List[AVEVAKeyApplicationItem] = Field(
        default_factory=lambda: [
            AVEVAKeyApplicationItem(
                id="app-1",
                industry="Oil & Gas",
                details="Plant-wide DCS & SCADA integration, pipeline SCADA, offshore platform control."
            ),
            AVEVAKeyApplicationItem(
                id="app-2",
                industry="Water & Wastewater",
                details="Centralized SCADA for distribution networks and treatment plants."
            ),
            AVEVAKeyApplicationItem(
                id="app-3",
                industry="Power Generation",
                details="Plant performance monitoring, electrical grid SCADA, renewable energy integration."
            ),
            AVEVAKeyApplicationItem(
                id="app-4",
                industry="Manufacturing & Logistics",
                details="Plant-wide MES & SCADA integration, OEE tracking, warehouse automation."
            )
        ]
    )


class AVEVASolutionsDetailsResponse(BaseModel):
    success: bool = True
    data: AVEVASolutionsDetails