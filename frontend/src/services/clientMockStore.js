/**
 * BhoomiShield Client-Side Demo Data & Fallback Store
 * Enables 100% interactive functionality on static hosts (Netlify, Vercel, GitHub Pages)
 * when a separate Node.js backend server is not hosted or temporarily unreachable.
 */

const defaultProperties = [
  {
    propertyId: 'PROP-10234',
    ownerName: 'Priya Sharma',
    ownerContact: '+91 98450 12345',
    propertyType: 'Residential Villa',
    surveyNumber: 'SY-402/1A',
    address: 'Plot 42, 14th Main, 4th Cross, Defence Colony, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560038',
    areaSqFt: 2400,
    registrationNumber: 'KA-BLR-2023-8901',
    purchaseDate: '2023-08-14',
    description: 'Corner 3BHK duplex villa with clear khata A certificate, approved BDA layout plan.',
    documentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    documentName: 'SaleDeed_PriyaSharma_2023.pdf',
    verificationStatus: 'Verified',
    riskScore: 12,
    riskLevel: 'LOW',
    isConflictFlagged: false,
    conflictDetails: null,
    transferCount: 1,
    recentTransferWithinMonths: 0,
    competingClaimsCount: 0,
    hasActiveDispute: false,
    createdAt: '2023-08-15T10:00:00Z',
    updatedAt: '2023-08-15T10:00:00Z'
  },
  {
    propertyId: 'PROP-44321',
    ownerName: 'Arun Kumar',
    ownerContact: '+91 97412 88319',
    propertyType: 'Commercial Plot',
    surveyNumber: 'SY-812/B',
    address: 'Survey 812, Sector 2, 27th Main, HSR Layout',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560102',
    areaSqFt: 3800,
    registrationNumber: 'KA-BLR-2024-1142',
    purchaseDate: '2024-09-02',
    description: 'Commercial zoned corner parcel adjacent to outer ring road transit hub.',
    documentHash: '5f4dcc3b5aa765d61d8327deb882cf992b9699aaf83424cb4d2f80c6563d7624',
    documentName: 'ConveyanceDeed_ArunKumar_2024.pdf',
    verificationStatus: 'Pending',
    riskScore: 48,
    riskLevel: 'MEDIUM',
    isConflictFlagged: false,
    conflictDetails: null,
    transferCount: 3,
    recentTransferWithinMonths: 2,
    competingClaimsCount: 0,
    hasActiveDispute: false,
    createdAt: '2024-09-03T11:20:00Z',
    updatedAt: '2024-09-03T11:20:00Z'
  },
  {
    propertyId: 'PROP-9087',
    ownerName: 'Meena Rao',
    ownerContact: '+91 94481 44521',
    propertyType: 'Agricultural Land',
    surveyNumber: 'SY-109/4C',
    address: 'Old Madras Road, Immadihalli Post, Whitefield',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560066',
    areaSqFt: 43560,
    registrationNumber: 'KA-BLR-2022-7711',
    purchaseDate: '2022-11-20',
    description: 'One acre agricultural land holding under conversion scrutiny for residential development.',
    documentHash: 'a2b8e23901b0987fecbc6870a41d082c5a143b8c9834125bcf82049e390234a1',
    documentName: 'RTC_PattaDeed_MeenaRao_2022.pdf',
    verificationStatus: 'Flagged',
    riskScore: 87,
    riskLevel: 'HIGH',
    isConflictFlagged: true,
    conflictDetails: {
      claimantName: 'Apex Realty Developers Syndicate',
      conflictType: 'Adverse Possession & Duplicate Power of Attorney',
      flaggedDate: '2026-02-14',
      status: 'In Civil Court Review'
    },
    transferCount: 5,
    recentTransferWithinMonths: 4,
    competingClaimsCount: 2,
    hasActiveDispute: true,
    createdAt: '2022-11-22T14:15:00Z',
    updatedAt: '2026-02-14T16:30:00Z'
  },
  {
    propertyId: 'PROP-7712',
    ownerName: 'Kiran R',
    ownerContact: '+91 99002 77112',
    propertyType: 'Residential Apartment',
    surveyNumber: 'SY-661/2',
    address: 'Flat 304, Emerald Heights, 9th Cross, Jayanagar 4th Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560011',
    areaSqFt: 1650,
    registrationNumber: 'KA-BLR-2021-3329',
    purchaseDate: '2021-04-18',
    description: '3BHK apartment in BBMP approved residential enclave with individual khata certificates.',
    documentHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    documentName: 'TitleDeed_KiranR_2021.pdf',
    verificationStatus: 'Verified',
    riskScore: 8,
    riskLevel: 'LOW',
    isConflictFlagged: false,
    conflictDetails: null,
    transferCount: 1,
    recentTransferWithinMonths: 0,
    competingClaimsCount: 0,
    hasActiveDispute: false,
    createdAt: '2021-04-20T09:00:00Z',
    updatedAt: '2021-04-20T09:00:00Z'
  },
  {
    propertyId: 'PROP-55321',
    ownerName: 'Anil Kumar',
    ownerContact: '+91 98451 99014',
    propertyType: 'Commercial Complex',
    surveyNumber: 'SY-334/1',
    address: 'Building 18, Jyoti Nivas College Road, Koramangala 5th Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '560095',
    areaSqFt: 6200,
    registrationNumber: 'KA-BLR-2024-9908',
    purchaseDate: '2024-05-10',
    description: 'Ground plus three floor commercial office building leased to technology co-working operator.',
    documentHash: '14092b34918e90e722cd11822c19927efefaf5e7488099684ad463d1a67a0528',
    documentName: 'Encumbrance_Title_AnilKumar_2024.pdf',
    verificationStatus: 'Pending',
    riskScore: 56,
    riskLevel: 'MEDIUM',
    isConflictFlagged: false,
    conflictDetails: null,
    transferCount: 2,
    recentTransferWithinMonths: 5,
    competingClaimsCount: 0,
    hasActiveDispute: false,
    createdAt: '2024-05-12T13:40:00Z',
    updatedAt: '2024-05-12T13:40:00Z'
  }
];

