from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.after_sales import (
    AfterSalesHeaderSection,
    AfterSalesHeaderResponse,
    AfterSalesOverviewSection,
    AfterSalesOverviewResponse,
    AfterSalesServiceScopeSection,
    AfterSalesServiceScopeResponse,
    AfterSalesWhyUsSection,
    AfterSalesWhyUsResponse,
)
from app.utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/after-sales", tags=["After-Sales & Warranty API"])


def clean_doc(doc: dict) -> dict:
    """Utility to strip MongoDB _id from returned dictionaries."""
    if isinstance(doc, dict):
        doc.pop("_id", None)
    return doc


@router.get("/header", response_model=AfterSalesHeaderResponse)
@router.get("/header/", response_model=AfterSalesHeaderResponse)
async def get_after_sales_header():
    """Public API: Fetch After-Sales & Warranty Header Banner."""
    try:
        doc = await db["after_sales_page"].find_one({"section": "header"})
        default_schema = AfterSalesHeaderSection().model_dump()

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

        return {"success": True, "data": AfterSalesHeaderSection(**merged_payload).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch After-Sales header: {str(e)}"
        )


@router.put("/header", response_model=AfterSalesHeaderResponse)
@router.put("/header/", response_model=AfterSalesHeaderResponse)
async def update_after_sales_header(
    payload: AfterSalesHeaderSection,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update After-Sales & Warranty Header Banner."""
    try:
        data_dict = payload.model_dump()
        img = data_dict.get("bg_image_url") or data_dict.get("image_url") or ""
        data_dict["bg_image_url"] = img
        data_dict["image_url"] = img
        now = datetime.now(timezone.utc)

        await db["after_sales_page"].update_one(
            {"section": "header"},
            {"$set": {"section": "header", "data": data_dict, "updated_at": now}},
            upsert=True
        )

        return {
            "success": True,
            "data": data_dict,
            "message": "After-Sales header updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update After-Sales header: {str(e)}"
        )


# ==========================================
# OVERVIEW SECTION ENDPOINTS (MULTI-IMAGE)
# ==========================================

@router.get("/overview", response_model=AfterSalesOverviewResponse)
@router.get("/overview/", response_model=AfterSalesOverviewResponse)
async def get_after_sales_overview():
    """Public API: Fetch After-Sales Overview Section with multi-image gallery."""
    try:
        doc = await db["after_sales_page"].find_one({"section": "overview"})
        default_payload = AfterSalesOverviewSection().model_dump()

        if not doc or "data" not in doc or not isinstance(doc.get("data"), dict):
            return {"success": True, "data": default_payload}

        saved_data = clean_doc(doc["data"])
        
        has_images_property = isinstance(saved_data.get("images"), list)
        gallery_images = saved_data.get("images") if has_images_property else []

        if not has_images_property and (saved_data.get("image_url") or saved_data.get("bg_image_url")):
            gallery_images = [saved_data.get("image_url") or saved_data.get("bg_image_url")]

        merged_payload = {
            "paragraph_1": saved_data.get("paragraph_1") if saved_data.get("paragraph_1") is not None else default_payload["paragraph_1"],
            "paragraph_2": saved_data.get("paragraph_2") if saved_data.get("paragraph_2") is not None else default_payload["paragraph_2"],
            "images": gallery_images,
            "image_url": gallery_images[0] if len(gallery_images) > 0 else "",
        }

        return {"success": True, "data": AfterSalesOverviewSection(**merged_payload).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch After-Sales overview: {str(e)}"
        )


@router.put("/overview", response_model=AfterSalesOverviewResponse)
@router.put("/overview/", response_model=AfterSalesOverviewResponse)
async def update_after_sales_overview(
    payload: AfterSalesOverviewSection,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update After-Sales Overview Section."""
    try:
        data_dict = payload.model_dump()
        
        if data_dict.get("images") and len(data_dict["images"]) > 0:
            data_dict["image_url"] = data_dict["images"][0]
            data_dict["bg_image_url"] = data_dict["images"][0]

        now = datetime.now(timezone.utc)

        await db["after_sales_page"].update_one(
            {"section": "overview"},
            {"$set": {"section": "overview", "data": data_dict, "updated_at": now}},
            upsert=True
        )

        return {
            "success": True,
            "data": data_dict,
            "message": "After-Sales overview section updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update After-Sales overview: {str(e)}"
        )


# ==========================================
# SERVICE SCOPE & ENGINEERS ENDPOINTS
# ==========================================

@router.get("/service-scope", response_model=AfterSalesServiceScopeResponse)
@router.get("/service-scope/", response_model=AfterSalesServiceScopeResponse)
async def get_after_sales_service_scope():
    """Public API: Fetch After-Sales Service Scope & Certified Engineers Section."""
    try:
        doc = await db["after_sales_page"].find_one({"section": "service_scope"})
        default_payload = AfterSalesServiceScopeSection().model_dump()

        if not doc or "data" not in doc or not isinstance(doc.get("data"), dict):
            return {"success": True, "data": default_payload}

        saved_data = clean_doc(doc["data"])
        
        has_items_property = isinstance(saved_data.get("items"), list)
        items_list = saved_data.get("items") if has_items_property else default_payload["items"]

        merged_payload = {
            "title": saved_data.get("title") or default_payload["title"],
            "items": items_list,
            "engineers_title": saved_data.get("engineers_title") or default_payload["engineers_title"],
            "engineers_content": saved_data.get("engineers_content") if saved_data.get("engineers_content") is not None else default_payload["engineers_content"],
        }

        return {"success": True, "data": AfterSalesServiceScopeSection(**merged_payload).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch After-Sales service scope section: {str(e)}"
        )


@router.put("/service-scope", response_model=AfterSalesServiceScopeResponse)
@router.put("/service-scope/", response_model=AfterSalesServiceScopeResponse)
async def update_after_sales_service_scope(
    payload: AfterSalesServiceScopeSection,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update After-Sales Service Scope & Certified Engineers Section."""
    try:
        data_dict = payload.model_dump()
        now = datetime.now(timezone.utc)

        await db["after_sales_page"].update_one(
            {"section": "service_scope"},
            {"$set": {"section": "service_scope", "data": data_dict, "updated_at": now}},
            upsert=True
        )

        return {
            "success": True,
            "data": data_dict,
            "message": "After-Sales service scope section updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update After-Sales service scope section: {str(e)}"
        )


# ==========================================
# INDUSTRIES SERVED & WHY CHOOSE US ENDPOINTS
# ==========================================

@router.get("/why-us", response_model=AfterSalesWhyUsResponse)
@router.get("/why-us/", response_model=AfterSalesWhyUsResponse)
async def get_after_sales_why_us():
    """Public API: Fetch After-Sales Industries Served & Why Choose Us Section."""
    try:
        doc = await db["after_sales_page"].find_one({"section": "why_us"})
        default_payload = AfterSalesWhyUsSection().model_dump()

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

        return {"success": True, "data": AfterSalesWhyUsSection(**merged_payload).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch After-Sales why us section: {str(e)}"
        )


@router.put("/why-us", response_model=AfterSalesWhyUsResponse)
@router.put("/why-us/", response_model=AfterSalesWhyUsResponse)
async def update_after_sales_why_us(
    payload: AfterSalesWhyUsSection,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update After-Sales Industries Served & Why Choose Us Section."""
    try:
        data_dict = payload.model_dump()
        now = datetime.now(timezone.utc)

        await db["after_sales_page"].update_one(
            {"section": "why_us"},
            {"$set": {"section": "why_us", "data": data_dict, "updated_at": now}},
            upsert=True
        )

        return {
            "success": True,
            "data": data_dict,
            "message": "After-Sales why us section updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update After-Sales why us section: {str(e)}"
        )