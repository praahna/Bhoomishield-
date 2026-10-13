import { calculatePropertyRisk } from '../services/riskEngineService.js';
import { dbStore } from '../config/db.js';

export function evaluateRisk(req, res) {
  try {
    const {
      propertyId,
      transferCount,
      documentMismatch,
      competingClaimsCount,
      recentTransferWithinMonths,
      verificationStatus,
      hasDuplicateSurvey,
    } = req.body;

    let params = {
      transferCount: Number(transferCount) || 1,
      documentMismatch: Boolean(documentMismatch),
      competingClaimsCount: Number(competingClaimsCount) || 0,
      recentTransferWithinMonths: Number(recentTransferWithinMonths) || 0,
      verificationStatus: verificationStatus || 'Verified',
      hasDuplicateSurvey: Boolean(hasDuplicateSurvey),
    };

    // If propertyId provided, load real property baseline if fields omitted
    if (propertyId) {
      const prop = dbStore.getPropertyById(propertyId);
      if (prop) {
        params = {
          transferCount: prop.transferCount,
          documentMismatch: prop.isDocumentMismatch || false,
          competingClaimsCount: prop.competingClaimsCount || 0,
          recentTransferWithinMonths: prop.recentTransferWithinMonths || 0,
          verificationStatus: prop.verificationStatus,
          hasDuplicateSurvey: false,
          hasActiveDispute: prop.isConflictFlagged,
          ...req.body,
        };
      }
    }

    const evaluation = calculatePropertyRisk(params);
    return res.json(evaluation);
  } catch (err) {
    return res.status(500).json({ error: 'Risk evaluation failed.' });
  }
}
