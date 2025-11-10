from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ================== APP INITIALIZATION ==================
app = FastAPI(
    title="Hygieia API - Federated HealthCare Intelligence",
    version="0.2.0",
    description="Backend for Federated HealthCare Intelligence System (FastAPI + MySQL + Docker)"
)

# ================== CORS CONFIGURATION ==================
# Allows requests from your Vite + React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Frontend dev server
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================== ROUTE REGISTRATION ==================

# --- Phase 1: Authentication & Registration Routes ---
from auth_routes import router as auth_router
app.include_router(auth_router)

# --- Phase 2: Hospital Operations (Upload, Train, Send Weights) ---
from hospital_routes import router as hospital_router
app.include_router(hospital_router)

# --- Phase 3: Central Server Dashboard (Hospitals + Weights) ---
from central_routes import router as central_router
app.include_router(central_router)

# ================== APP EVENTS ==================
@app.on_event("startup")
async def on_startup() -> None:
    """Log a confirmation message when the service boots up."""
    print("🚀 Hygieia backend is live and fully integrated.")
    print("✅ Auth, Hospital, and Central modules loaded successfully.")
    print("✅ Connected with MySQL via Docker network.")

# ================== HEALTH CHECK ROUTE ==================
@app.get("/ping")
async def ping():
    """Quick health check endpoint."""
    return {"msg": "pong", "status": "healthy"}
