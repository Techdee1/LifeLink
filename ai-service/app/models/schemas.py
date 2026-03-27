from pydantic import BaseModel


# --- Chatbot ---

class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None
    language: str | None = None  # ISO code or "auto" for detection
    hospital_id: str | None = None

class ChatResponse(BaseModel):
    reply: str
    detected_language: str | None = None
    conversation_id: str


# --- Risk Scoring ---

class RiskScoreRequest(BaseModel):
    loan_amount: float | None = None  # override; otherwise calculated from case data

class RiskScoreResponse(BaseModel):
    case_id: int
    risk_score: float  # 0.0 (no risk) to 100.0 (highest risk)
    risk_level: str  # LOW, MEDIUM, HIGH, VERY_HIGH
    recommendation: str  # APPROVE, REVIEW, DENY
    factors: dict  # breakdown of individual factor scores
    explanation: str  # Claude-generated human-readable explanation


# --- Case Prediction ---

class CasePredictionResponse(BaseModel):
    case_id: int
    success_probability: float  # 0.0 to 1.0
    estimated_days_to_target: int | None = None
    confidence_level: str  # LOW, MEDIUM, HIGH
    factors: dict
    explanation: str


# --- Translation ---

class TranslateRequest(BaseModel):
    text: str
    source_language: str | None = None  # None = auto-detect
    target_language: str = "en"

class TranslateResponse(BaseModel):
    translated_text: str
    detected_language: str | None = None


# --- Health ---

class HealthResponse(BaseModel):
    status: str
    version: str
