import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient

# Updated URI with password 'EssProject2026'
MONGO_URI = "mongodb+srv://itsupportqtr:EssProject2026@cluster0.rpfueke.mongodb.net/ESS?retryWrites=true&w=majority&appName=Cluster0"

async def test_write():
    print("Connecting to MongoDB Atlas via Motor Async...")
    client = AsyncIOMotorClient(
        MONGO_URI,
        tls=True,
        tlsCAFile=certifi.where()
    )
    
    # Target the ESS database
    db = client["ESS"]
    
    # Insert a document to force Atlas to create the database and collection
    result = await db["test_collection"].insert_one({
        "status": "connected",
        "message": "ESS database created successfully!"
    })
    
    print(f"✅ Success! Document inserted with ID: {result.inserted_id}")
    client.close()

if __name__ == "__main__":
    asyncio.run(test_write())