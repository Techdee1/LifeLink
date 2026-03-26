import json
from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.db_models import Case, VirtualAccount, Loan, Payment
from app.services.claude_service import chat_completion
from app.prompts.system_prompts import RISK_SCORING_SYSTEM_PROMPT


def _decimal_to_float(val) -> float:
    if val is None:
        return 0.0
    if isinstance(val, Decimal):
        return float(val)
    return float(val)


def compute_risk_score(case_id: int, loan_amount_override: float | None, db: Session) -> dict:
    # 1. Fetch case data
    case = db.query(Case).filter(Case.case_id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")

    virtual_account = db.query(VirtualAccount).filter(VirtualAccount.case_id == case_id).first()
    if not virtual_account:
        raise HTTPException(status_code=404, detail=f"Virtual account for case {case_id} not found")

    # 2. Calculate key metrics
    target_amount = _decimal_to_float(virtual_account.target_amount)
    raised_amount = _decimal_to_float(virtual_account.raised_amount)
    funding_percentage = float(virtual_account.percentage or 0.0)

    loan_amount = loan_amount_override
    if loan_amount is None:
        loan_amount = target_amount - raised_amount
    loan_to_target_ratio = loan_amount / target_amount if target_amount > 0 else 1.0

    # 3. Hospital track record
    hospital_id = case.hospital_account
    hospital_case_count = db.query(func.count(Case.case_id)).filter(
        Case.hospital_account == hospital_id
    ).scalar() or 0

    hospital_loans_paid = db.query(func.count(Loan.id)).join(
        Case, Loan.case_id == Case.case_id
    ).filter(
        Case.hospital_account == hospital_id,
        Loan.loan_status == "PAID",
    ).scalar() or 0

    hospital_loans_unpaid = db.query(func.count(Loan.id)).join(
        Case, Loan.case_id == Case.case_id
    ).filter(
        Case.hospital_account == hospital_id,
        Loan.loan_status == "UNPAID",
    ).scalar() or 0

    # 4. Donor count (distinct payments for this case's virtual account)
    donor_count = db.query(func.count(Payment.id)).filter(
        Payment.account_name == virtual_account.account_name
    ).scalar() or 0

    # 5. Funding velocity (approximate — using created_at if available)
    days_since_creation = None
    funding_velocity = None
    if case.created_at:
        from datetime import datetime
        delta = datetime.now() - case.created_at
        days_since_creation = max(delta.days, 1)
        funding_velocity = raised_amount / days_since_creation

    # 6. Existing loans on this case
    existing_loan_count = db.query(func.count(Loan.id)).filter(
        Loan.case_id == case_id
    ).scalar() or 0

    # 7. Build context for Claude
    context = {
        "case_id": case_id,
        "deposit_target": target_amount,
        "raised_amount": raised_amount,
        "funding_percentage": funding_percentage,
        "loan_amount_requested": loan_amount,
        "loan_to_target_ratio": round(loan_to_target_ratio, 4),
        "hospital_total_cases": hospital_case_count,
        "hospital_loans_paid": hospital_loans_paid,
        "hospital_loans_unpaid": hospital_loans_unpaid,
        "donor_count": donor_count,
        "days_since_creation": days_since_creation,
        "funding_velocity_per_day": round(funding_velocity, 2) if funding_velocity else None,
        "existing_loans_on_case": existing_loan_count,
    }

    # 8. Send to Claude for analysis
    claude_response = chat_completion(
        system_prompt=RISK_SCORING_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": json.dumps(context)}],
        max_tokens=512,
    )

    # 9. Parse Claude's JSON response
    try:
        result = json.loads(claude_response)
    except json.JSONDecodeError:
        # Try to extract JSON from the response if Claude added extra text
        import re
        json_match = re.search(r'\{.*\}', claude_response, re.DOTALL)
        if json_match:
            result = json.loads(json_match.group())
        else:
            raise HTTPException(status_code=502, detail="Failed to parse AI risk analysis response")

    result["case_id"] = case_id
    return result
