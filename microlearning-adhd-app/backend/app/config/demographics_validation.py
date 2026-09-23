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
# Free-text questions (studyBackground, otherDiagnoses, generalProgrammingLanguages) have no fixed
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

VALID_GENERAL_PROGRAMMING_EXPERIENCE = {
    "yes",
    "no",
}

VALID_GENERAL_PROGRAMMING_ABILITY = {
    "beginner",
    "intermediate",
    "expert",
    "no-experience",  # valueIfHidden
}

VALID_PYTHON_PROGRAMMING_EXPERIENCE = {
    "yes",
    "no",  # also valueIfHidden
}

VALID_PYTHON_PROGRAMMING_ABILITY = {
    "beginner",
    "intermediate",
    "expert",
    "no-python-experience",  # valueIfHidden
}

MIN_AGE = 18
MAX_AGE = 99
