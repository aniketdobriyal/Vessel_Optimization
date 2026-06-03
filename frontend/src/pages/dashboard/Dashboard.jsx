import React, { useState } from 'react';
import { useVoyages } from '../../context/VoyageContext';
import { useVessels } from '../../context/VesselContext';
import FleetMap from '../maps/FleetMap';
import SpeedPerformanceChart from '../../components/charts/SpeedPerformanceChart';
import FuelConsumptionChart from '../../components/charts/FuelConsumptionChart';
import { Ship, Compass, AlertCircle, ShieldAlert, TrendingDown } from 'lucide-react';

export default function Dashboard({ setCurrentTab, onSelectVessel }) {
  const { voyages, alerts, noonReports } = useVoyages();
  const { vessels } = useVessels();

  const activeVesselsCount = vessels.length;
  const activeVoyagesCount = voyages.filter(v => v.status === 'Active').length;
  const claimsCount = alerts.filter(a => a.type === 'Claim Alerts' || a.type === 'Speed Performance Alerts' || a.type === 'Fuel Alerts').length;
  const totalClaimsValue = alerts
    .filter(a => a.type === 'Claim Alerts' || a.type === 'Speed Performance Alerts' || a.type === 'Fuel Alerts')
    .reduce((sum, a) => sum + (a.estLoss || 0), 0);

  const fleetScore = vessels.length > 0 ? Math.round(vessels.reduce((sum, v) => sum + (v.overallScore || 0), 0) / vessels.length) : 0;
  const tankersCount = vessels.filter(v => v.type === 'Tanker').length;
  const bulkersCount = vessels.filter(v => v.type === 'Bulker').length;
  const containerCount = vessels.filter(v => v.type === 'Container').length;

  const totalFuelSavings = voyages.reduce((sum, v) => sum + (v.status === 'Completed' ? 14.5 : 0), 0);
  const totalSavingsValue = Math.round(totalFuelSavings * 650);

  // Active voyage reports for chart rendering
  const activeVoyage = voyages.find(v => v.status === 'Active') || voyages[0];
  const reports = activeVoyage ? (noonReports[activeVoyage.id] || []) : [];

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-cyan mb-1">FLEET OVERVIEW & COMMAND DECK</h2>
          <p className="text-secondary" style={{ fontSize: '12px' }}>Real-time analytics, voyage normalization pipelines, and charter party compliance tracking</p>
        </div>
        <div className="glass-panel py-1 px-3 d-flex align-items-center gap-2">
          <span className="text-secondary" style={{ fontSize: '11px' }}>FLEET SCORE:</span>
          <span className="fw-bold text-teal" style={{ fontSize: '16px' }}>{vessels.length > 0 ? `${fleetScore}%` : 'N/A'}</span>
        </div>
      </div>

      {/* KPI Cards row */}
      <div className="dashboard-grid">
        <div className="glass-panel kpi-card">
          <div className="d-flex justify-content-between align-items-center">
            <span className="kpi-title">Active Vessels</span>
            <Ship className="text-cyan" size={16} />
          </div>
          <span className="kpi-value">{activeVesselsCount}</span>
          <span className="kpi-subtext">{tankersCount} Tankers | {bulkersCount} Bulkers | {containerCount} Containerships</span>
        </div>

        <div className="glass-panel kpi-card">
          <div className="d-flex justify-content-between align-items-center">
            <span className="kpi-title">Active Voyages</span>
            <Compass className="text-teal" size={16} />
          </div>
          <span className="kpi-value">{activeVoyagesCount}</span>
          <span className="kpi-subtext">Route optimizations running</span>
        </div>

        <div className="glass-panel kpi-card" style={{ cursor: 'pointer' }} onClick={() => setCurrentTab('perf-claims')}>
          <div className="d-flex justify-content-between align-items-center">
            <span className="kpi-title">Potential Claims</span>
            <ShieldAlert className="text-danger" size={16} />
          </div>
          <span className="kpi-value text-danger">${totalClaimsValue.toLocaleString()}</span>
          <span className="kpi-subtext">{claimsCount} commercial variances flagged</span>
        </div>

        <div className="glass-panel kpi-card" style={{ cursor: 'pointer' }} onClick={() => setCurrentTab('optimization')}>
          <div className="d-flex justify-content-between align-items-center">
            <span className="kpi-title">Fuel Savings (Month)</span>
            <TrendingDown className="text-cyan" size={16} />
          </div>
          <span className="kpi-value text-teal">{totalFuelSavings.toFixed(1)} MT</span>
          <span className="kpi-subtext">Value: ${totalSavingsValue.toLocaleString()} saved via AI routing</span>
        </div>
      </div>

      {/* Fleet Map Panel */}
      <div className="glass-panel mb-4">
        <div className="panel-title">
          <Compass size={14} className="text-cyan" />
          <span>Interactive Fleet Map (Marine Radar View)</span>
        </div>
        <FleetMap onSelectVessel={onSelectVessel} />
      </div>

      {/* Charts split row */}
      <div className="panel-row">
        <div className="glass-panel">
          <div className="panel-title">
            <TrendingDown size={14} className="text-cyan" />
            <span>Speed Performance (CP Speed: {activeVoyage ? activeVoyage.cpSpeed : '--'} knots vs Actual)</span>
          </div>
          <div style={{ height: '180px' }}>
            <SpeedPerformanceChart reports={reports} cpSpeed={activeVoyage ? activeVoyage.cpSpeed : 0} />
          </div>
        </div>

        {/* Weather Risk Panel */}
        <div className="glass-panel d-flex flex-column">
          <div className="panel-title">
            <AlertCircle size={14} className="text-cyan" />
            <span>Active Weather Risks</span>
          </div>
          <div className="d-flex flex-column gap-2" style={{ flex: 1, overflowY: 'auto' }}>
            {alerts.filter(a => a.type === 'Weather Alerts').map(alert => (
              <div key={alert.id} className="alert-card-item warning m-0">
                <div>
                  <div className="alert-title">{alert.vessel} - Warning</div>
                  <div className="alert-desc" style={{ fontSize: '11px' }}>{alert.issue}</div>
                </div>
              </div>
            ))}
            {alerts.filter(a => a.type === 'Weather Alerts').length === 0 && (
              <div className="text-secondary text-center py-4" style={{ fontSize: '11px' }}>
                No active weather risks reported.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart 2 + Recent Voyage Table */}
      <div className="panel-row" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="glass-panel">
          <div className="panel-title">
            <TrendingDown size={14} className="text-teal" />
            <span>Fuel Consumption (CP Daily limit: {activeVoyage ? activeVoyage.cpConsumption : '--'} MT)</span>
          </div>
          <div style={{ height: '180px' }}>
            <FuelConsumptionChart reports={reports} cpLimit={activeVoyage ? activeVoyage.cpConsumption : 0} />
          </div>
        </div>

        <div className="glass-panel">
          <div className="panel-title">
            <Ship size={14} className="text-cyan" />
            <span>Recent Voyage Activity</span>
          </div>
          <div className="maritime-table-wrapper">
            <table className="maritime-table">
              <thead>
                <tr>
                  <th>Vessel</th>
                  <th>Voyage No</th>
                  <th>Departure</th>
                  <th>Destination</th>
                  <th>CP Speed</th>
                  <th>Sailed Dist</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {voyages.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-secondary text-center py-4" style={{ fontSize: '11px' }}>
                      No active voyage activity recorded.
                    </td>
                  </tr>
                ) : (
                  voyages.map((v) => (
                    <tr key={v.id} style={{ cursor: 'pointer' }} onClick={() => setCurrentTab('voyages-list')}>
                      <td className="fw-bold">{v.vesselName}</td>
                      <td>{v.voyageNumber}</td>
                      <td>{v.departurePort}</td>
                      <td>{v.destinationPort}</td>
                      <td>{v.cpSpeed} kt</td>
                      <td>{v.distanceSailed} / {v.distanceTotal} NM</td>
                      <td>
                        <span className={`badge ${v.status === 'Active' ? 'badge-sea' : 'badge-port'}`}>
                          {v.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
