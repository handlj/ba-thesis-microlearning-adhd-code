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
  - `mature/`
    - `audios/`: .wav audio tracks for video narration
    - `quiz/`: quiz contents (20 and 16 question versions)
    - `scripts/`: text scripts for video narration
    - `slides/`: selected slides for microlearning session
    - `videos/`: full video repository (local for space reasons)
  - `utils`: scripts for audio extraction and transcription of audio tracks
- `microlearning-adhd-app/`
  - `frontend/`: React/TypeScript frontend for the microlearning app
    - `assets/`: icons and stylesheets
    - `src/`: source code
      - `components/`: React components for the app
      - `content/`: user-facing string content
      - `hooks/`: custom React hooks
      - `services/`: endpoints and types for API management
      - `shell/`: state logic and app routing
      - `utils/`: utility functions
      - `views/`: Rendered pages and questionnaires

  - `backend/`: FastAPI backend for loading materials and storing user data. Connected to a local SQLite database.
    - `app`: source code for application backend
    - `data/`: directory for storing the SQLite database and exported CSV files for data analysis
    - `media`: directory of latest video files in use in the application

## Microlearning App Usage
To run the microlearning app, navigate to the `microlearning-adhd-app/frontend` directory and run:
```bash
npm run dev
```
This will start the development server, and you can access the app at `http://localhost:5173`.

To start the backend server, navigate to the `microlearning-adhd-app/backend` directory (activate a virtual environment) and run:
```bash
python main.py
```
This will start the backend server, and you can access the API at `http://localhost:8000`.


## Database & Inspection

For inspection of the `study.db` SQLite database, execute the `export_study_db.py` script in the `backend/data` directory:

```bash
./export_study_db.py
```

Note that, for every table in `study.db`, a separate timestamped CSV file will be created in the `backend/data` directory (per model). In subsequent data analysis, these files will be merged into a single CSV file.

## Data Collection

As soon as the study participants consents to data collection and proceeds (clicks the proceed button), data collection will commence by means of a first post request to the backend (containing the consent flag).

## Prerequisites

### Git LFS

This repository uses [Git LFS](https://git-lfs.github.com/) for storing large files such as session videos and audios.

Before cloning, make sure Git LFS is installed:

1. Install Git LFS: https://git-lfs.github.com/
2. Enable it: `git lfs install`
3. Clone the repository: `git clone <repository-url>`
4. Pull the large files: `git lfs pull`
