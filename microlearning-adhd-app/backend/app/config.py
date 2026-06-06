from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
MEDIA_DIR = BASE_DIR / "media"
DATA_DIR = BASE_DIR / "data"
DATABASE_URL = f"sqlite:///{DATA_DIR / 'study.db'}"

NUMBER_OF_EXPERIMENTAL_VIDEOS = 4

ORIGINS = [
    "http://localhost:5173",
]

VALID_STUDY_BACKGROUNDS = {
    "computer-science",
    "stem-other",
    "non-stem",
    "not-studying",
}

VALID_ADHD_DIAGNOSES = {
    "diagnosed",
    "self-diagnosed",
    "not-diagnosed",
    "prefer-not-to-say",
}
