from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.capabilities import (
    CapabilitiesHeaderSection,
    CapabilitiesHeaderResponse,
    CapabilitiesOverviewSection,
    CapabilitiesOverviewResponse,
    ExecutionScopeSection,
    ExecutionScopeResponse,
    WhyEssSection,
    WhyEssResponse,
)
from app.utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/capabilities", tags=["Capabilities API"])


def clean_doc(doc: dict) -> dict:
    """Utility to strip MongoDB _id from returned dictionaries."""
    if isinstance(doc, dict):
        doc.pop("_id", None)
    return doc


@router.get("/header", response_model=CapabilitiesHeaderResponse)
@router.get("/header/", response_model=CapabilitiesHeaderResponse)
async def get_capabilities_header():
    """Public API: Fetch Capabilities Header Banner."""
    try:
        doc = await db["capabilities_page"].find_one({"section": "header"})
        default_schema = CapabilitiesHeaderSection().model_dump()

        if not doc or "data" not in doc or not isinstance(doc.get("data"), dict):
            return {"success": True, "data": default_schema}

        data = clean_doc(doc["data"])
        img = data.get("bg_image_url") or data.get("image_url") or ""

        merged_payload = {
            "title": data.get("title") or default_schema["title"],
            "subtitle": data.get("subtitle") or default_schema["subtitle"],
            "bg_image_url": img,
            "image_url": img,
        }

        return {"success": True, "data": CapabilitiesHeaderSection(**merged_payload).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch Capabilities header: {str(e)}"
        )


