import copy
from typing import Any
from fastapi import APIRouter, status, Depends, HTTPException, Body
from app.config.database import db
from app.schemas.product import ProductPageData, ProductPageResponse
from app.utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/products", tags=["Products API"])

# Fallback dataset matching the 5 Product Divisions UI design
DEFAULT_PRODUCTS_DATA = {
    "header": {
        "title": "Products",
        "subtitle": "Explore Our Industrial Grade Hardware & Equipment",
        "bg_image": "",
        "bg_url": "",
        "image_url": "",
        "bg_color": "#0b1727"
    },
    "content": {
        "paragraph_1": "ESS Middle East embrace a total systems approach to meet the growing operational & environmental monitoring demands of the Oil & Gas, Petrochemical & Power sector industries.",
        "paragraph_2": "We offer products & services which are technically proven in the field, well supported by qualified service personnel & most economical with excellent return of investment.",
        "button_text": "Contact Us",
        "button_link": "/contact",
        "image_url": ""
    },
    "items": [
        {
            "id": "fire-and-gas-systems",
            "title": "Fire & Gas Systems",
            "icon_name": "Flame",
            "icon_url": "",
            "button_text": "KNOW MORE",
            "button_link": "/products/fire-and-gas-systems",
            "description": "Comprehensive safety monitoring & industrial hazard detection solutions."
        },
        {
            "id": "analytical-instrumentation",
            "title": "Analytical Instrumentation",
            "icon_name": "Users",
            "icon_url": "",
            "button_text": "KNOW MORE",
            "button_link": "/products/analytical-instrumentation",
            "description": "High-precision gas & liquid analytical analyzers for process control."
        },
        {
            "id": "analyzer-system-integration",
            "title": "Analyzer System Integration",
            "icon_name": "CircleDot",
            "icon_url": "",
            "button_text": "KNOW MORE",
            "button_link": "/products/analyzer-system-integration",
            "description": "Turnkey analyzer shelters, sample conditioning & field enclosures."
        },
        {
            "id": "industrial-automation",
            "title": "Industrial Automation",
            "icon_name": "Layers",
            "icon_url": "",
            "button_text": "KNOW MORE",
            "button_link": "/products/industrial-automation",
            "description": "PLC, SCADA, and DCS automation solutions for industrial plants."
        },
        {
            "id": "process-division",
            "title": "Process Division",
            "icon_name": "Share2",
            "icon_url": "",
            "button_text": "KNOW MORE",
            "button_link": "/products/process-division",
            "description": "Advanced process control instrumentation and fluid management systems."
        }
    ]
}


@router.get("", response_model=ProductPageResponse)
@router.get("/", response_model=ProductPageResponse)
async def get_products_page_content():
    """Public API: Fetch complete Products page data from MongoDB with automatic defaults."""
    try:
        doc = await db["products_page"].find_one({"_id": "products_page_content"})

        if not doc:
            return {"success": True, "data": DEFAULT_PRODUCTS_DATA}

        doc.pop("_id", None)

        # 1. Normalize Header Section
        if "header" not in doc or not isinstance(doc["header"], dict):
            doc["header"] = DEFAULT_PRODUCTS_DATA["header"]
        else:
            header = doc["header"]
            img = header.get("bg_image") or header.get("bg_url") or header.get("image_url") or ""
            header["bg_image"] = img
            header["bg_url"] = img
            header["image_url"] = img

        # 2. Normalize Content/Overview Section
        if "content" not in doc or not isinstance(doc["content"], dict):
            doc["content"] = DEFAULT_PRODUCTS_DATA["content"]

        # 3. Normalize Items/Cards Section
        if "items" not in doc or not isinstance(doc["items"], list) or len(doc["items"]) == 0:
            doc["items"] = DEFAULT_PRODUCTS_DATA["items"]

        return {"success": True, "data": doc}

    except Exception as e:
        print(f"Error fetching Products page: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch Products page content: {str(e)}"
        )


@router.put("", status_code=status.HTTP_200_OK)
@router.put("/", status_code=status.HTTP_200_OK)
async def update_full_products_page(
    payload: ProductPageData,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Save/Replace the full Products page dataset in MongoDB."""
    data_to_store = payload.model_dump()

    # Sync header background image aliases
    header = data_to_store.get("header", {})
    img = header.get("bg_image") or header.get("bg_url") or header.get("image_url") or ""
    header["bg_image"] = img
    header["bg_url"] = img
    header["image_url"] = img
    data_to_store["header"] = header

    data_to_store["_id"] = "products_page_content"

    await db["products_page"].replace_one(
        {"_id": "products_page_content"},
        data_to_store,
        upsert=True
    )
    return {"success": True, "message": "Products page updated successfully."}


@router.patch("/section/{section_name}", status_code=status.HTTP_200_OK)
async def update_products_section(
    section_name: str,
    payload: Any = Body(...),
    current_admin: dict = Depends(get_current_admin_user)
):
    """
    Admin API: Dynamically update specific sections ('header', 'content', 'items') 
    inside the products document.
    """
    allowed_sections = ["header", "content", "items"]

    if section_name not in allowed_sections:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid section name '{section_name}'. Allowed: {allowed_sections}"
        )

    try:
        # Guarantee header image key synchronization
        if section_name == "header" and isinstance(payload, dict):
            img = payload.get("bg_image") or payload.get("bg_url") or payload.get("image_url") or ""
            payload["bg_image"] = img
            payload["bg_url"] = img
            payload["image_url"] = img

        # Ensure root document exists before updating sub-field
        doc = await db["products_page"].find_one({"_id": "products_page_content"})
        if not doc:
            init_data = copy.deepcopy(DEFAULT_PRODUCTS_DATA)
            init_data["_id"] = "products_page_content"
            await db["products_page"].insert_one(init_data)

        # Update specific section via $set
        await db["products_page"].update_one(
            {"_id": "products_page_content"},
            {"$set": {section_name: payload}},
            upsert=True
        )

        return {
            "success": True,
            "message": f"Products section '{section_name}' updated successfully.",
            "data": payload
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update section '{section_name}': {str(e)}"
        )