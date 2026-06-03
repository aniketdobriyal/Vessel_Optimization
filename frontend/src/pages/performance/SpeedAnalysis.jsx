import React from 'react';
import { useVoyages } from '../../context/VoyageContext';
import SpeedPerformanceChart from '../../components/charts/SpeedPerformanceChart';
import { TrendingDown, ShieldCheck } from 'lucide-react';

export default function SpeedAnalysis() {
  const { voyages, noonReports, getVoyagePerformanceStats } = useVoyages();
  
  // Render for M/T DE XI
  const voyage = voyages.find(v => v.status === 'Active') || voyages[0] || null;

  if (voyages.length === 0) {
    return (
      <div className="page-container d-flex justify-content-center align-items-center" style={{ height: '400px', color: '#64748b' }}>
        <div className="text-center">
          <TrendingDown className="text-cyan mb-2" size={32} />
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>NO VOYAGE DATA AVAILABLE</div>
          <p className="text-secondary mb-0" style={{ fontSize: '11px' }}>Please create a vessel and active voyage to view speed performance analytics.</p>
        </div>
      </div>
    );
  }

  if (!voyage) {
    return (
      <div className="page-container d-flex justify-content-center align-items-center" style={{ height: '400px', color: '#64748b' }}>
        <div className="text-center">
          <div className="spinner-border text-cyan mb-2" role="status">
            <span className="visually-hidden">Loading Speed Data...</span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.05em' }}>LOADING VOYAGE CONTEXT...</div>
        </div>
      </div>
    );
  }

  const reports = noonReports[voyage.id] || []; // Use voyage.id dynamically rather than hardcoded voyageId
  const stats = getVoyagePerformanceStats(voyage.id);

  return (
    <div className="page-container">
      <div className="mb-4">
        <h2 className="text-cyan mb-1">SPEED PERFORMANCE ANALYSIS</h2>
        <p className="text-secondary" style={{ fontSize: '12px' }}>Actual vessel velocity compared to charter party warranted parameters under good weather conditions</p>
      </div>

      <div className="panel-row" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="glass-panel">
          <div className="panel-title">
            <TrendingDown size={14} className="text-cyan" />
            <span>Speed Variance Graph (Actual knots vs CP limits)</span>
          </div>
          <SpeedPerformanceChart reports={reports} cpSpeed={voyage.cpSpeed} />
        </div>

        <div className="glass-panel d-flex flex-column gap-3">
          <div className="panel-title">
            <ShieldCheck size={14} className="text-cyan" />
            <span>Speed Assessment Stats</span>
          </div>

          <div>
            <span className="text-secondary d-block" style={{ fontSize: '10px' }}>AVG ACTUAL SPEED</span>
            <span className="fw-bold text-cyan" style={{ fontSize: '20px' }}>{stats?.avgSpeedTotal !== undefined && reports.length > 0 ? `${stats.avgSpeedTotal} knots` : '--'}</span>
          </div>
          <div>
            <span className="text-secondary d-block" style={{ fontSize: '10px' }}>WARRANTED CP SPEED</span>
            <span className="fw-bold text-teal" style={{ fontSize: '20px' }}>{voyage.cpSpeed} knots</span>
          </div>
          <div>
            <span className="text-secondary d-block" style={{ fontSize: '10px' }}>SPEED LOSS (AVG)</span>
            <span className="fw-bold text-danger" style={{ fontSize: '20px' }}>{stats?.speedDeficit !== undefined && reports.length > 0 ? `-${stats.speedDeficit} knots` : '--'}</span>
          </div>
          <div>
            <span className="text-secondary d-block" style={{ fontSize: '10px' }}>GOOD WEATHER DAYS</span>
            <span className="fw-bold text-teal" style={{ fontSize: '20px' }}>{stats?.goodWeatherDays !== undefined && reports.length > 0 ? `${stats.goodWeatherDays} days` : '--'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
