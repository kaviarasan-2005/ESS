import copy
from typing import Any, List
from fastapi import APIRouter, status, Depends, HTTPException, Body
from app.config.database import db
from app.schemas.home import (
    FullHomePageData,
    HomeDataResponse,
    HeroSection,
    HeroSectionResponse,
    AboutSection,
    AboutSectionResponse,
    MissionVisionSection,
    MissionVisionSectionResponse,
    ProductsSection,
    ProductsSectionResponse,
    SolutionsSection,
    SolutionsSectionResponse,
    PartnersSection,
    PartnersSectionResponse,
    CapabilityItem,
    CapabilitiesSectionResponse,
    FooterSection,
    FooterSectionResponse,
)
from app.utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/home", tags=["Home Page API"])

# Fallback dataset matching full multi-section schemas
DEFAULT_HOME_DATA = {
    "hero": {
        "auto_play": True,
        "interval_seconds": 5,
        "slides": [
            {
                "id": "s1",
                "image_url": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
                "tagline": "THE RELIABLE FORCE IN INDUSTRIAL AUTOMATION",
                "title": "Engineering Ideas. Empowering Industries.",
                "main_title": "Engineering Ideas. Empowering Industries.",
                "subtitle": "ENGEN pioneers world-class precision automation...",
                "description": "Industrial manufacturing, and plant optimization engineered to accelerate scale throughput and operational safety.",
                "primary_btn_text": "Explore Our Services",
                "primary_btn_url": "/services",
                "secondary_btn_text": "Watch Overview",
                "secondary_btn_url": "/overview",
                "stats": [
                    {"label": "Years Experience", "value": "75+"},
                    {"label": "Projects Completed", "value": "50K+"},
                    {"label": "Satisfaction Rate", "value": "98%"}
                ]
            },
            {
                "id": "s2",
                "image_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758",
                "tagline": "TURNKEY PRECISION & EPC SUPPORT",
                "title": "Advanced Systems Integration",
                "main_title": "Advanced Systems Integration",
                "subtitle": "ISO 9001 Certified Field Engineers.",
                "description": "Delivering continuous capital efficiency and 24/7 field support.",
                "primary_btn_text": "Our Capabilities",
                "primary_btn_url": "/capabilities",
                "secondary_btn_text": "View Products",
                "secondary_btn_url": "/products",
                "stats": [
                    {"label": "Support", "value": "24/7"},
                    {"label": "Compliance", "value": "100%"}
                ]
            }
        ],
        "stats": [
            {"label": "Years Experience", "value": "75+"},
            {"label": "Projects Completed", "value": "50K+"},
            {"label": "Satisfaction Rate", "value": "98%"}
        ]
    },
    "about": {
        "tagline": "ABOUT US",
        "title": "WELCOME TO ESSENTIAL INDUSTRIAL SERVICES.",
        "description": "With over three decades of mechanical engineering rigor, ESS delivers turnkey systems engineering, process instrumentation, and comprehensive field integration.",
        "secondary_description": "Our multidisciplinary engineering teams combine deep domain expertise with cutting-edge technology.",
        "description_line_height": 1.8,
        "description_spacing": 16,
        "features": [
            {"title": "ISO 9001 Certified Field Engineers", "subtitle": "Adhering strictly to international safety standards."},
            {"title": "High-Tech Heavy Machinery Fleet", "subtitle": "Continuous capital investment into CNCs."},
            {"title": "24/7 Field Maintenance & Rapid Support", "subtitle": "On-site task forces ready within hours."}
        ],
        "image_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758",
        "floating_badge_title": "TURNKEY PRECISION",
        "floating_badge_subtitle": "Full-cycle Engineering & EPC Support",
        "cta_text": "Read Company Profile",
        "cta_url": "/about",
        "mission_statement": "",
        "vision_statement": ""
    },
    "mission_vision": {
        "tagline": "ENGEN",
        "mission_title": "MISSION STATEMENT",
        "mission_quote": '"ENGEN will deliver world-class solutions carefully designed to meet or exceed our customer requirements."',
        "mission_heading": "We believe our work sets a standard of care that benefits the wider community within the industries we serve.",
        "mission_description": "We believe our work fosters a standard of care that benefits the community at large.",
        "mission_points": [
            {
                "id": "mp-1",
                "title": "Upstream Instrumentation & Water Cut Metering",
                "description": "Precision water cut measurement solutions for upstream and midstream oil & gas operations, aligned with Saudi Aramco's IKTVA localization program."
            },
            {
                "id": "mp-2",
                "title": "Sampling Systems",
                "description": "Engineered sampling systems supporting crude oil quality control and Saudi Aramco's fiscal metering requirements."
            },
            {
                "id": "mp-3",
                "title": "Instrumentation Portfolio",
                "description": "A full range of process instrumentation, including Pressure, Temperature, Flow, and Level measurement for industrial and process applications."
            },
            {
                "id": "mp-4",
                "title": "Fire & Gas Control Systems",
                "description": "Turnkey design, supply, and commissioning of Fire and Gas detection systems for high-risk industrial environments, including SIL-rated control panels."
            }
        ],
        "vision_title": "OUR VISION",
        "vision_quote": '"Ensuring Success through Smarter Solutions" is our vision.',
        "vision_heading": "ESS Saudi is committed to becoming a trusted engineering partner with system integration capabilities in the Kingdom.",
        "vision_description": "ENGEN will strive to become an innovative leader supplying products & services.",
        "vision_points": [],
        "cta_text": "DISCOVER CAPABILITIES",
        "cta_url": "/capabilities",
        "center_circle_title": "ESS",
        "center_circle_subtitle": "SYSTEMS & SERVICES",
        "center_logo_url": "",
        "hexagon_nodes": [
            {
                "id": "1",
                "title": "Fire & Gas Systems",
                "bg_color": "#dc2626",
                "image_url": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
                "image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
                "icon_url": "",
                "icon": "",
                "url": "/products/fire-gas",
                "link": "/products/fire-gas"
            },
            {
                "id": "2",
                "title": "Analytical Instrumentation",
                "bg_color": "#16a34a",
                "image_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758",
                "image": "https://images.unsplash.com/photo-1581092160607-ee22621dd758",
                "icon_url": "",
                "icon": "",
                "url": "/products/analytical",
                "link": "/products/analytical"
            },
            {
                "id": "3",
                "title": "Industrial Automation",
                "bg_color": "#1e3a8a",
                "image_url": "https://images.unsplash.com/photo-1581092335397-9583fe92d232",
                "image": "https://images.unsplash.com/photo-1581092335397-9583fe92d232",
                "icon_url": "",
                "icon": "",
                "url": "/products/automation",
                "link": "/products/automation"
            },
            {
                "id": "4",
                "title": "Process Solutions",
                "bg_color": "#ea580c",
                "image_url": "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc",
                "image": "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc",
                "icon_url": "",
                "icon": "",
                "url": "/products/process",
                "link": "/products/process"
            },
            {
                "id": "5",
                "title": "System Integration",
                "bg_color": "#334155",
                "image_url": "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0",
                "image": "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0",
                "icon_url": "",
                "icon": "",
                "url": "/products/integration",
                "link": "/products/integration"
            },
            {
                "id": "6",
                "title": "Testing & Measurement",
                "bg_color": "#9333ea",
                "image_url": "https://images.unsplash.com/photo-1581092162384-8987c1d64718",
                "image": "https://images.unsplash.com/photo-1581092162384-8987c1d64718",
                "icon_url": "",
                "icon": "",
                "url": "/products/testing",
                "link": "/products/testing"
            }
        ]
    },
    "capabilities": [
        {
            "id": "c1",
            "title": "TURNKEY PRECISION",
            "subtitle": "Full-cycle Engineering & EPC Support",
            "image_url": "/images/turnkey.jpg"
        }
    ],
    "products": {
        "tagline": "MANUFACTURED HARDWARE",
        "title": "Our Products",
        "description": "Engineered to withstand extreme pressures, harsh corrosive environments, and intensive manufacturing duty cycles.",
        "items": [
            {
                "id": "p1",
                "title": "Heavy Duty Hydraulic Pumps",
                "description": "Up to 350 bar operating capacity with dual vacuum mounting...",
                "spec_code": "ISO 4401 Compliant",
                "image_url": "/images/pumps.jpg",
                "btn_text": "View Details",
                "details_url": "/products"
            }
        ]
    },
    "solutions": {
        "tagline": "TURNKEY SERVICES",
        "title": "Solutions",
        "description": "Custom engineered turn-key modules tailored from concept prototyping straight to site deployment.",
        "items": [
            {
                "id": "sol-1",
                "icon": "factory",
                "title": "Plant Fabrication",
                "description": "Full lifecycle structural detailing, on-site welding, piping spools fabrication, and foundation mounting.",
                "link_url": "/solutions/plant-fabrication",
                "link_text": "Details ->"
            },
            {
                "id": "sol-2",
                "icon": "bot",
                "title": "Smart Automation",
                "description": "AI sensor networks, real-time industrial telematics, PLC programming, and high-speed robotic integration.",
                "link_url": "/solutions/smart-automation",
                "link_text": "Details ->"
            },
            {
                "id": "sol-3",
                "icon": "wrench",
                "title": "Maintenance Ops",
                "description": "Vibration surveillance, predictive failure diagnosis, thermal inspections, and urgent field refurbishment.",
                "link_url": "/solutions/maintenance-ops",
                "link_text": "Details ->"
            },
            {
                "id": "sol-4",
                "icon": "shield",
                "title": "Safety Audits",
                "description": "Hazardous environment assessments, explosion-proof verification, pressure testing, and emission metrics.",
                "link_url": "/solutions/safety-audits",
                "link_text": "Details ->"
            }
        ],
        "cta": {
            "title": "Need a custom engineered solution?",
            "description": "Contact our specialist engineering team today for tailor-made CAD modeling and execution feasibility studies.",
            "btn_text": "Schedule Consultation",
            "btn_url": "/contact"
        }
    },
    "partners": {
        "tagline": "ALLIANCES",
        "title": "Our Partners",
        "items": [
            {
                "id": "pt1",
                "name": "Honeywell",
                "logo_url": "https://upload.wikimedia.org/wikipedia/commons/2/29/Honeywell_logo.svg",
                "website_url": "https://www.honeywell.com"
            },
            {
                "id": "pt2",
                "name": "HACH",
                "logo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Hach_Logo.svg/1200px-Hach_Logo.svg.png",
                "website_url": "https://www.hach.com"
            },
            {
                "id": "pt3",
                "name": "Rockwell Automation",
                "logo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Rockwell_Automation_logo.svg/1280px-Rockwell_Automation_logo.svg.png",
                "website_url": "https://www.rockwellautomation.com"
            },
            {
                "id": "pt4",
                "name": "EMERSON",
                "logo_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Emerson_Electric_Logo.svg/1280px-Emerson_Electric_Logo.svg.png",
                "website_url": "https://www.emerson.com"
            }
        ]
    },
    "footer": {
        "bg_image_url": "",
        "logo_url": "",
        "description": "Integrated engineering solutions, life-safety instrumentation, and industrial process control.",
        "socials": [
            {"id": "soc-1", "platform": "linkedin", "url": "https://linkedin.com"},
            {"id": "soc-2", "platform": "instagram", "url": "https://instagram.com"}
        ],
        "quick_links": [
            {"id": "ql-1", "label": "Home", "url": "/"},
            {"id": "ql-2", "label": "About Us", "url": "/about"},
            {"id": "ql-3", "label": "Contact Us", "url": "/contact"}
        ],
        "products": [
            {"id": "fp-1", "label": "Fire & Gas Systems", "url": "/products/fire-gas"},
            {"id": "fp-2", "label": "Analytical Instrumentation", "url": "/products/analytical"},
            {"id": "fp-3", "label": "Analyzer System Integration", "url": "/products/analyzer-integration"},
            {"id": "fp-4", "label": "Industrial Automation", "url": "/products/industrial-automation"},
            {"id": "fp-5", "label": "Process Division", "url": "/products/process-division"}
        ],
        "reach_us": {
            "company_name": "Essential Systems and Services",
            "address": "P.O. Box: 319, Buzwair Commercial Building, Al Mansoura, Zone: 25, Street: 330, Building: 57, Doha, Qatar.",
            "email": "sales@essme.com",
            "phone": "+974 4405 9666"
        },
        "terms_label": "Terms & Conditions",
        "terms_url": "/terms",
        "privacy_label": "Privacy Policy",
        "privacy_url": "/privacy",
        "copyright_text": "Copyright © 2026 Essential Systems and Services - All rights reserved."
    }
}


