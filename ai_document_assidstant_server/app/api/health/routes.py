from fastapi import APIRouter
from app.utils.response import success_response

router = APIRouter()

@router.get("/")
async def health_check():
    return success_response(data={"status": "ok", "service": "AI Document Assistant Backend"})
