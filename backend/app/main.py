import asyncio
from contextlib import asynccontextmanager
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Configuration imports
from app.config.database import connect_database, close_database
from app.config.redis import connect_redis, close_redis

# Active Route imports
from app.routes.auth import router as auth_router
from app.routes.redis_test import router as redis_test_router
from app.routes.home import router as home_router
from app.routes.about import router as about_router
from app.routes.settings import router as settings_router
from app.routes.upload import router as upload_router
from app.routes.product import router as product_router
from app.routes.partner import router as partner_router
from app.routes.contact import router as contact_router
from app.routes.agc_instruments import router as agc_instruments_router
from app.routes.akay_industries import router as akay_industries_router
from app.routes import aveva
from app.routes.bartec import router as bartec_router
from app.routes.eaton_medc import router as eaton_medc_router
from app.routes.eco_physics import router as eco_physics_router
from app.routes.user import router as reg_router
from app.routes.emerson import router as emerson_router
from app.routes.hach import router as hach_router
from app.routes.hitachi import router as hitachi_router
from app.routes.hyosung import router as hyosung_router
from app.routes.michell import router as michell_router
from app.routes.honeywell import router as honeywell_router
from app.routes.honeywell_gas_detection import router as honeywell_gas_detection_router
from app.routes.metal_samples import router as metal_samples_router
from app.routes.michell_instruments import router as michell_instruments_router
from app.routes.panorama import router as panorama_router
from app.routes.footer import router as footer_router
from app.routes.prominent_metering import router as prominent_metering_router
from app.routes.ra_silver import router as ra_silver_router
from app.routes.testo import router as testo_router
from app.routes.tsi import router as tsi_router
from app.routes.vogelsang import router as vogelsang_router
from app.routes.flame_gas import router as flame_gas_router
from app.routes.vesda import router as vesda_router
from app.routes.process_analyzers import router as process_analyzers_router
from app.routes.process_instrumentation import router as process_instrumentation_router
from app.routes.upstream_instrumentation import router as upstream_instrumentation_router
from app.routes.beacons_sounders import router as beacons_sounders_router
from app.routes.analyzer_systems import router as analyzer_systems_router
from app.routes.sampling_systems import router as sampling_systems_router
from app.routes.industrial_automation import router as industrial_automation_router
from app.routes.fire_gas import router as fire_gas_router
from app.routes.mass_notification import router as mass_notification_router
from app.routes.power_backup import router as power_backup_router
from app.routes.emission_monitoring import router as emission_monitoring_router
from app.routes.systems import router as systems_router
from app.routes.projects_services import router as projects_services_router
from app.routes.capabilities import router as capabilities_router
from app.routes.after_sales import router as after_sales_router

DATABASE_CONNECT_TIMEOUT_SECONDS = 10
REDIS_CONNECT_TIMEOUT_SECONDS = 5


@asynccontextmanager
async def lifespan(app: FastAPI):
    # MongoDB Connection (fails fast with an error instead of hanging forever)
    await asyncio.wait_for(
        connect_database(), timeout=DATABASE_CONNECT_TIMEOUT_SECONDS
    )

    # Redis Connection (optional: app still starts if Redis is down)
    try:
        await asyncio.wait_for(
            connect_redis(), timeout=REDIS_CONNECT_TIMEOUT_SECONDS
        )
    except Exception as e:
        print(f"Redis not available, continuing without it: {e}")

    yield

    # Close DB and Redis Connections
    await close_database()
    try:
        await close_redis()
    except Exception:
        pass


# Instantiate FastAPI
app = FastAPI(
    title="ESS API",
    description="Essential Industrial Services Dynamic Backend API",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://www.rightupnext-cafesystem.online",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory if serving static files locally
if os.path.exists("uploads"):
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# REGISTER ROUTERS WITH API PREFIX
app.include_router(auth_router)  # Already has prefix="/api/auth" inside auth.py
app.include_router(redis_test_router)
app.include_router(home_router)
app.include_router(about_router)
app.include_router(settings_router)
app.include_router(upload_router)
app.include_router(product_router)
app.include_router(partner_router)
app.include_router(contact_router)
app.include_router(agc_instruments_router)
app.include_router(akay_industries_router)
app.include_router(aveva.router)
app.include_router(bartec_router)
app.include_router(eaton_medc_router)
app.include_router(eco_physics_router)
app.include_router(reg_router)
app.include_router(emerson_router)
app.include_router(hach_router)
app.include_router(hitachi_router)
app.include_router(hyosung_router)
app.include_router(michell_router)
app.include_router(honeywell_router)
app.include_router(honeywell_gas_detection_router)
app.include_router(metal_samples_router)
app.include_router(michell_instruments_router)
app.include_router(panorama_router)
app.include_router(footer_router)
app.include_router(prominent_metering_router)
app.include_router(ra_silver_router)
app.include_router(testo_router)
app.include_router(tsi_router)
app.include_router(vogelsang_router)
app.include_router(flame_gas_router)
app.include_router(vesda_router)
app.include_router(process_analyzers_router)
app.include_router(process_instrumentation_router)
app.include_router(upstream_instrumentation_router)
app.include_router(beacons_sounders_router)
app.include_router(analyzer_systems_router)
app.include_router(sampling_systems_router)
app.include_router(industrial_automation_router)
app.include_router(fire_gas_router)
app.include_router(mass_notification_router)
app.include_router(power_backup_router)
app.include_router(emission_monitoring_router)
app.include_router(systems_router)
app.include_router(projects_services_router)
app.include_router(capabilities_router)
app.include_router(after_sales_router)


@app.get("/api/health", tags=["Health Check"])
async def health_check():
    return {
        "status": "success",
        "message": "ESS Backend is running smoothly"
    }