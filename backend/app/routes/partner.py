import copy
from typing import Any
from fastapi import APIRouter, HTTPException, Depends, Body, status
from app.config.database import db
from app.schemas.partner import PartnerPageData, PartnerPageResponse
from app.utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/partners", tags=["Partners API"])

# Default fallback dataset dynamically generated from PartnerPageData schema
DEFAULT_PARTNERS_DATA = PartnerPageData().model_dump()


@router.get("", response_model=PartnerPageResponse)
@router.get("/", response_model=PartnerPageResponse)
async def get_partners_page_content():
    """Public API: Fetch complete Partners page data from MongoDB."""
    try:
        doc = await db["partners_page"].find_one({"_id": "partners_page_content"})

        if not doc:
            return {"success": True, "data": DEFAULT_PARTNERS_DATA}

        doc.pop("_id", None)

        # 1. Normalize Header Section
        if "header" not in doc or not isinstance(doc["header"], dict):
            doc["header"] = DEFAULT_PARTNERS_DATA["header"]
        else:
            header = doc["header"]
            img = header.get("bg_image_url") or header.get("image_url") or ""
            header["bg_image_url"] = img
            header["image_url"] = img

        # 2. Normalize Overview Section
        if "overview" not in doc or not isinstance(doc["overview"], dict):
            doc["overview"] = DEFAULT_PARTNERS_DATA["overview"]

        # 3. Normalize CTA / Enquiry Section
        if "cta" not in doc or not isinstance(doc["cta"], dict):
            doc["cta"] = DEFAULT_PARTNERS_DATA["cta"]

        # 4. Normalize Category Groups (Categorized Partners Grid)
        if "category_groups" not in doc or not isinstance(doc["category_groups"], list):
            doc["category_groups"] = DEFAULT_PARTNERS_DATA["category_groups"]

        # 5. Normalize Flat Partners List (Fallback/Legacy support)
        if "partners" not in doc or not isinstance(doc["partners"], list):
            doc["partners"] = []

        return {"success": True, "data": doc}

    except Exception as e:
        print(f"Error fetching Partners page: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch Partners page content: {str(e)}"
        )


@router.put("", status_code=status.HTTP_200_OK)
@router.put("/", status_code=status.HTTP_200_OK)
async def update_full_partners_page(
    payload: PartnerPageData,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Save/Replace full Partners page dataset in MongoDB."""
    data_to_store = payload.model_dump()

    # Sync header background image aliases
    header = data_to_store.get("header", {})
    img = header.get("bg_image_url") or header.get("image_url") or ""
    header["bg_image_url"] = img
    header["image_url"] = img
    data_to_store["header"] = header

    data_to_store["_id"] = "partners_page_content"

    await db["partners_page"].replace_one(
        {"_id": "partners_page_content"},
        data_to_store,
        upsert=True
    )
    return {"success": True, "message": "Partners page updated successfully."}


@router.patch("/section/{section_name}", status_code=status.HTTP_200_OK)
async def update_partners_section(
    section_name: str,
    payload: Any = Body(...),
    current_admin: dict = Depends(get_current_admin_user)
):
    """
    Admin API: Dynamically update specific sections ('header', 'overview', 'cta', 'category_groups', 'partners')
    inside the partners document.
    """
    allowed_sections = ["header", "overview", "cta", "category_groups", "partners"]

    if section_name not in allowed_sections:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid section name '{section_name}'. Allowed: {allowed_sections}"
        )

    try:
        # Guarantee header image key synchronization
        if section_name == "header" and isinstance(payload, dict):
            img = payload.get("bg_image_url") or payload.get("image_url") or ""
            payload["bg_image_url"] = img
            payload["image_url"] = img

        # Ensure root document exists before updating sub-field
        doc = await db["partners_page"].find_one({"_id": "partners_page_content"})
        if not doc:
            init_data = copy.deepcopy(DEFAULT_PARTNERS_DATA)
            init_data["_id"] = "partners_page_content"
            await db["partners_page"].insert_one(init_data)

        # Update specific section via $set
        await db["partners_page"].update_one(
            {"_id": "partners_page_content"},
            {"$set": {section_name: payload}},
            upsert=True
        )

        return {
            "success": True,
            "message": f"Partners section '{section_name}' updated successfully.",
            "data": payload
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update section '{section_name}': {str(e)}"
        )