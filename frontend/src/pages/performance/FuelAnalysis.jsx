import React from 'react';
import { useVoyages } from '../../context/VoyageContext';
import FuelConsumptionChart from '../../components/charts/FuelConsumptionChart';
import ROBTrendChart from '../../components/charts/ROBTrendChart';
import { TrendingDown, ShieldCheck } from 'lucide-react';
import { calculateEmissions } from '../../utils/fuelCalculations';

export default function FuelAnalysis() {
  const { voyages, noonReports, getVoyagePerformanceStats } = useVoyages();
  
  const voyage = voyages.find(v => v.status === 'Active') || voyages[0] || null;

  if (voyages.length === 0) {
    return (
      <div className="page-container d-flex justify-content-center align-items-center" style={{ height: '400px', color: '#64748b' }}>
        <div className="text-center">
          <TrendingDown className="text-cyan mb-2" size={32} />
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>NO VOYAGE DATA AVAILABLE</div>
          <p className="text-secondary mb-0" style={{ fontSize: '11px' }}>Please create a vessel and active voyage to view fuel efficiency analytics.</p>
        </div>
      </div>
    );
  }

  if (!voyage) {
    return (
      <div className="page-container d-flex justify-content-center align-items-center" style={{ height: '400px', color: '#64748b' }}>
        <div className="text-center">
          <div className="spinner-border text-cyan mb-2" role="status">
            <span className="visually-hidden">Loading Fuel Data...</span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.05em' }}>LOADING VOYAGE CONTEXT...</div>
        </div>
      </div>
    );
  }

  const reports = noonReports[voyage.id] || []; // Use voyage.id dynamically rather than hardcoded voyageId
  const stats = getVoyagePerformanceStats(voyage.id);

  // Total actual fuel consumed
  const totalActualFuel = reports.reduce((sum, r) => sum + parseFloat(r.fuelConsumed || 0), 0);
  const carbonEmissions = calculateEmissions(totalActualFuel);

  return (
    <div className="page-container">
      <div className="mb-4">
        <h2 className="text-cyan mb-1">FUEL EFFICIENCY ANALYSIS</h2>
        <p className="text-secondary" style={{ fontSize: '12px' }}>Vessel daily fuel consumption variance monitoring and CO2 carbon footprints estimation</p>
      </div>

      <div className="panel-row">
        <div className="glass-panel">
          <div className="panel-title">
            <TrendingDown size={14} className="text-cyan" />
            <span>Fuel Consumption Bars (MT/day)</span>
          </div>
          <FuelConsumptionChart reports={reports} cpLimit={voyage.cpConsumption} />
        </div>

        <div className="glass-panel">
          <div className="panel-title">
            <TrendingDown size={14} className="text-teal" />
            <span>Remaining Fuel On Board (ROB Trend in MT)</span>
          </div>
          <ROBTrendChart reports={reports} initialROB={1288} />
        </div>
      </div>

      <div className="glass-panel">
        <div className="panel-title">
          <ShieldCheck size={14} className="text-cyan" />
          <span>Fuel Analysis Diagnostics</span>
        </div>
        <div className="row d-flex justify-content-between text-center py-2">
          <div className="flex-fill">
            <div className="text-secondary" style={{ fontSize: '10px' }}>TOTAL FUEL BURNED</div>
            <div className="fw-bold text-cyan" style={{ fontSize: '18px' }}>{totalActualFuel.toFixed(1)} MT</div>
          </div>
          <div className="flex-fill">
            <div className="text-secondary" style={{ fontSize: '10px' }}>DAILY AVG</div>
            <div className="fw-bold text-cyan" style={{ fontSize: '18px' }}>{(totalActualFuel / (reports.length || 1)).toFixed(1)} MT/d</div>
          </div>
          <div className="flex-fill">
            <div className="text-secondary" style={{ fontSize: '10px' }}>DAILY LIMIT</div>
            <div className="fw-bold text-teal" style={{ fontSize: '18px' }}>{voyage.cpConsumption.toFixed(1)} MT/d</div>
          </div>
          <div className="flex-fill">
            <div className="text-secondary" style={{ fontSize: '10px' }}>CO2 EMISSIONS</div>
            <div className="fw-bold text-danger" style={{ fontSize: '18px' }}>{carbonEmissions} MT CO2</div>
          </div>
        </div>
      </div>
    </div>
  );
}
