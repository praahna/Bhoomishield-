# BhoomiShield — Responsive Blockchain Property Verification & Litigation Prevention Platform

> **“Verify Property. Secure Ownership. Prevent Disputes.”**

BhoomiShield is an engineering ideathon-grade full-stack web application designed to eliminate fraudulent real-estate conveyances, duplicate power-of-attorney sales, and conflicting land claims before they escalate into multi-decade civil court litigations.

Built with a mobile-first responsive architecture using **React, Vite, Tailwind CSS, Node.js, Express, Solidity, and an explainable AI Litigation Risk Engine**.

---

## 🌟 Key Capabilities & Architectural Pillars

1. **Mobile-First Responsive Design (320px – 1920px)**:
   - **Desktop**: Collapsible sidebar, multi-column dashboard metrics, analytics charts, spacious cadastral data tables.
   - **Mobile Phones**: Compact header, sliding mobile navigation drawer, vertical chronological timelines, tap-friendly touch targets (min 44px), cardified data views without horizontal overflow.
2. **Tamper-Evident Blockchain Smart Contract (`PropertyRegistry.sol`)**:
   - Stores immutable ownership conveyance logs, survey mutation references, and administrative caveats.
   - **Off-Chain Security Guarantee**: Confidential deeds are hashed client-side with SHA-256 and never stored as raw documents on a public ledger.
   - Transparent **Deterministic Blockchain Demo Mode** clearly distinguishes simulated zero-gas ledger logs from live testnet operations.
3. **Explainable AI Litigation Risk Engine**:
   - Multi-factor heuristic scoring (0–100) calibrated into **LOW (0–30)**, **MEDIUM (31–60)**, and **HIGH (61–100)**.
   - Traceable weights for ownership transfer velocity, document cryptographic mismatches, competing caveat counts, recent conveyance recency, and overlapping survey parcels.
4. **Live Conflict Simulation Engine**:
   - Instant interactive test scenario on **PROP-10234** (Priya Sharma).
   - Simulates a rogue transfer attempt by claimant **Rahul Verma**.
   - BhoomiShield detects the mismatch, engages an automated lock, escalates the risk score to HIGH (95/100), halts the transfer, logs the dispute on blockchain, and dispatches an authority alert to the Alert Center.

---

## 📱 Tested Breakpoints & Screen Sizes

| Viewport Category | Width | Device Examples | Status |
|-------------------|-------|-----------------|--------|
| Small Mobile      | 320px | iPhone SE (1st gen) | ✅ Verified (No horizontal overflow) |
| Standard Mobile   | 375px | iPhone 12/13/14 mini, SE | ✅ Verified (Full touch drawers) |
| Large Mobile      | 390px | iPhone 14/15 Pro | ✅ Verified |
| Tablet            | 768px | iPad Mini, iPad Air | ✅ Verified |
| Desktop           | 1024px| Small Laptops | ✅ Verified (Sidebar collapsible) |
| Widescreen PC     | 1366px / 1920px | Full HD / 2K Monitors | ✅ Verified (Spacious grids) |

---

## 🚀 Quick Start Guide (Local PC Development)

### Prerequisites
- **Node.js**: v18.0.0 or later (Tested on Node v24.16.0)
- **npm**: v9.0.0 or later (Tested on npm 11.13.0)

### 1. Repository Directory Structure
```
bhoomishield-app/
├── backend/                  # Node.js + Express API Server
│   ├── contracts/            # Solidity Smart Contract (PropertyRegistry.sol)
│   ├── src/
│   │   ├── config/           # Database (Live MongoDB or In-Memory Store)
│   │   ├── controllers/      # Auth, Property, Blockchain, Risk, Alerts
│   │   ├── middleware/       # JWT auth & role validation
│   │   ├── routes/           # REST endpoints
│   │   ├── seed/             # 5 Preloaded sample properties & demo accounts
│   │   └── services/         # Blockchain ledger & AI Risk Engine
│   ├── server.js             # Express entry point (0.0.0.0:5000)
│   ├── .env.example
│   └── package.json
├── frontend/                 # React 19 + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── components/       # Navbar, Sidebar, MobileDrawer, Footer, RiskBadge, SimulateConflictModal
│   │   ├── context/          # AuthContext (Citizen & Authority role switching)
│   │   ├── pages/            # 11 Responsive Application Pages
│   │   └── services/         # Centralized api.js client (No hardcoded localhost)
│   ├── .env.development
│   ├── .env.production
│   ├── .env.example
│   └── package.json
└── README.md
```

### 2. Configure Environment Files

#### Backend:
In `backend/`, copy `.env.example` to `.env`:
```bash
cd backend
cp .env.example .env
```
Default `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bhoomishield
JWT_SECRET=bhoomishield_super_secure_jwt_secret_2026_key
FRONTEND_ORIGIN=http://localhost:5173
NODE_ENV=development
```
*(Note: If MongoDB daemon is not running locally, BhoomiShield automatically engages its high-performance in-memory datastore with pre-seeded demo records!)*

#### Frontend:
In `frontend/`, check `.env.development`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
And `.env.production`:
```env
VITE_API_BASE_URL=https://your-deployed-backend-domain.com/api
```

