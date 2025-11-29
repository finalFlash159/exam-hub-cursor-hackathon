"""Folder service"""
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.models.folder import Folder
from app.repositories.folder import FolderRepository
from app.schemas.folder import FolderCreate, FolderUpdate, FolderResponse


class FolderService:
    """Folder service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = FolderRepository(db)
    
    async def create_folder(self, folder_data: FolderCreate) -> FolderResponse:
        """Create a new folder"""
        folder = Folder(**folder_data.model_dump())
        folder = await self.repository.create(folder)
        
        return FolderResponse(
            **folder.__dict__,
            exam_count=0,
            file_count=0
        )
    
    async def get_folder(self, folder_id: int) -> FolderResponse:
        """Get folder by ID"""
        folder = await self.repository.get_by_id(folder_id)
        if not folder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Folder not found"
            )
        
        # Get counts
        folder_with_counts = await self.repository.get_all_with_counts()
        folder_data = next((f for f in folder_with_counts if f["folder"].id == folder_id), None)
        
        return FolderResponse(
            **folder.__dict__,
            exam_count=folder_data["exam_count"] if folder_data else 0,
            file_count=folder_data["file_count"] if folder_data else 0
        )
    
    async def get_all_folders(self, skip: int = 0, limit: int = 100) -> List[FolderResponse]:
        """Get all folders"""
        folders_with_counts = await self.repository.get_all_with_counts(skip, limit)
        
        return [
            FolderResponse(
                **f["folder"].__dict__,
                exam_count=f["exam_count"],
                file_count=f["file_count"]
            )
            for f in folders_with_counts
        ]
    
    async def update_folder(self, folder_id: int, folder_data: FolderUpdate) -> FolderResponse:
        """Update folder"""
        folder = await self.repository.get_by_id(folder_id)
        if not folder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Folder not found"
            )
        
        # Update fields
        update_data = folder_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(folder, key, value)
        
        folder = await self.repository.update(folder)
        
        return await self.get_folder(folder_id)
    
    async def delete_folder(self, folder_id: int) -> bool:
        """Delete folder"""
        folder = await self.repository.get_by_id(folder_id)
        if not folder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Folder not found"
            )
        
        return await self.repository.delete(folder_id)

