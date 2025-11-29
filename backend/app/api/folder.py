"""Folder endpoints"""
from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.services.folder_service import FolderService
from app.schemas.folder import FolderCreate, FolderUpdate, FolderResponse

router = APIRouter()


@router.post("", response_model=FolderResponse, status_code=201)
async def create_folder(
    folder_data: FolderCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new folder"""
    service = FolderService(db)
    return await service.create_folder(folder_data)


@router.get("", response_model=List[FolderResponse])
async def get_folders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """Get all folders"""
    service = FolderService(db)
    return await service.get_all_folders(skip, limit)


@router.get("/{folder_id}", response_model=FolderResponse)
async def get_folder(
    folder_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get folder by ID"""
    service = FolderService(db)
    return await service.get_folder(folder_id)


@router.put("/{folder_id}", response_model=FolderResponse)
async def update_folder(
    folder_id: int,
    folder_data: FolderUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update folder"""
    service = FolderService(db)
    return await service.update_folder(folder_id, folder_data)


@router.delete("/{folder_id}", status_code=204)
async def delete_folder(
    folder_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete folder"""
    service = FolderService(db)
    await service.delete_folder(folder_id)
    return None