### 3. Run Backend Server
```bash
cd backend
npm install
npm start
```
*Backend listens on `http://0.0.0.0:5000`. Health check available at `http://localhost:5000/api/health`.*

### 4. Run Frontend Development Server
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```
*Vite dev server will start at `http://localhost:5173`.*

---

## 📲 Testing on Physical Mobile Phone (Same Wi-Fi)

To test BhoomiShield directly on your physical smartphone over local Wi-Fi:

1. **Find your PC's Local Network IP Address**:
   - On Windows: Run `ipconfig` in PowerShell and look for **IPv4 Address** (e.g., `192.168.1.45` or `172.16.7.91`).
   - On macOS/Linux: Run `ifconfig` or `ip a`.
2. **Configure Frontend Environment Variable**:
   In `frontend/.env.development`:
   ```env
   VITE_API_BASE_URL=http://<YOUR_PC_LAN_IP>:5000/api
   ```
   *(e.g., `VITE_API_BASE_URL=http://172.16.7.91:5000/api`)*
3. **Restart the Vite Server**:
   > ⚠️ **Important**: Changing a Vite environment variable requires stopping and restarting Vite (`npm run dev -- --host 0.0.0.0`).
4. **Allow Windows Firewall**:
   Ensure ports `5000` (Node API) and `5173` (Vite Frontend) are permitted through Windows Defender Firewall.
5. **Open Phone Browser**:
   Connect your smartphone to the same Wi-Fi and navigate to:
   ```
   http://<YOUR_PC_LAN_IP>:5173
   ```

---

## 🔑 Demo Access Credentials

The platform includes 1-click quick login buttons on the Login page and Navbar for frictionless ideathon evaluation:

| Role | Email | Password | Pre-loaded Name & Authority |
|------|-------|----------|-----------------------------|
| **Citizen Demo** | `citizen@bhoomishield.gov.in` | `citizen123` | Priya Sharma (Owner of PROP-10234) |
| **Authority Demo** | `authority@bhoomishield.gov.in` | `admin123` | K. Ramanathan (Revenue Officer & Sub-Registrar) |

---

## 📋 Sample Pre-Loaded Land Parcels

1. **PROP-10234** — Priya Sharma — **LOW Risk (12/100)** — Status: `Verified`
   - *Survey:* SY-402/1A (Indiranagar, Bengaluru)
   - *Target for Conflict Simulation*: Demonstrates unauthorized conveyance detection.
2. **PROP-44321** — Arun Kumar — **MEDIUM Risk (48/100)** — Status: `Pending`
   - *Survey:* SY-812/B (HSR Layout, Bengaluru)
   - *Risk Factor:* Elevated transfer velocity (3 transfers in 18 months).
3. **PROP-9087** — Meena Rao — **HIGH Risk (87/100)** — Status: `Flagged`
   - *Survey:* SY-109/4C (Whitefield, Bengaluru)
   - *Risk Factor:* Competing Power of Attorney claim by developer syndicate.
4. **PROP-7712** — Kiran R — **LOW Risk (8/100)** — Status: `Verified`
   - *Survey:* SY-661/2 (Jayanagar, Bengaluru)
   - *Risk Factor:* Clean residential title with single genesis allotment.
5. **PROP-55321** — Anil Kumar — **MEDIUM Risk (56/100)** — Status: `Pending`
   - *Survey:* SY-334/1 (Koramangala, Bengaluru)
   - *Risk Factor:* Commercial complex with pending sub-registrar mutation audit.

---

## 🛠️ API Endpoints Summary

All frontend calls route through the centralized Axios client (`frontend/src/services/api.js`).

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Service health status check |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT |
| `POST` | `/api/auth/register` | Register new citizen account |
| `GET` | `/api/properties` | Query properties with filters |
| `GET` | `/api/properties/:id` | Fetch parcel details, timeline & risk breakdown |
| `POST` | `/api/properties/register` | Mint new property parcel on blockchain |
| `POST` | `/api/properties/simulate-conflict` | Execute live title conflict demonstration |
| `POST` | `/api/properties/reset-conflict` | Reset PROP-10234 back to pristine state |
| `GET` | `/api/properties/stats` | Authority registry metrics & distribution |
| `GET` | `/api/blockchain/records` | Explorer view of all block receipts |
| `POST` | `/api/blockchain/verify-document` | Compare document SHA-256 against ledger |
| `POST` | `/api/risk/evaluate` | Explainable AI risk factor calculator |
| `GET` | `/api/alerts` | Query active caveats & conflict alerts |
| `PATCH` | `/api/alerts/:id/status` | Adjudicate alert (Under Review / Resolved) |
| `POST` | `/api/alerts/:id/remarks` | Add official sub-registrar inquiry notes |

---

## ⚖️ Legal & Cryptographic Disclaimer

BhoomiShield's cryptographic SHA-256 deed hashing and blockchain immutability guarantee that registered document copies cannot be tampered with or replaced retroactively without immediate algorithmic detection. Formal legal ownership rights remain subject to jurisdictional cadastral revenue surveys and official state Sub-Registrar stamp act protocols.
