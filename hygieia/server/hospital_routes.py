# === Hospital Routes ===
from datetime import datetime
import os
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, log_loss
import pickle
import mysql.connector

# Reuse the connection function from auth_routes
from auth_routes import get_db_connection

# API router for hospital endpoints
router = APIRouter(prefix="", tags=["Hospital"])

# ===================== MODELS =====================
class ApiResponse(BaseModel):
    success: bool
    message: str

class TrainResponse(BaseModel):
    success: bool
    message: str
    accuracy: float
    loss: float

# ===================== HELPERS =====================
def get_hospital_name(cursor, hospital_id: int) -> str:
    cursor.execute("SELECT name FROM hospitals WHERE id = %s", (hospital_id,))
    row = cursor.fetchone()
    return row[0] if row else None

# ===================== ROUTES =====================

@router.post("/upload_dataset", response_model=ApiResponse)
async def upload_dataset(
    hospital_id: int = Form(...),
    file: UploadFile = File(...),
    connection=Depends(get_db_connection)
):
    cursor = connection.cursor()

    hospital_name = get_hospital_name(cursor, hospital_id)
    if not hospital_name:
        raise HTTPException(status_code=400, detail="Invalid hospital ID")

    # Create uploads directory for hospital
    hospital_dir = f"uploads/{hospital_name}"
    os.makedirs(hospital_dir, exist_ok=True)

    # Save file
    file_path = os.path.join(hospital_dir, file.filename)
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    # Record in database
    cursor.execute(
        "INSERT INTO hospital_datasets (hospital_id, file_name, file_path, uploaded_at) VALUES (%s, %s, %s, %s)",
        (hospital_id, file.filename, file_path, datetime.utcnow())
    )
    connection.commit()

    print(f"✅ Dataset uploaded for hospital {hospital_name}: {file.filename}")
    return ApiResponse(success=True, message=f"Dataset {file.filename} uploaded successfully")

class TrainRequest(BaseModel):
    hospital_id: int

@router.post("/train_model", response_model=TrainResponse)
async def train_model(
    request: TrainRequest,
    connection=Depends(get_db_connection)
):
    hospital_id = request.hospital_id
    cursor = connection.cursor()

    hospital_name = get_hospital_name(cursor, hospital_id)
    if not hospital_name:
        raise HTTPException(status_code=400, detail="Invalid hospital ID")

    # Get latest dataset for hospital
    cursor.execute(
        "SELECT file_path FROM hospital_datasets WHERE hospital_id = %s ORDER BY uploaded_at DESC LIMIT 1",
        (hospital_id,)
    )
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=400, detail="No dataset uploaded for this hospital")

    file_path = row[0]

    # Load data
    data = pd.read_csv(file_path)
    if data.shape[1] < 2:
        raise HTTPException(status_code=400, detail="Dataset must have at least 2 columns")

    X = data.iloc[:, :-1].values
    y = data.iloc[:, -1].values

    # Train model
    model = LogisticRegression(random_state=42, max_iter=1000)
    model.fit(X, y)

    # Calculate metrics
    y_pred = model.predict(X)
    y_prob = model.predict_proba(X)
    accuracy = accuracy_score(y, y_pred)
    loss = log_loss(y, y_prob)

    # Save model
    model_dir = f"models/{hospital_name}"
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, f"{hospital_name}_weights.pkl")
    with open(model_path, "wb") as f:
        pickle.dump(model, f)

    # Record in database
    cursor.execute(
        "INSERT INTO hospital_models (hospital_id, model_path, accuracy, loss, trained_at) VALUES (%s, %s, %s, %s, %s)",
        (hospital_id, model_path, accuracy, loss, datetime.utcnow())
    )
    connection.commit()

    print(f"✅ Model trained for hospital {hospital_name}: accuracy={accuracy}, loss={loss}")
    return TrainResponse(success=True, message="Model trained successfully", accuracy=accuracy, loss=loss)

@router.get("/get_weights/{hospital_id}")
async def get_weights(hospital_id: int, connection=Depends(get_db_connection)):
    cursor = connection.cursor()

    # Get latest model for hospital
    cursor.execute(
        "SELECT model_path FROM hospital_models WHERE hospital_id = %s ORDER BY trained_at DESC LIMIT 1",
        (hospital_id,)
    )
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=400, detail="No model trained for this hospital")

    model_path = row[0]

    # Load model and get weights
    with open(model_path, "rb") as f:
        model = pickle.load(f)

    coefficients = model.coef_.tolist()
    intercept = model.intercept_.tolist()

    return {
        "coefficients": coefficients,
        "intercept": intercept
    }

class SendWeightsRequest(BaseModel):
    hospital_id: int

@router.post("/send_weights", response_model=ApiResponse)
async def send_weights(
    request: SendWeightsRequest,
    connection=Depends(get_db_connection)
):
    hospital_id = request.hospital_id
    cursor = connection.cursor()

    hospital_name = get_hospital_name(cursor, hospital_id)
    if not hospital_name:
        raise HTTPException(status_code=400, detail="Invalid hospital ID")

    # Get latest model path
    cursor.execute(
        "SELECT model_path FROM hospital_models WHERE hospital_id = %s ORDER BY trained_at DESC LIMIT 1",
        (hospital_id,)
    )
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=400, detail="No model trained for this hospital")

    model_path = row[0]

    # Simulate sending to central (for now, just record)
    # In real, would upload to central server
    cursor.execute(
        "INSERT INTO weight_transfers (hospital_id, weight_path, sent_at, received_by_central) VALUES (%s, %s, %s, %s)",
        (hospital_id, model_path, datetime.utcnow(), True)  # Assume received for now
    )
    connection.commit()

    print(f"✅ Weights sent to central for hospital {hospital_name}")
    return ApiResponse(success=True, message="Weights sent to central successfully")