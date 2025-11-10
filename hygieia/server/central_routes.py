# === Central Routes ===
from fastapi import APIRouter, Depends, HTTPException
from auth_routes import get_db_connection
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/central", tags=["Central"])

# ===================== RESPONSE MODELS =====================

class ApiResponse(BaseModel):
    success: bool
    message: str

# ===================== ROUTES =====================

@router.get("/hospitals")
async def list_hospitals(connection=Depends(get_db_connection)):
    """Return all registered hospitals"""
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT id, name, email, created_at
            FROM hospitals
            ORDER BY created_at DESC
            """
        )
        hospitals = cursor.fetchall()
        return {"success": True, "hospitals": hospitals}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/weights_received")
async def list_weights_received(connection=Depends(get_db_connection)):
    """Return hospitals that sent weights to the central server"""
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT hospital_id, sent_at
            FROM weight_transfers
            WHERE received_by_central = TRUE
            ORDER BY sent_at DESC
            """
        )
        weights = cursor.fetchall()
        return {"success": True, "weights_received": weights}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.post("/aggregate", response_model=ApiResponse)
async def aggregate_weights(connection=Depends(get_db_connection)):
    """
    Placeholder route for future aggregation logic.
    Marks all received weights as aggregated (for simulation).
    """
    try:
        cursor = connection.cursor()
        cursor.execute(
            """
            UPDATE weight_transfers
            SET received_by_central = TRUE
            WHERE received_by_central = FALSE
            """
        )
        connection.commit()
        return ApiResponse(success=True, message="Weights aggregated successfully (placeholder)")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Aggregation failed: {str(e)}")
