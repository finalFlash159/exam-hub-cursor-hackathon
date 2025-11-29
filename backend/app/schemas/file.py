"""File schemas"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FileResponse(BaseModel):
    """Schema for file response"""
    id: int
    filename: str
    original_filename: str
    file_path: str
    file_type: str
    file_size: int
    mime_type: Optional[str]
    folder_id: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True


class FileUploadResponse(BaseModel):
    """Schema for file upload response"""
    message: str
    file: FileResponse