def clean_doc(doc: dict) -> dict:
    if isinstance(doc, dict):
        doc.pop("_id", None)
    return doc


async def get_home_content() -> dict:
    """Fetch the single-source-of-truth home document from MongoDB and apply fallbacks."""
    home_data = await db["home_page"].find_one({"_id": "home_page_content"})
    if not home_data:
        return copy.deepcopy(DEFAULT_HOME_DATA)

    home_data.pop("_id", None)

    # Normalize mission_vision points and nodes if missing from legacy records
    if "mission_vision" in home_data and isinstance(home_data["mission_vision"], dict):
        mv = home_data["mission_vision"]
        if "mission_points" not in mv or not isinstance(mv["mission_points"], list):
            mv["mission_points"] = DEFAULT_HOME_DATA["mission_vision"]["mission_points"]
        if "vision_points" not in mv or not isinstance(mv["vision_points"], list):
            mv["vision_points"] = DEFAULT_HOME_DATA["mission_vision"]["vision_points"]

        if "hexagon_nodes" in mv and isinstance(mv["hexagon_nodes"], list):
            for node in mv["hexagon_nodes"]:
                if isinstance(node, dict):
                    img = node.get("image_url") or node.get("image") or ""
                    node["image_url"] = img
                    node["image"] = img
                    icon_val = node.get("icon_url") or node.get("icon") or ""
                    node["icon_url"] = icon_val
                    node["icon"] = icon_val
                    url_val = node.get("url") or node.get("link") or "/products"
                    node["url"] = url_val
                    node["link"] = url_val

    # Convert legacy array formats in MongoDB into dictionary object format before validation
    if "solutions" in home_data and isinstance(home_data["solutions"], list):
        home_data["solutions"] = DEFAULT_HOME_DATA["solutions"]

    if "products" in home_data and isinstance(home_data["products"], list):
        home_data["products"] = DEFAULT_HOME_DATA["products"]

    if "partners" in home_data and isinstance(home_data["partners"], list):
        home_data["partners"] = {
            "tagline": "ALLIANCES",
            "title": "Our Partners",
            "items": home_data["partners"]
        }

    # Normalize old footer formats
    if "footer" in home_data and isinstance(home_data["footer"], dict):
        if "quick_links" not in home_data["footer"] or "products" not in home_data["footer"]:
            merged_footer = copy.deepcopy(DEFAULT_HOME_DATA["footer"])
            merged_footer.update(home_data["footer"])
            home_data["footer"] = merged_footer

    # Fallback missing keys
    for key, val in DEFAULT_HOME_DATA.items():
        if key not in home_data or home_data[key] is None:
            home_data[key] = copy.deepcopy(val)

    return home_data


