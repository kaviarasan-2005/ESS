from fastapi import APIRouter, status, Depends
from pydantic import BaseModel
from typing import List, Optional
from app.config.database import db
from app.utils.auth import get_current_admin_user

# FIXED: Set prefix to '/api/settings' so it matches the frontend base URL perfectly
router = APIRouter(prefix="/api/settings", tags=["Site Settings API"])

class NavLink(BaseModel):
    id: str
    label: str
    path: str
    has_dropdown: bool = False
    dropdown_items: Optional[List[dict]] = []

class CtaButton(BaseModel):
    text: str
    url: str

class NavbarData(BaseModel):
    logo_url: str
    nav_links: List[NavLink]
    cta_button: CtaButton

@router.get("/navbar")
async def get_navbar():
    """PUBLIC ENDPOINT: Fetch navbar settings for website header."""
    nav_data = await db["site_settings"].find_one({"_id": "navbar_settings"})
    
    if not nav_data:
        return {
            "success": True,
            "data": {
                "logo_url": "",
                "nav_links": [
                    {"id": "1", "label": "Home", "path": "/", "has_dropdown": False},
                    {"id": "2", "label": "About Us", "path": "/about", "has_dropdown": False},
                    {"id": "3", "label": "Products", "path": "/products", "has_dropdown": True, "dropdown_items": []},
                    {
                        "id": "4", 
                        "label": "Integrated Systems & Solutions", 
                        "path": "/integrated-systems", 
                        "has_dropdown": True, 
                        "dropdown_items": []
                    },
                    {
                        "id": "5", 
                        "label": "Projects & Services", 
                        "path": "/projects-services", 
                        "has_dropdown": True, 
                        "dropdown_items": []
                    },
                    {"id": "6", "label": "Our Partners", "path": "/partners", "has_dropdown": True, "dropdown_items": []},
                    {"id": "7", "label": "Contact Us", "path": "/contact", "has_dropdown": False}
                ],
                "cta_button": {"text": "Shop with Us", "url": "/shop"}
            }
        }
    
    nav_data.pop("_id", None)
    return {"success": True, "data": nav_data}

@router.put("/navbar", status_code=status.HTTP_200_OK)
async def update_navbar(
    payload: NavbarData, 
    current_admin: dict = Depends(get_current_admin_user)
):
    """ADMIN ENDPOINT: Update navbar logo, links, and CTA button in MongoDB."""
    data = payload.model_dump()
    data["_id"] = "navbar_settings"
    
    await db["site_settings"].replace_one({"_id": "navbar_settings"}, data, upsert=True)
    return {"success": True, "message": "Navbar settings updated successfully."}