const defaultTransactions = [
  {
    transactionId: 'TX-1001',
    propertyId: 'PROP-10234',
    blockNumber: 18492001,
    txHash: '0x8f192b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852a',
    fromOwner: 'Government Revenue Survey Dept (Genesis Parcel)',
    toOwner: 'Priya Sharma',
    transactionType: 'Genesis Registration',
    documentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    timestamp: '2023-08-15T10:00:00Z',
    status: 'Confirmed',
    confirmations: 384
  },
  {
    transactionId: 'TX-2001',
    propertyId: 'PROP-44321',
    blockNumber: 18492015,
    txHash: '0x3a4b91c890123def456789abcde0123456789abcdef0123456789abcdef01234',
    fromOwner: 'Suresh Hegde',
    toOwner: 'Vikas Builders Pvt Ltd',
    transactionType: 'Ownership Transfer',
    documentHash: '4a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
    timestamp: '2024-03-10T14:22:00Z',
    status: 'Confirmed',
    confirmations: 240
  },
  {
    transactionId: 'TX-2002',
    propertyId: 'PROP-44321',
    blockNumber: 18492028,
    txHash: '0x5f4dcc3b5aa765d61d8327deb882cf992b9699aaf83424cb4d2f80c6563d7624',
    fromOwner: 'Vikas Builders Pvt Ltd',
    toOwner: 'Arun Kumar',
    transactionType: 'Ownership Transfer',
    documentHash: '5f4dcc3b5aa765d61d8327deb882cf992b9699aaf83424cb4d2f80c6563d7624',
    timestamp: '2024-09-03T11:20:00Z',
    status: 'Confirmed',
    confirmations: 96
  },
  {
    transactionId: 'TX-3001',
    propertyId: 'PROP-9087',
    blockNumber: 18492035,
    txHash: '0x99a1b2c3d4e5f6789abcdef0123456789abcdef0123456789abcdef012345678',
    fromOwner: 'Govindappa Family Trust',
    toOwner: 'Meena Rao',
    transactionType: 'Ownership Transfer',
    documentHash: 'a2b8e23901b0987fecbc6870a41d082c5a143b8c9834125bcf82049e390234a1',
    timestamp: '2022-11-22T14:15:00Z',
    status: 'Confirmed',
    confirmations: 620
  },
  {
    transactionId: 'TX-4001',
    propertyId: 'PROP-7712',
    blockNumber: 18492005,
    txHash: '0x771290abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    fromOwner: 'Emerald Housing Society',
    toOwner: 'Kiran R',
    transactionType: 'Genesis Registration',
    documentHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    timestamp: '2021-04-20T09:00:00Z',
    status: 'Confirmed',
    confirmations: 940
  },
  {
    transactionId: 'TX-5001',
    propertyId: 'PROP-55321',
    blockNumber: 18492019,
    txHash: '0x55321abcdef0123456789abcdef0123456789abcdef0123456789abcdef012345',
    fromOwner: 'Naveen Reddy Estates',
    toOwner: 'Anil Kumar',
    transactionType: 'Ownership Transfer',
    documentHash: '14092b34918e90e722cd11822c19927efefaf5e7488099684ad463d1a67a0528',
    timestamp: '2024-05-12T13:40:00Z',
    status: 'Confirmed',
    confirmations: 180
  }
];

