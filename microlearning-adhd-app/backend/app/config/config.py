from pathlib import Path

_BASE_DIR = Path(__file__).resolve().parent.parent.parent

MEDIA_DIR = _BASE_DIR / "media"
DATA_DIR = _BASE_DIR / "data"
DATABASE_URL = f"sqlite:///{DATA_DIR / 'study.db'}"
