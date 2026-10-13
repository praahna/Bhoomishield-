import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbStore } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'bhoomishield_super_secure_jwt_secret_2026_key';

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = dbStore.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or credentials.' });
    }

    let isMatch = false;
    // Allow plain match for demo users or compare bcrypt hash
    if (user.plainPasswordForDemo && user.plainPasswordForDemo === password) {
      isMatch = true;
    } else if (user.password) {
      isMatch = await bcrypt.compare(password, user.password).catch(() => false);
      if (!isMatch && user.plainPasswordForDemo === password) isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department || null,
        phone: user.phone || null,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal authentication server error.' });
  }
}

export async function register(req, res) {
  try {
    const { name, email, password, role = 'citizen', phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = dbStore.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      role: role === 'authority' ? 'authority' : 'citizen',
      phone: phone || '',
      createdAt: new Date().toISOString()
    };

    dbStore.addUser(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Registration failed due to server error.' });
  }
}

export function getCurrentUser(req, res) {
  return res.json({ user: req.user });
}

export function getDemoCredentials(req, res) {
  return res.json({
    citizen: {
      email: 'citizen@bhoomishield.gov.in',
      password: 'citizen123',
      role: 'citizen',
      label: 'Citizen Demo (Priya Sharma)'
    },
    authority: {
      email: 'authority@bhoomishield.gov.in',
      password: 'admin123',
      role: 'authority',
      label: 'Authority Demo (K. Ramanathan - Revenue Officer)'
    }
  });
}
