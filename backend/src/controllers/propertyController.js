import crypto from 'crypto';
import { dbStore } from '../config/db.js';
import { blockchainService } from '../services/blockchainService.js';
import { calculatePropertyRisk } from '../services/riskEngineService.js';

export function getAllProperties(req, res) {
  try {
    const { search, status, riskLevel } = req.query;
    const properties = dbStore.getAllProperties({ search, status, riskLevel });
    return res.json({
      count: properties.length,
      properties,
    });
  } catch (err) {
    console.error('Error fetching properties:', err);
    return res.status(500).json({ error: 'Failed to retrieve properties.' });
  }
}

export function getPropertyById(req, res) {
  try {
    const { id } = req.params;
    const property = dbStore.getPropertyById(id);

    if (!property) {
      return res.status(404).json({ error: `Property record '${id}' was not found in the registry.` });
    }

    // Fetch related blockchain transactions and audit timeline
    const transactions = dbStore.getTransactionsByProperty(property.propertyId);

    // Calculate dynamic risk analysis breakdown
    const riskAnalysis = calculatePropertyRisk({
      transferCount: property.transferCount || transactions.length || 1,
      documentMismatch: property.isDocumentMismatch || false,
      competingClaimsCount: property.competingClaimsCount || 0,
      recentTransferWithinMonths: property.recentTransferWithinMonths || 0,
      verificationStatus: property.verificationStatus,
      hasActiveDispute: property.isConflictFlagged,
      isSimulatedConflict: property.isConflictFlagged,
    });

    return res.json({
      property,
      transactions,
      riskAnalysis,
    });
  } catch (err) {
    console.error('Error fetching property details:', err);
    return res.status(500).json({ error: 'Failed to retrieve property details.' });
  }
}