@router.put("/header", response_model=CapabilitiesHeaderResponse)
@router.put("/header/", response_model=CapabilitiesHeaderResponse)
async def update_capabilities_header(
    payload: CapabilitiesHeaderSection,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Capabilities Header Banner."""
    try:
        data_dict = payload.model_dump()
        img = data_dict.get("bg_image_url") or data_dict.get("image_url") or ""
        data_dict["bg_image_url"] = img
        data_dict["image_url"] = img
        now = datetime.now(timezone.utc)

        await db["capabilities_page"].update_one(
            {"section": "header"},
            {"$set": {"section": "header", "data": data_dict, "updated_at": now}},
            upsert=True
        )

        return {
            "success": True,
            "data": data_dict,
            "message": "Capabilities header updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Capabilities header: {str(e)}"
        )

# ==========================================
# OVERVIEW SECTION ENDPOINTS
# ==========================================

@router.get("/overview", response_model=CapabilitiesOverviewResponse)
@router.get("/overview/", response_model=CapabilitiesOverviewResponse)
async def get_capabilities_overview():
    """Public API: Fetch Capabilities Overview Section."""
    try:
        doc = await db["capabilities_page"].find_one({"section": "overview"})
        default_payload = CapabilitiesOverviewSection().model_dump()

        if not doc or "data" not in doc or not isinstance(doc.get("data"), dict):
            return {"success": True, "data": default_payload}

        saved_data = clean_doc(doc["data"])
        
        # Handle single vs list image structures gracefully
        images_list = saved_data.get("images") if isinstance(saved_data.get("images"), list) and len(saved_data.get("images")) > 0 else []
        if not images_list and (saved_data.get("image_url") or saved_data.get("bg_image_url")):
            images_list = [saved_data.get("image_url") or saved_data.get("bg_image_url")]
        
        if not images_list:
            images_list = default_payload["images"]

        merged_payload = {
            "paragraph_1": saved_data.get("paragraph_1") if saved_data.get("paragraph_1") is not None else default_payload["paragraph_1"],
            "paragraph_2": saved_data.get("paragraph_2") if saved_data.get("paragraph_2") is not None else default_payload["paragraph_2"],
            "images": images_list,
            "image_url": images_list[0] if len(images_list) > 0 else "",
        }

        return {"success": True, "data": CapabilitiesOverviewSection(**merged_payload).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch Capabilities overview: {str(e)}"
        )


@router.put("/overview", response_model=CapabilitiesOverviewResponse)
@router.put("/overview/", response_model=CapabilitiesOverviewResponse)
async def update_capabilities_overview(
    payload: CapabilitiesOverviewSection,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Capabilities Overview Section."""
    try:
        data_dict = payload.model_dump()
        
        # Ensure image_url stays in sync with images list
        if data_dict.get("images") and len(data_dict["images"]) > 0:
            data_dict["image_url"] = data_dict["images"][0]
            
        now = datetime.now(timezone.utc)

        await db["capabilities_page"].update_one(
            {"section": "overview"},
            {"$set": {"section": "overview", "data": data_dict, "updated_at": now}},
            upsert=True
        )

        return {
            "success": True,
            "data": data_dict,
            "message": "Capabilities overview section updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Capabilities overview: {str(e)}"
        )


# ==========================================
# EXECUTION SCOPE & STANDARDS ENDPOINTS
# ==========================================

@router.get("/execution-scope", response_model=ExecutionScopeResponse)
@router.get("/execution-scope/", response_model=ExecutionScopeResponse)
async def get_execution_scope():
    """Public API: Fetch Capabilities Execution Scope & Standards Section."""
    try:
        doc = await db["capabilities_page"].find_one({"section": "execution_scope"})
        default_payload = ExecutionScopeSection().model_dump()

        if not doc or "data" not in doc or not isinstance(doc.get("data"), dict):
            return {"success": True, "data": default_payload}

        saved_data = clean_doc(doc["data"])
        
        has_items_property = isinstance(saved_data.get("items"), list)
        items_list = saved_data.get("items") if has_items_property else default_payload["items"]

        merged_payload = {
            "title": saved_data.get("title") or default_payload["title"],
            "items": items_list,
            "standards_title": saved_data.get("standards_title") or default_payload["standards_title"],
            "standards_content": saved_data.get("standards_content") if saved_data.get("standards_content") is not None else default_payload["standards_content"],
        }

        return {"success": True, "data": ExecutionScopeSection(**merged_payload).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch execution scope section: {str(e)}"
        )


@router.put("/execution-scope", response_model=ExecutionScopeResponse)
@router.put("/execution-scope/", response_model=ExecutionScopeResponse)
async def update_execution_scope(
    payload: ExecutionScopeSection,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Capabilities Execution Scope & Standards Section."""
    try:
        data_dict = payload.model_dump()
        now = datetime.now(timezone.utc)

        await db["capabilities_page"].update_one(
            {"section": "execution_scope"},
            {"$set": {"section": "execution_scope", "data": data_dict, "updated_at": now}},
            upsert=True
        )

        return {
            "success": True,
            "data": data_dict,
            "message": "Execution scope section updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update execution scope section: {str(e)}"
        )


# ==========================================
# INDUSTRIES SERVED & WHY ESS ENDPOINTS
# ==========================================

@router.get("/why-ess", response_model=WhyEssResponse)
@router.get("/why-ess/", response_model=WhyEssResponse)
async def get_why_ess():
    """Public API: Fetch Industries Served & Why ESS Saudi Section."""
    try:
        doc = await db["capabilities_page"].find_one({"section": "why_ess"})
        default_payload = WhyEssSection().model_dump()

        if not doc or "data" not in doc or not isinstance(doc.get("data"), dict):
            return {"success": True, "data": default_payload}

        saved_data = clean_doc(doc["data"])
        
        has_industries = isinstance(saved_data.get("industries"), list)
        industries_list = saved_data.get("industries") if has_industries else default_payload["industries"]

        merged_payload = {
            "industries_title": saved_data.get("industries_title") or default_payload["industries_title"],
            "industries": industries_list,
            "why_title": saved_data.get("why_title") or default_payload["why_title"],
            "why_description": saved_data.get("why_description") if saved_data.get("why_description") is not None else default_payload["why_description"],
        }

        return {"success": True, "data": WhyEssSection(**merged_payload).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch Why ESS section: {str(e)}"
        )


@router.put("/why-ess", response_model=WhyEssResponse)
@router.put("/why-ess/", response_model=WhyEssResponse)
async def update_why_ess(
    payload: WhyEssSection,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Industries Served & Why ESS Saudi Section."""
    try:
        data_dict = payload.model_dump()
        now = datetime.now(timezone.utc)

        await db["capabilities_page"].update_one(
            {"section": "why_ess"},
            {"$set": {"section": "why_ess", "data": data_dict, "updated_at": now}},
            upsert=True
        )

        return {
            "success": True,
            "data": data_dict,
            "message": "Why ESS section updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Why ESS section: {str(e)}"
        )