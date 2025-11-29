"""File repository"""
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.file import File
from app.repositories.base import BaseRepository


class FileRepository(BaseRepository[File]):
    """File repository"""
    
    def __init__(self, db: AsyncSession):
        super().__init__(File, db)
    
    async def get_by_folder(self, folder_id: Optional[int], skip: int = 0, limit: int = 100) -> List[File]:
        """Get files by folder"""
        query = select(self.model)
        if folder_id:
            query = query.where(self.model.folder_id == folder_id)
        else:
            query = query.where(self.model.folder_id.is_(None))
        
        result = await self.db.execute(query.offset(skip).limit(limit))
        return result.scalars().all()

