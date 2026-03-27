from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.schemas import CasePredictionResponse
from app.services.case_prediction_service import predict_case_success

router = APIRouter()


@router.post("/cases/{case_id}/predict", response_model=CasePredictionResponse)
def predict(case_id: int, db: Session = Depends(get_db)):
    result = predict_case_success(case_id, db)
    return CasePredictionResponse(**result)
