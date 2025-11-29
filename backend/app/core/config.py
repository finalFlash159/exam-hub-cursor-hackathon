"""Application configuration"""
from pydantic_settings import BaseSettings
from typing import List


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
    ]
    
    # File Upload
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: List[str] = ["pdf", "docx", "doc", "txt", "pptx", "jpg", "jpeg", "png"]
    
    # AI/GenAI
    GEMINI_API_KEY: str = ""
    GENAI_ENABLED: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

