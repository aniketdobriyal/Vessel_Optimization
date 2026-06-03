import React from 'react';
import { Compass } from 'lucide-react';

export default function VoyageCard({ voyage, onClick }) {
  if (!voyage) return null;
  return (
    <div 
      className="glass-panel d-flex justify-content-between align-items-center"
      style={{ cursor: 'pointer' }}
      onClick={() => onClick && onClick(voyage.id)}
    >
      <div className="d-flex align-items-center gap-2">
        <Compass className="text-teal" size={16} />
        <div>
          <span className="fw-bold d-block">{voyage.voyageNumber}</span>
          <span className="text-secondary" style={{ fontSize: '10px' }}>{voyage.departurePort} → {voyage.destinationPort}</span>
        </div>
      </div>
      <div className="text-end">
        <span className="badge badge-sea" style={{ fontSize: '9px', padding: '2px 6px' }}>{voyage.status}</span>
        <span className="text-secondary d-block mt-0.5" style={{ fontSize: '9px' }}>{voyage.distanceSailed} NM sailed</span>
      </div>
    </div>
  );
}
