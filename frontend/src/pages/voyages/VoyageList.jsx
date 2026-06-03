import React from 'react';
import { useVoyages } from '../../context/VoyageContext';
import { Compass, Plus } from 'lucide-react';

export default function VoyageList({ setCurrentTab, setSelectedVoyageId }) {
  const { voyages } = useVoyages();

  const handleVoyageClick = (id) => {
    setSelectedVoyageId(id);
    setCurrentTab('voyage-details');
  };

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-cyan mb-1">VOYAGE MANAGEMENT</h2>
          <p className="text-secondary" style={{ fontSize: '12px' }}>Monitor sailing timelines, distance remaining metrics, and charter party warranted compliance parameters</p>
        </div>
        <button 
          className="btn btn-cyan d-flex align-items-center gap-1.5"
          onClick={() => setCurrentTab('voyages-create')}
        >
          <Plus size={14} /> Create Voyage
        </button>
      </div>

      <div className="glass-panel">
        <div className="panel-title">
          <Compass size={14} className="text-cyan" />
          <span>Active & Historical Voyage Logs</span>
        </div>

        <div className="maritime-table-wrapper">
          <table className="maritime-table">
            <thead>
              <tr>
                <th>Voyage Number</th>
                <th>Vessel Name</th>
                <th>Route</th>
                <th>Departure Date</th>
                <th>Est. Arrival (ETA)</th>
                <th>CP Speed / Consumption</th>
                <th>Distance Sailed / Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {voyages.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-secondary text-center py-4" style={{ fontSize: '11px' }}>
                    No voyages found. Click "Create Voyage" to start.
                  </td>
                </tr>
              ) : (
                voyages.map(v => (
                  <tr key={v.id}>
                    <td className="fw-bold text-cyan" style={{ cursor: 'pointer' }} onClick={() => handleVoyageClick(v.id)}>{v.voyageNumber}</td>
                    <td>{v.vesselName}</td>
                    <td>{v.departurePort} → {v.destinationPort}</td>
                    <td>{v.departureDate}</td>
                    <td>{v.eta}</td>
                    <td>{v.cpSpeed} kt / {v.cpConsumption} MT/d</td>
                    <td>{v.distanceSailed} / {v.distanceTotal} NM</td>
                    <td>
                      <span className={`badge ${v.status === 'Active' ? 'badge-sea' : 'badge-port'}`}>
                        {v.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary py-1 px-2"
                        style={{ fontSize: '10px' }}
                        onClick={() => handleVoyageClick(v.id)}
                      >
                        View Details
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
