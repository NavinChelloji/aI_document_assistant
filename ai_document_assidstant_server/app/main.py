from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.health import routes as health_routes
from app.api.auth import routes as auth_routes
from app.api.users import routes as users_routes
from app.api.workspaces import routes as workspaces_routes
from app.api.documents import routes as documents_routes
from app.api.chat import routes as chat_routes
from app.config.settings import get_settings

settings = get_settings()

app = FastAPI(
    title="AI Document Assistant API",
    version="1.0.0",
    description="Backend API for the AI Document Assistant using Clean Architecture."
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health_routes.router, prefix="/api/health", tags=["Health"])
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Auth"])
app.include_router(users_routes.router, prefix="/api/users", tags=["Users"])
app.include_router(workspaces_routes.router, prefix="/api/workspaces", tags=["Workspaces"])
app.include_router(documents_routes.router, prefix="/api/documents", tags=["Documents"])
app.include_router(chat_routes.router, prefix="/api/chat", tags=["Chat"])

@app.get("/")
async def root():
    return {"message": "Welcome to AI Document Assistant API"}
