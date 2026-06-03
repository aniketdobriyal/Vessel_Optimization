import React from 'react';
import { CloudSun } from 'lucide-react';

export default function WeatherCard({ title, value, icon: Icon = CloudSun, subtext }) {
  return (
    <div className="glass-panel d-flex flex-column justify-content-between" style={{ height: '100px' }}>
      <div className="d-flex justify-content-between align-items-center">
        <span className="text-secondary" style={{ fontSize: '11px', textTransform: 'uppercase' }}>{title}</span>
        <Icon className="text-cyan" size={14} />
      </div>
      <div className="fw-bold text-cyan" style={{ fontSize: '20px' }}>
        {value}
      </div>
      <span className="text-muted" style={{ fontSize: '10px' }}>
        {subtext}
      </span>
    </div>
  );
}
