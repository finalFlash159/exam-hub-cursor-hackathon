"""Folder schemas"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class FolderBase(BaseModel):
    """Base folder schema"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    color: str = Field(default="#3B82F6", pattern="^#[0-9A-Fa-f]{6}$")


class FolderCreate(FolderBase):
    """Schema for creating a folder"""
    pass


class FolderUpdate(BaseModel):
    """Schema for updating a folder"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    color: Optional[str] = Field(None, pattern="^#[0-9A-Fa-f]{6}$")


class FolderResponse(FolderBase):
    """Schema for folder response"""
    id: int
    created_at: datetime
    updated_at: datetime
    exam_count: int = 0
    file_count: int = 0
    
    class Config:
        from_attributes = True

