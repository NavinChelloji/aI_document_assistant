from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.health import routes as health_routes
from app.api.auth import routes as auth_routes
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

@app.get("/")
async def root():
    return {"message": "Welcome to AI Document Assistant API"}
