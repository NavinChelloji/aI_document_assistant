from typing import List
from fastapi import UploadFile, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database.models.document import Document
from app.api.workspaces.service import get_workspace
from app.storage.local_storage import save_upload_file, delete_file
from app.background_jobs.document_indexing import index_document_task

async def upload_document(
    db: AsyncSession, 
    workspace_id: int, 
    user_id: int, 
    file: UploadFile, 
    background_tasks: BackgroundTasks
) -> Document:
    # Validate workspace ownership first
    await get_workspace(db, workspace_id, user_id)
    
    # Save file to disk
    relative_path = await save_upload_file(file, workspace_id)
    
    # Save metadata to DB
    size_bytes = file.size if file.size else 0
    
    db_document = Document(
        filename=file.filename or "unknown",
        file_path=relative_path,
        content_type=file.content_type or "application/octet-stream",
        size_bytes=size_bytes,
        workspace_id=workspace_id
    )
    
    db.add(db_document)
    await db.commit()
    await db.refresh(db_document)
    
    # Trigger background AI processing task
    background_tasks.add_task(index_document_task, db_document.id, workspace_id, relative_path)
    
    return db_document

async def get_documents(db: AsyncSession, workspace_id: int, user_id: int) -> List[Document]:
    # Validate workspace ownership
    await get_workspace(db, workspace_id, user_id)
    
    result = await db.execute(select(Document).where(Document.workspace_id == workspace_id))
    return result.scalars().all()

async def get_document(db: AsyncSession, document_id: int, user_id: int) -> Document:
    # Need to join with Workspace to ensure user owns it
    # For simplicity, fetch doc, then validate workspace
    result = await db.execute(select(Document).where(Document.id == document_id))
    document = result.scalars().first()
    
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
        
    # Validates ownership implicitly
    await get_workspace(db, document.workspace_id, user_id)
    
    return document

async def delete_document_service(db: AsyncSession, document_id: int, user_id: int) -> None:
    document = await get_document(db, document_id, user_id)
    
    # Remove from local storage
    delete_file(document.file_path)
    
    # Remove from DB
    await db.delete(document)
    await db.commit()
