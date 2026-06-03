import React from 'react';
import { X, Ship, Compass, ShieldAlert, Calendar, AlertTriangle } from 'lucide-react';
import { useVoyages } from '../../context/VoyageContext';

export default function VesselDetailsModal({ vessel, onClose }) {
  const { voyages, alerts } = useVoyages() || { voyages: [], alerts: [] };
  if (!vessel) return null;

  // Filter voyages and alerts for this specific vessel
  const vesselVoyages = voyages.filter(v => v.vesselId === vessel.id || v.vesselName === vessel.name);
  const vesselAlerts = alerts.filter(a => a.vesselId === vessel.id || a.vessel === vessel.name);

  // Claims calculations
  const claimAlerts = vesselAlerts.filter(a => 
    a.type === 'Speed Deficit' || 
    a.type === 'Speed Performance Alerts' || 
    a.type === 'Fuel Overconsumption' || 
    a.type === 'Fuel Alerts' ||
    a.type === 'Claim Alerts' ||
    a.type === 'Claim Alert'
  );
  const claimsCount = claimAlerts.length;
  const totalClaimsLoss = claimAlerts.reduce((sum, a) => sum + a.estLoss, 0);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-teal';
    if (score >= 80) return 'text-cyan';
    return 'text-amber';
  };

  return (
    <div className="position-fixed top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.7)', zIndex: 1000 }}>
      <div className="glass-panel text-start position-relative animate-fadeIn" style={{ maxWidth: '680px', width: '100%', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
        <button 
          className="position-absolute top-0 end-0 mt-3 me-3 text-cyan btn btn-secondary p-1"
          onClick={onClose}
        >
          <X size={16} />
        </button>

        <div className="d-flex align-items-center gap-2.5 mb-3 border-bottom border-maritime pb-2">
          <Ship className="text-cyan" size={24} />
          <h3 className="text-cyan mb-0">{vessel.name}</h3>
          <span className="badge badge-sea ms-auto">{vessel.status}</span>
        </div>

        {/* Scores segment */}
        <div className="glass-panel mb-3 py-2.5" style={{ background: 'rgba(0, 240, 255, 0.02)' }}>
          <div className="row d-flex justify-content-around text-center">
            <div className="flex-fill">
              <span className="text-secondary d-block" style={{ fontSize: '9px' }}>OVERALL</span>
              <strong className={`fs-5 ${getScoreColor(vessel.overallScore)}`}>{vessel.overallScore}%</strong>
            </div>
            <div className="flex-fill">
              <span className="text-secondary d-block" style={{ fontSize: '9px' }}>SPEED SCORE</span>
              <strong className={`fs-5 ${getScoreColor(vessel.speedScore)}`}>{vessel.speedScore}%</strong>
            </div>
            <div className="flex-fill">
              <span className="text-secondary d-block" style={{ fontSize: '9px' }}>FUEL SCORE</span>
              <strong className={`fs-5 ${getScoreColor(vessel.fuelScore)}`}>{vessel.fuelScore}%</strong>
            </div>
            <div className="flex-fill">
              <span className="text-secondary d-block" style={{ fontSize: '9px' }}>WEATHER SCORE</span>
              <strong className={`fs-5 ${getScoreColor(vessel.weatherScore)}`}>{vessel.weatherScore}%</strong>
            </div>
          </div>
        </div>

        <div className="row d-flex gap-3 mb-3">
          {/* Vessel particulars */}
          <div className="flex-fill d-flex flex-column gap-2" style={{ fontSize: '12px', minWidth: '250px' }}>
            <div className="fw-bold text-cyan border-bottom border-maritime pb-1">Vessel Particulars</div>
            <div className="d-flex justify-content-between">
              <span className="text-secondary">IMO Number:</span>
              <span className="fw-bold">{vessel.imo}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-secondary">Vessel Type:</span>
              <span className="fw-bold">{vessel.type}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-secondary">DWT Capacity:</span>
              <span className="fw-bold">{vessel.dwt} MT</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-secondary">Cargo Capacity:</span>
              <span className="fw-bold">{vessel.capacity}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-secondary">Location:</span>
              <span className="fw-bold text-cyan" style={{ fontFamily: 'monospace' }}>{vessel.lat}, {vessel.lon}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-secondary">Remaining ROB:</span>
              <span className="fw-bold text-teal">{vessel.fuelRob} MT</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-secondary">Flag State:</span>
              <span className="fw-bold">{vessel.flag}</span>
            </div>
          </div>

          {/* Owners and registry */}
          <div className="flex-fill d-flex flex-column gap-2" style={{ fontSize: '12px', minWidth: '250px' }}>
            <div className="fw-bold text-cyan border-bottom border-maritime pb-1">Management details</div>
            <div className="d-flex justify-content-between">
              <span className="text-secondary">Owner:</span>
              <span className="fw-bold">{vessel.owner}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-secondary">Manager:</span>
              <span className="fw-bold">{vessel.manager}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-secondary">Built Year:</span>
              <span className="fw-bold">{vessel.builtYear}</span>
            </div>
            <div className="d-flex justify-content-between border-top border-maritime pt-2 mt-1">
              <span className="text-secondary">Total Claims:</span>
              <span className="fw-bold text-danger">{claimsCount} claims</span>
            </div>
            <div className="d-flex justify-content-between">
              <span className="text-secondary">Exposure Value:</span>
              <span className="fw-bold text-warning">${totalClaimsLoss.toLocaleString()} USD</span>
            </div>
          </div>
        </div>

        {/* Dynamic Voyage History */}
        <div className="mb-3">
          <div className="fw-bold text-cyan border-bottom border-maritime pb-1 mb-2" style={{ fontSize: '12px' }}>
            <Calendar size={12} className="me-1 inline" /> Voyage History ({vesselVoyages.length})
          </div>
          {vesselVoyages.length === 0 ? (
            <div className="text-secondary" style={{ fontSize: '11px' }}>No voyages registered.</div>
          ) : (
            <div className="d-flex flex-column gap-1.5" style={{ maxHeight: '100px', overflowY: 'auto' }}>
              {vesselVoyages.map(v => (
                <div key={v.id} className="d-flex justify-content-between text-secondary bg-maritime p-2 rounded" style={{ fontSize: '11px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-medium)' }}>
                  <span className="fw-bold text-white">{v.voyageNumber}</span>
                  <span>{v.departurePort} → {v.destinationPort}</span>
                  <span className={v.status === 'Active' ? 'text-teal' : 'text-muted'}>{v.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Alert History & Claims */}
        <div className="mb-3">
          <div className="fw-bold text-cyan border-bottom border-maritime pb-1 mb-2" style={{ fontSize: '12px' }}>
            <AlertTriangle size={12} className="me-1 inline" /> Recent Alerts & Claims ({vesselAlerts.length})
          </div>
          {vesselAlerts.length === 0 ? (
            <div className="text-secondary" style={{ fontSize: '11px' }}>No active alerts.</div>
          ) : (
            <div className="d-flex flex-column gap-1.5" style={{ maxHeight: '120px', overflowY: 'auto' }}>
              {vesselAlerts.map(a => (
                <div key={a.id} className="d-flex justify-content-between text-secondary bg-maritime p-2 rounded align-items-center" style={{ fontSize: '11px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-medium)' }}>
                  <span className="fw-bold text-white">[{a.type}]</span>
                  <span style={{ maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.issue}</span>
                  <span className={a.severity === 'High' ? 'text-danger' : (a.severity === 'Medium' ? 'text-warning' : 'text-secondary')}>{a.severity}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <button className="btn btn-cyan w-100 py-2 fw-bold" onClick={onClose}>
            CLOSE PARTICULARS VIEW
          </button>
        </div>
      </div>
    </div>
  );
}
