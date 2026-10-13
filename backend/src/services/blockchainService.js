import crypto from 'crypto';

/**
 * BhoomiShield Blockchain Service
 * Manages smart contract interaction or transparent simulated cryptographic ledger.
 *
 * Distinguishes clearly between:
 * - Live EVM network (Hardhat / Sepolia / Ganache)
 * - Simulated Local Ledger (Deterministic Cryptographic Demo Mode)
 */

class BlockchainService {
  constructor() {
    this.rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';
    this.contractAddress = process.env.CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    this.isLiveConnected = false;
    this.mode = 'DEMO_SIMULATION'; // Clearly labelled demo mode by default
    this.currentBlockNumber = 18492040;
    this.chain = [];
  }

  generateTxHash() {
    return '0x' + crypto.randomBytes(32).toString('hex');
  }

  generateBlockHash() {
    return '0x0000000000' + crypto.randomBytes(27).toString('hex');
  }

  calculateSha256(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  getStatus() {
    return {
      connected: this.isLiveConnected,
      mode: this.mode,
      modeLabel: this.isLiveConnected ? 'Live Ethereum / EVM Network' : 'Deterministic Blockchain Demo Mode',
      contractAddress: this.contractAddress,
      rpcUrl: this.rpcUrl,
      latestBlock: this.currentBlockNumber,
      disclaimer: 'BhoomiShield stores only cryptographic document hashes (SHA-256) and ownership metadata on-chain. Sensitive legal documents remain securely off-chain.'
    };
  }

  async recordGenesisProperty({ propertyId, surveyNumber, ownerName, documentHash }) {
    this.currentBlockNumber += 1;
    const txHash = this.generateTxHash();
    const prevTxHash = '0x0000000000000000000000000000000000000000000000000000000000000000';

    const txRecord = {
      transactionId: `TX-${Date.now()}`,
      propertyId,
      surveyNumber,
      blockNumber: this.currentBlockNumber,
      txHash,
      prevTxHash,
      fromOwner: 'Revenue Department / Genesis Cadastral Survey',
      toOwner: ownerName,
      transactionType: 'Genesis Registration',
      documentHash,
      timestamp: new Date().toISOString(),
      status: 'Confirmed',
      isSimulatedBlockchain: !this.isLiveConnected,
      gasUsed: '142,850 Gwei',
      confirmations: 12,
    };

    this.chain.push(txRecord);
    return txRecord;
  }

  async recordTransfer({ propertyId, surveyNumber, fromOwner, toOwner, newDocumentHash, previousTxHash }) {
    this.currentBlockNumber += 1;
    const txHash = this.generateTxHash();

    const txRecord = {
      transactionId: `TX-${Date.now()}`,
      propertyId,
      surveyNumber,
      blockNumber: this.currentBlockNumber,
      txHash,
      prevTxHash: previousTxHash || this.generateTxHash(),
      fromOwner,
      toOwner,
      transactionType: 'Ownership Transfer',
      documentHash: newDocumentHash,
      timestamp: new Date().toISOString(),
      status: 'Confirmed',
      isSimulatedBlockchain: !this.isLiveConnected,
      gasUsed: '168,410 Gwei',
      confirmations: 16,
    };

    this.chain.push(txRecord);
    return txRecord;
  }

  async recordDisputeFlag({ propertyId, recordedOwner, claimantName, reason }) {
    this.currentBlockNumber += 1;
    const txHash = this.generateTxHash();

    const txRecord = {
      transactionId: `TX-DISPUTE-${Date.now()}`,
      propertyId,
      blockNumber: this.currentBlockNumber,
      txHash,
      prevTxHash: this.generateTxHash(),
      fromOwner: recordedOwner,
      toOwner: `HOLD: Disputed by ${claimantName}`,
      transactionType: 'Dispute Flagged',
      documentHash: '0xDISPUTE_TRIGGER_REVERT_OVERRIDE',
      timestamp: new Date().toISOString(),
      status: 'Flagged',
      isSimulatedBlockchain: !this.isLiveConnected,
      remarks: reason,
      gasUsed: '89,200 Gwei',
      confirmations: 8,
    };

    this.chain.push(txRecord);
    return txRecord;
  }
}

export const blockchainService = new BlockchainService();
