import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function PerformanceCard({ title, value, unit, variance, positiveGood = false }) {
  const isNeutral = variance === 0 || variance === undefined;
  const isGood = positiveGood ? variance > 0 : variance < 0;
  const colorClass = isNeutral ? 'text-cyan' : (isGood ? 'text-teal' : 'text-danger');

  return (
    <div className="glass-panel d-flex flex-column justify-content-between" style={{ height: '100px' }}>
      <div className="d-flex justify-content-between align-items-center">
        <span className="text-secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>{title}</span>
        <BarChart3 className="text-muted" size={14} />
      </div>
      <div className="fw-bold" style={{ fontSize: '20px', color: 'var(--text-primary)' }}>
        {value} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>{unit}</span>
      </div>
      <span className="text-secondary" style={{ fontSize: '10px' }}>
        Variance: <strong className={colorClass}>{variance >= 0 ? `+${variance}` : variance}</strong>
      </span>
    </div>
  );
}
