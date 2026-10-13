import express from 'express';
import { getBlockchainRecords, getBlockchainStatus, verifyDocumentHash } from '../controllers/blockchainController.js';

const router = express.Router();

router.get('/records', getBlockchainRecords);
router.get('/status', getBlockchainStatus);
router.post('/verify-document', verifyDocumentHash);

export default router;
