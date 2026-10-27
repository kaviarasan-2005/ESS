# import asyncio
# import certifi
# from motor.motor_asyncio import AsyncIOMotorClient
# from passlib.context import CryptContext

# # Password hashing configuration (bcrypt)
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# MONGO_URI = "mongodb+srv://username:<yourpassword@cluster0.rpfueke.mongodb.net/ESS?retryWrites=true&w=majority&appName=Cluster0"

# async def create_initial_admin():
#     print("Connecting to MongoDB Atlas...")
#     client = AsyncIOMotorClient(
#         MONGO_URI,
#         tls=True,
#         tlsCAFile=certifi.where()
#     )
    
#     db = client["ESS"]
#     users_collection = db["users"]
    
#     # Check if admin already exists
#     existing_user = await users_collection.find_one({"username": "admin"})
    
#     hashed_password = pwd_context.hash("admin123")
    
#     admin_data = {
#         "username": "admin",
#         "password": hashed_password,
#         "email": "admin@ess.com",
#         "role": "admin"
#     }
    
#     if existing_user:
#         await users_collection.update_one(
#             {"username": "admin"},
#             {"$set": {"password": hashed_password}}
#         )
#         print("✅ Admin password reset successfully to: admin123")
#     else:
#         result = await users_collection.insert_one(admin_data)
#         print(f"✅ Admin user created with ID: {result.inserted_id}")
        
#     client.close()

# if __name__ == "__main__":
#     asyncio.run(create_initial_admin())
