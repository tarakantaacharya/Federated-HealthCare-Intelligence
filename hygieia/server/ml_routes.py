import os
import pandas as pd
from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from sklearn.linear_model import LogisticRegression
import pickle
import numpy as np

# API router for ML endpoints
router = APIRouter(prefix="", tags=["ML"])

# Global variables to store model and data
trained_model = None
uploaded_data_path = None

@router.post("/upload_data")
async def upload_data(file: UploadFile = File(...)):
    """Upload a CSV file and save it to the uploads directory."""
    global uploaded_data_path

    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    # Create uploads directory if it doesn't exist
    uploads_dir = "uploads"
    os.makedirs(uploads_dir, exist_ok=True)

    # Save the file
    file_path = os.path.join(uploads_dir, file.filename)
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    uploaded_data_path = file_path

    return {"message": "File uploaded successfully", "filename": file.filename}

@router.post("/train_model")
async def train_model():
    """Train a Logistic Regression model on the uploaded data."""
    global trained_model, uploaded_data_path

    if uploaded_data_path is None:
        raise HTTPException(status_code=400, detail="No data uploaded. Please upload a CSV file first.")

    try:
        # Read the CSV file
        data = pd.read_csv(uploaded_data_path)

        # Assume the last column is the target variable
        if data.shape[1] < 2:
            raise HTTPException(status_code=400, detail="CSV must have at least 2 columns (features + target)")

        X = data.iloc[:, :-1].values
        y = data.iloc[:, -1].values

        # Train Logistic Regression model
        model = LogisticRegression(random_state=42, max_iter=1000)
        model.fit(X, y)

        trained_model = model

        return {"message": "Model trained successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error training model: {str(e)}")

@router.get("/get_weights")
async def get_weights():
    """Get the trained model's coefficients and intercept."""
    global trained_model

    if trained_model is None:
        raise HTTPException(status_code=400, detail="No model trained. Please train a model first.")

    try:
        coefficients = trained_model.coef_.tolist()
        intercept = trained_model.intercept_.tolist()

        return {
            "coefficients": coefficients,
            "intercept": intercept
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving weights: {str(e)}")