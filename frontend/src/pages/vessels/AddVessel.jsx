import React, { useState } from 'react';
import { useVessels } from '../../context/VesselContext';
import { Ship, Plus } from 'lucide-react';

export default function AddVessel({ setCurrentTab }) {
  const { addVessel } = useVessels();

  const [name, setName] = useState('');
  const [imo, setImo] = useState('');
  const [type, setType] = useState('Tanker');
  const [dwt, setDwt] = useState('');
  const [owner, setOwner] = useState('');
  const [manager, setManager] = useState('');
  const [grossTonnage, setGrossTonnage] = useState('');
  const [builtYear, setBuiltYear] = useState('');
  const [capacity, setCapacity] = useState('');
  const [flag, setFlag] = useState('Singapore');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !imo || !dwt) {
      setError('Please fill in Vessel Name, IMO Number, and DWT capacity.');
      return;
    }
    
    try {
      await addVessel({
        name: `M/V ${name}`,
        imo,
        type,
        dwt: parseFloat(dwt).toLocaleString(),
        owner: owner || 'Oceanic Shipping Corp',
        manager: manager || 'Fleet Operations Management',
        grossTonnage: grossTonnage || '45,000',
        builtYear: builtYear || '2022',
        capacity: capacity ? `${parseFloat(capacity).toLocaleString()} cbm` : '85,000 cbm',
        flag,
        status: 'In Port'
      });
      setCurrentTab('vessels-list');
    } catch (err) {
      setError(err.message || 'Failed to register vessel');
    }
  };

  return (
    <div className="page-container">
      <div className="mb-4">
        <h2 className="text-cyan mb-1">ADD NEW VESSEL</h2>
        <p className="text-secondary" style={{ fontSize: '12px' }}>Register a new merchant vessel to fleet tracking contexts</p>
      </div>

      <div className="glass-panel" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div className="panel-title">
          <Ship size={14} className="text-cyan" />
          <span>Vessel Particulars Registration Form</span>
        </div>

        {error && (
          <div className="alert-card-item danger p-2 mb-3">
            <span style={{ fontSize: '11px' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row d-flex gap-3 mb-3">
            <div className="form-group flex-fill">
              <label className="form-label" htmlFor="vessel-name-input">Vessel Name</label>
              <input 
                id="vessel-name-input"
                type="text" 
                className="form-input" 
                placeholder="e.g. OCEAN PRINCE"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div className="form-group flex-fill">
              <label className="form-label" htmlFor="imo-number-input">IMO Number *</label>
              <input 
                id="imo-number-input"
                type="text" 
                className="form-input" 
                placeholder="e.g. 9845722"
                value={imo} 
                onChange={(e) => setImo(e.target.value)} 
              />
            </div>
          </div>

          <div className="row d-flex gap-3 mb-3">
            <div className="form-group flex-fill">
              <label className="form-label" htmlFor="type-select">Vessel Type</label>
              <select 
                id="type-select"
                className="form-input" 
                value={type} 
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Tanker">Crude Tanker</option>
                <option value="Bulker">Dry Bulk Carrier</option>
                <option value="Container">Containership</option>
                <option value="LNG">LNG Carrier</option>
              </select>
            </div>
            <div className="form-group flex-fill">
              <label className="form-label" htmlFor="dwt-input">DWT (Deadweight Tonnage) *</label>
              <input 
                id="dwt-input"
                type="number" 
                className="form-input" 
                placeholder="e.g. 82000"
                value={dwt} 
                onChange={(e) => setDwt(e.target.value)} 
              />
            </div>
          </div>

          <div className="row d-flex gap-3 mb-3">
            <div className="form-group flex-fill">
              <label className="form-label" htmlFor="owner-input">Owner Entity</label>
              <input 
                id="owner-input"
                type="text" 
                className="form-input" 
                placeholder="e.g. Apex Leasing Inc"
                value={owner} 
                onChange={(e) => setOwner(e.target.value)} 
              />
            </div>
            <div className="form-group flex-fill">
              <label className="form-label" htmlFor="manager-input">Technical Manager</label>
              <input 
                id="manager-input"
                type="text" 
                className="form-input" 
                placeholder="e.g. Veson Management Corp"
                value={manager} 
                onChange={(e) => setManager(e.target.value)} 
              />
            </div>
          </div>

          <div className="row d-flex gap-3 mb-3">
            <div className="form-group flex-fill">
              <label className="form-label" htmlFor="built-year-input">Built Year</label>
              <input 
                id="built-year-input"
                type="number" 
                className="form-input" 
                placeholder="e.g. 2021"
                value={builtYear} 
                onChange={(e) => setBuiltYear(e.target.value)} 
              />
            </div>
            <div className="form-group flex-fill">
              <label className="form-label" htmlFor="capacity-input">Cargo Capacity (cbm / TEU)</label>
              <input 
                id="capacity-input"
                type="number" 
                className="form-input" 
                placeholder="e.g. 95000"
                value={capacity} 
                onChange={(e) => setCapacity(e.target.value)} 
              />
            </div>
          </div>

          <div className="row d-flex gap-3 mb-3">
            <div className="form-group flex-fill">
              <label className="form-label" htmlFor="flag-select">Flag State</label>
              <select 
                id="flag-select"
                className="form-input" 
                value={flag} 
                onChange={(e) => setFlag(e.target.value)}
              >
                <option value="Singapore">Singapore</option>
                <option value="Panama">Panama</option>
                <option value="Liberia">Liberia</option>
                <option value="Marshall Islands">Marshall Islands</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-3 mt-4">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => setCurrentTab('vessels-list')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-cyan fw-bold">
              <Plus size={14} /> REGISTER VESSEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
