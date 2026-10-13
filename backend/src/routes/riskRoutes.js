import express from 'express';
import { evaluateRisk } from '../controllers/riskController.js';

const router = express.Router();

router.post('/evaluate', evaluateRisk);

export default router;
