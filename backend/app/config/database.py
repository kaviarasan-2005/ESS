import os
import certifi
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# Load environment variables directly from backend/.env
load_dotenv()

# Read database credentials directly from .env
MONGODB_URL = os.getenv(
    "MONGODB_URI",
    os.getenv("MONGODB_URL", "mongodb://localhost:27017")
)
DB_NAME = os.getenv("DATABASE_NAME", "ESS")

is_atlas = "mongodb+srv" in MONGODB_URL

client = AsyncIOMotorClient(
    MONGODB_URL,
    tls=is_atlas,
    tlsCAFile=certifi.where() if is_atlas else None
)

db = client[DB_NAME]
database = db


async def connect_database():
    try:
        await client.admin.command("ping")
        print(f"MongoDB Atlas connected successfully to database: '{DB_NAME}'")
    except Exception as e:
        print(f"MongoDB connection error: {e}")


async def close_database():
    client.close()
    print("MongoDB connection closed")