from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MEDIA_DIR = BASE_DIR / "media"
DATA_DIR = BASE_DIR / "data"
DATABASE_URL = f"sqlite:///{DATA_DIR / 'study.db'}"

NUMBER_OF_EXPERIMENTAL_VIDEOS = 4

ORIGINS = [
    "http://localhost:5173",
]


VALID_ADHD_DIAGNOSES = {
    "diagnosed",
    "self-diagnosed",
    "not-diagnosed",
    "prefer-not-to-say",
}


VALID_ASSIGNMENTS = {"control", "experimental"}

# Video-player subgroup. The control arm's subgroup mirrors its assignment; the
# experimental arm splits into the standard player and the ML+ enhanced player.
CONTROL_SUBGROUP = "control"
EXPERIMENTAL_SUBGROUPS = ("standard", "enhanced-player")
VALID_SUBGROUPS = {CONTROL_SUBGROUP, *EXPERIMENTAL_SUBGROUPS}
VALID_SUBGROUPS_BY_ASSIGNMENT = {
    "control": {CONTROL_SUBGROUP},
    "experimental": set(EXPERIMENTAL_SUBGROUPS),
}


# Efrons Biased Coin Probability
BIASED_COIN_PROBABILITY = 0.75


# Number of items per Likert questionnaire.
ADHD_SCREENING_ITEM_COUNT = 19
PANAS_ITEM_COUNT = 20
FAM_ITEM_COUNT = 19
UES_ITEM_COUNT = 31

# Expected question IDs per Likert questionnaire
# Must match the frontend content files in frontend/src/content/*.ts and column names in models.py.
# TODO: Add single source of truth
ADHD_SCREENING_QUESTION_IDS = {f"adhd{index}" for index in range(1, ADHD_SCREENING_ITEM_COUNT + 1)}
PANAS_QUESTION_IDS = {f"panas{index}" for index in range(1, PANAS_ITEM_COUNT + 1)}
FAM_QUESTION_IDS = {f"fam{index}" for index in range(1, FAM_ITEM_COUNT + 1)}
UES_QUESTION_IDS = {f"ues{index}" for index in range(1, UES_ITEM_COUNT + 1)}

# ASRS v1.1 Part A scoring. Items 1-3 are inattention, items 4-6 hyperactivity.
# An inattention item counts as a "mark" at "Manchmal" (3) or higher; a
# hyperactivity item counts at "Oft" (4) or higher. Four or more marks across
# the six items is a positive screen.
ADHD_INATTENTION_QUESTION_IDS = ("adhd1", "adhd2", "adhd3")
ADHD_HYPERACTIVITY_QUESTION_IDS = ("adhd4", "adhd5", "adhd6")
ADHD_INATTENTION_THRESHOLD = 3
ADHD_HYPERACTIVITY_THRESHOLD = 4
ADHD_SCREEN_POSITIVE_MARKS = 4


# Likert response ranges (inclusive). FAM uses a 1-7 scale, the others 1-5.
LIKERT_MIN = 1
LIKERT_MAX = 5
FAM_SCALE_MAX = 7


# Demographics Validation
MIN_AGE = 18
MAX_AGE = 99


# Experimental-Group Quiz Gating
QUIZ_PASS_THRESHOLD = 4  # Min. of correct answers (out of 5)
QUIZ_MAX_ATTEMPTS = 3


# HTTP Status Codes
HTTP_400_BAD_REQUEST = 400
HTTP_404_NOT_FOUND = 404


# Error Messages
ERROR_CONSENT_REQUIRED = "Consent must be provided before starting the study."
ERROR_PARTICIPANT_NOT_FOUND = "Participant session not found."
ERROR_INVALID_ASSIGNMENT = "Invalid assignment."
ERROR_INVALID_AGE = "Age must be between {MIN_AGE} and {MAX_AGE}."
ERROR_INVALID_ADHD_DIAGNOSIS = "Invalid ADHD diagnosis status."
ERROR_QUIZ_ANSWERS_REQUIRED = "Quiz answers are required."
ERROR_FIELD_REQUIRED = "{field_name} is required."
ERROR_INVALID_SUBGROUP = "Invalid subgroup."
ERROR_SUBGROUP_ASSIGNMENT_MISMATCH = "Subgroup does not match the assignment."
ERROR_NAIVE_TIMESTAMP_WRITE = "Naive timestamp write detected. Use UTC-aware timestamps."

# Video Filenames
CONTROL_VIDEO_FILENAME = "video-full-v1.mp4"
INSTRUCTION_VIDEO_FILENAME = "video-instructions-v1.mp4"
EXPERIMENTAL_VIDEO_FILENAME_TEMPLATE = "video{index}.mp4"