const defaultAlerts = [
  {
    alertId: 'ALT-9087-01',
    propertyId: 'PROP-9087',
    propertyTitle: '1 Acre Agricultural Land, Whitefield (SY-109/4C)',
    recordedOwner: 'Meena Rao',
    claimantName: 'Apex Realty Developers Syndicate',
    alertType: 'Ownership Conflict',
    severity: 'HIGH',
    description: 'Competing claimant attempted to submit unregistered Power of Attorney for property mutation while Meena Rao holds certified Khathedar title.',
    status: 'Active',
    remarks: [
      {
        author: 'K. Ramanathan (Revenue Officer)',
        timestamp: '2026-02-15T10:15:00Z',
        comment: 'Issued notice to claimant to produce original registered title deed.'
      }
    ],
    createdAt: '2026-02-14T16:30:00Z'
  },
  {
    alertId: 'ALT-44321-02',
    propertyId: 'PROP-44321',
    propertyTitle: 'Commercial Plot, HSR Layout (SY-812/B)',
    recordedOwner: 'Arun Kumar',
    claimantName: 'System Heuristic Monitor',
    alertType: 'Suspicious Transfer Velocity',
    severity: 'MEDIUM',
    description: '3 title conveyances recorded within 18 months. Requires verification of seller consideration receipts and chain of deeds.',
    status: 'Under Review',
    remarks: [
      {
        author: 'System Auto-Rule',
        timestamp: '2024-09-04T08:00:00Z',
        comment: 'Velocity threshold triggered (>2 transfers in 24 months).'
      }
    ],
    createdAt: '2024-09-04T08:00:00Z'
  }
];

class ClientMockStore {
  constructor() {
    this.loadState();
  }

  loadState() {
    try {
      const storedProps = localStorage.getItem('bhoomishield_properties');
      this.properties = storedProps ? JSON.parse(storedProps) : JSON.parse(JSON.stringify(defaultProperties));
      const storedTxs = localStorage.getItem('bhoomishield_transactions');
      this.transactions = storedTxs ? JSON.parse(storedTxs) : JSON.parse(JSON.stringify(defaultTransactions));
      const storedAlerts = localStorage.getItem('bhoomishield_alerts');
      this.alerts = storedAlerts ? JSON.parse(storedAlerts) : JSON.parse(JSON.stringify(defaultAlerts));
    } catch (_) {
      this.properties = JSON.parse(JSON.stringify(defaultProperties));
      this.transactions = JSON.parse(JSON.stringify(defaultTransactions));
      this.alerts = JSON.parse(JSON.stringify(defaultAlerts));
    }
  }

