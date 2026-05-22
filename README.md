# ADHD Microlearning

> Bachelor Thesis (CS) by Jan S. Handler  
> Institute for Human-Centered Computing (HCC)  
> Supervisors: Dr. Lisa Berger & Prof. Elisabeth Lex  

## Overview
This repository contains the code and data used for the bachelor thesis with the working title "ADHD Microlearning" by Jan S. Handler.  

## Contents
- `course_materials/`
  - `raw/`: raw course slides, audios, transcripts and videos (local for space reasons)
  - `preprocessed/`
    - `transcripts/`: manually preprocessed transcripts for selected videos
    - `slides/`: preprocessed slides for microlearning session
- `microlearning-adhd-app/`
  - `frontend/`: React/TypeScript frontend for the microlearning app
  - `backend/`: FastAPI backend for loading materials and storing user data. Connected to a local SQLite database.

## Microlearning App Usage
To run the microlearning app, navigate to the `microlearning-adhd-app/frontend` directory and run:
```bash
npm run dev
```
This will start the development server, and you can access the app at `http://localhost:5173`.

To start the backend server, navigate to the `microlearning-adhd-app/backend` directory and run:
```bash
python main.py
```
This will start the backend server, and you can access the API at `http://localhost:8000`.


## Database & Inspection

For inspection of the `study.db` SQLite database, execute the `export_study_db.py` script in the `backend/utils` directory:

```bash
python export_study_db.py
```

Note that at the moment, for every table in `study.db`, a separate timestamped CSV file will be created in the `backend/data` directory. As soon as the database structure is finalized, a merged CSV file will be created for data analysis.

## Data Collection

As soon as the study participants consents to data collection and proceeds (clicks the proceed button), data collection will commence by means of a first post request to the backend (containing the consent flag).
