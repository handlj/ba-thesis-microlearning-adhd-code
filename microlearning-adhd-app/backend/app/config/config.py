import os
from pathlib import Path

_BASE_DIR = Path(__file__).resolve().parent.parent.parent

STUDY_ENV = os.environ.get("STUDY_ENV", "development")
IS_PRODUCTION = STUDY_ENV == "production"

MEDIA_DIR = Path(os.environ.get("STUDY_MEDIA_DIR", _BASE_DIR / "media"))
DATA_DIR = Path(os.environ.get("STUDY_DATA_DIR", _BASE_DIR / "data"))
DATABASE_URL = f"sqlite:///{DATA_DIR / 'study.db'}"

FRONTEND_DIST_DIR = (
    Path(os.environ["FRONTEND_DIST_DIR"]) if os.environ.get("FRONTEND_DIST_DIR") else None
)

_DEFAULT_CORS_ORIGINS = "" if IS_PRODUCTION else "http://localhost:5173"
ORIGINS = [
    origin.strip()
    for origin in os.environ.get("CORS_ORIGINS", _DEFAULT_CORS_ORIGINS).split(",")
    if origin.strip()
]
