from fastapi import APIRouter

from app.config.redis import redis_client


router = APIRouter(
    prefix="/api/redis",
    tags=["Redis"]
)


@router.get("/test")
async def redis_test():

    await redis_client.set(
        "ess_test",
        "ESS Redis Working",
        ex=300
    )

    value = await redis_client.get("ess_test")

    return {
        "status": "success",
        "message": "Redis is working",
        "value": value
    }