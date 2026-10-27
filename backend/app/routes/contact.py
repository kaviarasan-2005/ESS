import copy
from typing import Any
from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends, Body, status
from app.config.database import db
from app.schemas.contact import (
    ContactPageData, 
    ContactPageResponse, 
    ContactHeader, 
    ContactSubmissionCreate
)
from app.utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/contact", tags=["Contact API"])

# Default fallback dataset matching image layout, maps, and form input controls
DEFAULT_CONTACT_DATA = {
    "header": {
        "title": "Contact Us",
        "subtitle": "Get in touch with our expert technical support and sales team.",
        "bg_image": "",
        "bg_image_url": "",
        "image_url": "",
        "bg_url": ""
    },
    "content": {
        "tagline": "REACH US",
        "title": "Get in Touch.",
        "description": "We are never out of reach and always at your service. We can't wait to growth along with you.",
        "locations": [
            {
                "id": "loc-1",
                "title": "Main Office",
                "address": "P.O. Box: 319, Buzwair Commercial Building, Al Mansoura Zone: 25, Street: 330, Building: 57, Doha, Qatar."
            },
            {
                "id": "loc-2",
                "title": "Warehouse",
                "address": "P.O. Box: 319, Street 46, Industrial Area, Doha, Qatar."
            },
            {
                "id": "loc-3",
                "title": "Engineering Facility",
                "address": "P.O. Box: 319, Street 14, Industrial Area Doha, Qatar."
            }
        ],
        "email": "sales@essme.com",
        "phone": "+974 4405 9666",
        "product_options": [
            "Fire & Gas Systems",
            "Analytical Instrumentation",
            "Analyzer System Integration",
            "Industrial Automation",
            "Process Equipments"
        ],
        "form_labels": {
            "name_label": "Name",
            "name_placeholder": "Your name",
            "location_label": "Location",
            "location_placeholder": "Your location",
            "email_label": "Email",
            "email_placeholder": "you@example.com",
            "contact_number_label": "Contact Number",
            "contact_number_placeholder": "+974 ...",
            "products_label": "Choose Products",
            "message_label": "Message",
            "message_placeholder": "Tell us about your requirements...",
            "submit_btn_text": "SUBMIT",
            # Dynamic right panel headings
            "email_heading": "Email Us",
            "phone_heading": "Call to Us",
            "social_heading": "FOLLOW OUR SOCIAL MEDIA"
        },
        "social_links": [
            {
                "id": "soc-1",
                "platform": "linkedin",
                "url": "https://linkedin.com"
            }
        ]
    },
    "maps_section": {
        "section_title": "Our Locations",
        "main_map_embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.286812852787!2d51.5284!3d25.2693",
        "main_map_link": "https://maps.google.com",
        "facility_maps": [
            {
                "id": "map-1",
                "title": "Engineering Facility",
                "address": "P.O. Box: 319, Street 14, Industrial Area Doha, Qatar",
                "map_embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.6!2d51.44!3d25.18",
                "map_link": "https://maps.google.com"
            },
            {
                "id": "map-2",
                "title": "Warehouse",
                "address": "P.O. Box: 319, Street 46, Industrial Area, Doha, Qatar",
                "map_embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.8!2d51.43!3d25.17",
                "map_link": "https://maps.google.com"
            }
        ]
    },
    "offices": [],
    "general_email": "sales@essme.com",
    "general_phone": "+974 4405 9666"
}


# ==========================================
# HELPER FUNCTIONS
# ==========================================

def normalize_header_images(header_dict: dict) -> dict:
    """Ensure all possible image alias keys contain the saved background URL."""
    if not isinstance(header_dict, dict):
        return DEFAULT_CONTACT_DATA["header"]

    img = (
        header_dict.get("bg_image")
        or header_dict.get("bg_image_url")
        or header_dict.get("image_url")
        or header_dict.get("bg_url")
        or ""
    )

    header_dict["bg_image"] = img
    header_dict["bg_image_url"] = img
    header_dict["image_url"] = img
    header_dict["bg_url"] = img

    return header_dict


# ==========================================
# PUBLIC API ENDPOINTS
# ==========================================

