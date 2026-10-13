import { dbStore } from '../config/db.js';

export function getAllAlerts(req, res) {
  try {
    const { status } = req.query;
    const alerts = dbStore.getAllAlerts(status);
    return res.json({
      count: alerts.length,
      alerts,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve alerts.' });
  }
}

export function getAlertById(req, res) {
  try {
    const { alertId } = req.params;
    const alert = dbStore.getAlertById(alertId);
    if (!alert) {
      return res.status(404).json({ error: `Alert ${alertId} not found.` });
    }
    return res.json(alert);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve alert.' });
  }
}

export function addRemark(req, res) {
  try {
    const { alertId } = req.params;
    const { comment, author } = req.body;

    if (!comment) {
      return res.status(400).json({ error: 'Comment text is required.' });
    }

    const alert = dbStore.getAlertById(alertId);
    if (!alert) {
      return res.status(404).json({ error: `Alert ${alertId} not found.` });
    }

    const newRemark = {
      author: author || req.user?.name || 'Authorized Officer',
      comment,
      timestamp: new Date().toISOString(),
    };

    alert.remarks.push(newRemark);
    return res.json({ message: 'Remark added successfully', alert });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to add remark.' });
  }
}

export function updateAlertStatus(req, res) {
  try {
    const { alertId } = req.params;
    const { status, remarks } = req.body;

    const alert = dbStore.getAlertById(alertId);
    if (!alert) {
      return res.status(404).json({ error: `Alert ${alertId} not found.` });
    }

    const updateData = { status };
    if (status === 'Resolved') {
      updateData.resolvedAt = new Date().toISOString();
      updateData.resolvedBy = req.user?.name || 'Authority Reviewer';

      // Also unflag the property if alert resolved
      const prop = dbStore.getPropertyById(alert.propertyId);
      if (prop && prop.isConflictFlagged) {
        dbStore.updateProperty(prop.propertyId, {
          isConflictFlagged: false,
          verificationStatus: 'Verified',
          riskScore: 22,
          riskLevel: 'LOW',
        });
      }
    }

    if (remarks) {
      alert.remarks.push({
        author: req.user?.name || 'Authorized Officer',
        comment: remarks,
        timestamp: new Date().toISOString()
      });
    }

    const updated = dbStore.updateAlert(alertId, updateData);
    return res.json({ message: `Alert status updated to ${status}`, alert: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update alert.' });
  }
}
