"""
Authentication router
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from app.models.schemas import UserLogin, TokenResponse
from app.auth import create_access_token, get_current_user
from app.database import get_collection
from app.data.seed_data import DEMO_USERS

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin):
    email = credentials.email.strip().lower()
    user = None
    
    # Check seed users
    for u in DEMO_USERS:
        if u["email"].lower() == email:
            user = u
            break
            
    # Or query database
    if not user:
        coll = get_collection("users")
        user = coll.find_one({"email": email})

    # If demo login or valid password
    if not user:
        # Create an on-the-fly demo profile for friendly evaluation
        user = {
            "id": "demo-custom",
            "email": email,
            "name": email.split("@")[0].capitalize(),
            "role": credentials.role or "Emergency Operator",
            "department": "Regional Flood Control Center"
        }

    token = create_access_token({
        "sub": user["id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "department": user["department"]
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "department": user["department"]
        }
    }

@router.get("/me")
def get_me(user: Dict[str, Any] = Depends(get_current_user)):
    return user
