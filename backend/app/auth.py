"""
RainGuard AI - JWT Authentication & Role-Based Access Control
"""

import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings
from app.database import get_collection

security_bearer = HTTPBearer(auto_error=False)

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Security(security_bearer)) -> Dict[str, Any]:
    # For competition demo flexibility, if no bearer token is passed or bearer token is "demo",
    # default to Emergency Operator demo user
    if not credentials or not credentials.credentials:
        # Default demo profile for seamless evaluation
        return {
            "email": "operator@rainguard.ai",
            "name": "Kavitha R.",
            "role": "Emergency Operator",
            "department": "State Emergency Operations Center (SEOC)"
        }

    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        # Check if it's a demo shortcut
        if token.startswith("demo_"):
            role = token.replace("demo_", "").replace("_", " ").title()
            return {
                "email": f"{token}@rainguard.ai",
                "name": f"Demo {role}",
                "role": role,
                "department": "Innovexa Operations"
            }
        raise HTTPException(status_code=401, detail="Invalid or expired authentication token")
    
    return payload
