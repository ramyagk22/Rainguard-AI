import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "RainGuard AI"
    TEAM_NAME: str = "Innovexa"
    VERSION: str = "1.0.0-competition"
    TAGLINE: str = "From Rainfall Intelligence to Actionable Flood Warnings."
    
    # Environment configs
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "rainguard")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "rainguard_innovexa_super_secret_key_2026_xai")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    # Execution mode indicator
    DEMO_MODE: bool = True  # Explicitly flagged to comply with ethical AI requirements
    DATA_SOURCE_LABEL: str = "Demo / Simulated Prototype Data"
    
    # Geographic Focus
    PRIMARY_REGION: str = "Tamil Nadu & Coastal Coromandel (Chennai Metro Basin)"
    DEFAULT_LAT: float = 13.0827
    DEFAULT_LON: float = 80.2707

settings = Settings()
