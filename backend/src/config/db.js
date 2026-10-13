import mongoose from 'mongoose';
import { initialUsers, initialProperties, initialTransactions, initialAlerts } from '../seed/sampleData.js';

// In-Memory Fallback Store to guarantee 100% reliable execution out-of-the-box
export class InMemoryStore {
  constructor() {
    this.users = [...initialUsers];
    this.properties = JSON.parse(JSON.stringify(initialProperties));
    this.transactions = JSON.parse(JSON.stringify(initialTransactions));
    this.alerts = JSON.parse(JSON.stringify(initialAlerts));
    this.isInMemory = true;
  }

  // Properties
  getAllProperties(filter = {}) {
    let list = [...this.properties];
    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(p =>
        p.propertyId.toLowerCase().includes(q) ||
        p.surveyNumber.toLowerCase().includes(q) ||
        p.registrationNumber.toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
      );
    }
    if (filter.status) {
      list = list.filter(p => p.verificationStatus.toLowerCase() === filter.status.toLowerCase());
    }
    if (filter.riskLevel) {
      list = list.filter(p => p.riskLevel.toLowerCase() === filter.riskLevel.toLowerCase());
    }
    return list;
  }

  getPropertyById(id) {
    if (!id) return null;
    const cleanId = id.trim().toUpperCase();
    return this.properties.find(p =>
      p.propertyId.toUpperCase() === cleanId ||
      p.surveyNumber.toUpperCase() === cleanId ||
      p.registrationNumber.toUpperCase() === cleanId
    );
  }

  addProperty(propertyData) {
    this.properties.unshift(propertyData);
    return propertyData;
  }

  updateProperty(id, updateData) {
    const idx = this.properties.findIndex(p => p.propertyId === id);
    if (idx !== -1) {
      this.properties[idx] = { ...this.properties[idx], ...updateData, updatedAt: new Date().toISOString() };
      return this.properties[idx];
    }
    return null;
  }

  // Transactions
  getTransactionsByProperty(propertyId) {
    if (!propertyId) return [...this.transactions];
    return this.transactions.filter(t => t.propertyId === propertyId);
  }

  getAllTransactions() {
    return [...this.transactions];
  }

  addTransaction(tx) {
    this.transactions.unshift(tx);
    return tx;
  }

  // Alerts
  getAllAlerts(status) {
    let list = [...this.alerts];
    if (status) {
      list = list.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }
    return list;
  }

  getAlertById(alertId) {
    return this.alerts.find(a => a.alertId === alertId);
  }

  addAlert(alertData) {
    this.alerts.unshift(alertData);
    return alertData;
  }

  updateAlert(alertId, updateData) {
    const idx = this.alerts.findIndex(a => a.alertId === alertId);
    if (idx !== -1) {
      this.alerts[idx] = { ...this.alerts[idx], ...updateData };
      return this.alerts[idx];
    }
    return null;
  }

  // Users
  getUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id) {
    return this.users.find(u => u.id === id);
  }

  addUser(userData) {
    this.users.push(userData);
    return userData;
  }
}

export const dbStore = new InMemoryStore();

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bhoomishield';
  try {
    // Attempt Mongoose connection with 3-second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('[BhoomiShield DB] Successfully connected to live MongoDB server.');
    return true;
  } catch (err) {
    console.warn(
      `[BhoomiShield DB Warning] MongoDB server unavailable at ${uri}. Engaging high-performance in-memory datastore with full demo dataset.`
    );
    return false;
  }
}
