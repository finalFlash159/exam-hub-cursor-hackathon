"""Folder model for organizing exams"""
from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class Folder(BaseModel):
    """Folder model"""
    __tablename__ = "folders"
    
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    color = Column(String(50), default="#3B82F6")  # Default blue color
    
    # Relationships
    exams = relationship("Exam", back_populates="folder", cascade="all, delete-orphan")
    files = relationship("File", back_populates="folder", cascade="all, delete-orphan")

