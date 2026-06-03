import React, { useState, useEffect } from 'react';
import WeatherImpactChart from '../../components/charts/WeatherImpactChart';
import { CloudSun, Wind, AlertCircle, Sparkles } from 'lucide-react';
import { useVoyages } from '../../context/VoyageContext';

export default function WeatherForecast() {
  const { voyages, noonReports, loading: voyagesLoading } = useVoyages();
  const [selectedVoyageId, setSelectedVoyageId] = useState('');

  // Sync selected voyage ID on load
  useEffect(() => {
    if (voyages.length > 0 && !selectedVoyageId) {
      const active = voyages.find(v => v.status === 'Active') || voyages[0];
      if (active) {
        setSelectedVoyageId(active.id);
      }
    }
  }, [voyages, selectedVoyageId]);

  if (voyages.length === 0) {
    return (
      <div className="page-container d-flex justify-content-center align-items-center" style={{ height: '400px', color: '#64748b' }}>
        <div className="text-center">
          <CloudSun className="text-cyan mb-2" size={32} />
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>NO METEOROLOGICAL DATA AVAILABLE</div>
          <p className="text-secondary mb-0" style={{ fontSize: '11px' }}>Please select a voyage and ensure noon reports are submitted to load weather forecasts.</p>
        </div>
      </div>
    );
  }

  const activeVoyage = voyages.find(v => v.id === selectedVoyageId) || voyages[0] || null;
  const reports = activeVoyage ? (noonReports[activeVoyage.id] || []) : [];
  const latestReport = reports.length > 0 ? reports[reports.length - 1] : null;

  const currentCondition = latestReport ? {
    windSpeed: `${latestReport.windSpeed} knots`,
    waveHeight: `${latestReport.waveHeight} meters`,
    currentSpeed: `${latestReport.currentSpeed} knots`,
    windDirection: latestReport.windDirection || latestReport.windDir || 'N/A',
    currentDirection: latestReport.currentDirection || latestReport.currentDir || 'N/A',
    swellDirection: latestReport.swellDirection || 'N/A',
    beaufort: latestReport.beaufortScale || 0,
    description: `Beaufort ${latestReport.beaufortScale} - ${latestReport.beaufortScale <= 4 ? 'Good weather conditions apply.' : 'Moderate to rough seas encountered.'}`
  } : {
    windSpeed: '--',
    waveHeight: '--',
    currentSpeed: '--',
    windDirection: '--',
    currentDirection: '--',
    swellDirection: '--',
    beaufort: '--',
    description: 'No weather reports logged for this voyage.'
  };

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-cyan mb-1">WEATHER & SEA STATE ANALYSIS</h2>
          <p className="text-secondary" style={{ fontSize: '12px' }}>Real-time meteorological tracking, sea wave swells resistance, and charter party good-weather diagnostics</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <label className="text-secondary" style={{ fontSize: '11px' }} htmlFor="voyage-select-weather">Voyage Context:</label>
          <select 
            id="voyage-select-weather"
            className="form-input py-1 px-2 text-cyan" 
            style={{ width: '180px', fontSize: '12px' }}
            value={selectedVoyageId}
            onChange={(e) => setSelectedVoyageId(e.target.value)}
            disabled={voyagesLoading}
          >
            {voyagesLoading ? (
              <option>Loading voyages...</option>
            ) : (
              voyages.map(v => (
                <option key={v.id} value={v.id}>{v.voyageNumber} ({v.vesselName})</option>
              ))
            )}
          </select>
        </div>
      </div>

      <div className="panel-row">
        {/* Conditions grid */}
        <div className="glass-panel">
          <div className="panel-title">
            <CloudSun size={14} className="text-cyan" />
            <span>Active Meteorological Conditions</span>
          </div>

          <div className="row d-flex justify-content-around text-center py-3">
            <div className="flex-fill">
              <Wind className="text-cyan mb-1" size={24} />
              <div className="text-secondary" style={{ fontSize: '10px' }}>WIND SPEED</div>
              <div className="fw-bold text-cyan" style={{ fontSize: '18px' }}>{currentCondition.windSpeed}</div>
              <span className="d-block text-secondary mt-1" style={{ fontSize: '9px' }}>Dir: {currentCondition.windDirection}</span>
            </div>
            <div className="flex-fill">
              <CloudSun className="text-teal mb-1" size={24} />
              <div className="text-secondary" style={{ fontSize: '10px' }}>WAVE SWELLS</div>
              <div className="fw-bold text-teal" style={{ fontSize: '18px' }}>{currentCondition.waveHeight}</div>
              <span className="d-block text-secondary mt-1" style={{ fontSize: '9px' }}>Swell: {currentCondition.swellDirection}</span>
            </div>
            <div className="flex-fill">
              <AlertCircle className="text-cyan mb-1" size={24} />
              <div className="text-secondary" style={{ fontSize: '10px' }}>BEAUFORT SCALE</div>
              <div className="fw-bold text-cyan" style={{ fontSize: '18px' }}>BF {currentCondition.beaufort}</div>
              <span className="d-block text-secondary mt-1" style={{ fontSize: '9px' }}>Current: {currentCondition.currentSpeed} ({currentCondition.currentDirection})</span>
            </div>
          </div>

          <div className="alert-card-item info mt-2">
            <div>
              <div className="alert-title text-cyan">Condition Report</div>
              <div className="alert-desc" style={{ fontSize: '11px' }}>{currentCondition.description}</div>
            </div>
          </div>
        </div>

        {/* Forecast map summary */}
        <div className="glass-panel d-flex flex-column justify-content-center">
          <div className="panel-title">
            <AlertCircle size={14} className="text-cyan" />
            <span>Weather Risk Index Map Overlay</span>
          </div>
          <div className="d-flex justify-content-around align-items-center py-2">
            <div className="text-center">
              <div className="badge badge-sea">Green</div>
              <span className="d-block text-secondary mt-1" style={{ fontSize: '9px' }}>Safe (BF 0-4)</span>
            </div>
            <div className="text-center">
              <div className="badge badge-anchor">Yellow</div>
              <span className="d-block text-secondary mt-1" style={{ fontSize: '9px' }}>Moderate (BF 5-6)</span>
            </div>
            <div className="text-center">
              <div className="badge badge-alert">Red</div>
              <span className="d-block text-secondary mt-1" style={{ fontSize: '9px' }}>High Risk (BF 7+)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Speed loss chart */}
      <div className="glass-panel">
        <div className="panel-title">
          <Wind size={14} className="text-cyan" />
          <span>Weather Resistance & Wave Speed Penalties</span>
        </div>
        <WeatherImpactChart />
      </div>
    </div>
  );
}