  saveState() {
    try {
      localStorage.setItem('bhoomishield_properties', JSON.stringify(this.properties));
      localStorage.setItem('bhoomishield_transactions', JSON.stringify(this.transactions));
      localStorage.setItem('bhoomishield_alerts', JSON.stringify(this.alerts));
    } catch (_) {}
  }

  getProperty(idOrSurvey) {
    if (!idOrSurvey) return null;
    const q = idOrSurvey.trim().toUpperCase();
    return this.properties.find(
      (p) =>
        p.propertyId?.toUpperCase() === q ||
        p.surveyNumber?.toUpperCase() === q ||
        p.registrationNumber?.toUpperCase() === q ||
        p.ownerName?.toUpperCase().includes(q)
    );
  }

  getRiskAnalysis(prop) {
    const isConflict = prop.isConflictFlagged;
    const score = isConflict ? 95 : (prop.riskScore || 15);
    const level = isConflict ? 'HIGH' : (prop.riskLevel || 'LOW');

    return {
      riskScore: score,
      riskLevel: level,
      recommendation: isConflict
        ? 'HIGH RISK WARNING: Active conflicting ownership claim or deed mismatch detected. Title transfer locked.'
        : level === 'HIGH'
        ? 'HIGH LITIGATION RISK: Overlapping boundary or elevated dispute history. Exercise extreme caution.'
        : level === 'MEDIUM'
        ? 'MODERATE RISK: Rapid turnover recorded in last 18 months. Perform physical encumbrance check.'
        : 'LOW RISK: Clean title deed with clear chain of ownership and matching cryptographic hashes.',
      factors: [
        {
          factor: isConflict ? 'Competing Ownership Claim' : 'Historical Title Chain',
          description: isConflict
            ? 'Active title contest logged by unauthorized claimant.'
            : `Clean conveyance history with ${prop.transferCount || 1} recorded transfers.`,
          weight: isConflict ? '+35' : '0',
          severity: isConflict ? 'CRITICAL' : 'LOW'
        },
        {
          factor: 'Document SHA-256 Anchoring',
          description: 'Document hash verified against immutable blockchain registry.',
          weight: '0',
          severity: 'LOW'
        }
      ]
    };
  }

  normalizeUrl(rawUrl) {
    if (!rawUrl) return '/';
    let path = rawUrl;
    // Extract pathname if URL is absolute
    try {
      if (rawUrl.includes('://')) {
        path = new URL(rawUrl).pathname;
      }
    } catch (_) {}
    path = path.split('?')[0];
    // Remove /api prefix if present
    path = path.replace(/^\/api/, '');
    if (!path.startsWith('/')) path = '/' + path;
    return path;
  }

