"""
RainGuard AI Database Layer
Supports MongoDB Atlas with automatic fallback to an in-memory/JSON store
if MONGODB_URI is not set or unreachable.
"""

import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
from app.config import settings

logger = logging.getLogger("rainguard.database")

# In-memory local database fallback
_LOCAL_STORAGE: Dict[str, List[Dict[str, Any]]] = {
    "users": [],
    "data_sources": [],
    "observations": [],
    "weather_forecasts": [],
    "rainfall_predictions": [],
    "inundation_predictions": [],
    "risk_assessments": [],
    "alerts": [],
    "historical_events": [],
    "reports": [],
    "audit_logs": [],
    "warning_thresholds": []
}

_MONGO_CLIENT = None
_MONGO_DB = None
_IS_USING_MONGO = False

def init_db():
    global _MONGO_CLIENT, _MONGO_DB, _IS_USING_MONGO
    if settings.MONGODB_URI and settings.MONGODB_URI.strip():
        try:
            from pymongo import MongoClient
            _MONGO_CLIENT = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=3000)
            # Test connection
            _MONGO_CLIENT.server_info()
            _MONGO_DB = _MONGO_CLIENT[settings.DATABASE_NAME]
            _IS_USING_MONGO = True
            logger.info("Successfully connected to MongoDB Atlas database: %s", settings.DATABASE_NAME)
            return
        except Exception as e:
            logger.warning("MongoDB Atlas connection failed (%s). Falling back to Local Store.", str(e))
            _IS_USING_MONGO = False
    else:
        logger.info("No MONGODB_URI provided. Running in Autonomous Local Storage Mode (Ready for Demo/Competition).")
        _IS_USING_MONGO = False

def is_mongo_active() -> bool:
    return _IS_USING_MONGO

class DatabaseCollection:
    def __init__(self, collection_name: str):
        self.name = collection_name

    def find(self, filter_query: Optional[Dict[str, Any]] = None, sort_field: Optional[str] = None, sort_order: int = -1, limit: int = 100) -> List[Dict[str, Any]]:
        global _LOCAL_STORAGE, _MONGO_DB, _IS_USING_MONGO
        if _IS_USING_MONGO and _MONGO_DB is not None:
            try:
                coll = _MONGO_DB[self.name]
                cursor = coll.find(filter_query or {}, {"_id": 0})
                if sort_field:
                    cursor = cursor.sort(sort_field, sort_order)
                if limit > 0:
                    cursor = cursor.limit(limit)
                return list(cursor)
            except Exception as e:
                logger.error("Mongo query error on %s: %s", self.name, str(e))

        # Local storage fallback
        items = _LOCAL_STORAGE.get(self.name, [])
        results = []
        for item in items:
            match = True
            if filter_query:
                for k, v in filter_query.items():
                    if item.get(k) != v:
                        match = False
                        break
            if match:
                results.append(item.copy())

        if sort_field:
            results.sort(key=lambda x: x.get(sort_field, ""), reverse=(sort_order == -1))
        
        return results[:limit] if limit > 0 else results

    def find_one(self, filter_query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        results = self.find(filter_query, limit=1)
        return results[0] if results else None

    def insert_one(self, document: Dict[str, Any]) -> Dict[str, Any]:
        global _LOCAL_STORAGE, _MONGO_DB, _IS_USING_MONGO
        doc = document.copy()
        if "id" not in doc and "_id" not in doc:
            import uuid
            doc["id"] = str(uuid.uuid4())
        
        if _IS_USING_MONGO and _MONGO_DB is not None:
            try:
                coll = _MONGO_DB[self.name]
                coll.insert_one(doc.copy())
            except Exception as e:
                logger.error("Mongo insert error on %s: %s", self.name, str(e))

        # Always update local cache as well
        if self.name not in _LOCAL_STORAGE:
            _LOCAL_STORAGE[self.name] = []
        _LOCAL_STORAGE[self.name].append(doc)
        return doc

    def update_one(self, filter_query: Dict[str, Any], update_data: Dict[str, Any]) -> bool:
        global _LOCAL_STORAGE, _MONGO_DB, _IS_USING_MONGO
        updated = False
        if _IS_USING_MONGO and _MONGO_DB is not None:
            try:
                coll = _MONGO_DB[self.name]
                coll.update_one(filter_query, {"$set": update_data})
                updated = True
            except Exception as e:
                logger.error("Mongo update error on %s: %s", self.name, str(e))

        items = _LOCAL_STORAGE.get(self.name, [])
        for item in items:
            match = True
            for k, v in filter_query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match:
                item.update(update_data)
                updated = True
                break
        return updated

    def count_documents(self, filter_query: Optional[Dict[str, Any]] = None) -> int:
        return len(self.find(filter_query, limit=0))

def get_collection(name: str) -> DatabaseCollection:
    return DatabaseCollection(name)
