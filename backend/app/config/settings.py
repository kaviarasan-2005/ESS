# from pydantic_settings import BaseSettings


# class Settings(BaseSettings):
#     # MongoDB Configuration
#     MONGODB_URI: str = "localhost"
#     MONGODB_URL: str = "localhost"
#     DATABASE_NAME: str = "ESS"

#     # Redis Configuration
#     REDIS_URL: str = "redis://localhost:6379/0"

#     # Auth & JWT Configuration
#     JWT_SECRET: str = "36612a6dbb30f173723bdeb1deef60dcc4aa9bd178737a2d229a14a7iuygfd"
#     JWT_ALGORITHM: str = "HS245"
#     JWT_EXPIRE_MINUTES: int = 10080  # 7 days — matches .env JWT_EXPIRE_MINUTES
#     # Alias kept for backward-compat with any code that reads ACCESS_TOKEN_EXPIRE_MINUTES
#     @property
#     def ACCESS_TOKEN_EXPIRE_MINUTES(self) -> int:
#         return self.JWT_EXPIRE_MINUTES

#     # Cloudinary Configuration
#     CLOUDINARY_CLOUD_NAME: str = ""
#     CLOUDINARY_API_KEY: str = ""
#     CLOUDINARY_API_SECRET: str = ""

#     class Config:
#         env_file = ".env"
#         extra = "ignore"


# settings = Settings()