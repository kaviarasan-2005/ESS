from datetime import datetime, timezone
from typing import Any, Dict
from fastapi import APIRouter, HTTPException, Depends, Body, status
from app.config.database import db
from app.schemas.about import (
    AboutPageData,
    AboutPageResponse,
    PageHeaderSection,
    AboutStorySection,
    SpecializedDivisionsSection,
)
from app.utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/about", tags=["About API"])


def clean_doc(doc: dict) -> dict:
    if isinstance(doc, dict):
        doc.pop("_id", None)
    return doc


# ==========================================
# 1. HEADER BANNER ENDPOINTS
# ==========================================

@router.get("/header")
@router.get("/header/")
async def get_about_header():
    """Public API: Fetch Header Banner section."""
    try:
        doc = await db["about_page"].find_one({"section": "header"})
        if not doc or "data" not in doc:
            return {"success": True, "data": PageHeaderSection().model_dump()}

        data = clean_doc(doc["data"])
        img = data.get("bg_image_url") or data.get("image_url") or ""
        data["bg_image_url"] = img
        data["image_url"] = img

        return {"success": True, "data": PageHeaderSection(**data).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch About header: {str(e)}"
        )


@router.put("/header")
@router.put("/header/")
async def update_about_header(
    payload: PageHeaderSection,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Header Banner section."""
    try:
        data_dict = payload.model_dump()
        img = data_dict.get("bg_image_url") or data_dict.get("image_url") or ""
        data_dict["bg_image_url"] = img
        data_dict["image_url"] = img

        now = datetime.now(timezone.utc)
        await db["about_page"].update_one(
            {"section": "header"},
            {"$set": {"section": "header", "data": data_dict, "updated_at": now}},
            upsert=True
        )
        return {"success": True, "data": data_dict, "message": "About header updated successfully."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update About header: {str(e)}"
        )


# ==========================================
# 2. OUR STORY ENDPOINTS
# ==========================================

@router.get("/story")
@router.get("/story/")
async def get_about_story():
    """Public API: Fetch Our Story section."""
    try:
        doc = await db["about_page"].find_one({"section": "story"})
        if not doc or "data" not in doc:
            return {"success": True, "data": AboutStorySection().model_dump()}

        data = clean_doc(doc["data"])
        return {"success": True, "data": AboutStorySection(**data).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch Our Story section: {str(e)}"
        )


@router.put("/story")
@router.put("/story/")
async def update_about_story(
    payload: AboutStorySection,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Our Story section."""
    try:
        data_dict = payload.model_dump()
        now = datetime.now(timezone.utc)
        await db["about_page"].update_one(
            {"section": "story"},
            {"$set": {"section": "story", "data": data_dict, "updated_at": now}},
            upsert=True
        )
        return {"success": True, "data": data_dict, "message": "Our Story updated successfully."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Our Story: {str(e)}"
        )


# ==========================================
# 3. SPECIALIZED DIVISIONS ENDPOINTS
# ==========================================
@router.get("/specialized-divisions")
@router.get("/specialized-divisions/")
async def get_about_specialized_divisions():
    """Public API: Fetch Specialized Divisions section with guaranteed schema fallbacks."""
    try:
        doc = await db["about_page"].find_one({"section": "specialized_divisions"})
        
        # Start with default schema payload
        default_payload = SpecializedDivisionsSection().model_dump()

        if not doc or "data" not in doc or not isinstance(doc.get("data"), dict):
            return {"success": True, "data": default_payload}

        saved_data = clean_doc(doc["data"])

        # Merge saved values over defaults so empty text never breaks the editor
        merged_data = {
            "title": saved_data.get("title") or default_payload["title"],
            "image_url": saved_data.get("image_url") or default_payload["image_url"],
            "divisions": saved_data.get("divisions") if saved_data.get("divisions") else default_payload["divisions"],
            "description_1": saved_data.get("description_1") or default_payload["description_1"],
            "description_2": saved_data.get("description_2") or default_payload["description_2"],
            "cta_text": saved_data.get("cta_text") or default_payload["cta_text"],
            "cta_url": saved_data.get("cta_url") or default_payload["cta_url"],
        }

        return {"success": True, "data": merged_data}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch Specialized Divisions: {str(e)}"
        )


@router.put("/specialized-divisions")
@router.put("/specialized-divisions/")
async def update_about_specialized_divisions(
    payload: SpecializedDivisionsSection,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Specialized Divisions section."""
    try:
        data_dict = payload.model_dump()
        now = datetime.now(timezone.utc)
        await db["about_page"].update_one(
            {"section": "specialized_divisions"},
            {"$set": {"section": "specialized_divisions", "data": data_dict, "updated_at": now}},
            upsert=True
        )
        return {"success": True, "data": data_dict, "message": "Specialized Divisions updated successfully."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Specialized Divisions: {str(e)}"
        )


# ==========================================
# 4. LEGACY / BACKWARD-COMPATIBLE FALLBACK
# ==========================================

@router.patch("/section/{section_name}")
@router.put("/section/{section_name}")
async def update_about_section_legacy(
    section_name: str,
    payload: Any = Body(...),
    current_admin: dict = Depends(get_current_admin_user)
):
    """
    Backward-compatible API route: Catches requests sent to /api/about/section/{section_name}
    and routes them directly into the section-based MongoDB documents.
    """
    valid_map = {
        "header": "header",
        "story": "story",
        "specialized_divisions": "specialized_divisions",
        "specialized-divisions": "specialized_divisions"
    }

    if section_name not in valid_map:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid section name '{section_name}'. Allowed: {list(valid_map.keys())}"
        )

    db_key = valid_map[section_name]

    try:
        if db_key == "header" and isinstance(payload, dict):
            img = payload.get("bg_image_url") or payload.get("image_url") or ""
            payload["bg_image_url"] = img
            payload["image_url"] = img

        now = datetime.now(timezone.utc)
        await db["about_page"].update_one(
            {"section": db_key},
            {"$set": {"section": db_key, "data": payload, "updated_at": now}},
            upsert=True
        )

        return {
            "success": True,
            "data": payload,
            "message": f"Section '{section_name}' updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update section '{section_name}': {str(e)}"
        )


# ==========================================
# 5. FULL ABOUT PAGE COMBINED ENDPOINT
# ==========================================

@router.get("", response_model=AboutPageResponse)
@router.get("/", response_model=AboutPageResponse)
async def get_about_page_content():
    """Fetch complete About Page dataset combining all 3 section documents."""
    try:
        cursor = db["about_page"].find({"section": {"$in": ["header", "story", "specialized_divisions"]}})
        docs = await cursor.to_list(length=10)

        combined_data = {
            "header": PageHeaderSection().model_dump(),
            "story": AboutStorySection().model_dump(),
            "specialized_divisions": SpecializedDivisionsSection().model_dump(),
        }

        for doc in docs:
            sec_name = doc.get("section")
            sec_data = doc.get("data")
            if sec_name in combined_data and sec_data is not None:
                combined_data[sec_name] = clean_doc(sec_data)

        return {"success": True, "data": AboutPageData(**combined_data)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch full About page: {str(e)}"
        )