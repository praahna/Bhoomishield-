import express from 'express';
import { getAllAlerts, getAlertById, addRemark, updateAlertStatus } from '../controllers/alertController.js';

const router = express.Router();

router.get('/', getAllAlerts);
router.get('/:alertId', getAlertById);
router.post('/:alertId/remarks', addRemark);
router.patch('/:alertId/status', updateAlertStatus);

export default router;
