import json
from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.db_models import Case, VirtualAccount, Loan, Payment
from app.services.claude_service import chat_completion
from app.prompts.system_prompts import CASE_PREDICTION_SYSTEM_PROMPT


def _decimal_to_float(val) -> float:
    if val is None:
        return 0.0
    if isinstance(val, Decimal):
        return float(val)
    return float(val)


def predict_case_success(case_id: int, db: Session) -> dict:
    # 1. Fetch case data
    case = db.query(Case).filter(Case.case_id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")

    virtual_account = db.query(VirtualAccount).filter(VirtualAccount.case_id == case_id).first()
    if not virtual_account:
        raise HTTPException(status_code=404, detail=f"Virtual account for case {case_id} not found")

    # 2. Key metrics
    target_amount = _decimal_to_float(virtual_account.target_amount)
    raised_amount = _decimal_to_float(virtual_account.raised_amount)
    funding_percentage = float(virtual_account.percentage or 0.0)
    case_status = "OPEN" if case.patient_case == 0 else "CLOSED"

    # 3. Donor count
    donor_count = db.query(func.count(Payment.id)).filter(
        Payment.account_name == virtual_account.account_name
    ).scalar() or 0

    # 4. Hospital track record
    hospital_id = case.hospital_account
    hospital_case_count = db.query(func.count(Case.case_id)).filter(
        Case.hospital_account == hospital_id
    ).scalar() or 0

    hospital_closed_count = db.query(func.count(Case.case_id)).filter(
        Case.hospital_account == hospital_id,
        Case.patient_case == 1,  # CLOSED
    ).scalar() or 0

    hospital_success_rate = (
        hospital_closed_count / hospital_case_count
        if hospital_case_count > 0
        else None
    )

    # 5. Funding velocity
    days_since_creation = None
    funding_velocity = None
    if case.created_at:
        from datetime import datetime
        delta = datetime.now() - case.created_at
        days_since_creation = max(delta.days, 1)
        funding_velocity = raised_amount / days_since_creation

    # 6. Platform-wide averages
    platform_avg_target = _decimal_to_float(
        db.query(func.avg(VirtualAccount.target_amount)).scalar()
    )
    platform_avg_raised = _decimal_to_float(
        db.query(func.avg(VirtualAccount.raised_amount)).scalar()
    )
    total_cases = db.query(func.count(Case.case_id)).scalar() or 0
    total_closed = db.query(func.count(Case.case_id)).filter(Case.patient_case == 1).scalar() or 0
    platform_completion_rate = total_closed / total_cases if total_cases > 0 else None

    # 7. Build context for Claude
    context = {
        "case_id": case_id,
        "deposit_target": target_amount,
        "raised_amount": raised_amount,
        "funding_percentage": funding_percentage,
        "case_status": case_status,
        "donor_count": donor_count,
        "days_since_creation": days_since_creation,
        "funding_velocity_per_day": round(funding_velocity, 2) if funding_velocity else None,
        "hospital_total_cases": hospital_case_count,
        "hospital_completed_cases": hospital_closed_count,
        "hospital_success_rate": round(hospital_success_rate, 4) if hospital_success_rate else None,
        "platform_average_target": round(platform_avg_target, 2),
        "platform_average_raised": round(platform_avg_raised, 2),
        "platform_completion_rate": round(platform_completion_rate, 4) if platform_completion_rate else None,
    }

    # 8. Send to Claude for prediction
    claude_response = chat_completion(
        system_prompt=CASE_PREDICTION_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": json.dumps(context)}],
        max_tokens=512,
    )

    # 9. Parse Claude's JSON response
    try:
        result = json.loads(claude_response)
    except json.JSONDecodeError:
        import re
        json_match = re.search(r'\{.*\}', claude_response, re.DOTALL)
        if json_match:
            result = json.loads(json_match.group())
        else:
            raise HTTPException(status_code=502, detail="Failed to parse AI prediction response")

    result["case_id"] = case_id
    return result
