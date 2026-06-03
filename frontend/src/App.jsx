import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VesselProvider } from './context/VesselContext';
import { VoyageProvider, useVoyages } from './context/VoyageContext';

// Styling Sheets
import './styles/variables.css';
import './styles/globals.css';
import './styles/dashboard.css';
import './styles/maps.css';
import './styles/reports.css';

// Base Layout Shells
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Login from './pages/auth/Login';
import { renderTab } from './routes/AppRoutes';

// Modals
import VesselDetailsModal from './components/modals/VesselDetailsModal';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const { voyages } = useVoyages();
  
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedVoyageId, setSelectedVoyageId] = useState('voyage-15');
  const [selectedVessel, setSelectedVessel] = useState(null);

  // Sync selectedVoyageId when voyages load from database
  useEffect(() => {
    if (voyages.length > 0 && selectedVoyageId === 'voyage-15') {
      const active = voyages.find(v => v.status === 'Active') || voyages[0];
      if (active) {
        setSelectedVoyageId(active.id);
      }
    }
  }, [voyages, selectedVoyageId]);

  // Switch tabs
  const renderTabContent = () => {
    return renderTab(currentTab, {
      setCurrentTab,
      onSelectVessel: (vessel) => setSelectedVessel(vessel),
      selectedVoyageId,
      setSelectedVoyageId
    });
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ backgroundColor: '#0b0f19', color: '#00f0ff' }}>
        <div className="spinner-border text-cyan mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading Fleet Command Center...</span>
        </div>
        <div style={{ fontSize: '13px', letterSpacing: '0.1em', fontWeight: 'bold' }}>VERIFYING CREDENTIALS...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setCurrentTab('dashboard')} />;
  }

  return (
    <div className="app-container">
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        isCollapsed={sidebarCollapsed} 
        setIsCollapsed={setSidebarCollapsed} 
      />
      <main className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Header />
        <div className="flex-grow-1">
          {renderTabContent()}
        </div>
        <Footer />
      </main>

      {/* Details modal overlay */}
      {selectedVessel && (
        <VesselDetailsModal 
          vessel={selectedVessel} 
          onClose={() => setSelectedVessel(null)} 
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <VesselProvider>
        <VoyageProvider>
          <AppContent />
        </VoyageProvider>
      </VesselProvider>
    </AuthProvider>
  );
}
