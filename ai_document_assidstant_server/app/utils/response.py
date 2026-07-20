from typing import Any, Generic, TypeVar, Optional
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from fastapi import status

T = TypeVar("T")

class StandardResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    data: Optional[T] = None

def success_response(data: Any = None, message: str = "Operation successful") -> dict:
    """
    Returns a standardized dictionary for success responses.
    FastAPI will automatically serialize this using the route's response_model if provided,
    or just return it as JSON if no model is provided.
    """
    return {
        "success": True,
        "message": message,
        "data": data
    }

def error_response(message: str, status_code: int = status.HTTP_400_BAD_REQUEST, data: Any = None) -> JSONResponse:
    """
    Returns a standardized JSONResponse for errors.
    """
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "data": data
        }
    )
