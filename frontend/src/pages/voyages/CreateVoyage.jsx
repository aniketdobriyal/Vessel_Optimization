import React, { useState, useEffect } from 'react';
import { useVoyages } from '../../context/VoyageContext';
import { useVessels } from '../../context/VesselContext';
import { Compass, Calendar } from 'lucide-react';
import { calculateDurationHours, formatDuration, projectETA } from '../../utils/etaCalculations';

export default function CreateVoyage({ setCurrentTab }) {
  const { createVoyage } = useVoyages();
  const { vessels } = useVessels();

  const [vesselId, setVesselId] = useState('');
  const [departurePort, setDeparturePort] = useState('Singapore (SGP)');
  const [destinationPort, setDestinationPort] = useState('Rotterdam (RTM)');
  const [cpSpeed, setCpSpeed] = useState(12.5);
  const [cpConsumption, setCpConsumption] = useState(25.0);
  const [departureDate, setDepartureDate] = useState('2026-06-01');
  const [distanceTotal, setDistanceTotal] = useState(8350); // mock distance

  const [estDuration, setEstDuration] = useState('15d 14h');
  const [estEta, setEstEta] = useState('2026-06-16 14:00');

  useEffect(() => {
    // Recalculate duration & ETA when distance or speed changes
    const hours = calculateDurationHours(distanceTotal, cpSpeed);
    setEstDuration(formatDuration(hours));
    setEstEta(projectETA(departureDate, distanceTotal, cpSpeed));
  }, [distanceTotal, cpSpeed, departureDate]);

  const handleVesselChange = (e) => {
    setVesselId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vesselId || !departurePort || !destinationPort) {
      alert('Please fill out all fields.');
      return;
    }

    const selectedVessel = vessels.find(v => v.id === vesselId);
    
    try {
      await createVoyage({
        vesselId,
        vesselName: selectedVessel ? selectedVessel.name : 'Unknown Vessel',
        departurePort,
        destinationPort,
        cpSpeed: parseFloat(cpSpeed),
        cpConsumption: parseFloat(cpConsumption),
        departureDate,
        eta: estEta.split(' ')[0],
        distanceTotal: parseFloat(distanceTotal),
        distanceSailed: 0
      });
      setCurrentTab('voyages-list');
    } catch (err) {
      alert(`Failed to create voyage: ${err.message}`);
    }
  };

  return (
    <div className="page-container">
      <div className="mb-4">
        <h2 className="text-cyan mb-1">CREATE VOYAGE</h2>
        <p className="text-secondary" style={{ fontSize: '12px' }}>Initialize a new sailing plan, set speed constraints, and define allowed fuel consumption thresholds</p>
      </div>

      <div className="glass-panel" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div className="panel-title">
          <Compass size={14} className="text-cyan" />
          <span>New Voyage Planning Sheet</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="vessel-select">Select Vessel</label>
            <select 
              id="vessel-select"
              className="form-input" 
              value={vesselId} 
              onChange={handleVesselChange}
            >
              <option value="">-- Choose Vessel from Fleet --</option>
              {vessels.map(v => (
                <option key={v.id} value={v.id}>{v.name} (IMO: {v.imo})</option>
              ))}
            </select>
          </div>

          <div className="row d-flex gap-3 mb-3">
            <div className="form-group flex-fill">
              <label className="form-label" htmlFor="dep-port-input">Departure Port</label>
              <input 
                id="dep-port-input"
                type="text" 
                className="form-input" 
                value={departurePort} 
                onChange={(e) => setDeparturePort(e.target.value)} 
              />
            </div>
            <div className="form-group flex-fill">
              <label className="form-label" htmlFor="dest-port-input">Destination Port</label>
              <input 
                id="dest-port-input"
                type="text" 
                className="form-input" 
                value={destinationPort} 
                onChange={(e) => setDestinationPort(e.target.value)} 
              />
            </div>
          </div>

          <div className="row d-flex gap-3 mb-3">
            <div className="form-group flex-fill">
              <label className="form-label" htmlFor="speed-knots-input">CP Warranted Speed (knots)</label>
              <input 
                id="speed-knots-input"
                type="number" 
                step="0.1" 
                className="form-input" 
                value={cpSpeed} 
                onChange={(e) => setCpSpeed(parseFloat(e.target.value) || 0)} 
              />
            </div>
            <div className="form-group flex-fill">
              <label className="form-label" htmlFor="consumption-daily-input">CP Daily Consumption (MT/day)</label>
              <input 
                id="consumption-daily-input"
                type="number" 
                step="0.1" 
                className="form-input" 
                value={cpConsumption} 
                onChange={(e) => setCpConsumption(parseFloat(e.target.value) || 0)} 
              />
            </div>
          </div>

          <div className="row d-flex gap-3 mb-3">
            <div className="form-group flex-fill">
              <label className="form-label" htmlFor="departure-date-input">Departure Date</label>
              <input 
                id="departure-date-input"
                type="date" 
                className="form-input" 
                value={departureDate} 
                onChange={(e) => setDepartureDate(e.target.value)} 
              />
            </div>
            <div className="form-group flex-fill">
              <label className="form-label" htmlFor="distance-total-input">Estimated Distance (NM)</label>
              <input 
                id="distance-total-input"
                type="number" 
                className="form-input" 
                value={distanceTotal} 
                onChange={(e) => setDistanceTotal(parseFloat(e.target.value) || 0)} 
              />
            </div>
          </div>

          {/* Calculations indicators */}
          <div className="glass-panel d-flex justify-content-between align-items-center mb-4" style={{ background: 'rgba(0, 240, 255, 0.02)', borderColor: 'rgba(0, 240, 255, 0.08)' }}>
            <div>
              <div className="text-secondary" style={{ fontSize: '10px' }}>ESTIMATED DURATION</div>
              <div className="fw-bold text-cyan" style={{ fontSize: '16px' }}>{estDuration}</div>
            </div>
            <div>
              <div className="text-secondary" style={{ fontSize: '10px' }}>PROJECTED ETA</div>
              <div className="fw-bold text-teal" style={{ fontSize: '16px' }}>{estEta}</div>
            </div>
            <div>
              <div className="text-secondary" style={{ fontSize: '10px' }}>TOTAL DIRECT DISTANCE</div>
              <div className="fw-bold text-cyan" style={{ fontSize: '16px' }}>{distanceTotal} NM</div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-3">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => setCurrentTab('voyages-list')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-cyan fw-bold">
              <Compass size={14} /> CREATE VOYAGE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
