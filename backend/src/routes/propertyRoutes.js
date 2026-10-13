import express from 'express';
import {
  getAllProperties,
  getPropertyById,
  registerProperty,
  simulateConflict,
  resetConflictScenario,
  getAuthorityStats
} from '../controllers/propertyController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllProperties);
router.get('/stats', getAuthorityStats);
router.get('/:id', getPropertyById);
router.post('/register', registerProperty); // optionally authenticated, works with demo
router.post('/simulate-conflict', simulateConflict);
router.post('/reset-conflict', resetConflictScenario);

export default router;
