from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.user import User
from app.database.session import get_db_session
from app.security.auth_dependency import get_current_user
from app.utils.response import success_response, StandardResponse

router = APIRouter()


class PreferencesResponse(BaseModel):
    theme: str = "light"
    language: str = "English"
    default_workspace_id: Optional[str] = None
    show_sources_by_default: bool = True
    response_length: str = "balanced"


class PreferencesUpdate(BaseModel):
    theme: Optional[str] = None
    language: Optional[str] = None
    default_workspace_id: Optional[str] = None
    show_sources_by_default: Optional[bool] = None
    response_length: Optional[str] = None


@router.get("/preferences", response_model=StandardResponse[PreferencesResponse])
async def get_preferences(current_user: User = Depends(get_current_user)):
    """Get user preferences (stored in user record or defaults)."""
    prefs = PreferencesResponse(
        theme=getattr(current_user, "theme", "light") or "light",
        language=getattr(current_user, "language", "English") or "English",
        default_workspace_id=getattr(current_user, "default_workspace_id", None),
        show_sources_by_default=getattr(current_user, "show_sources_by_default", True),
        response_length=getattr(current_user, "response_length", "balanced") or "balanced",
    )
    return success_response(data=prefs, message="Preferences retrieved successfully")


@router.put("/preferences", response_model=StandardResponse[PreferencesResponse])
async def update_preferences(
    prefs_in: PreferencesUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
):
    """Update user preferences."""
    if prefs_in.theme is not None and hasattr(current_user, "theme"):
        current_user.theme = prefs_in.theme
    if prefs_in.language is not None and hasattr(current_user, "language"):
        current_user.language = prefs_in.language
    if prefs_in.default_workspace_id is not None and hasattr(current_user, "default_workspace_id"):
        current_user.default_workspace_id = prefs_in.default_workspace_id
    if prefs_in.show_sources_by_default is not None and hasattr(current_user, "show_sources_by_default"):
        current_user.show_sources_by_default = prefs_in.show_sources_by_default
    if prefs_in.response_length is not None and hasattr(current_user, "response_length"):
        current_user.response_length = prefs_in.response_length

    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)

    prefs = PreferencesResponse(
        theme=getattr(current_user, "theme", "light") or "light",
        language=getattr(current_user, "language", "English") or "English",
        default_workspace_id=getattr(current_user, "default_workspace_id", None),
        show_sources_by_default=getattr(current_user, "show_sources_by_default", True),
        response_length=getattr(current_user, "response_length", "balanced") or "balanced",
    )
    return success_response(data=prefs, message="Preferences updated successfully")
