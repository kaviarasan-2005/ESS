from fastapi import APIRouter, status, Depends, HTTPException
from app.config.database import db
from app.schemas.footer import FooterData, FooterDataResponse
from app.utils.auth import get_current_admin_user

router = APIRouter(prefix="/api/footer", tags=["Footer API"])

# --- Default footer data (fallback when collection is empty) ---
DEFAULT_FOOTER = {
    "bg_image_url": "",
    "logo_url": "",
    "description": (
        "Integrated engineering solutions, life-safety instrumentation, "
        "and industrial process control."
    ),
    "socials": [
        {"id": "soc-1", "platform": "linkedin",  "url": "https://linkedin.com"},
        {"id": "soc-2", "platform": "instagram", "url": "https://instagram.com"},
    ],
    "quick_links": [
        {"id": "ql-1", "label": "Home",       "url": "/"},
        {"id": "ql-2", "label": "About Us",   "url": "/about"},
        {"id": "ql-3", "label": "Contact Us", "url": "/contact"},
    ],
    "products": [
        {"id": "fp-1", "label": "Fire & Gas Systems",          "url": "/products/fire-gas"},
        {"id": "fp-2", "label": "Analytical Instrumentation",  "url": "/products/analytical"},
        {"id": "fp-3", "label": "Analyzer System Integration", "url": "/products/analyzer-integration"},
        {"id": "fp-4", "label": "Industrial Automation",       "url": "/products/industrial-automation"},
        {"id": "fp-5", "label": "Process Division",            "url": "/products/process-division"},
    ],
    "reach_us": {
        "company_name": "Essential Systems and Services",
        "address": (
            "P.O. Box: 319, Buzwair Commercial Building, Al Mansoura, "
            "Zone: 25, Street: 330, Building: 57, Doha, Qatar."
        ),
        "email": "sales@essme.com",
        "phone": "+974 4405 9666",
    },
    "terms_label":    "Terms & Conditions",
    "terms_url":      "/terms",
    "privacy_label":  "Privacy Policy",
    "privacy_url":    "/privacy",
    "copyright_text": "Copyright (c) 2026 Essential Systems and Services - All rights reserved.",
}

FOOTER_DOC_ID = "footer_content"


# ---------------------------------------------------------------------------
# GET  /api/footer  — Public: fetch footer data
# ---------------------------------------------------------------------------
@router.get("", response_model=FooterDataResponse)
@router.get("/", response_model=FooterDataResponse)
async def get_footer():
    """Fetch footer data from the dedicated footer_page collection."""
    doc = await db["footer_page"].find_one({"_id": FOOTER_DOC_ID})

    if not doc:
        return {"success": True, "data": DEFAULT_FOOTER}

    doc.pop("_id", None)

    # Merge any missing keys with defaults
    for key, val in DEFAULT_FOOTER.items():
        if key not in doc or doc[key] is None:
            doc[key] = val

    return {"success": True, "data": doc}


# ---------------------------------------------------------------------------
# PUT  /api/footer  — Admin: full replace
# ---------------------------------------------------------------------------
@router.put("", status_code=status.HTTP_200_OK)
@router.put("/", status_code=status.HTTP_200_OK)
async def update_footer(
    payload: FooterData,
    current_admin: dict = Depends(get_current_admin_user),
):
    """Replace the entire footer document in MongoDB (admin only)."""
    data = payload.model_dump()
    data["_id"] = FOOTER_DOC_ID

    await db["footer_page"].replace_one(
        {"_id": FOOTER_DOC_ID},
        data,
        upsert=True,
    )
    return {"success": True, "message": "Footer updated successfully."}
