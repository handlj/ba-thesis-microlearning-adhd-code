# Data Analysis Plan
> This plan is intended as a guidline for committing to a data-analysis pipeline.   
> Its scope begins after the full extraction of raw tables from the study.db database file.   
> Raw agnostic extraction is already handled by `export_study_db.py` inside the `backend/data-analysis` directory.


## 1. Data Preprocessing
The first stage in the data analysis pipeline is called "Data Preprocessing" and will be handled in the directory `data-preprocessing` which is inside `backend/data-analysis`.   

The goal of this stage is to produce one merged .csv file named `merged-dataset-<date>.csv`, stored in `data-preprocessing`, containing all combined data from the seperately extracted raw tables inside `backend/data/study_db_export_<date>`. 

*Note*: `<date>` is not meant literal here, but has to be dynamically replaced with the current date in the format: `YYYY-MM-DD-HHMMSS`.

In this step, we will perform no cleaning principles such as deduplication, outlier detection, missing value exclusion etc. The sole objective is to combine all data into a single file for subsequent analysis.

To this end, we will create a python script `merge_study_db_extraction.py` inside `data-preprocessing`.   
Per default, this script takes as input the contents of the latest study.db export in the `backend/data` directory. If a parameter with a specifc and correct foldername inside the `backend/data` directory is passed, it will take this folder instead of the default one (the most current one). In the respective folder, all necessary raw table exports have to be already existing, saved as .csv files. If some files are missing, the merged dataset can not be created and the script should abort with a descriptive error message.

The resulting `merged-dataset.csv` will contain the following columns from the raw files (some are renamed!) in the specified order:

