import React, { useState } from 'react';
import { useVoyages } from '../../context/VoyageContext';
import VoyageMap from '../maps/VoyageMap';
import SpeedPerformanceChart from '../../components/charts/SpeedPerformanceChart';
import FuelConsumptionChart from '../../components/charts/FuelConsumptionChart';
import { Compass, FileText, TrendingUp, AlertCircle, Ship, Calendar } from 'lucide-react';

export default function VoyageDetails({ voyageId, setCurrentTab }) {
  const { voyages, noonReports, cospReports, eospReports, getVoyagePerformanceStats } = useVoyages();
  const [activeSubTab, setActiveSubTab] = useState('overview');

  const voyage = voyages.find(v => v.id === voyageId) || voyages[0];

  if (!voyage) {
    return (
      <div className="page-container d-flex justify-content-center align-items-center" style={{ height: '400px', color: '#64748b' }}>
        <div className="text-center">
          <div className="spinner-border text-cyan mb-2" role="status">
            <span className="visually-hidden">Loading Voyage Data...</span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.05em' }}>RETRIEVING VOYAGE DATA...</div>
        </div>
      </div>
    );
  }

  const reports = noonReports[voyage.id] || [];
  const cosp = cospReports[voyage.id];
  const eosp = eospReports[voyage.id];

  const stats = getVoyagePerformanceStats(voyage.id);

  const getStatusColor = (status) => {
    return status === 'Active' ? 'badge-sea' : 'badge-port';
  };

  return (
    <div className="page-container">
      {/* Header details */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-cyan mb-1">VOYAGE DETAILED SHEET: {voyage.voyageNumber}</h2>
          <p className="text-secondary" style={{ fontSize: '12px' }}>
            Vessel: <strong>{voyage.vesselName}</strong> | Route: <strong>{voyage.departurePort} → {voyage.destinationPort}</strong>
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-secondary py-1.5 px-3" onClick={() => setCurrentTab('voyages-list')}>
            Back to Voyages
          </button>
          <span className={`badge ${getStatusColor(voyage.status)} d-flex align-items-center`}>
            {voyage.status}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="reports-tab-container">
        <button 
          className={`report-tab-btn ${activeSubTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`report-tab-btn ${activeSubTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('map')}
        >
          Route Map
        </button>
        <button 
          className={`report-tab-btn ${activeSubTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('reports')}
        >
          Reports Warehouse
        </button>
        <button 
          className={`report-tab-btn ${activeSubTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('performance')}
        >
          Performance Engines
        </button>
      </div>

      {/* Tab Contents */}
      {activeSubTab === 'overview' && (
        <div className="d-flex flex-column gap-4">
          <div className="panel-row">
            {/* Voyage progress bar */}
            <div className="glass-panel">
              <div className="panel-title">
                <Compass size={14} className="text-cyan" />
                <span>Voyage Progress Indicators</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary" style={{ fontSize: '12px' }}>Distance Sailed:</span>
                <span className="fw-bold text-cyan" style={{ fontSize: '14px' }}>
                  {voyage.distanceSailed} NM / {voyage.distanceTotal} NM ({voyage.distanceTotal > 0 ? Math.round((voyage.distanceSailed / voyage.distanceTotal) * 100) : 0}%)
                </span>
              </div>
              <div className="progress mb-3" style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px' }}>
                <div style={{ width: `${voyage.distanceTotal > 0 ? (voyage.distanceSailed / voyage.distanceTotal) * 100 : 0}%`, background: 'var(--color-cyan)', borderRadius: '5px' }}></div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary" style={{ fontSize: '12px' }}>Distance Remaining:</span>
                <span className="fw-bold text-cyan" style={{ fontSize: '13px' }}>{Math.max(0, voyage.distanceTotal - voyage.distanceSailed)} NM</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="text-secondary" style={{ fontSize: '12px' }}>Current Fuel ROB:</span>
                <span className="fw-bold text-teal" style={{ fontSize: '13px' }}>
                  {reports.length > 0 ? `${reports[reports.length - 1].robFuel} MT` : (cosp ? `${cosp.robFuel} MT` : 'N/A')}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-secondary d-block" style={{ fontSize: '10px' }}>ETA</span>
                  <span className="fw-bold text-teal" style={{ fontSize: '14px' }}>{voyage.eta}</span>
                </div>
                <div>
                  <span className="text-secondary d-block" style={{ fontSize: '10px' }}>AVG SPEED</span>
                  <span className="fw-bold text-cyan" style={{ fontSize: '14px' }}>{stats?.avgSpeedTotal || '--'} knots</span>
                </div>
                <div>
                  <span className="text-secondary d-block" style={{ fontSize: '10px' }}>AVG DAILY FUEL</span>
                  <span className="fw-bold text-cyan" style={{ fontSize: '14px' }}>{stats?.avgFuelTotal || '--'} MT/day</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="glass-panel">
              <div className="panel-title">
                <Calendar size={14} className="text-cyan" />
                <span>Voyage Passage Timeline</span>
              </div>
              <div className="d-flex flex-column gap-3 ps-2" style={{ borderLeft: '1.5px solid rgba(0, 240, 255, 0.15)' }}>
                <div className="position-relative">
                  <div className="position-absolute bg-cyan" style={{ width: '8px', height: '8px', borderRadius: '50%', left: '-13px', top: '4px' }}></div>
                  <span className="fw-bold" style={{ fontSize: '12px', color: 'var(--color-cyan)' }}>COSP Commenced</span>
                  <div className="text-secondary" style={{ fontSize: '10px' }}>{cosp ? cosp.date : voyage.departureDate + ' 08:00'} @ Draft: {cosp ? cosp.draft : (voyage.draftForward ? `${voyage.draftForward}m` : '--')}</div>
                </div>
                {reports.map((r, i) => (
                  <div key={i} className="position-relative">
                    <div className="position-absolute bg-teal" style={{ width: '8px', height: '8px', borderRadius: '50%', left: '-13px', top: '4px' }}></div>
                    <span className="fw-bold" style={{ fontSize: '11px' }}>Noon Report {i+1}</span>
                    <div className="text-secondary" style={{ fontSize: '10px' }}>{r.date} | Pos: {r.latitude}, {r.longitude} | Speed: {r.speed} kt</div>
                  </div>
                ))}
                <div className="position-relative" style={{ opacity: eosp ? 1 : 0.4 }}>
                  <div className="position-absolute bg-secondary" style={{ width: '8px', height: '8px', borderRadius: '50%', left: '-13px', top: '4px' }}></div >
                  <span className="fw-bold" style={{ fontSize: '11px' }}>EOSP Arrived (End of Sea Passage)</span>
                  <div className="text-secondary" style={{ fontSize: '10px' }}>{eosp ? eosp.date : 'Pending arrival'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'map' && (
        <div className="glass-panel">
          <div className="panel-title">
            <Compass size={14} className="text-cyan" />
            <span>Planned Voyage Path vs Sailed Track</span>
          </div>
          <VoyageMap voyage={voyage} />
        </div>
      )}

      {activeSubTab === 'reports' && (
        <div className="glass-panel">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="fw-bold" style={{ fontSize: '14px' }}>Reports Warehouse ({reports.length + (cosp ? 1 : 0)} files)</div>
            <button 
              className="btn btn-cyan py-1.5 px-3" 
              style={{ fontSize: '11px' }}
              onClick={() => setCurrentTab('reports-upload')}
            >
              Upload Report
            </button>
          </div>

          <div className="maritime-table-wrapper">
            <table className="maritime-table">
              <thead>
                <tr>
                  <th>Report Type</th>
                  <th>Date/Time</th>
                  <th>Position</th>
                  <th>Speed</th>
                  <th>RPM</th>
                  <th>Wind / Beaufort</th>
                  <th>Fuel Consumed</th>
                  <th>Fuel ROB</th>
                </tr>
              </thead>
              <tbody>
                {cosp && (
                  <tr>
                    <td className="fw-bold text-cyan">COSP REPORT</td>
                    <td>{cosp.date}</td>
                    <td>{cosp.position}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>{cosp.robFuel} MT</td>
                  </tr>
                )}
                {reports.map(r => (
                  <tr key={r.id}>
                    <td className="fw-bold text-teal">NOON REPORT</td>
                    <td>{r.date}</td>
                    <td>{r.latitude}, {r.longitude}</td>
                    <td>{r.speed} kt</td>
                    <td>{r.rpm}</td>
                    <td>{r.windSpeed} kt / BF {r.beaufortScale}</td>
                    <td>{r.fuelConsumed} MT</td>
                    <td>{r.robFuel} MT</td>
                  </tr>
                ))}
                {eosp && (
                  <tr>
                    <td className="fw-bold text-cyan">EOSP REPORT</td>
                    <td>{eosp.date}</td>
                    <td>{eosp.arrivalPosition}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>{eosp.robArrival} MT</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'performance' && (
        <div className="d-flex flex-column gap-4">
          <div className="panel-row">
            <div className="glass-panel">
              <div className="panel-title">
                <TrendingUp size={14} className="text-cyan" />
                <span>Actual Speed vs Warranted Limits</span>
              </div>
              <SpeedPerformanceChart reports={reports} cpSpeed={voyage.cpSpeed} />
            </div>

            <div className="glass-panel">
              <div className="panel-title">
                <TrendingUp size={14} className="text-teal" />
                <span>Actual Fuel vs Permitted Limits</span>
              </div>
              <FuelConsumptionChart reports={reports} cpLimit={voyage.cpConsumption} />
            </div>
          </div>

          <div className="glass-panel">
            <div className="panel-title">
              <AlertCircle size={14} className="text-cyan" />
              <span>Charter Party Performance Summary</span>
            </div>
            {stats && (
              <div className="row d-flex justify-content-between text-center py-2">
                <div className="flex-fill">
                  <div className="text-secondary" style={{ fontSize: '10px' }}>GOOD WEATHER DAYS</div>
                  <div className="fw-bold text-cyan" style={{ fontSize: '18px' }}>{stats.goodWeatherDays} days</div>
                </div>
                <div className="flex-fill">
                  <div className="text-secondary" style={{ fontSize: '10px' }}>SPEED VARIANCE</div>
                  <div className={`fw-bold ${stats.speedVariance >= 0 ? 'text-teal' : 'text-danger'}`} style={{ fontSize: '18px' }}>
                    {stats.speedVariance >= 0 ? `+${stats.speedVariance}` : stats.speedVariance} kt
                  </div>
                </div>
                <div className="flex-fill">
                  <div className="text-secondary" style={{ fontSize: '10px' }}>FUEL VARIANCE</div>
                  <div className={`fw-bold ${stats.fuelVariance <= 0 ? 'text-teal' : 'text-danger'}`} style={{ fontSize: '18px' }}>
                    {stats.fuelVariance >= 0 ? `+${stats.fuelVariance}` : stats.fuelVariance} MT
                  </div>
                </div>
                <div className="flex-fill">
                  <div className="text-secondary" style={{ fontSize: '10px' }}>POTENTIAL CLAIM</div>
                  <div className="fw-bold text-danger" style={{ fontSize: '18px' }}>
                    ${(stats.speedClaimValue + stats.fuelClaimValue).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
