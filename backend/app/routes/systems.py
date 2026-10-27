from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.systems import SystemsHeaderSection, SystemsHeaderResponse,SystemsOverviewSection, SystemsOverviewResponse, SystemsSolutionsGridSection,SystemsSolutionsGridResponse
from app.utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/systems", tags=["Systems & Solutions API"])


def clean_doc(doc: dict) -> dict:
    """Removes MongoDB internal _id object from raw dictionary."""
    if isinstance(doc, dict):
        doc.pop("_id", None)
    return doc


# ==========================================
# 1. GET SYSTEMS HEADER (PUBLIC)
# ==========================================
@router.get("/header", response_model=SystemsHeaderResponse)
@router.get("/header/", response_model=SystemsHeaderResponse)
async def get_systems_header():
    """Fetch Header Banner for Systems & Solutions page."""
    try:
        doc = await db["systems_page"].find_one({"section": "header"})

        default_schema = SystemsHeaderSection().model_dump()

        if not doc or "data" not in doc or not isinstance(doc.get("data"), dict):
            return {"success": True, "data": default_schema}

        data = clean_doc(doc["data"])

        # Dual-key normalization for image URL compatibility
        img = data.get("bg_image_url") or data.get("image_url") or ""

        # Merge fetched data with schema defaults so empty strings don't crash components
        merged_payload = {
            "title": data.get("title") or default_schema["title"],
            "subtitle": data.get("subtitle") or default_schema["subtitle"],
            "bg_image_url": img,
            "image_url": img,
        }

        return {"success": True, "data": SystemsHeaderSection(**merged_payload).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch Systems header: {str(e)}"
        )


# ==========================================
# 2. PUT SYSTEMS HEADER (ADMIN)
# ==========================================
@router.put("/header", response_model=SystemsHeaderResponse)
@router.put("/header/", response_model=SystemsHeaderResponse)
async def update_systems_header(
    payload: SystemsHeaderSection,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Update Header Banner for Systems & Solutions page."""
    try:
        data_dict = payload.model_dump()

        # Synchronize dual-key image URL fields
        img = data_dict.get("bg_image_url") or data_dict.get("image_url") or ""
        data_dict["bg_image_url"] = img
        data_dict["image_url"] = img

        now = datetime.now(timezone.utc)

        # Upsert MongoDB Atlas document in systems_page collection
        await db["systems_page"].update_one(
            {"section": "header"},
            {"$set": {"section": "header", "data": data_dict, "updated_at": now}},
            upsert=True
        )

        return {
            "success": True,
            "data": data_dict,
            "message": "Systems & Solutions header updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Systems header: {str(e)}"
        )



# ==========================================
# SYSTEMS OVERVIEW ENDPOINTS
# ==========================================

@router.get("/overview", response_model=SystemsOverviewResponse)
@router.get("/overview/", response_model=SystemsOverviewResponse)
async def get_systems_overview():
    """Public API: Fetch Systems & Solutions overview section."""
    try:
        doc = await db["systems_page"].find_one({"section": "overview"})
        default_payload = SystemsOverviewSection().model_dump()

        if not doc or "data" not in doc or not isinstance(doc.get("data"), dict):
            return {"success": True, "data": default_payload}

        saved_data = clean_doc(doc["data"])

        # Merge saved data with schema defaults to guarantee fallbacks
        merged_payload = {
            "paragraph_1": saved_data.get("paragraph_1") if saved_data.get("paragraph_1") is not None else default_payload["paragraph_1"],
            "paragraph_2": saved_data.get("paragraph_2") if saved_data.get("paragraph_2") is not None else default_payload["paragraph_2"],
            "image_url": saved_data.get("image_url") or "",
            "cta_button_text": saved_data.get("cta_button_text") or default_payload["cta_button_text"],
            "cta_button_url": saved_data.get("cta_button_url") or default_payload["cta_button_url"],
        }

        return {"success": True, "data": SystemsOverviewSection(**merged_payload).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch Systems overview: {str(e)}"
        )


@router.put("/overview", response_model=SystemsOverviewResponse)
@router.put("/overview/", response_model=SystemsOverviewResponse)
async def update_systems_overview(
    payload: SystemsOverviewSection,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Systems & Solutions overview section."""
    try:
        data_dict = payload.model_dump()
        now = datetime.now(timezone.utc)

        await db["systems_page"].update_one(
            {"section": "overview"},
            {"$set": {"section": "overview", "data": data_dict, "updated_at": now}},
            upsert=True
        )

        return {
            "success": True,
            "data": data_dict,
            "message": "Systems overview section updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Systems overview: {str(e)}"
        )

# ==========================================
# 3. SOLUTIONS GRID ENDPOINTS
# ==========================================

@router.get("/solutions-grid", response_model=SystemsSolutionsGridResponse)
@router.get("/solutions-grid/", response_model=SystemsSolutionsGridResponse)
async def get_systems_solutions_grid():
    """Public API: Fetch Systems & Solutions Feature Cards Grid."""
    try:
        doc = await db["systems_page"].find_one({"section": "solutions_grid"})
        default_payload = SystemsSolutionsGridSection().model_dump()

        if not doc or "data" not in doc or not isinstance(doc.get("data"), dict):
            return {"success": True, "data": default_payload}

        saved_data = clean_doc(doc["data"])
        cards = saved_data.get("cards") if isinstance(saved_data.get("cards"), list) and len(saved_data.get("cards")) > 0 else default_payload["cards"]

        return {"success": True, "data": {"cards": cards}}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch solutions grid: {str(e)}"
        )


@router.put("/solutions-grid", response_model=SystemsSolutionsGridResponse)
@router.put("/solutions-grid/", response_model=SystemsSolutionsGridResponse)
async def update_systems_solutions_grid(
    payload: SystemsSolutionsGridSection,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Systems & Solutions Feature Cards Grid."""
    try:
        data_dict = payload.model_dump()
        now = datetime.now(timezone.utc)

        await db["systems_page"].update_one(
            {"section": "solutions_grid"},
            {"$set": {"section": "solutions_grid", "data": data_dict, "updated_at": now}},
            upsert=True
        )

        return {
            "success": True,
            "data": data_dict,
            "message": "Solutions grid updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update solutions grid: {str(e)}"
        )