# Microlearning ADHD Application

## Short Description
This application serves as the environment hosting a user study to find out in which ways microlearning interventions can benefit learners with ADHD w.r.t. to different outcome variables.

Specifically, the present code models a full-stack application with a React frontend and a FastAPI backend which is connected to a singe SQLite database file.

The application is intended for research purposes and was created in the context of an undergraduate thesis in the field of computer science at TU Graz, Institute of Human Centered Computing (HCC).

## Deployment
The deployment suite in `deploy/` was built to run the app on a single Spark server.

Set it up via 
```bash
./deploy/setup.sh
```
and start it via
```bash
./deploy/start.sh
```
or stop it via
```bash
./deploy/stop.sh
```
