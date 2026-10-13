import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import propertyRoutes from './src/routes/propertyRoutes.js';
import blockchainRoutes from './src/routes/blockchainRoutes.js';
import riskRoutes from './src/routes/riskRoutes.js';
import alertRoutes from './src/routes/alertRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration - Allows configured frontend origin, LAN IPs, and localhost
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://10.0.2.2:5173', // Android emulator host
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Allow any local network IP for mobile testing (e.g., 192.168.x.x, 10.x.x.x, 172.x.x.x)
    if (
      allowedOrigins.includes(origin) ||
      /^http:\/\/192\.168\.\d+\.\d+:\d+$/.test(origin) ||
      /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/.test(origin) ||
      /^http:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+:\d+$/.test(origin) ||
      process.env.NODE_ENV === 'development'
    ) {
      return callback(null, true);
    }
    return callback(new Error('CORS request blocked by BhoomiShield policy'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// Request parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Standard Health-Check Endpoint (GET /api/health)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'BhoomiShield Property Verification & Risk Engine API',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/alerts', alertRoutes);

// 404 Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `API endpoint '${req.originalUrl}' not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[BhoomiShield Unhandled Server Error]:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected internal server error occurred.',
  });
});

// Initialize database and start server
async function startServer() {
  await connectDB();
  app.listen(PORT, HOST, () => {
    console.log(`=======================================================`);
    console.log(`🛡️  BhoomiShield API Server running on http://${HOST}:${PORT}`);
    console.log(`📡 Health check available at: http://${HOST}:${PORT}/api/health`);
    console.log(`🌐 Ready to accept desktop, tablet, and mobile connections`);
    console.log(`=======================================================`);
  });
}

startServer();