1. `participant_id`: Taken from `participantsession.csv. This serves as primary key to merge the correct entries from the other files onto.
2. `consented`: Taken from `participantsession.csv`.
3. `consented_at`: Taken from `participantsession.csv`.
4. `created_at`: Taken from `participantsession.csv`.
5. `assignment`: Taken from `participantsession.csv`. For all other merged files, `assignment` will not be merged, to not create duplicate columns.
6. `subgroup`: Taken from `participantsession.csv`. For all other merged files, `subgroup` will not be merged, to not create duplicate columns.
7. `adhd_screen_positive`: Taken from `participantsession.csv`.
8. `age`: Taken from `demographics.csv`.
9. `gender`: Taken from `demographics.csv`.
10. `highest_education`: Taken from `demographics.csv`.
11. `currently_studying`: Taken from `demographics.csv`.
12. `study_background`: Taken from `demographics.csv`.
13. `adhd_diagnosis`: Taken from `demographics.csv`.
14. `adhd_official_diagnosis`: Taken from `demographics.csv`.
15. `adhd_medication`: Taken from `demographics.csv`.
16. `demographics_submitted_at`: Taken from `demographics.csv`. **Renamed from `submitted_at`.**
17. `adhd1` to `adhd18`: Taken from `adhdscreeningresponse.csv`.
18. `adhd_submitted_at`: Taken from `adhdscreeningresponse.csv`. **Renamed from `submitted_at`.**
19. `prepanas1` to `prepanas20`: Taken from `panaspreresponse.csv`. **Each entry renamed from `panas<nr>`.**
20. `prepanas_submitted_at`: Taken from `panaspreresponse.csv`. **Renamed from `submitted_at`.**
21. `postpanas1` to `postpanas20`: Taken from `panaspostresponse.csv`. **Each entry renamed from `panas<nr>`.**
22. `postpanas_submitted_at`: Taken from `panaspostresponse.csv`. **Renamed from `submitted_at`.**
23. `fam1` to `fam18`: Taken from `famresponse.csv`.
24. `fam_submitted_at`: Taken from `famresponse.csv`. **Renamed from `submitted_at`.**
25. `ues1` to `ues30`: Taken from `uesresponse.csv`.
26. `ues_submitted_at`: Taken from `uesresponse.csv`. **Renamed from `submitted_at`.**

Now, for the merge of the quiz answers across prequiz and the 4 experimental quizzes with multiple attempts as well as the control quiz we will need a more involved strategy. The goal is to keep only a single row per participant in the resulting combined .csv file:

The following additional columns will be added next to the ones listed above. All of them are taken from the raw `quizsubmission.csv` table.

27. `prequiz_answers`: This is filled with the `answers_json` for which the `topic_id` is "pre-quiz".
28. `prequiz_answers_count`: This is filled with the `answer_count` for which the `topic_id` is "pre-quiz".
29. `prequiz_submitted_at`: This is filled with the `submitted_at` for which the `topic_id` is "pre-quiz".
30. `eq_1_answers`, eq refering to "experimental_quiz: This is filled with the `answers_json` for which the `topic_id` is "a".
31. `eq_1_answers_count`: This is filled with the `answer_count` for which the `topic_id` is "a".
32. `eq_1_attempts`: This is filled with the `attempt` for which the `topic_id` is "a".
33. `eq_1_submitted_at`: This is filled with the `submitted_at` for which the `topic_id` is "a".
34. `eq_2_answers`: Meaning experimental_quiz_2_answers: This is filled with the `answers_json` for which the `topic_id` is "b".
35. `eq_2_answers_count`: This is filled with the `answer_count_` for which the `topic_id` is "b".
36. `eq_2_attempts`: This is filled with the `attempt` for which the `topic_id` is "b".
37. `eq_2_submitted_at`: This is filled with the `submitted_at` for which the `topic_id` is "b".
38. `eq_3_answers`: Meaning experimental_quiz_3_answers: This is filled with the `answers_json` for which the `topic_id` is "c".
39. `eq_3_answers_count`: This is filled with the `answer_count` for which the `topic_id` is "c".
40. `eq_3_attempts`: This is filled with the `attempt` for which the `topic_id` is "c".
41. `eq_3_submitted_at`: This is filled with the `submitted_at` for which the `topic_id` is "c".
42. `eq_4_answers`: Meaning experimental_quiz_4_answers: This is filled with the `answers_json` for which the `topic_id` is "d".
43. `eq_4_answers_count`: This is filled with the `answer_count` for which the `topic_id` is "d".
44. `eq_4_attempts`: This is filled with the `attempt` for which the `topic_id` is "d".
45. `eq_4_submitted_at`: This is filled with the `submitted_at` for which the `topic_id` is "d".
46. `cq_answers`: Meaning control_quiz_answers: This is filled with the `answers_json` for which the `topic_id` is "control-quiz".
47. `cq_answers_count`: This is filled with the `answer_count` for which the `topic_id` is "control-quiz"
48. `cq_submitted_at`: This is filled with the `submitted_at` for which the `topic_id` is "control-quiz"

Next, we will turn to the merge of `interactionevent.csv`. It will be necessary to add the following configured columns. All contents are therefore taken from the extracted raw `interactionevent.csv` table.

49. `interaction_page`: **Renamed from `page`**
50. `interaction_type`: **Renamed from `event_type`**
51. `interaction_time_ocurred`: **Renamed from `occurred_at`**
52. `interaction_time_received`: **Renamed from `received_at`**
53. `interaction_payload`: **Renamed from `payload_json`**

For the merge of the last remaining extracted raw table `postinterventionresponse.csv`, we need to add the following columns in order:
54. `feedback`: **Renamed from `open_feedback`.**
55. `feedback_submitted_at`: **Renamed from `submitted_at`.**

None of the original raw table exports should be altered or deleted in any way. The only new file will be the merged dataset, daved inside the preprocessing directory.

# 2. Data Cleaning
> The second stage of the data analysis pipeline is called "Data Cleaning".
> It takes as an input the latest merged dataset returned by the previous stage "Data Preprocessing".

**Goal**: Clean the merged dataset by means of the pipeline below.

**Output Files**:   
1. Cleaned dataset `cleaned-dataset-<date>` (same pattern as stage "Data Preprocessing").
2. Dataset with all excluded participants for manual inspection named `excluded-dataset-<date>`.

*Note*: The original merged dataset will not be altered or deleted in any way in order to preserve fallback options on data-corruption.

## Cleaning Pipeline

### Missing or Faulty Values

1. **Exclusion on Empty Fields**   
If a participant has missing values in either `participant_id`, `consented`, `assignment` or `subgroup`, they will be excluded from the cleaned dataset.

2. **Exclusion on Faulty Fields**
If a participant has not consented, i.e. `consented: 0`, they will be excluded.

### Dataset Simplification

1. **Redundant Columns**   
Drop column `consented_at`, since it is duplicated by `created_at`.



