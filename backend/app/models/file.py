"""File model for uploaded documents"""
from sqlalchemy import Column, String, Integer, BigInteger, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class File(BaseModel):
    """File model"""
    __tablename__ = "files"
    
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(50), nullable=False)  # pdf, docx, txt, etc.
    file_size = Column(BigInteger, nullable=False)  # in bytes
    mime_type = Column(String(100), nullable=True)
    
    # Foreign keys
    folder_id = Column(Integer, ForeignKey("folders.id", ondelete="CASCADE"), nullable=True)
    
    # Relationships
    folder = relationship("Folder", back_populates="files")

