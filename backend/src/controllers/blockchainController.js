import crypto from 'crypto';
import { dbStore } from '../config/db.js';
import { blockchainService } from '../services/blockchainService.js';

export function getBlockchainRecords(req, res) {
  try {
    const { propertyId } = req.query;
    const records = dbStore.getTransactionsByProperty(propertyId);
    const status = blockchainService.getStatus();

    return res.json({
      status,
      count: records.length,
      records,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve blockchain records.' });
  }
}

export function getBlockchainStatus(req, res) {
  return res.json(blockchainService.getStatus());
}

/**
 * Document Verification Endpoint
 * Compares an uploaded document hash against the registered blockchain hash
 */
export function verifyDocumentHash(req, res) {
  try {
    const { propertyId, documentHash, documentContent } = req.body;

    if (!propertyId) {
      return res.status(400).json({ error: 'Property ID is required.' });
    }

    const property = dbStore.getPropertyById(propertyId);
    if (!property) {
      return res.status(404).json({ error: `Property ${propertyId} not found.` });
    }

    let calculatedHash = documentHash;
    if (!calculatedHash && documentContent) {
      calculatedHash = crypto.createHash('sha256').update(documentContent).digest('hex');
    }

    if (!calculatedHash) {
      return res.status(400).json({ error: 'Either documentHash or documentContent must be provided.' });
    }

    const recordedHash = property.documentHash;
    const isMatch = recordedHash.toLowerCase() === calculatedHash.toLowerCase();

    return res.json({
      propertyId: property.propertyId,
      surveyNumber: property.surveyNumber,
      recordedOwner: property.ownerName,
      submittedHash: calculatedHash,
      recordedBlockchainHash: recordedHash,
      isMatch,
      status: isMatch ? 'CRYPTOGRAPHICALLY_VERIFIED' : 'HASH_MISMATCH_SUSPICIOUS',
      explanation: isMatch
        ? 'Document SHA-256 matches the registered cryptographic fingerprint on the BhoomiShield ledger. Note: Cryptographic hash match confirms document integrity; legal validity also requires official cadastral revenue inspection.'
        : 'CRITICAL ALERT: Submitted document hash differs from the tamper-evident hash stored on-chain. Possible deed alteration, forged mutation, or stale survey draft detected!',
      verifiedAt: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Document verification failed.' });
  }
}
