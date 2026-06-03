import React from 'react';
import { useVoyages } from '../../context/VoyageContext';
import { ShieldAlert, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

export default function ClaimsAnalysis() {
  const { alerts, voyages } = useVoyages();

  const activeClaims = alerts.filter(a => 
    a.type === 'Speed Deficit' || 
    a.type === 'Speed Performance Alerts' || 
    a.type === 'Fuel Overconsumption' || 
    a.type === 'Fuel Alerts' ||
    a.type === 'Claim Alerts' ||
    a.type === 'Claim Alert'
  );
  const totalLoss = activeClaims.reduce((sum, c) => sum + c.estLoss, 0);

  const getAlertIcon = (type) => {
    return (type === 'Speed Deficit' || type === 'Speed Performance Alerts') ? 'badge-alert' : 'badge-anchor';
  };

  return (
    <div className="page-container">
      <div className="mb-4">
        <h2 className="text-cyan mb-1">COMMERCIAL CLAIMS & ALERTS GATEWAY</h2>
        <p className="text-secondary" style={{ fontSize: '12px' }}>Automatically flags speed deficits and fuel overconsumption during calm weather periods under charter party terms</p>
      </div>

      {/* KPI summaries */}
      <div className="dashboard-grid">
        <div className="glass-panel kpi-card">
          <div className="d-flex justify-content-between align-items-center">
            <span className="kpi-title">Active Claims Checked</span>
            <ShieldAlert className="text-danger" size={16} />
          </div>
          <span className="kpi-value text-danger">{activeClaims.length} Claims</span>
          <span className="kpi-subtext">Automated checks running</span>
        </div>

        <div className="glass-panel kpi-card">
          <div className="d-flex justify-content-between align-items-center">
            <span className="kpi-title">Commercial Exposure</span>
            <AlertTriangle className="text-warning" size={16} />
          </div>
          <span className="kpi-value text-warning">${totalLoss.toLocaleString()}</span>
          <span className="kpi-subtext">Estimated charterer claims value</span>
        </div>

        <div className="glass-panel kpi-card">
          <div className="d-flex justify-content-between align-items-center">
            <span className="kpi-title">Speed Claims Value</span>
            <FileText className="text-cyan" size={16} />
          </div>
          <span className="kpi-value text-cyan">
            ${activeClaims.filter(c => c.type === 'Speed Deficit' || c.type === 'Speed Performance Alerts').reduce((sum, c) => sum + c.estLoss, 0).toLocaleString()}
          </span>
          <span className="kpi-subtext">Deficits &gt; 0.5 kt in calm sea</span>
        </div>

        <div className="glass-panel kpi-card">
          <div className="d-flex justify-content-between align-items-center">
            <span className="kpi-title">Fuel Claims Value</span>
            <CheckCircle className="text-teal" size={16} />
          </div>
          <span className="kpi-value text-teal">
            ${activeClaims.filter(c => c.type === 'Fuel Overconsumption' || c.type === 'Fuel Alerts').reduce((sum, c) => sum + c.estLoss, 0).toLocaleString()}
          </span>
          <span className="kpi-subtext">Overconsumption &gt; limit MT</span>
        </div>
      </div>

      {/* Claims Table */}
      <div className="glass-panel mb-4">
        <div className="panel-title">
          <ShieldAlert size={14} className="text-cyan" />
          <span>Potential Commercial Charter Party Claims</span>
        </div>

        <div className="maritime-table-wrapper">
          <table className="maritime-table">
            <thead>
              <tr>
                <th>Claim Type</th>
                <th>Voyage Reference</th>
                <th>Vessel Name</th>
                <th>Sailing Variance</th>
                <th>Estimated Loss (USD)</th>
                <th>Verification Status</th>
              </tr>
            </thead>
            <tbody>
              {activeClaims.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-secondary text-center py-4" style={{ fontSize: '11px' }}>
                    No active commercial claims or alerts detected.
                  </td>
                </tr>
              ) : (
                activeClaims.map(claim => (
                  <tr key={claim.id}>
                    <td className="fw-bold text-danger">
                      <AlertTriangle size={12} className="me-1 text-danger" /> {claim.type}
                    </td>
                    <td>{claim.voyageNumber}</td>
                    <td className="fw-bold">{claim.vessel}</td>
                    <td>{claim.issue}</td>
                    <td className="fw-bold text-warning">${claim.estLoss.toLocaleString()}</td>
                    <td>
                      <span className="badge badge-alert">Pending Signoff</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notifications Logger */}
      <div className="glass-panel">
        <div className="panel-title">
          <AlertTriangle size={14} className="text-cyan" />
          <span>Operator Real-Time Alert Log</span>
        </div>
        <div className="d-flex flex-column gap-2.5">
          {alerts.length === 0 ? (
            <div className="text-secondary text-center py-4" style={{ fontSize: '11px' }}>
              No real-time alerts logged.
            </div>
          ) : (
            alerts.map(a => (
              <div key={a.id} className="alert-card-item warning d-flex justify-content-between align-items-center py-2.5 px-3">
                <div>
                  <span className="fw-bold me-2" style={{ color: 'var(--color-cyan)' }}>[{a.type}]</span>
                  <span>{a.vessel} on {a.voyageNumber}: {a.issue}</span>
                </div>
                <span className="text-muted" style={{ fontSize: '10px' }}>{a.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