  handleRequest(method, rawUrl, data = {}) {
    const cleanUrl = this.normalizeUrl(rawUrl);
    const m = (method || 'GET').toUpperCase();

    // GET /properties/stats
    if (cleanUrl === '/properties/stats') {
      return {
        totalProperties: this.properties.length,
        verifiedProperties: this.properties.filter(p => p.verificationStatus === 'Verified').length,
        pendingReviews: this.properties.filter(p => p.verificationStatus === 'Pending').length,
        flaggedProperties: this.properties.filter(p => p.isConflictFlagged || p.verificationStatus === 'Flagged').length,
        highRiskProperties: this.properties.filter(p => p.riskLevel === 'HIGH').length,
        activeAlerts: this.alerts.filter(a => a.status === 'Active').length,
        riskDistribution: [
          { name: 'Low Risk', value: 2, color: '#10b981' },
          { name: 'Medium Risk', value: 2, color: '#f59e0b' },
          { name: 'High Risk', value: 1, color: '#ef4444' },
        ],
        monthlyTrends: [
          { month: 'Nov 2025', verified: 5, flagged: 1 },
          { month: 'Dec 2025', verified: 8, flagged: 0 },
          { month: 'Jan 2026', verified: 12, flagged: 2 },
          { month: 'Feb 2026', verified: 14, flagged: 1 },
        ]
      };
    }

    // GET /properties/:id
    if (cleanUrl.startsWith('/properties/') && m === 'GET') {
      const id = cleanUrl.replace('/properties/', '');
      const prop = this.getProperty(decodeURIComponent(id));
      if (!prop) {
        throw { response: { status: 404, data: { error: `Property record '${id}' not found in registry.` } } };
      }
      const propTxs = this.transactions.filter(t => t.propertyId === prop.propertyId);
      return {
        property: prop,
        transactions: propTxs.length > 0 ? propTxs : [
          {
            transactionId: `TX-GEN-${prop.propertyId}`,
            propertyId: prop.propertyId,
            blockNumber: 18492040,
            txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
            fromOwner: 'Genesis Government Registry',
            toOwner: prop.ownerName,
            transactionType: 'Genesis Registration',
            documentHash: prop.documentHash,
            timestamp: prop.createdAt || new Date().toISOString(),
            status: 'Confirmed',
            confirmations: 12
          }
        ],
        riskAnalysis: this.getRiskAnalysis(prop)
      };
    }

    // GET /properties
    if (cleanUrl === '/properties' && m === 'GET') {
      return { count: this.properties.length, properties: this.properties };
    }

    // POST /properties/register
    if (cleanUrl === '/properties/register' && m === 'POST') {
      const newId = `PROP-${Math.floor(10000 + Math.random() * 90000)}`;
      const newProp = {
        propertyId: newId,
        ownerName: data.ownerName || 'Verified Citizen',
        ownerContact: '+91 98450 11223',
        propertyType: data.propertyType || 'Residential Villa',
        surveyNumber: data.surveyNumber || 'SY-100',
        address: data.address || 'Bengaluru',
        city: data.city || 'Bengaluru',
        state: data.state || 'Karnataka',
        pinCode: data.pinCode || '560001',
        areaSqFt: Number(data.areaSqFt) || 2000,
        registrationNumber: data.registrationNumber || `KA-BLR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        purchaseDate: data.purchaseDate || new Date().toISOString().split('T')[0],
        documentHash: data.documentHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        documentName: data.documentName || 'TitleDeed_Executed.pdf',
        verificationStatus: 'Pending',
        riskScore: 12,
        riskLevel: 'LOW',
        isConflictFlagged: false,
        transferCount: 1,
        createdAt: new Date().toISOString()
      };

      this.properties.unshift(newProp);

      const genesisTx = {
        transactionId: `TX-GEN-${Date.now()}`,
        propertyId: newId,
        blockNumber: 18492050,
        txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        fromOwner: 'Revenue Cadastral Allotment',
        toOwner: newProp.ownerName,
        transactionType: 'Genesis Registration',
        documentHash: newProp.documentHash,
        timestamp: new Date().toISOString(),
        status: 'Confirmed',
        confirmations: 12
      };
      this.transactions.unshift(genesisTx);

      this.saveState();

      return {
        message: 'Property successfully anchored to blockchain ledger.',
        property: newProp,
        blockchainTx: genesisTx,
        riskAnalysis: this.getRiskAnalysis(newProp)
      };
    }

    // POST /properties/simulate-conflict
    if (cleanUrl === '/properties/simulate-conflict' && m === 'POST') {
      const prop = this.getProperty('PROP-10234') || this.properties[0];
      prop.isConflictFlagged = true;
      prop.verificationStatus = 'Flagged';
      prop.riskScore = 95;
      prop.riskLevel = 'HIGH';
      prop.conflictDetails = {
        claimantName: 'Rahul Verma',
        recordedOwner: 'Priya Sharma',
        reason: 'CRITICAL TITLE MISMATCH: Party Rahul Verma attempted to execute a deed conveyance, but recorded legal title belongs to Priya Sharma.'
      };

      const newAlert = {
        alertId: `ALT-CONF-${Date.now().toString().slice(-4)}`,
        propertyId: prop.propertyId,
        propertyTitle: `${prop.propertyType}, ${prop.city}`,
        recordedOwner: 'Priya Sharma',
        claimantName: 'Rahul Verma',
        alertType: 'Ownership Conflict',
        severity: 'HIGH',
        description: 'Unauthorized conveyance attempt by Rahul Verma. Ownership mismatch detected against recorded title holder Priya Sharma.',
        status: 'Active',
        remarks: [{ author: 'BhoomiShield Sentinel', timestamp: new Date().toISOString(), comment: 'Automated lock engaged.' }],
        createdAt: new Date().toISOString()
      };
      this.alerts.unshift(newAlert);
      this.saveState();

      return {
        conflictDetected: true,
        status: 'BLOCKED_AND_FLAGGED',
        message: 'Ownership conflict detected! Transfer blocked. Legal title remains securely with Priya Sharma.',
        property: prop,
        alert: newAlert
      };
    }

    // POST /properties/reset-conflict
    if (cleanUrl === '/properties/reset-conflict' && m === 'POST') {
      const prop = this.getProperty('PROP-10234');
      if (prop) {
        prop.isConflictFlagged = false;
        prop.verificationStatus = 'Verified';
        prop.riskScore = 12;
        prop.riskLevel = 'LOW';
        prop.conflictDetails = null;
      }
      this.alerts = this.alerts.filter(a => !a.alertId?.startsWith('ALT-CONF-'));
      this.saveState();
      return { message: 'Demo scenario reset to pristine state.', property: prop };
    }

    // GET /blockchain/records
    if (cleanUrl === '/blockchain/records') {
      return {
        status: { modeLabel: 'Deterministic Blockchain Demo Mode', latestBlock: 18492050, contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3' },
        records: this.transactions
      };
    }

    // POST /blockchain/verify-document
    if (cleanUrl === '/blockchain/verify-document') {
      const prop = this.getProperty(data.propertyId);
      const isMatch = prop && prop.documentHash?.toLowerCase() === data.documentHash?.toLowerCase();
      return {
        isMatch,
        explanation: isMatch
          ? 'Document SHA-256 matches the registered cryptographic fingerprint on the BhoomiShield ledger.'
          : 'CRITICAL ALERT: Submitted document hash differs from the tamper-evident hash stored on-chain.'
      };
    }

    // POST /risk/evaluate
    if (cleanUrl === '/risk/evaluate') {
      let score = 5;
      if (data.transferCount > 4) score += 25;
      else if (data.transferCount >= 3) score += 15;
      if (data.documentMismatch) score += 30;
      if (data.competingClaimsCount > 0) score += 30;
      if (data.recentTransferWithinMonths > 0 && data.recentTransferWithinMonths <= 6) score += 15;
      if (data.verificationStatus === 'Flagged') score += 25;
      else if (data.verificationStatus === 'Pending') score += 10;
      if (data.hasDuplicateSurvey) score += 30;

      const finalScore = Math.min(100, Math.max(0, score));
      const level = finalScore <= 30 ? 'LOW' : finalScore <= 60 ? 'MEDIUM' : 'HIGH';

      return {
        riskScore: finalScore,
        riskLevel: level,
        recommendation: level === 'HIGH' ? 'HIGH RISK WARNING: High probability of litigation.' : 'Verified stable parcel profile.',
        factors: [
          { factor: 'Transfer Velocity', description: `${data.transferCount} recorded transfers.`, weight: '+15', severity: 'MEDIUM' }
        ]
      };
    }

    // GET /alerts
    if (cleanUrl === '/alerts') {
      return { count: this.alerts.length, alerts: this.alerts };
    }

    // POST /auth/login
    if (cleanUrl === '/auth/login') {
      return {
        token: 'demo-jwt-token-2026',
        user: { name: 'Priya Sharma', email: data.email || 'citizen@bhoomishield.gov.in', role: 'citizen' }
      };
    }

    return { success: true };
  }
}

export const clientMockStore = new ClientMockStore();
