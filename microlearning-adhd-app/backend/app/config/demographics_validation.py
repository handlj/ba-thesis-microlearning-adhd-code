# This file contains validation rules for demographics data in the ADHD microlearning app backend.
#
# It was modelled according to demographics.ts file in the content directory of the frontend
#
# Note that demographicFormQuestions turns the option values from camel case to kebab-case,
# so the values here are in kebab-case.
#
# Conditionally visible questions submit their valueIfHidden when hidden, so that value is
# included in the respective set as well.
#
# Free-text questions (studyBackground, otherDiagnoses, otherProgrammingLanguages) have no fixed
# set of valid values and are therefore not listed here.


VALID_GENDERS = {
    "male",
    "female",
    "other",
    "prefer-not-to-say",
}

VALID_HIGHEST_EDUCATION = {
    "none-or-mandatory",
    "vocational",
    "high-school",
    "bachelor",
    "master",
    "doctorate",
    "other",
    "prefer-not-to-say",
}

VALID_CURRENTLY_STUDYING = {
    "yes",
    "no",
}

VALID_DEVICES = {
    "desktop",
    "laptop",
    "tablet",
    "smartphone",
    "other",
}

VALID_ADHD_DIAGNOSES = {
    "diagnosed",
    "self-diagnosed",
    "not-diagnosed",
    "prefer-not-to-say",
}

VALID_ADHD_OFFICIAL_DIAGNOSES = {
    "combined",
    "inattentive",
    "hyperactive-impulsive",
    "not-specified",
    "not-diagnosed",  # valueIfHidden
}

VALID_ADHD_MEDICATION = {
    "yes",
    "no",
    "prefer-not-to-say",
    "not-diagnosed",  # valueIfHidden
}

VALID_HAS_OTHER_DIAGNOSES = {
    "yes",
    "no",
    "prefer-not-to-say",
}

VALID_PYTHON_PROGRAMMING_EXPERIENCE = {
    "yes",
    "no",
}

VALID_PYTHON_PROGRAMMING_ABILITY = {
    "novice",
    "beginner",
    "intermediate",
    "expert",
}

VALID_OTHER_PROGRAMMING_EXPERIENCE = {
    "yes",
    "no",
}

VALID_GENERAL_PROGRAMMING_ABILITY = {
    "novice",
    "beginner",
    "intermediate",
    "expert",
}

NO_PROGRAMMING_EXPERIENCE_ABILITY = "novice"

CONDITIONAL_FIELDS = {
    "gender_other": {
        "hidden_value": "gender-other-not-specified",
        "visible_if": {"gender": {"other"}},
    },
    "study_background": {
        "hidden_value": "not-studying",
        "visible_if": {"currently_studying": {"yes"}},
    },
    "adhd_official_diagnosis": {
        "hidden_value": "not-diagnosed",
        "visible_if": {"adhd_diagnosis": {"diagnosed"}},
    },
    "adhd_medication": {
        "hidden_value": "not-diagnosed",
        "visible_if": {"adhd_diagnosis": {"diagnosed"}},
    },
    "other_diagnoses": {
        "hidden_value": "no-other-diagnoses",
        "visible_if": {"has_other_diagnoses": {"yes"}},
    },
    "python_programming_ability": {
        "hidden_value": NO_PROGRAMMING_EXPERIENCE_ABILITY,
        "visible_if": {"python_programming_experience": {"yes"}},
    },
    "other_programming_languages": {
        "hidden_value": "no-other-experience",
        "visible_if": {"other_programming_experience": {"yes"}},
    },
    "general_programming_ability": {
        "hidden_value": NO_PROGRAMMING_EXPERIENCE_ABILITY,
        "visible_if": {
            "python_programming_experience": {"yes"},
            "other_programming_experience": {"yes"},
        },
    },
}


MIN_AGE = 18
MAX_AGE = 99
