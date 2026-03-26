from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.schemas import RiskScoreRequest, RiskScoreResponse
from app.services.risk_scoring_service import compute_risk_score

router = APIRouter()


@router.post("/loans/{case_id}/risk-score", response_model=RiskScoreResponse)
def risk_score(case_id: int, request: RiskScoreRequest = None, db: Session = Depends(get_db)):
    if request is None:
        request = RiskScoreRequest()
    result = compute_risk_score(case_id, request.loan_amount, db)
    return RiskScoreResponse(**result)
