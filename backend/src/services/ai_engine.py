"""
BhoomiShield AI Litigation Risk Prediction Microservice
Framework: FastAPI + Scikit-learn / Rule Engine
Calculates multi-dimensional property litigation probabilities.
"""

from typing import Optional, List, Dict, Any
from datetime import datetime

# Rule weights calibrated from historical property litigation datasets
WEIGHT_TRANSFER_VELOCITY = 25
WEIGHT_DOCUMENT_MISMATCH = 30
WEIGHT_COMPETING_CLAIMS = 35
WEIGHT_RECENCY = 15
WEIGHT_FLAGGED_STATUS = 25
WEIGHT_DUPLICATE_SURVEY = 30

def predict_litigation_risk(
    transfer_count: int = 1,
    document_mismatch: bool = False,
    competing_claims_count: int = 0,
    recent_transfer_within_months: int = 0,
    verification_status: str = "Verified",
    has_duplicate_survey: bool = False
) -> Dict[str, Any]:
    score = 5 # baseline
    factors = []

    # 1. Transfer velocity
    if transfer_count > 4:
        score += WEIGHT_TRANSFER_VELOCITY
        factors.append({
            "factor": "High Transfer Velocity",
            "weight": f"+{WEIGHT_TRANSFER_VELOCITY}",
            "severity": "HIGH",
            "description": f"Property transferred {transfer_count} times, indicating rapid speculative or fraudulent turnover."
        })
    elif transfer_count >= 3:
        score += 15
        factors.append({
            "factor": "Elevated Transfer Frequency",
            "weight": "+15",
            "severity": "MEDIUM",
            "description": f"Property transferred {transfer_count} times in recorded ledger."
        })

    # 2. Document hash mismatch
    if document_mismatch:
        score += WEIGHT_DOCUMENT_MISMATCH
        factors.append({
            "factor": "Cryptographic Deed Mismatch",
            "weight": f"+{WEIGHT_DOCUMENT_MISMATCH}",
            "severity": "CRITICAL",
            "description": "Uploaded deed SHA-256 hash does not match immutable blockchain registry."
        })

    # 3. Competing claims
    if competing_claims_count > 0:
        added = min(WEIGHT_COMPETING_CLAIMS, competing_claims_count * 20)
        score += added
        factors.append({
            "factor": "Active Competing Claims",
            "weight": f"+{added}",
            "severity": "CRITICAL",
            "description": f"{competing_claims_count} unresolved mutation claims detected."
        })

    # 4. Recent transfers
    if 0 < recent_transfer_within_months <= 6:
        score += WEIGHT_RECENCY
        factors.append({
            "factor": "Recent Conveyance Recency",
            "weight": f"+{WEIGHT_RECENCY}",
            "severity": "MEDIUM",
            "description": f"Transferred within past {recent_transfer_within_months} months."
        })

    # 5. Status
    if verification_status.lower() == "flagged":
        score += WEIGHT_FLAGGED_STATUS
        factors.append({
            "factor": "Disputed Regulatory Status",
            "weight": f"+{WEIGHT_FLAGGED_STATUS}",
            "severity": "HIGH",
            "description": "Administrative stay or court caveat lodged."
        })

    # 6. Duplicate survey
    if has_duplicate_survey:
        score += WEIGHT_DUPLICATE_SURVEY
        factors.append({
            "factor": "Duplicate Survey Parcel",
            "weight": f"+{WEIGHT_DUPLICATE_SURVEY}",
            "severity": "CRITICAL",
            "description": "Boundary matches existing active deed in revenue records."
        })

    final_score = min(100, max(0, score))
    risk_level = "LOW" if final_score <= 30 else ("MEDIUM" if final_score <= 60 else "HIGH")

    return {
        "risk_score": final_score,
        "risk_level": risk_level,
        "factors": factors,
        "model_version": "BhoomiShield-RiskEngine-v2.4",
        "evaluated_at": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    test_result = predict_litigation_risk(transfer_count=5, document_mismatch=True, competing_claims_count=1)
    print("Test AI Risk Score:", test_result)
