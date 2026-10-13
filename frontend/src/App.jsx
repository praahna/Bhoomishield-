import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MobileDrawer from './components/MobileDrawer';
import Footer from './components/Footer';
import SimulateConflictModal from './components/SimulateConflictModal';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CitizenDashboard from './pages/CitizenDashboard';
import PropertyRegistrationPage from './pages/PropertyRegistrationPage';
import PropertyVerificationPage from './pages/PropertyVerificationPage';
import OwnershipHistoryPage from './pages/OwnershipHistoryPage';
import BlockchainRecordsPage from './pages/BlockchainRecordsPage';
import RiskAnalysisPage from './pages/RiskAnalysisPage';
import AuthorityDashboard from './pages/AuthorityDashboard';
import AlertCenterPage from './pages/AlertCenterPage';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [conflictModalOpen, setConflictModalOpen] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased overflow-x-hidden">
          {/* Top Navbar */}
          <Navbar
            onOpenMobileMenu={() => setMobileDrawerOpen(true)}
            onOpenConflictModal={() => setConflictModalOpen(true)}
          />

          {/* Mobile Drawer (Slide-in) */}
          <MobileDrawer
            isOpen={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
            onOpenConflictModal={() => setConflictModalOpen(true)}
          />

          {/* Interactive Global Conflict Simulation Modal */}
          <SimulateConflictModal
            isOpen={conflictModalOpen}
            onClose={() => setConflictModalOpen(false)}
          />

          {/* Main Layout Area: Desktop Sidebar + Content */}
          <div className="flex-1 flex w-full">
            <Sidebar
              isCollapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
              <div className="flex-1">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <LandingPage onOpenConflictModal={() => setConflictModalOpen(true)} />
                    }
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/dashboard"
                    element={
                      <CitizenDashboard onOpenConflictModal={() => setConflictModalOpen(true)} />
                    }
                  />
                  <Route path="/register-property" element={<PropertyRegistrationPage />} />
                  <Route path="/verify" element={<PropertyVerificationPage />} />
                  <Route path="/history" element={<OwnershipHistoryPage />} />
                  <Route path="/blockchain" element={<BlockchainRecordsPage />} />
                  <Route path="/risk-analysis" element={<RiskAnalysisPage />} />
                  <Route path="/authority" element={<AuthorityDashboard />} />
                  <Route path="/alerts" element={<AlertCenterPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>

              {/* Responsive Footer */}
              <Footer />
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
