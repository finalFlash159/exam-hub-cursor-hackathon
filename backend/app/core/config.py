"""Application configuration"""
from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv


load_dotenv()

class Settings(BaseSettings):
    """Application settings"""
    
    # App
    APP_NAME: str = "Exam Hub"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./exam_hub.db"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "*",  # Allow all origins for debugging
    ]
    
    # File Upload
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: List[str] = ["pdf", "docx", "doc", "txt", "pptx", "jpg", "jpeg", "png"]
    
    # AI/GenAI
    GENAI_ENABLED: bool = True
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL: str = "gemini-2.5-flash"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

