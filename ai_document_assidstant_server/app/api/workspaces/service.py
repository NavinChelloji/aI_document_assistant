from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status

from app.database.models.workspace import Workspace
from app.api.workspaces.schema import WorkspaceCreate, WorkspaceUpdate

async def create_workspace(db: AsyncSession, workspace_in: WorkspaceCreate, user_id: int) -> Workspace:
    db_workspace = Workspace(name=workspace_in.name, owner_id=user_id)
    db.add(db_workspace)
    await db.commit()
    await db.refresh(db_workspace)
    return db_workspace

async def get_workspaces(db: AsyncSession, user_id: int) -> List[Workspace]:
    result = await db.execute(select(Workspace).where(Workspace.owner_id == user_id))
    return result.scalars().all()

async def get_workspace(db: AsyncSession, workspace_id: int, user_id: int) -> Workspace:
    result = await db.execute(select(Workspace).where(Workspace.id == workspace_id, Workspace.owner_id == user_id))
    workspace = result.scalars().first()
    if not workspace:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")
    return workspace

async def update_workspace(db: AsyncSession, workspace_id: int, workspace_in: WorkspaceUpdate, user_id: int) -> Workspace:
    workspace = await get_workspace(db, workspace_id, user_id)
    if workspace_in.name is not None:
        workspace.name = workspace_in.name
    
    db.add(workspace)
    await db.commit()
    await db.refresh(workspace)
    return workspace

async def delete_workspace(db: AsyncSession, workspace_id: int, user_id: int) -> None:
    workspace = await get_workspace(db, workspace_id, user_id)
    await db.delete(workspace)
    await db.commit()
