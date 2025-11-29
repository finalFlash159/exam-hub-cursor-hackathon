"""Folder repository"""
from typing import List
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.folder import Folder
from app.models.exam import Exam
from app.models.file import File
from app.repositories.base import BaseRepository


class FolderRepository(BaseRepository[Folder]):
    """Folder repository"""
    
    def __init__(self, db: AsyncSession):
        super().__init__(Folder, db)
    
    async def get_all_with_counts(self, skip: int = 0, limit: int = 100) -> List[dict]:
        """Get all folders with exam and file counts"""
        # Get folders
        folders = await self.get_all(skip, limit)
        
        result = []
        for folder in folders:
            # Count exams
            exam_count_result = await self.db.execute(
                select(func.count(Exam.id)).where(Exam.folder_id == folder.id)
            )
            exam_count = exam_count_result.scalar() or 0
            
            # Count files
            file_count_result = await self.db.execute(
                select(func.count(File.id)).where(File.folder_id == folder.id)
            )
            file_count = file_count_result.scalar() or 0
            
            result.append({
                "folder": folder,
                "exam_count": exam_count,
                "file_count": file_count
            })
        
        return result

