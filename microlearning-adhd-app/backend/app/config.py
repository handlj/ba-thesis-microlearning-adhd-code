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

VALID_ASSIGNMENTS = {"control", "experimental"}

# Expected question IDs per Likert questionnaire (must match the frontend
# content files in frontend/src/content/*.ts and the column names in models.py).
ADHD_SCREENING_QUESTION_IDS = {f"adhd{index}" for index in range(1, 7)}
PANAS_QUESTION_IDS = {f"panas{index}" for index in range(1, 21)}
FAM_QUESTION_IDS = {f"fam{index}" for index in range(1, 19)}
UES_QUESTION_IDS = {f"ues{index}" for index in range(1, 31)}

# Likert response ranges (inclusive). FAM uses a 1-7 scale, the others 1-5.
LIKERT_MIN = 1
LIKERT_MAX = 5
FAM_SCALE_MAX = 7
