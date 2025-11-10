# === Phase 1 Start ===
from datetime import datetime
from typing import Optional
import mysql.connector
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext

# Password hashing context for hospital credentials
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def get_mysql_connection():
    """Create and return a MySQL connection using environment variables."""
    import os

    connection = mysql.connector.connect(
        host=os.environ.get("MYSQL_HOST", "db"),
        port=int(os.environ.get("MYSQL_PORT", "3306")),
        user=os.environ.get("MYSQL_USER", "root"),
        password=os.environ.get("MYSQL_PASSWORD", "newpassword"),
        database=os.environ.get("MYSQL_DATABASE", "federatedhealthcareintelligence"),
    )
    return connection

# API router for authentication endpoints
router = APIRouter(prefix="", tags=["Authentication"])

CENTRAL_USER = "admin"
CENTRAL_PASS = "hygieia123"

# ===================== MODELS =====================
class CentralLoginRequest(BaseModel):
    username: str
    password: str

class HospitalRegistrationRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    address: str
    contact_number: str

class HospitalLoginRequest(BaseModel):
    username: str
    password: str

class ApiResponse(BaseModel):
    success: bool
    message: str

class LoginResponse(BaseModel):
    success: bool
    message: str
    hospital_id: Optional[int] = None
    name: Optional[str] = None

# ===================== HELPERS =====================
def get_hospital_by_email(cursor, email: str) -> Optional[dict]:
    cursor.execute(
        "SELECT id, name, email, password_hash, address, contact_number, created_at FROM hospitals WHERE email = %s",
        (email,),
    )
    row = cursor.fetchone()
    if row:
        return {
            "id": row[0],
            "name": row[1],
            "email": row[2],
            "password_hash": row[3],
            "address": row[4],
            "contact_number": row[5],
            "created_at": row[6],
        }
    return None

def get_hospital_by_username(cursor, username: str) -> Optional[dict]:
    cursor.execute(
        "SELECT id, name, email, password_hash, address, contact_number, created_at FROM hospitals WHERE name = %s",
        (username,),
    )
    row = cursor.fetchone()
    if row:
        return {
            "id": row[0],
            "name": row[1],
            "email": row[2],
            "password_hash": row[3],
            "address": row[4],
            "contact_number": row[5],
            "created_at": row[6],
        }
    return None

def ensure_hospital_table_exists(cursor) -> None:
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS hospitals (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            email VARCHAR(100) UNIQUE,
            password_hash VARCHAR(255),
            address VARCHAR(255),
            contact_number VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
    )

def ensure_hospital_datasets_table_exists(cursor) -> None:
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS hospital_datasets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            hospital_id INT,
            file_name VARCHAR(255),
            file_path VARCHAR(500),
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
        );
        """
    )

def ensure_hospital_models_table_exists(cursor) -> None:
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS hospital_models (
            id INT AUTO_INCREMENT PRIMARY KEY,
            hospital_id INT,
            model_path VARCHAR(500),
            accuracy FLOAT,
            loss FLOAT,
            trained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
        );
        """
    )

def ensure_weight_transfers_table_exists(cursor) -> None:
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS weight_transfers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            hospital_id INT,
            weight_path VARCHAR(500),
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            received_by_central BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
        );
        """
    )

# ===================== DEPENDENCIES =====================
async def get_db_connection():
    connection = get_mysql_connection()
    cursor = connection.cursor()
    ensure_hospital_table_exists(cursor)
    ensure_hospital_datasets_table_exists(cursor)
    ensure_hospital_models_table_exists(cursor)
    ensure_weight_transfers_table_exists(cursor)
    connection.commit()
    print("✅ MySQL connected")
    print("✅ Tables verified or created")
    try:
        yield connection
    finally:
        cursor.close()
        connection.close()

def get_cursor(connection = Depends(get_db_connection)):
    return connection.cursor(dictionary=True)

# ===================== ROUTES =====================
@router.post("/login_central", response_model=ApiResponse)
async def login_central(payload: CentralLoginRequest) -> ApiResponse:
    if payload.username == CENTRAL_USER and payload.password == CENTRAL_PASS:
        return ApiResponse(success=True, message="Central login successful")
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid central credentials",
    )

@router.post("/register_hospital", response_model=ApiResponse)
async def register_hospital(payload: HospitalRegistrationRequest, connection = Depends(get_db_connection)) -> ApiResponse:
    cursor = connection.cursor()
    ensure_hospital_table_exists(cursor)
    connection.commit()

    # 🚨 Validate password length (argon2 supports up to ~128 bytes, but still check)
    if len(payload.password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password too long. Maximum 72 characters allowed."
        )

    existing_email = get_hospital_by_email(cursor, payload.email)
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A hospital with this email already exists.",
        )

    existing_username = get_hospital_by_username(cursor, payload.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A hospital with this name already exists.",
        )

    password_hash = pwd_context.hash(payload.password)

    cursor.execute(
        """
        INSERT INTO hospitals (name, email, password_hash, address, contact_number, created_at)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (payload.username, payload.email, password_hash, payload.address, payload.contact_number, datetime.utcnow()),
    )
    connection.commit()

    return ApiResponse(success=True, message="Hospital registered successfully")

@router.post("/login_hospital", response_model=LoginResponse)
async def login_hospital(payload: HospitalLoginRequest, connection = Depends(get_db_connection)) -> LoginResponse:
    cursor = connection.cursor()
    ensure_hospital_table_exists(cursor)
    connection.commit()

    hospital = get_hospital_by_username(cursor, payload.username)
    if hospital is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid hospital credentials",
        )

    if not pwd_context.verify(payload.password, hospital["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid hospital credentials",
        )

    return LoginResponse(success=True, message="Hospital login successful", hospital_id=hospital["id"], name=hospital["name"])
# === Phase 1 End ===
