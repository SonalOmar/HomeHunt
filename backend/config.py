# config.py
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Base configuration class"""
    
    # MongoDB Configuration
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/homehunt")
    
    # JWT Configuration
    SECRET_KEY = os.getenv("SECRET_KEY", "your_fallback_secret_key_here")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Application Configuration
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    PROJECT_NAME = "HomeHunt Property App"
    PROJECT_VERSION = "1.0.0"
    
    # CORS Configuration
    ALLOWED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    
    # File Upload Configuration
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
    UPLOAD_DIR = "uploads/properties"

def get_config():
    return Config()