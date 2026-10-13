/**
 * BhoomiShield Explainable AI Risk Engine
 * Multi-factor algorithmic risk assessment for property litigation and fraudulent conveyance prevention.
 *
 * Factors evaluated:
 * 1. Number of ownership transfers (velocity)
 * 2. Document SHA-256 mismatch count
 * 3. Competing ownership claims / dispute history
 * 4. Recent transaction frequency (< 180 days)
 * 5. Registry verification status
 * 6. Duplicate survey number or overlapping boundary flags
 */

export function calculatePropertyRisk({
  transferCount = 1,
  documentMismatch = false,
  competingClaimsCount = 0,
  recentTransferWithinMonths = 0,
  verificationStatus = 'Verified',
  hasDuplicateSurvey = false,
  hasActiveDispute = false,
  isSimulatedConflict = false,
}) {
  let score = 0;
  const factors = [];

  // Base confidence score
  let baseScore = 5;
  score += baseScore;

  // Factor 1: Transfer velocity
  if (transferCount > 4) {
    score += 25;
    factors.push({
      factor: 'High Transfer Velocity',
      weight: '+25',
      severity: 'HIGH',
      description: `Property has been transferred ${transferCount} times, indicating speculative flipping or shell conveyancing.`
    });
  } else if (transferCount >= 3) {
    score += 15;
    factors.push({
      factor: 'Elevated Transfer Frequency',
      weight: '+15',
      severity: 'MEDIUM',
      description: `Property transferred ${transferCount} times in its recorded lifecycle.`
    });
  } else {
    factors.push({
      factor: 'Normal Transfer History',
      weight: '0',
      severity: 'LOW',
      description: `Stable ownership pattern with ${transferCount} recorded transfer(s).`
    });
  }

  // Factor 2: Document Hash Discrepancy
  if (documentMismatch) {
    score += 30;
    factors.push({
      factor: 'Cryptographic Document Mismatch',
      weight: '+30',
      severity: 'CRITICAL',
      description: 'Submitted document SHA-256 hash does not match the immutable ledger hash on the blockchain.'
    });
  }

  // Factor 3: Competing Claims / Adverse Possession Claims
  if (competingClaimsCount > 0 || isSimulatedConflict) {
    const claimWeight = Math.min(35, competingClaimsCount * 20 || 30);
    score += claimWeight;
    factors.push({
      factor: 'Competing Ownership Claims',
      weight: `+${claimWeight}`,
      severity: 'CRITICAL',
      description: `Active third-party dispute or unverified mutation claim detected on this survey record.`
    });
  }

  // Factor 4: Recent Transaction Recency (< 6 months)
  if (recentTransferWithinMonths > 0 && recentTransferWithinMonths <= 6) {
    score += 15;
    factors.push({
      factor: 'Recent Transaction Velocity',
      weight: '+15',
      severity: 'MEDIUM',
      description: `Property changed hands within the last ${recentTransferWithinMonths} months.`
    });
  }

  // Factor 5: Verification Status
  if (verificationStatus === 'Flagged' || hasActiveDispute) {
    score += 25;
    factors.push({
      factor: 'Administrative Flag Status',
      weight: '+25',
      severity: 'HIGH',
      description: 'Revenue authority or sub-registrar has placed an administrative hold or dispute flag on this parcel.'
    });
  } else if (verificationStatus === 'Pending') {
    score += 10;
    factors.push({
      factor: 'Pending Physical Verification',
      weight: '+10',
      severity: 'MEDIUM',
      description: 'Field survey geo-tagging and sub-registrar physical deed match are pending verification.'
    });
  }

  // Factor 6: Duplicate survey number flag
  if (hasDuplicateSurvey) {
    score += 30;
    factors.push({
      factor: 'Duplicate Survey Claim',
      weight: '+30',
      severity: 'CRITICAL',
      description: 'Survey number matches another active parcel registration with a conflicting revenue boundary.'
    });
  }

  // Clamp score to 0 - 100
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));

  let riskLevel = 'LOW';
  let badgeColor = 'emerald';
  let recommendation = 'Low risk profile. Title deeds, cryptographic hashes, and revenue mutations are clear.';

  if (finalScore >= 61) {
    riskLevel = 'HIGH';
    badgeColor = 'rose';
    recommendation = 'HIGH RISK WARNING: High probability of litigation, conflicting title deed, or fraudulent transfer attempt. Do NOT disburse payments without judicial and sub-registrar clearance.';
  } else if (finalScore >= 31) {
    riskLevel = 'MEDIUM';
    badgeColor = 'amber';
    recommendation = 'MODERATE RISK: Noticeable title turnover or incomplete field survey verification. Verify encumbrance certificates dating back 30 years before executing deed.';
  }

  return {
    riskScore: finalScore,
    riskLevel,
    badgeColor,
    recommendation,
    engineType: 'Rule-Based Explainable Litigation Risk Engine v2.4 (Simulated ML Calibration)',
    evaluatedAt: new Date().toISOString(),
    factors,
  };
}
