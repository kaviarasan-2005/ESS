from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from app.config.database import db
from app.schemas.projects_services import (
    ProjectsServicesHeaderSection,
    ProjectsServicesHeaderResponse,
    ProjectsServicesOverviewSection,
    ProjectsServicesOverviewResponse,
    ProjectsServicesGridSection,
    ProjectsServicesGridResponse,
)
from app.utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/projects-services", tags=["Projects & Services API"])


def clean_doc(doc: dict) -> dict:
    """Utility to strip MongoDB _id from returned dictionaries."""
    if isinstance(doc, dict):
        doc.pop("_id", None)
    return doc


@router.get("/header", response_model=ProjectsServicesHeaderResponse)
@router.get("/header/", response_model=ProjectsServicesHeaderResponse)
async def get_projects_services_header():
    """Public API: Fetch Projects & Services Header Banner."""
    try:
        doc = await db["projects_services_page"].find_one({"section": "header"})
        default_schema = ProjectsServicesHeaderSection().model_dump()

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

        return {"success": True, "data": ProjectsServicesHeaderSection(**merged_payload).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch Projects & Services header: {str(e)}"
        )


@router.put("/header", response_model=ProjectsServicesHeaderResponse)
@router.put("/header/", response_model=ProjectsServicesHeaderResponse)
async def update_projects_services_header(
    payload: ProjectsServicesHeaderSection,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Projects & Services Header Banner."""
    try:
        data_dict = payload.model_dump()
        img = data_dict.get("bg_image_url") or data_dict.get("image_url") or ""
        data_dict["bg_image_url"] = img
        data_dict["image_url"] = img
        now = datetime.now(timezone.utc)

        await db["projects_services_page"].update_one(
            {"section": "header"},
            {"$set": {"section": "header", "data": data_dict, "updated_at": now}},
            upsert=True
        )

        return {
            "success": True,
            "data": data_dict,
            "message": "Projects & Services header updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Projects & Services header: {str(e)}"
        )


# ==========================================
# OVERVIEW SECTION ENDPOINTS
# ==========================================

@router.get("/overview", response_model=ProjectsServicesOverviewResponse)
@router.get("/overview/", response_model=ProjectsServicesOverviewResponse)
async def get_projects_services_overview():
    """Public API: Fetch Projects & Services Overview Section."""
    try:
        doc = await db["projects_services_page"].find_one({"section": "overview"})
        default_payload = ProjectsServicesOverviewSection().model_dump()

        if not doc or "data" not in doc or not isinstance(doc.get("data"), dict):
            return {"success": True, "data": default_payload}

        saved_data = clean_doc(doc["data"])
        img = saved_data.get("image_url") or saved_data.get("bg_image_url") or ""

        merged_payload = {
            "paragraph_1": saved_data.get("paragraph_1") if saved_data.get("paragraph_1") is not None else default_payload["paragraph_1"],
            "paragraph_2": saved_data.get("paragraph_2") if saved_data.get("paragraph_2") is not None else default_payload["paragraph_2"],
            "image_url": img,
            "bg_image_url": img,
            "cta_button_text": saved_data.get("cta_button_text") or default_payload["cta_button_text"],
            "cta_button_url": saved_data.get("cta_button_url") or default_payload["cta_button_url"],
        }

        return {"success": True, "data": ProjectsServicesOverviewSection(**merged_payload).model_dump()}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch Projects & Services overview: {str(e)}"
        )


@router.put("/overview", response_model=ProjectsServicesOverviewResponse)
@router.put("/overview/", response_model=ProjectsServicesOverviewResponse)
async def update_projects_services_overview(
    payload: ProjectsServicesOverviewSection,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Projects & Services Overview Section."""
    try:
        data_dict = payload.model_dump()
        img = data_dict.get("image_url") or data_dict.get("bg_image_url") or ""
        data_dict["image_url"] = img
        data_dict["bg_image_url"] = img
        now = datetime.now(timezone.utc)

        await db["projects_services_page"].update_one(
            {"section": "overview"},
            {"$set": {"section": "overview", "data": data_dict, "updated_at": now}},
            upsert=True
        )

        return {
            "success": True,
            "data": data_dict,
            "message": "Projects & Services overview section updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Projects & Services overview: {str(e)}"
        )


# ==========================================
# GRID CARDS SECTION ENDPOINTS
# ==========================================

@router.get("/grid", response_model=ProjectsServicesGridResponse)
@router.get("/grid/", response_model=ProjectsServicesGridResponse)
async def get_projects_services_grid():
    """Public API: Fetch Projects & Services Feature Grid Cards."""
    try:
        doc = await db["projects_services_page"].find_one({"section": "grid"})
        default_payload = ProjectsServicesGridSection().model_dump()

        if not doc or "data" not in doc or not isinstance(doc.get("data"), dict):
            return {"success": True, "data": default_payload}

        saved_data = clean_doc(doc["data"])
        cards = (
            saved_data.get("cards")
            if isinstance(saved_data.get("cards"), list) and len(saved_data.get("cards")) > 0
            else default_payload["cards"]
        )

        return {"success": True, "data": {"cards": cards}}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch Projects & Services grid: {str(e)}"
        )


@router.put("/grid", response_model=ProjectsServicesGridResponse)
@router.put("/grid/", response_model=ProjectsServicesGridResponse)
async def update_projects_services_grid(
    payload: ProjectsServicesGridSection,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Update Projects & Services Feature Grid Cards."""
    try:
        data_dict = payload.model_dump()
        now = datetime.now(timezone.utc)

        await db["projects_services_page"].update_one(
            {"section": "grid"},
            {"$set": {"section": "grid", "data": data_dict, "updated_at": now}},
            upsert=True
        )

        return {
            "success": True,
            "data": data_dict,
            "message": "Projects & Services feature grid updated successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update Projects & Services grid: {str(e)}"
        )