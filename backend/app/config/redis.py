import os
import redis.asyncio as redis
from dotenv import load_dotenv

# Load environment variables directly from backend/.env
load_dotenv()

# Read Redis URL directly from environment variables
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

redis_client = None


async def connect_redis():
    global redis_client
    try:
        redis_client = redis.from_url(
            REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
            protocol=2  # Force RESP2 protocol to avoid HELLO command error on older Redis versions
        )
        await redis_client.ping()
        print("Redis connected successfully")
    except Exception as e:
        print(f"⚠️ Redis connection warning: {e}")
        redis_client = None


async def close_redis():
    global redis_client
    if redis_client:
        await redis_client.close()
        print("Redis connection closed")