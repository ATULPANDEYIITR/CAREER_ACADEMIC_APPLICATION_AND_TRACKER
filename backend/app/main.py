from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Career & Academic Application Tracker API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "name": "Career & Academic Application Tracker API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/api/jobs")
def jobs():
    return {
        "items": [],
        "total": 0,
        "message": "Job collector is ready for source connectors."
    }


@app.get("/api/phd/cs")
def phd_cs():
    return {
        "items": [],
        "total": 0,
        "message": "CS PhD collector is ready for source connectors."
    }


@app.get("/api/phd/management")
def phd_management():
    return {
        "items": [],
        "total": 0,
        "message": "Management PhD collector is ready for source connectors."
    }
