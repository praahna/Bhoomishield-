import jwt from 'jsonwebtoken';
import { dbStore } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'bhoomishield_super_secure_jwt_secret_2026_key';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Missing Bearer token.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = dbStore.getUserById(decoded.id) || decoded;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }
}

export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access forbidden. Action requires role: ${allowedRoles.join(' or ')}.`
      });
    }
    next();
  };
}