export async function registerProperty(req, res) {
  try {
    const {
      ownerName,
      propertyType,
      surveyNumber,
      address,
      city,
      state = 'Karnataka',
      pinCode,
      areaSqFt,
      registrationNumber,
      purchaseDate,
      description,
      documentHash: providedHash,
      documentName,
    } = req.body;

    if (!ownerName || !surveyNumber || !address || !city) {
      return res.status(400).json({
        error: 'Owner name, survey number, address, and city are mandatory.'
      });
    }

    // Generate property ID if not specified
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const propertyId = `PROP-${randomNum}`;

    // Compute or validate SHA-256 document hash
    const documentHash = providedHash || crypto.createHash('sha256').update(`${propertyId}:${surveyNumber}:${Date.now()}`).digest('hex');

    // Initial Risk Assessment
    const initialRisk = calculatePropertyRisk({
      transferCount: 1,
      documentMismatch: false,
      competingClaimsCount: 0,
      recentTransferWithinMonths: 0,
      verificationStatus: 'Pending',
    });

    const newProperty = {
      propertyId,
      ownerName,
      ownerContact: req.user?.phone || '+91 90000 00000',
      propertyType: propertyType || 'Residential Apartment',
      surveyNumber,
      address,
      city,
      state,
      pinCode: pinCode || '560001',
      areaSqFt: Number(areaSqFt) || 1200,
      registrationNumber: registrationNumber || `KA-BLR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
      description: description || 'New property parcel submitted for registration and title audit.',
      documentHash,
      documentName: documentName || 'TitleDeed_Uploaded.pdf',
      verificationStatus: 'Pending',
      riskScore: initialRisk.riskScore,
      riskLevel: initialRisk.riskLevel,
      isConflictFlagged: false,
      conflictDetails: null,
      transferCount: 1,
      recentTransferWithinMonths: 0,
      competingClaimsCount: 0,
      hasActiveDispute: false,
      registeredBy: req.user?.email || 'citizen@bhoomishield.gov.in',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to database
    dbStore.addProperty(newProperty);

    // Record on Blockchain Ledger
    const blockchainTx = await blockchainService.recordGenesisProperty({
      propertyId,
      surveyNumber,
      ownerName,
      documentHash,
    });

    dbStore.addTransaction(blockchainTx);

    return res.status(201).json({
      message: 'Property successfully registered and anchored to blockchain ledger.',
      property: newProperty,
      blockchainTx,
      riskAnalysis: initialRisk,
    });
  } catch (err) {
    console.error('Error registering property:', err);
    return res.status(500).json({ error: 'Property registration failed.' });
  }
}

/**
 * Conflict Simulation Endpoint (Requirement 5.I and 9)
 * Selects PROP-10234 (Priya Sharma).
 * Claimant: Rahul Verma.
 * Detects mismatch, prevents transfer, flags property, creates authority alert.
 */
export async function simulateConflict(req, res) {
  try {
    const targetPropertyId = req.body.propertyId || 'PROP-10234';
    const claimantName = req.body.claimantName || 'Rahul Verma';
    const attemptedAction = req.body.action || 'Attempted Conveyance Transfer';

    const property = dbStore.getPropertyById(targetPropertyId);
    if (!property) {
      return res.status(404).json({ error: `Target property ${targetPropertyId} not found.` });
    }

    const recordedOwner = property.ownerName;

    // Verify ownership match
    const isConflict = recordedOwner.toLowerCase() !== claimantName.toLowerCase();

    if (isConflict) {
      // 1. Flag property
      const conflictDetails = {
        claimantName,
        attemptedAction,
        recordedOwner,
        detectedAt: new Date().toISOString(),
        reason: `CRITICAL TITLE MISMATCH: Party '${claimantName}' attempted to execute a deed conveyance, but recorded legal title belongs to '${recordedOwner}'.`,
        riskEscalation: 'Risk elevated to HIGH (Score 88). Transfer blocked by BhoomiShield smart logic.',
        courtJurisdiction: 'Bengaluru District Civil Court & Sub-Registrar Indiranagar'
      };

      // Recalculate High Risk
      const updatedRisk = calculatePropertyRisk({
        transferCount: property.transferCount + 1,
        documentMismatch: true,
        competingClaimsCount: 1,
        recentTransferWithinMonths: 1,
        verificationStatus: 'Flagged',
        hasActiveDispute: true,
        isSimulatedConflict: true,
      });

      dbStore.updateProperty(property.propertyId, {
        isConflictFlagged: true,
        conflictDetails,
        verificationStatus: 'Flagged',
        riskScore: updatedRisk.riskScore,
        riskLevel: updatedRisk.riskLevel,
      });

      // 2. Prevent the recorded owner from changing! Recorded owner remains Priya Sharma.

      // 3. Create authority alert in Alert Center
      const newAlert = {
        alertId: `ALT-CONF-${Date.now().toString().slice(-5)}`,
        propertyId: property.propertyId,
        propertyTitle: `${property.propertyType}, ${property.city} (${property.surveyNumber})`,
        recordedOwner,
        claimantName,
        alertType: 'Ownership Conflict',
        severity: 'HIGH',
        description: `Unauthorized conveyance attempt by '${claimantName}'. Ownership mismatch detected against recorded title holder '${recordedOwner}'. Transfer automatically locked.`,
        status: 'Active',
        remarks: [
          {
            author: 'BhoomiShield Automated Conflict Sentinel',
            timestamp: new Date().toISOString(),
            comment: `Automated lock engaged. Transaction halted. Legal notice dispatched.`
          }
        ],
        createdAt: new Date().toISOString()
      };
      dbStore.addAlert(newAlert);

      // 4. Record dispute log on blockchain
      const blockchainRecord = await blockchainService.recordDisputeFlag({
        propertyId: property.propertyId,
        recordedOwner,
        claimantName,
        reason: conflictDetails.reason,
      });
      dbStore.addTransaction(blockchainRecord);

      return res.json({
        conflictDetected: true,
        status: 'BLOCKED_AND_FLAGGED',
        message: `Ownership conflict detected! Transfer blocked. Legal title remains securely with ${recordedOwner}. Property has been flagged for Authority review.`,
        property: dbStore.getPropertyById(targetPropertyId),
        alert: newAlert,
        blockchainRecord,
        riskAnalysis: updatedRisk,
      });
    } else {
      return res.json({
        conflictDetected: false,
        message: 'Claimant matches recorded owner. No conflict triggered.',
      });
    }
  } catch (err) {
    console.error('Error simulating conflict:', err);
    return res.status(500).json({ error: 'Conflict simulation failed.' });
  }
}

/**
 * Reset Demo Scenario: Returns PROP-10234 back to LOW risk verified state
 */
export function resetConflictScenario(req, res) {
  try {
    const targetPropertyId = 'PROP-10234';
    dbStore.updateProperty(targetPropertyId, {
      ownerName: 'Priya Sharma',
      verificationStatus: 'Verified',
      riskScore: 12,
      riskLevel: 'LOW',
      isConflictFlagged: false,
      conflictDetails: null,
      competingClaimsCount: 0,
      hasActiveDispute: false,
    });

    // Remove any simulation alerts
    dbStore.alerts = dbStore.alerts.filter(a => !a.alertId.startsWith('ALT-CONF-'));

    return res.json({
      message: 'Demo scenario successfully reset to pristine state.',
      property: dbStore.getPropertyById(targetPropertyId),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reset scenario.' });
  }
}

/**
 * Authority Dashboard Statistics
 */
export function getAuthorityStats(req, res) {
  try {
    const all = dbStore.getAllProperties();
    const totalProperties = all.length;
    const verifiedProperties = all.filter(p => p.verificationStatus === 'Verified').length;
    const pendingReviews = all.filter(p => p.verificationStatus === 'Pending').length;
    const flaggedProperties = all.filter(p => p.isConflictFlagged || p.verificationStatus === 'Flagged').length;
    const highRiskProperties = all.filter(p => p.riskLevel === 'HIGH').length;
    const mediumRiskProperties = all.filter(p => p.riskLevel === 'MEDIUM').length;
    const lowRiskProperties = all.filter(p => p.riskLevel === 'LOW').length;

    const allAlerts = dbStore.getAllAlerts();
    const activeAlerts = allAlerts.filter(a => a.status === 'Active').length;

    return res.json({
      totalProperties,
      verifiedProperties,
      pendingReviews,
      flaggedProperties,
      highRiskProperties,
      mediumRiskProperties,
      lowRiskProperties,
      activeAlerts,
      riskDistribution: [
        { name: 'Low Risk', value: lowRiskProperties, color: '#10b981' },
        { name: 'Medium Risk', value: mediumRiskProperties, color: '#f59e0b' },
        { name: 'High Risk', value: highRiskProperties, color: '#ef4444' },
      ],
      monthlyTrends: [
        { month: 'Oct 2025', verified: 3, flagged: 0 },
        { month: 'Nov 2025', verified: 5, flagged: 1 },
        { month: 'Dec 2025', verified: 8, flagged: 0 },
        { month: 'Jan 2026', verified: 12, flagged: 2 },
        { month: 'Feb 2026', verified: 14, flagged: 1 },
        { month: 'Mar 2026', verified: 19, flagged: 2 },
      ]
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to calculate authority statistics.' });
  }
}