@router.get("", response_model=ContactPageResponse)
@router.get("/", response_model=ContactPageResponse)
async def get_contact_page_content():
    """Public API: Fetch complete Contact page CMS content."""
    try:
        doc = await db["contact_page"].find_one({"_id": "contact_page_content"})

        if not doc:
            return {"success": True, "data": DEFAULT_CONTACT_DATA}

        doc.pop("_id", None)

        # 1. Normalize Header Image across all keys
        if "header" in doc and isinstance(doc["header"], dict):
            doc["header"] = normalize_header_images(doc["header"])
        else:
            doc["header"] = DEFAULT_CONTACT_DATA["header"]

        # 2. Ensure content section exists and includes form_labels fallback
        if "content" not in doc or not isinstance(doc["content"], dict):
            doc["content"] = DEFAULT_CONTACT_DATA["content"]
        else:
            if "form_labels" not in doc["content"] or not isinstance(doc["content"]["form_labels"], dict):
                doc["content"]["form_labels"] = DEFAULT_CONTACT_DATA["content"]["form_labels"]
            else:
                for k, v in DEFAULT_CONTACT_DATA["content"]["form_labels"].items():
                    doc["content"]["form_labels"].setdefault(k, v)

        # 3. Ensure maps_section exists
        if "maps_section" not in doc or not isinstance(doc["maps_section"], dict):
            doc["maps_section"] = DEFAULT_CONTACT_DATA["maps_section"]

        if "offices" not in doc or not isinstance(doc["offices"], list):
            doc["offices"] = []

        return {"success": True, "data": doc}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch contact page content: {str(e)}"
        )


@router.post("/submit", status_code=status.HTTP_201_CREATED)
async def submit_contact_form(payload: ContactSubmissionCreate):
    """Public API: Submit contact form message from visitors."""
    try:
        submission = payload.model_dump()
        submission["created_at"] = datetime.now(timezone.utc)
        submission["is_read"] = False

        result = await db["contact_submissions"].insert_one(submission)

        return {
            "success": True,
            "message": "Thank you! Your message has been sent successfully.",
            "submission_id": str(result.inserted_id)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process your message: {str(e)}"
        )


# ==========================================
# ADMIN API ENDPOINTS (CMS & SUBMISSIONS)
# ==========================================

@router.put("", status_code=status.HTTP_200_OK)
@router.put("/", status_code=status.HTTP_200_OK)
async def update_full_contact_page(
    payload: ContactPageData,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Save/Replace full Contact page content."""
    data_to_store = payload.model_dump()

    # Sync header background image aliases
    header = data_to_store.get("header", {})
    data_to_store["header"] = normalize_header_images(header)
    data_to_store["_id"] = "contact_page_content"

    await db["contact_page"].replace_one(
        {"_id": "contact_page_content"},
        data_to_store,
        upsert=True
    )
    return {"success": True, "message": "Contact page updated successfully."}


@router.patch("/section/{section_name}", status_code=status.HTTP_200_OK)
async def update_contact_section(
    section_name: str,
    payload: Any = Body(...),
    current_admin: dict = Depends(get_current_admin_user)
):
    """
    Admin API: Dynamically update specific sections 
    ('header', 'content', 'maps_section', 'offices', 'general_email', 'general_phone').
    """
    allowed_sections = ["header", "content", "maps_section", "offices", "general_email", "general_phone"]

    if section_name not in allowed_sections:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid section name '{section_name}'. Allowed: {allowed_sections}"
        )

    try:
        if section_name == "header" and isinstance(payload, dict):
            payload = normalize_header_images(payload)

        doc = await db["contact_page"].find_one({"_id": "contact_page_content"})
        if not doc:
            init_data = copy.deepcopy(DEFAULT_CONTACT_DATA)
            init_data["_id"] = "contact_page_content"
            await db["contact_page"].insert_one(init_data)

        await db["contact_page"].update_one(
            {"_id": "contact_page_content"},
            {"$set": {section_name: payload}},
            upsert=True
        )

        return {
            "success": True,
            "message": f"Contact section '{section_name}' updated successfully.",
            "data": payload
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update section '{section_name}': {str(e)}"
        )


@router.get("/submissions", status_code=status.HTTP_200_OK)
async def get_contact_submissions(
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Retrieve all contact form enquiry messages."""
    try:
        cursor = db["contact_submissions"].find().sort("created_at", -1)
        submissions = []
        async for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            submissions.append(doc)

        return {"success": True, "data": submissions}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch submissions: {str(e)}"
        )


@router.delete("/submissions/{submission_id}", status_code=status.HTTP_200_OK)
async def delete_contact_submission(
    submission_id: str,
    current_admin: dict = Depends(get_current_admin_user)
):
    """Admin API: Delete a user enquiry message by ID."""
    try:
        try:
            obj_id = ObjectId(submission_id)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid submission ID format.")

        res = await db["contact_submissions"].delete_one({"_id": obj_id})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Submission not found.")

        return {"success": True, "message": "Submission deleted successfully."}
    except HTTPException as http_ex:
        raise http_ex
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete submission: {str(e)}"
        )