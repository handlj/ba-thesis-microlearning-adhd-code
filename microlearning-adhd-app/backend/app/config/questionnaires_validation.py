ADHD_SCREENING_ITEM_COUNT = 19
PANAS_ITEM_COUNT = 20
FAM_ITEM_COUNT = 19
UES_ITEM_COUNT = 31

# Must match the frontend content files in frontend/src/content/*.ts and column names in models.py.
# TODO: Add single source of truth
ADHD_SCREENING_QUESTION_IDS = {f"adhd{index}" for index in range(1, ADHD_SCREENING_ITEM_COUNT + 1)}
PANAS_QUESTION_IDS = {f"panas{index}" for index in range(1, PANAS_ITEM_COUNT + 1)}
FAM_QUESTION_IDS = {f"fam{index}" for index in range(1, FAM_ITEM_COUNT + 1)}
UES_QUESTION_IDS = {f"ues{index}" for index in range(1, UES_ITEM_COUNT + 1)}

ADHD_PART_A_QUESTION_IDS = ("adhd1", "adhd2", "adhd3", "adhd4", "adhd5", "adhd6")
ADHD_PART_B_QUESTION_IDS = (
    "adhd7",
    "adhd8",
    "adhd9",
    "adhd10",
    "adhd11",
    "adhd12",
    "adhd13",
    "adhd14",
    "adhd15",
    "adhd16",
    "adhd17",
    "adhd18",
)

# Thresholds increased by 1 per question, since scoring is based on 1-5 likert scale instead of 0-4.
ADHD_PART_A_SCORE_THRESHOLD = 20
ADHD_PART_B_SCORE_THRESHOLD = 39

# Likert response ranges (inclusive). FAM uses a 1-7 scale, the others 1-5.
LIKERT_MIN = 1
LIKERT_MAX = 5
FAM_SCALE_MAX = 7