async def save_home_section(section_name: str, section_data: Any) -> None:
    """Safely persist a single section to MongoDB home_page collection."""
    doc = await db["home_page"].find_one({"_id": "home_page_content"})
    if not doc:
        init_data = copy.deepcopy(DEFAULT_HOME_DATA)
        init_data["_id"] = "home_page_content"
        init_data[section_name] = section_data
        await db["home_page"].insert_one(init_data)
    else:
        await db["home_page"].update_one(
            {"_id": "home_page_content"},
            {"$set": {section_name: section_data}},
            upsert=True
        )


# ==========================================
# 1. HERO SECTION (GET & PUT)
# ==========================================
@router.get("/hero", response_model=HeroSectionResponse)
@router.get("/hero/", response_model=HeroSectionResponse)
async def get_home_hero():
    """Public/Admin API: Fetch Hero section of Home page."""
    try:
        content = await get_home_content()
        hero_data = content.get("hero") or DEFAULT_HOME_DATA["hero"]
        return {"success": True, "data": HeroSection(**hero_data).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch hero section: {str(e)}"
        )


@router.put("/hero", response_model=HeroSectionResponse)
@router.put("/hero/", response_model=HeroSectionResponse)
async def update_home_hero(
    payload: Any = Body(...),
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Hero section of Home page."""
    try:
        content = await get_home_content()
        current_hero = content.get("hero") or copy.deepcopy(DEFAULT_HOME_DATA["hero"])
        incoming = payload if isinstance(payload, dict) else (payload.model_dump(exclude_unset=True) if hasattr(payload, "model_dump") else dict(payload))
        current_hero.update(incoming)
        validated = HeroSection(**current_hero).model_dump()
        await save_home_section("hero", validated)
        return {
            "success": True,
            "data": validated,
            "message": "Hero section updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update hero section: {str(e)}"
        )


# ==========================================
# 2. ABOUT SECTION (GET & PUT)
# ==========================================
@router.get("/about", response_model=AboutSectionResponse)
@router.get("/about/", response_model=AboutSectionResponse)
async def get_home_about():
    """Public/Admin API: Fetch About section of Home page."""
    try:
        content = await get_home_content()
        about_data = content.get("about") or DEFAULT_HOME_DATA["about"]
        return {"success": True, "data": AboutSection(**about_data).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch about section: {str(e)}"
        )


@router.put("/about", response_model=AboutSectionResponse)
@router.put("/about/", response_model=AboutSectionResponse)
async def update_home_about(
    payload: Any = Body(...),
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update About section of Home page."""
    try:
        content = await get_home_content()
        current_about = content.get("about") or copy.deepcopy(DEFAULT_HOME_DATA["about"])
        incoming = payload if isinstance(payload, dict) else (payload.model_dump(exclude_unset=True) if hasattr(payload, "model_dump") else dict(payload))
        current_about.update(incoming)
        validated = AboutSection(**current_about).model_dump()
        await save_home_section("about", validated)
        return {
            "success": True,
            "data": validated,
            "message": "About section updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update about section: {str(e)}"
        )


# ==========================================
# 3. MISSION & VISION SECTION (GET & PUT)
# ==========================================
@router.get("/mission-vision", response_model=MissionVisionSectionResponse)
@router.get("/mission-vision/", response_model=MissionVisionSectionResponse)
@router.get("/mission_vision", response_model=MissionVisionSectionResponse)
@router.get("/mission_vision/", response_model=MissionVisionSectionResponse)
async def get_home_mission_vision():
    """Public/Admin API: Fetch Mission & Vision section of Home page."""
    try:
        content = await get_home_content()
        mv_data = content.get("mission_vision") or DEFAULT_HOME_DATA["mission_vision"]
        return {"success": True, "data": MissionVisionSection(**mv_data).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch mission & vision section: {str(e)}"
        )


@router.put("/mission-vision", response_model=MissionVisionSectionResponse)
@router.put("/mission-vision/", response_model=MissionVisionSectionResponse)
@router.put("/mission_vision", response_model=MissionVisionSectionResponse)
@router.put("/mission_vision/", response_model=MissionVisionSectionResponse)
async def update_home_mission_vision(
    payload: Any = Body(...),
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Mission & Vision section of Home page."""
    try:
        content = await get_home_content()
        current_mv = content.get("mission_vision") or copy.deepcopy(DEFAULT_HOME_DATA["mission_vision"])
        incoming = payload if isinstance(payload, dict) else (payload.model_dump(exclude_unset=True) if hasattr(payload, "model_dump") else dict(payload))
        current_mv.update(incoming)

        # Ensure hexagon node aliases are synchronized
        if "hexagon_nodes" in current_mv and isinstance(current_mv["hexagon_nodes"], list):
            for node in current_mv["hexagon_nodes"]:
                if isinstance(node, dict):
                    img = node.get("image_url") or node.get("image") or ""
                    node["image_url"] = img
                    node["image"] = img
                    icon_val = node.get("icon_url") or node.get("icon") or ""
                    node["icon_url"] = icon_val
                    node["icon"] = icon_val
                    url_val = node.get("url") or node.get("link") or "/products"
                    node["url"] = url_val
                    node["link"] = url_val

        validated = MissionVisionSection(**current_mv).model_dump()
        await save_home_section("mission_vision", validated)
        return {
            "success": True,
            "data": validated,
            "message": "Mission & Vision section updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update mission & vision section: {str(e)}"
        )


# ==========================================
# 4. PRODUCTS SECTION (GET & PUT)
# ==========================================
@router.get("/products", response_model=ProductsSectionResponse)
@router.get("/products/", response_model=ProductsSectionResponse)
async def get_home_products():
    """Public/Admin API: Fetch Products section of Home page."""
    try:
        content = await get_home_content()
        prod_data = content.get("products") or DEFAULT_HOME_DATA["products"]
        return {"success": True, "data": ProductsSection(**prod_data).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch products section: {str(e)}"
        )


@router.put("/products", response_model=ProductsSectionResponse)
@router.put("/products/", response_model=ProductsSectionResponse)
async def update_home_products(
    payload: Any = Body(...),
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Products section of Home page."""
    try:
        content = await get_home_content()
        current_prod = content.get("products") or copy.deepcopy(DEFAULT_HOME_DATA["products"])
        incoming = payload if isinstance(payload, dict) else (payload.model_dump(exclude_unset=True) if hasattr(payload, "model_dump") else dict(payload))
        current_prod.update(incoming)
        validated = ProductsSection(**current_prod).model_dump()
        await save_home_section("products", validated)
        return {
            "success": True,
            "data": validated,
            "message": "Products section updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update products section: {str(e)}"
        )


# ==========================================
# 5. SOLUTIONS SECTION (GET & PUT)
# ==========================================
@router.get("/solutions", response_model=SolutionsSectionResponse)
@router.get("/solutions/", response_model=SolutionsSectionResponse)
@router.get("/solution", response_model=SolutionsSectionResponse)
@router.get("/solution/", response_model=SolutionsSectionResponse)
async def get_home_solutions():
    """Public/Admin API: Fetch Solutions section of Home page."""
    try:
        content = await get_home_content()
        sol_data = content.get("solutions") or DEFAULT_HOME_DATA["solutions"]
        return {"success": True, "data": SolutionsSection(**sol_data).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch solutions section: {str(e)}"
        )


@router.put("/solutions", response_model=SolutionsSectionResponse)
@router.put("/solutions/", response_model=SolutionsSectionResponse)
@router.put("/solution", response_model=SolutionsSectionResponse)
@router.put("/solution/", response_model=SolutionsSectionResponse)
async def update_home_solutions(
    payload: Any = Body(...),
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Solutions section of Home page."""
    try:
        content = await get_home_content()
        current_sol = content.get("solutions") or copy.deepcopy(DEFAULT_HOME_DATA["solutions"])
        incoming = payload if isinstance(payload, dict) else (payload.model_dump(exclude_unset=True) if hasattr(payload, "model_dump") else dict(payload))
        current_sol.update(incoming)
        validated = SolutionsSection(**current_sol).model_dump()
        await save_home_section("solutions", validated)
        return {
            "success": True,
            "data": validated,
            "message": "Solutions section updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update solutions section: {str(e)}"
        )


# ==========================================
# 6. PARTNERS SECTION (GET & PUT)
# ==========================================
@router.get("/partners", response_model=PartnersSectionResponse)
@router.get("/partners/", response_model=PartnersSectionResponse)
async def get_home_partners():
    """Public/Admin API: Fetch Partners section of Home page."""
    try:
        content = await get_home_content()
        partners_data = content.get("partners") or DEFAULT_HOME_DATA["partners"]
        return {"success": True, "data": PartnersSection(**partners_data).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch partners section: {str(e)}"
        )


@router.put("/partners", response_model=PartnersSectionResponse)
@router.put("/partners/", response_model=PartnersSectionResponse)
async def update_home_partners(
    payload: Any = Body(...),
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Partners section of Home page."""
    try:
        content = await get_home_content()
        current_partners = content.get("partners") or copy.deepcopy(DEFAULT_HOME_DATA["partners"])
        if isinstance(payload, list):
            current_partners["items"] = payload
        else:
            incoming = payload if isinstance(payload, dict) else (payload.model_dump(exclude_unset=True) if hasattr(payload, "model_dump") else dict(payload))
            current_partners.update(incoming)

        validated = PartnersSection(**current_partners).model_dump()
        await save_home_section("partners", validated)
        return {
            "success": True,
            "data": validated,
            "message": "Partners section updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update partners section: {str(e)}"
        )


# ==========================================
# 7. CAPABILITIES SECTION (GET & PUT)
# ==========================================
@router.get("/capabilities", response_model=CapabilitiesSectionResponse)
@router.get("/capabilities/", response_model=CapabilitiesSectionResponse)
async def get_home_capabilities():
    """Public/Admin API: Fetch Capabilities section of Home page."""
    try:
        content = await get_home_content()
        cap_data = content.get("capabilities") or DEFAULT_HOME_DATA["capabilities"]
        if isinstance(cap_data, list):
            items = [CapabilityItem(**item).model_dump() for item in cap_data]
        elif isinstance(cap_data, dict):
            items = [CapabilityItem(**item).model_dump() for item in cap_data.get("items", [])]
        else:
            items = []
        return {"success": True, "data": items}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch capabilities section: {str(e)}"
        )


@router.put("/capabilities", response_model=CapabilitiesSectionResponse)
@router.put("/capabilities/", response_model=CapabilitiesSectionResponse)
async def update_home_capabilities(
    payload: Any = Body(...),
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Capabilities section of Home page."""
    try:
        if isinstance(payload, list):
            raw_items = payload
        elif isinstance(payload, dict) and "items" in payload:
            raw_items = payload["items"]
        else:
            raw_items = []
        items = [CapabilityItem(**item).model_dump() for item in raw_items]
        await save_home_section("capabilities", items)
        return {
            "success": True,
            "data": items,
            "message": "Capabilities section updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update capabilities section: {str(e)}"
        )


# ==========================================
# 8. FOOTER SECTION (GET & PUT)
# ==========================================
@router.get("/footer", response_model=FooterSectionResponse)
@router.get("/footer/", response_model=FooterSectionResponse)
async def get_home_footer():
    """Public/Admin API: Fetch Footer section of Home page."""
    try:
        content = await get_home_content()
        footer_data = content.get("footer") or DEFAULT_HOME_DATA["footer"]
        return {"success": True, "data": FooterSection(**footer_data).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch footer section: {str(e)}"
        )


@router.put("/footer", response_model=FooterSectionResponse)
@router.put("/footer/", response_model=FooterSectionResponse)
async def update_home_footer(
    payload: Any = Body(...),
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Footer section of Home page."""
    try:
        content = await get_home_content()
        current_footer = content.get("footer") or copy.deepcopy(DEFAULT_HOME_DATA["footer"])
        incoming = payload if isinstance(payload, dict) else (payload.model_dump(exclude_unset=True) if hasattr(payload, "model_dump") else dict(payload))
        current_footer.update(incoming)
        validated = FooterSection(**current_footer).model_dump()
        await save_home_section("footer", validated)
        return {
            "success": True,
            "data": validated,
            "message": "Footer section updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update footer section: {str(e)}"
        )


# ==========================================
# 9. FULL HOME PAGE (GET & PUT)
# ==========================================
@router.get("", response_model=HomeDataResponse)
@router.get("/", response_model=HomeDataResponse)
async def get_home_page_content():
    """Fetch complete home dataset containing all sections."""
    try:
        content = await get_home_content()
        return {"success": True, "data": content}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch home page content: {str(e)}"
        )


@router.put("", status_code=status.HTTP_200_OK)
@router.put("/", status_code=status.HTTP_200_OK)
async def update_full_home_page(
    payload: FullHomePageData,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Replace full home page document in MongoDB."""
    try:
        data_to_store = payload.model_dump()
        data_to_store["_id"] = "home_page_content"

        await db["home_page"].replace_one(
            {"_id": "home_page_content"},
            data_to_store,
            upsert=True
        )
        return {"success": True, "message": "Home page content updated successfully from Admin Panel."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update full home page: {str(e)}"
        )


# ==========================================
# 10. BACKWARD-COMPATIBLE SECTION ENDPOINTS
# ==========================================
@router.get("/section/{section_name}")
async def get_single_section_legacy(section_name: str):
    """Legacy route for fetching an individual section."""
    section_map = {
        "hero": get_home_hero,
        "about": get_home_about,
        "mission_vision": get_home_mission_vision,
        "mission-vision": get_home_mission_vision,
        "products": get_home_products,
        "solutions": get_home_solutions,
        "solution": get_home_solutions,
        "partners": get_home_partners,
        "capabilities": get_home_capabilities,
        "footer": get_home_footer,
    }
    handler = section_map.get(section_name)
    if not handler:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid section name '{section_name}'. Allowed: {list(section_map.keys())}"
        )
    return await handler()


@router.patch("/section/{section_name}")
@router.put("/section/{section_name}")
async def update_single_section_legacy(
    section_name: str,
    payload: Any = Body(...),
    current_admin: dict = Depends(get_current_admin_user)
):
    """Legacy route for updating an individual section."""
    section_map = {
        "hero": update_home_hero,
        "about": update_home_about,
        "mission_vision": update_home_mission_vision,
        "mission-vision": update_home_mission_vision,
        "products": update_home_products,
        "solutions": update_home_solutions,
        "solution": update_home_solutions,
        "partners": update_home_partners,
        "capabilities": update_home_capabilities,
        "footer": update_home_footer,
    }
    handler = section_map.get(section_name)
    if not handler:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid section name '{section_name}'. Allowed: {list(section_map.keys())}"
        )
    return await handler(payload=payload, current_admin=current_admin)
