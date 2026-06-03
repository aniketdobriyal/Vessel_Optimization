import React from 'react';
import { Ship } from 'lucide-react';

export default function VesselCard({ vessel, onClick }) {
  if (!vessel) return null;
  return (
    <div 
      className="glass-panel d-flex justify-content-between align-items-center"
      style={{ cursor: 'pointer' }}
      onClick={() => onClick && onClick(vessel)}
    >
      <div className="d-flex align-items-center gap-2">
        <Ship className="text-cyan animate-pulse-pin" size={16} />
        <div>
          <span className="fw-bold d-block">{vessel.name}</span>
          <span className="text-secondary" style={{ fontSize: '10px' }}>IMO: {vessel.imo} | {vessel.type}</span>
        </div>
      </div>
      <div className="text-end">
        <span className="fw-bold text-teal d-block">{vessel.overallScore}%</span>
        <span className="badge badge-sea" style={{ fontSize: '9px', padding: '2px 6px' }}>{vessel.status}</span>
      </div>
    </div>
  );
}
