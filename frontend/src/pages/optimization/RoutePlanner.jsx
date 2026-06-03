import React, { useState, useEffect } from 'react';
import VoyageMap from '../maps/VoyageMap';
import VoyageEfficiencyChart from '../../components/charts/VoyageEfficiencyChart';
import { Route, Navigation, Compass, ShieldAlert, Sparkles } from 'lucide-react';
import { useVoyages } from '../../context/VoyageContext';
import { getOptimizedRoute } from '../../services/optimizationApi';

export default function RoutePlanner() {
  const { voyages, loading: voyagesLoading } = useVoyages();
  const [selectedVoyageId, setSelectedVoyageId] = useState('');
  const [loading, setLoading] = useState(false);
  const [optData, setOptData] = useState(null);

  // Sync selected voyage ID on load
  useEffect(() => {
    if (voyages.length > 0 && !selectedVoyageId) {
      const active = voyages.find(v => v.status === 'Active') || voyages[0];
      if (active) {
        setSelectedVoyageId(active.id);
      }
    }
  }, [voyages, selectedVoyageId]);

  // Load optimization records when voyage changes
  useEffect(() => {
    if (selectedVoyageId) {
      setLoading(true);
      const activeVoyage = voyages.find(v => v.id === selectedVoyageId);
      getOptimizedRoute(selectedVoyageId, activeVoyage?.departurePort || 'Singapore (SGP)', activeVoyage?.destinationPort || 'Rotterdam (RTM)')
        .then(data => {
          setOptData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [selectedVoyageId, voyages]);

  const handleOptimize = (e) => {
    e.preventDefault();
    if (!selectedVoyageId) return;
    setLoading(true);
    const activeVoyage = voyages.find(v => v.id === selectedVoyageId);
    getOptimizedRoute(selectedVoyageId, activeVoyage?.departurePort, activeVoyage?.destinationPort)
      .then(data => {
        setOptData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  if (voyages.length === 0) {
    return (
      <div className="page-container d-flex justify-content-center align-items-center" style={{ height: '400px', color: '#64748b' }}>
        <div className="text-center">
          <Compass className="text-cyan mb-2" size={32} />
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>NO VOYAGE DATA AVAILABLE</div>
          <p className="text-secondary mb-0" style={{ fontSize: '11px' }}>Please create a vessel and active voyage to run AI route optimizations.</p>
        </div>
      </div>
    );
  }

  const selectedVoyage = voyages.find(v => v.id === selectedVoyageId);

  return (
    <div className="page-container">
      <div className="mb-4">
        <h2 className="text-cyan mb-1">AI ROUTE OPTIMIZATION</h2>
        <p className="text-secondary" style={{ fontSize: '12px' }}>Runs voyage prediction models utilizing historical weather tracks, pilot charts, and vessel performance coefficients</p>
      </div>

      <div className="glass-panel mb-4">
        <div className="panel-title">
          <Sparkles size={14} className="text-cyan" />
          <span>AI Voyage Optimization Controls</span>
        </div>

        <form onSubmit={handleOptimize} className="d-flex align-items-end gap-3 flex-wrap">
          <div className="form-group mb-0 flex-fill">
            <label className="form-label" htmlFor="voyage-select">Select Active Voyage</label>
            <select 
              id="voyage-select" 
              className="form-input" 
              value={selectedVoyageId} 
              onChange={(e) => setSelectedVoyageId(e.target.value)}
              disabled={voyagesLoading}
            >
              {voyagesLoading ? (
                <option>Loading voyages...</option>
              ) : (
                voyages.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.vesselName} - {v.voyageNumber} ({v.departurePort} → {v.destinationPort})
                  </option>
                ))
              )}
            </select>
          </div>
          <button type="submit" className="btn btn-cyan fw-bold flex-fill py-2.5" disabled={loading || !selectedVoyageId}>
            <Compass size={16} /> {loading ? 'ANALYZING WEATHER GRIDS...' : 'RUN OPTIMIZATION ENGINE'}
          </button>
        </form>
      </div>

      {optData && (
        <div className="d-flex flex-column gap-4">
          <div className="panel-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            {/* Voyage map overlay */}
            <div className="glass-panel">
              <div className="panel-title">
                <Compass size={14} className="text-cyan" />
                <span>Weather risk track overlay map</span>
              </div>
              <VoyageMap voyage={selectedVoyage || { id: selectedVoyageId }} />
            </div>

            {/* Comparisons */}
            <div className="glass-panel d-flex flex-column justify-content-between" style={{ gap: '16px' }}>
              <div>
                <div className="panel-title">
                  <Navigation size={14} className="text-teal" />
                  <span>Route Alternatives Comparison</span>
                </div>

                <div className="d-flex flex-column gap-2 mb-3">
                  <div className="glass-panel p-2" style={{ background: 'rgba(0, 240, 255, 0.03)', borderColor: 'rgba(0, 240, 255, 0.15)' }}>
                    <div className="fw-bold text-cyan" style={{ fontSize: '12px' }}>Route A: {optData.routeA || '--'}</div>
                    <div className="d-flex justify-content-between text-secondary" style={{ fontSize: '10px', marginTop: '4px' }}>
                      <span>Distance: {optData.distanceA ? `${optData.distanceA} NM` : '--'}</span>
                      <span>Fuel: {optData.fuelA ? `${optData.fuelA} MT` : '--'}</span>
                      <span>ETA: {optData.etaA || '--'}</span>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--color-teal)', marginTop: '2px' }}>
                      Weather Impact: {optData.weatherImpactA || '--'}
                    </div>
                  </div>

                  <div className="glass-panel p-2" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="fw-bold" style={{ fontSize: '12px' }}>Route B: {optData.routeB || '--'}</div>
                    <div className="d-flex justify-content-between text-secondary" style={{ fontSize: '10px', marginTop: '4px' }}>
                      <span>Distance: {optData.distanceB ? `${optData.distanceB} NM` : '--'}</span>
                      <span>Fuel: {optData.fuelB ? `${optData.fuelB} MT` : '--'}</span>
                      <span>ETA: {optData.etaB || '--'}</span>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--color-warning)', marginTop: '2px' }}>
                      Weather Impact: {optData.weatherImpactB || '--'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendation card */}
              <div className="alert-card-item info m-0" style={{ borderLeft: '3px solid var(--color-cyan)', background: 'rgba(0, 240, 255, 0.05)', padding: '10px' }}>
                <div>
                  <div className="alert-title text-cyan" style={{ fontWeight: 'bold' }}>AI Recommendation Details</div>
                  <div className="alert-desc" style={{ fontSize: '11px', marginTop: '4px' }}>
                    {optData.recommendationReason || '--'}
                  </div>
                  <div className="mt-2 text-secondary" style={{ fontSize: '10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span>Distance Comparison: {optData.distanceComparison !== undefined ? `${optData.distanceComparison} NM` : '--'}</span>
                    <span className="text-teal font-bold">Estimated Fuel Savings: {optData.fuelSaving !== undefined ? `${optData.fuelSaving} MT` : (optData.fuelComparison !== undefined ? `${Math.abs(optData.fuelComparison)} MT` : '--')}</span>
                  </div>
                </div>
              </div>

              {optData.isDiversionRecommended && (
                <div className="alert-card-item warning m-0 mt-2" style={{ borderLeft: '3px solid var(--color-warning)', background: 'rgba(255, 170, 0, 0.05)', padding: '10px' }}>
                  <div className="alert-title text-warning" style={{ fontWeight: 'bold' }}>Diversion Recommendation Alert</div>
                  <div className="alert-desc" style={{ fontSize: '11px', marginTop: '4px' }}>
                    {optData.diversionDetails || 'Bypass active storm grids ahead.'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Efficiency chart */}
          <div className="glass-panel">
            <div className="panel-title">
              <Compass size={14} className="text-cyan" />
              <span>Comparative efficiency chart</span>
            </div>
            <VoyageEfficiencyChart optData={optData} />
          </div>
        </div>
      )}
    </div>
  );
}
