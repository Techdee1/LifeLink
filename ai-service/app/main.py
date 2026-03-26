from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import health, chatbot, risk_scoring, case_prediction

app = FastAPI(
    title="LifeLink AI Service",
    description="AI-powered chatbot, risk scoring, and case prediction for LifeLink",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1/ai", tags=["Health"])
app.include_router(chatbot.router, prefix="/api/v1/ai", tags=["Chatbot"])
app.include_router(risk_scoring.router, prefix="/api/v1/ai", tags=["Risk Scoring"])
app.include_router(case_prediction.router, prefix="/api/v1/ai", tags=["Case Prediction"])
