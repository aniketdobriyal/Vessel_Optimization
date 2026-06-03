import React, { useState } from 'react';
import { useVessels } from '../../context/VesselContext';
import { Ship, Info, UserPlus } from 'lucide-react';

export default function VesselList({ setCurrentTab, onSelectVessel }) {
  const { vessels } = useVessels();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVessels = vessels.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.imo.includes(searchTerm)
  );

  const getStatusBadgeClass = (status) => {
    if (status === 'At Sea') return 'badge-sea';
    if (status === 'In Port') return 'badge-port';
    return 'badge-anchor';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-teal';
    if (score >= 80) return 'text-cyan';
    return 'text-amber';
  };

  // Fleet Status Distribution counts
  const atSea = vessels.filter(v => v.status === 'At Sea').length;
  const inPort = vessels.filter(v => v.status === 'In Port').length;
  const anchored = vessels.filter(v => v.status === 'Anchored').length;

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-cyan mb-1">FLEET LIST & PERFORMANCE RATINGS</h2>
          <p className="text-secondary" style={{ fontSize: '12px' }}>Vessel details, current coordinates, remaining fuel oil on board, and optimization scorecards</p>
        </div>
        <button 
          className="btn btn-cyan d-flex align-items-center gap-1.5"
          onClick={() => setCurrentTab('vessels-add')}
        >
          <UserPlus size={14} /> Add Vessel
        </button>
      </div>

      {/* Overview Analytics Grids */}
      <div className="panel-row" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="glass-panel text-center d-flex flex-column justify-content-center">
          <div className="panel-title text-start">
            <Ship size={14} className="text-cyan" />
            <span>Vessel Status Distribution</span>
          </div>
          <div className="my-3 d-flex justify-content-around align-items-center">
            <div>
              <div className="fw-bold text-cyan" style={{ fontSize: '24px' }}>{atSea}</div>
              <div className="text-secondary" style={{ fontSize: '10px' }}>At Sea</div>
            </div>
            <div>
              <div className="fw-bold text-blue" style={{ fontSize: '24px' }}>{inPort}</div>
              <div className="text-secondary" style={{ fontSize: '10px' }}>In Port</div>
            </div>
            <div>
              <div className="fw-bold text-warning" style={{ fontSize: '24px' }}>{anchored}</div>
              <div className="text-secondary" style={{ fontSize: '10px' }}>Anchored</div>
            </div>
          </div>
          <div className="progress" style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', display: 'flex', overflow: 'hidden' }}>
            <div style={{ width: `${(atSea / (vessels.length || 1)) * 100}%`, background: 'var(--color-status-sea)' }}></div>
            <div style={{ width: `${(inPort / (vessels.length || 1)) * 100}%`, background: 'var(--color-status-port)' }}></div>
            <div style={{ width: `${(anchored / (vessels.length || 1)) * 100}%`, background: 'var(--color-status-anchor)' }}></div>
          </div>
        </div>

        <div className="glass-panel">
          <div className="panel-title">
            <Ship size={14} className="text-cyan" />
            <span>Performance Distribution (Overall Score %)</span>
          </div>
          <div className="d-flex align-items-end justify-content-between pt-3" style={{ height: '70px', padding: '0 20px' }}>
            {vessels.map((v, i) => (
              <div key={i} className="d-flex flex-column align-items-center gap-1" style={{ flex: 1 }}>
                <div 
                  style={{ 
                    width: '18px', 
                    height: `${(v.overallScore / 100) * 50}px`, 
                    background: 'var(--color-cyan)', 
                    opacity: 0.65 + (i * 0.05),
                    borderRadius: '2px 2px 0 0'
                  }}
                ></div>
                <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>{v.name.replace('M/T ', '').replace('M/V ', '')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main fleet table */}
      <div className="glass-panel">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="fw-bold" style={{ fontSize: '14px' }}>Registered Vessels ({vessels.length})</div>
          <input 
            type="text" 
            className="form-input py-1.5 px-3" 
            style={{ width: '220px', fontSize: '12px' }}
            placeholder="Search vessel by name or IMO..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="maritime-table-wrapper">
          <table className="maritime-table">
            <thead>
              <tr>
                <th>Vessel Name</th>
                <th>IMO Number</th>
                <th>Vessel Type</th>
                <th>DWT</th>
                <th>Current Position</th>
                <th>Status</th>
                <th>Fuel ROB</th>
                <th>Overall Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVessels.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-secondary text-center py-4" style={{ fontSize: '11px' }}>
                    No registered vessels found. Click "Add Vessel" to register one.
                  </td>
                </tr>
              ) : (
                filteredVessels.map(v => (
                  <tr key={v.id}>
                    <td className="fw-bold text-cyan" style={{ cursor: 'pointer' }} onClick={() => onSelectVessel(v)}>{v.name}</td>
                    <td>{v.imo}</td>
                    <td>{v.type}</td>
                    <td>{v.dwt} MT</td>
                    <td style={{ fontFamily: 'monospace' }}>{v.lat}, {v.lon}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(v.status)}`}>
                        {v.status}
                      </span>
                    </td>
                    <td>{v.fuelRob} MT</td>
                    <td>
                      <strong className={getScoreColor(v.overallScore)}>{v.overallScore}%</strong>
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary py-1 px-2 d-flex align-items-center gap-1"
                        style={{ fontSize: '10px' }}
                        onClick={() => onSelectVessel(v)}
                      >
                        <Info size={10} /> Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
