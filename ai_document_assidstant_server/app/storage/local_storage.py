import os
import uuid
import shutil
from fastapi import UploadFile
from app.config.settings import get_settings

settings = get_settings()

def get_workspace_dir(workspace_id: int) -> str:
    """Returns the absolute path to the workspace's storage directory."""
    path = os.path.join(settings.UPLOAD_DIR, str(workspace_id))
    os.makedirs(path, exist_ok=True)
    return path

async def save_upload_file(upload_file: UploadFile, workspace_id: int) -> str:
    """Saves an UploadFile to the local file system and returns the relative path."""
    workspace_dir = get_workspace_dir(workspace_id)
    
    # Generate a unique filename to prevent collisions
    extension = os.path.splitext(upload_file.filename)[1] if upload_file.filename else ""
    unique_filename = f"{uuid.uuid4().hex}{extension}"
    
    file_path = os.path.join(workspace_dir, unique_filename)
    
    # We must reset the file cursor just in case
    await upload_file.seek(0)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
        
    # Return a relative path that can be stored in the DB
    return os.path.join(str(workspace_id), unique_filename)

def delete_file(relative_path: str) -> None:
    """Deletes a file from local storage given its relative path."""
    full_path = os.path.join(settings.UPLOAD_DIR, relative_path)
    if os.path.exists(full_path):
        os.remove(full_path)
