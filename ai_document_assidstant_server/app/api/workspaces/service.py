from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status

from app.database.models.workspace import Workspace
from app.api.workspaces.schema import WorkspaceCreate, WorkspaceUpdate

async def create_workspace(db: AsyncSession, workspace_in: WorkspaceCreate, user_id: UUID) -> Workspace:
    db_workspace = Workspace(name=workspace_in.name, description=workspace_in.description, user_id=user_id)
    db.add(db_workspace)
    await db.commit()
    await db.refresh(db_workspace)
    return db_workspace

async def get_workspaces(db: AsyncSession, user_id: UUID) -> List[Workspace]:
    result = await db.execute(select(Workspace).where(Workspace.user_id == user_id))
    return list(result.scalars().all())

async def get_workspace(db: AsyncSession, workspace_id: UUID, user_id: UUID) -> Workspace:
    result = await db.execute(select(Workspace).where(Workspace.id == workspace_id, Workspace.user_id == user_id))
    workspace = result.scalars().first()
    if not workspace:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")
    return workspace

async def update_workspace(db: AsyncSession, workspace_id: UUID, workspace_in: WorkspaceUpdate, user_id: UUID) -> Workspace:
    workspace = await get_workspace(db, workspace_id, user_id)
    if workspace_in.name is not None:
        workspace.name = workspace_in.name
    if workspace_in.description is not None:
        workspace.description = workspace_in.description
    
    db.add(workspace)
    await db.commit()
    await db.refresh(workspace)
    return workspace

async def delete_workspace(db: AsyncSession, workspace_id: UUID, user_id: UUID) -> None:
    workspace = await get_workspace(db, workspace_id, user_id)
    await db.delete(workspace)
    await db.commit()
