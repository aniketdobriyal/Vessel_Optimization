import React, { useState, useEffect } from 'react';
import { useVoyages } from '../../context/VoyageContext';
import { FileText, Printer, CheckCircle } from 'lucide-react';

export default function VesselPerformanceReport() {
  const { voyages, getVoyagePerformanceStats, noonReports } = useVoyages();
  const [selectedVoyageId, setSelectedVoyageId] = useState('');
  const [showReport, setShowReport] = useState(false);

  // Sections checkboxes
  const [sections, setSections] = useState({
    summary: true,
    speed: true,
    fuel: true,
    weather: true,
    claims: true,
    recs: true
  });

  useEffect(() => {
    if (voyages.length > 0 && (!selectedVoyageId || selectedVoyageId === 'voyage-15')) {
      const active = voyages.find(v => v.status === 'Active') || voyages[0];
      if (active) {
        setSelectedVoyageId(active.id);
      }
    }
  }, [voyages, selectedVoyageId]);

  const toggleSection = (secKey) => {
    setSections(prev => ({ ...prev, [secKey]: !prev[secKey] }));
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    setShowReport(true);
  };

  const voyage = voyages.find(v => v.id === selectedVoyageId) || voyages[0] || null;
  const stats = voyage ? getVoyagePerformanceStats(voyage.id) : null;
  const reports = voyage ? (noonReports[voyage.id] || []) : [];

  if (voyages.length === 0) {
    return (
      <div className="page-container d-flex justify-content-center align-items-center" style={{ height: '400px', color: '#64748b' }}>
        <div className="text-center">
          <FileText className="text-cyan mb-2" size={32} />
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>NO VOYAGE DATA AVAILABLE</div>
          <p className="text-secondary mb-0" style={{ fontSize: '11px' }}>Please create a vessel and active voyage to generate performance reports.</p>
        </div>
      </div>
    );
  }

  if (!voyage) {
    return (
      <div className="page-container">
        <h2 className="text-cyan mb-1">OFFICIAL PERFORMANCE REPORT GENERATOR</h2>
        <p className="text-secondary">Loading Voyage data...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-4">
        <h2 className="text-cyan mb-1">OFFICIAL PERFORMANCE REPORT GENERATOR</h2>
        <p className="text-secondary" style={{ fontSize: '12px' }}>Generate standardized vessel performance reports suitable for owners, charterers, and ship managers</p>
      </div>

      <div className="panel-row" style={{ gridTemplateColumns: '1fr 2fr' }}>
        {/* Settings Panel */}
        <div className="glass-panel d-flex flex-column justify-content-between">
          <div>
            <div className="panel-title">
              <FileText size={14} className="text-cyan" />
              <span>Report Options</span>
            </div>

            <form onSubmit={handleGenerate}>
              <div className="form-group">
                <label className="form-label" htmlFor="voyage-select-report">Select Voyage</label>
                <select 
                  id="voyage-select-report"
                  className="form-input text-cyan" 
                  value={selectedVoyageId}
                  onChange={(e) => {
                    setSelectedVoyageId(e.target.value);
                    setShowReport(false);
                  }}
                >
                  {voyages.map(v => (
                    <option key={v.id} value={v.id}>{v.voyageNumber} ({v.vesselName})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Include Sections</label>
                <div className="d-flex flex-column   gap-2 mt-2" >
                  <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                    <input type="checkbox" checked={sections.summary} onChange={() => toggleSection('summary')} />
                    <span>Executive Summary</span>
                  </label>
                  <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                    <input type="checkbox" checked={sections.speed} onChange={() => toggleSection('speed')} />
                    <span>Speed Performance</span>
                  </label>
                  <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                    <input type="checkbox" checked={sections.fuel} onChange={() => toggleSection('fuel')} />
                    <span>Fuel Consumption</span>
                  </label>
                  <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                    <input type="checkbox" checked={sections.weather} onChange={() => toggleSection('weather')} />
                    <span>Weather Impact</span>
                  </label>
                  <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                    <input type="checkbox" checked={sections.claims} onChange={() => toggleSection('claims')} />
                    <span>Claims Variance</span>
                  </label>
                  <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                    <input type="checkbox" checked={sections.recs} onChange={() => toggleSection('recs')} />
                    <span>Recommendations</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-cyan bg-warning  w-100 mt-3 py-2 fw-bold">
                COMPILE REPORT PREVIEW
              </button>
            </form>
          </div>
        </div>

        {/* Report Preview Panel */}
        <div className="glass-panel" style={{ minHeight: '400px' }}>
          <div className="panel-title d-flex justify-content-between align-items-center">
            <span>Official Report Document Sheet</span>
            {showReport && (
              <button className="btn btn-secondary py-1 px-2.5" onClick={() => window.print()}>
                <Printer size={12} /> Print PDF
              </button>
            )}
          </div>

          {!showReport ? (
            <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center py-5 text-secondary">
              <FileText size={48} className="text-muted mb-3" />
              <span>Select options on the left and click Compile Report to generate the sheet.</span>
            </div>
          ) : (
            <div className="printable-report">
              <div className="text-center mb-4">
                <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, textTransform: 'uppercase' }}>Vessel Performance Analysis Report</h2>
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
                  Document Ref: VPR-{voyage.voyageNumber} | Compiled under IMO Charter Standard guidelines
                </div>
              </div>

              <table style={{ fontSize: '11px', border: '1px solid #cbd5e1' }}>
                <tbody>
                  <tr>
                    <td><strong>Vessel Name:</strong></td>
                    <td>{voyage.vesselName}</td>
                    <td><strong>Voyage ID:</strong></td>
                    <td>{voyage.voyageNumber}</td>
                  </tr>
                  <tr>
                    <td><strong>Departure Port:</strong></td>
                    <td>{voyage.departurePort}</td>
                    <td><strong>Destination Port:</strong></td>
                    <td>{voyage.destinationPort}</td>
                  </tr>
                  <tr>
                    <td><strong>Warranted Speed:</strong></td>
                    <td>{voyage.cpSpeed} knots</td>
                    <td><strong>Allowed Daily Fuel:</strong></td>
                    <td>{voyage.cpConsumption} MT/day</td>
                  </tr>
                </tbody>
              </table>

              {sections.summary && (
                <div>
                  <h3>1. Executive Summary</h3>
                  <p style={{ fontSize: '11px' }}>
                    During passage from {voyage.departurePort} to {voyage.destinationPort}, the vessel sailed a normalized distance of {voyage.distanceSailed} Nautical Miles. Fuel Remaining On Board (ROB) was monitored throughout daily reports. Under good weather periods (Beaufort scale 4 or below), the overall fleet optimization engine computed performance coefficients.
                  </p>
                </div>
              )}

              {sections.speed && (
                <div>
                  <h3>2. Speed Performance</h3>
                  <p style={{ fontSize: '11px' }}>
                    The average speed maintained during good weather periods was <strong>{stats?.avgSpeedGoodWeather !== undefined && stats?.goodWeatherDays > 0 ? `${stats.avgSpeedGoodWeather} knots` : '--'}</strong>.
                    This represents a speed variance of <strong>{stats?.speedVariance !== undefined && reports.length > 0 ? `${stats.speedVariance} knots` : '--'}</strong> relative to the charter speed limit of {voyage.cpSpeed} knots.
                  </p>
                </div>
              )}

              {sections.fuel && (
                <div>
                  <h3>3. Fuel Consumption</h3>
                  <p style={{ fontSize: '11px' }}>
                    Average daily fuel burned was <strong>{stats?.avgFuelGoodWeather !== undefined && stats?.goodWeatherDays > 0 ? `${stats.avgFuelGoodWeather} MT/day` : '--'}</strong>, resulting in a daily variance of <strong>{stats?.fuelVariance !== undefined && reports.length > 0 ? `${stats.fuelVariance} MT/day` : '--'}</strong> against the charter party allowed daily consumption of {voyage.cpConsumption} MT/day.
                  </p>
                </div>
              )}

              {sections.weather && (
                <div>
                  <h3>4. Weather Impact Summary</h3>
                  <p style={{ fontSize: '11px' }}>
                    During transit, the vessel encountered average wave heights of <strong>{reports.length > 0 ? (reports.reduce((sum, r) => sum + (r.waveHeight || 0), 0) / reports.length).toFixed(1) + 'm' : '--'}</strong> and average wind speeds of <strong>{reports.length > 0 ? (reports.reduce((sum, r) => sum + (r.windSpeed || 0), 0) / reports.length).toFixed(1) + ' knots' : '--'}</strong>. Operational weather risks were evaluated as <strong>{reports.length > 0 ? (reports.filter(r => r.beaufortScale >= 5).length > 0 ? 'Moderate' : 'Low') : '--'}</strong>.
                  </p>
                </div>
              )}

              {sections.claims && (
                <div>
                  <h3>5. Claims & Commercial Liability</h3>
                  <p style={{ fontSize: '11px' }}>
                    The claims analysis engine flagged <strong>{stats?.hasSpeedClaim ? '1 Speed claim' : '0 Speed claims'}</strong> and <strong>{stats?.hasFuelClaim ? '1 Fuel claim' : '0 Fuel claims'}</strong>.
                    Estimated commercial impact is valued at <strong>${stats ? (stats.speedClaimValue + stats.fuelClaimValue).toLocaleString() : '0'} USD</strong>.
                  </p>
                </div>
              )}

              {sections.recs && (
                <div>
                  <h3>6. Recommendations</h3>
                  <ul style={{ fontSize: '11px', paddingLeft: '20px', margin: '6px 0' }}>
                    <li>Adjust engine RPM profile to optimize specific fuel consumption rates.</li>
                    <li>Utilize AI route planning to bypass high wave swells in North Atlantic zones.</li>
                    <li>Inspect vessel hull slip rating to identify potential biofouling resistance.</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
