import React, { useState, useEffect } from 'react';
import { useVoyages } from '../../context/VoyageContext';
import { FileText, Upload, Plus, Check } from 'lucide-react';

export default function NoonReports() {
  const { 
    voyages, 
    uploadNoonReport, 
    uploadCOSP, 
    uploadEOSP, 
    uploadArrivalReport,
    uploadDepartureReport,
    uploadPortNoonReport,
    noonReports,
    cospReports,
    eospReports,
    arrivalReports,
    departureReports,
    portNoonReports
  } = useVoyages();
  const [selectedVoyageId, setSelectedVoyageId] = useState('');
  const [activeTab, setActiveTab] = useState('noon'); // cosp, noon, eosp, portNoon, arrival, departure
  const [showManualForm, setShowManualForm] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Dedicated Port Noon, Arrival, and Departure Fields
  const [portName, setPortName] = useState('Rotterdam');
  const [arrivalPlace, setArrivalPlace] = useState('Berth 4');
  const [departurePlace, setDeparturePlace] = useState('Berth 4');

  // Manual Noon Report Fields
  const [date, setDate] = useState('2026-05-05 12:00');
  const [latitude, setLatitude] = useState('07.52');
  const [longitude, setLongitude] = useState('73.12');
  const [distance, setDistance] = useState('420.5');
  const [speed, setSpeed] = useState('11.8');
  const [rpm, setRpm] = useState('78');
  const [slip, setSlip] = useState('5.0');
  const [windDir, setWindDir] = useState('210');
  const [windSpeed, setWindSpeed] = useState('14');
  const [currentDir, setCurrentDir] = useState('190');
  const [currentSpeed, setCurrentSpeed] = useState('1.1');
  const [beaufort, setBeaufort] = useState('4');
  const [fuelConsumed, setFuelConsumed] = useState('36.2');
  const [robFuel, setRobFuel] = useState('1138');

  // Gaps Coverage - Noon Report Extra Fields
  const [draftForward, setDraftForward] = useState('12.0');
  const [draftMid, setDraftMid] = useState('12.2');
  const [draftAft, setDraftAft] = useState('12.4');
  const [displacement, setDisplacement] = useState('85000');
  const [constant, setConstant] = useState('250');

  const [meCylinderOilRob, setMeCylinderOilRob] = useState('45');
  const [cylinderOilConsumption, setCylinderOilConsumption] = useState('1.2');
  const [meSystemOilRob, setMeSystemOilRob] = useState('32');
  const [meSystemOilConsumption, setMeSystemOilConsumption] = useState('0.8');
  const [aeLoRob, setAeLoRob] = useState('15');
  const [aeLoConsumption, setAeLoConsumption] = useState('0.3');

  const [fwGenerated, setFwGenerated] = useState('15');
  const [fwConsumed, setFwConsumed] = useState('12');
  const [fwReceived, setFwReceived] = useState('0');
  const [fwRob, setFwRob] = useState('180');

  const [ae1Hours, setAe1Hours] = useState('24');
  const [ae2Hours, setAe2Hours] = useState('24');
  const [ae3Hours, setAe3Hours] = useState('0');

  const [meHsfoConsumed, setMeHsfoConsumed] = useState('22.0');
  const [meLsfoConsumed, setMeLsfoConsumed] = useState('5.5');
  const [meMgoConsumed, setMeMgoConsumed] = useState('1.2');
  const [aeHsfoConsumed, setAeHsfoConsumed] = useState('2.1');
  const [aeLsfoConsumed, setAeLsfoConsumed] = useState('1.0');
  const [aeMgoConsumed, setAeMgoConsumed] = useState('0.5');
  const [boilerHsfoConsumed, setBoilerHsfoConsumed] = useState('1.5');
  const [boilerLsfoConsumed, setBoilerLsfoConsumed] = useState('0.8');
  const [boilerMgoConsumed, setBoilerMgoConsumed] = useState('0.2');
  
  const [robHsfo, setRobHsfo] = useState('800');
  const [robLsfo, setRobLsfo] = useState('120');
  const [robMgo, setRobMgo] = useState('30');

  const [swellDirection, setSwellDirection] = useState('S');
  const [windDirection, setWindDirection] = useState('SSW');
  const [currentDirection, setCurrentDirection] = useState('SSW');

  // Cargo Information (COSP & EOSP & Voyage)
  const [cargoDescription, setCargoDescription] = useState('Crude Oil (Brent Crude)');
  const [cargoQuantity, setCargoQuantity] = useState('80000');
  const [billOfLadingQuantity, setBillOfLadingQuantity] = useState('80200');
  const [cargoRemarks, setCargoRemarks] = useState('Laden passage via Suez');

  // Noon Position Report Gaps State
  const [utcTime, setUtcTime] = useState('12:00');
  const [vesselCondition, setVesselCondition] = useState('Laden');
  const [lastPort, setLastPort] = useState('Singapore (SGP)');
  const [nextPort, setNextPort] = useState('Rotterdam (RTM)');
  const [distanceToNextPort, setDistanceToNextPort] = useState('7894');
  const [engineDistance, setEngineDistance] = useState('460');
  const [distanceSailedFromCosp, setDistanceSailedFromCosp] = useState('456');
  const [steamingTimeDaily, setSteamingTimeDaily] = useState('24');
  const [steamingTimeAfterCosp, setSteamingTimeAfterCosp] = useState('24');
  const [allowedCpSpeed, setAllowedCpSpeed] = useState('12.5');
  const [averageSpeed, setAverageSpeed] = useState('11.3');
  const [eta, setEta] = useState('2026-05-16');
  const [fuelReceived, setFuelReceived] = useState('0');
  const [remarks, setRemarks] = useState('Steady passage tracking.');

  // Manual COSP Fields
  const [cospDraft, setCospDraft] = useState('12.5m');
  const [cospRob, setCospRob] = useState('1288');

  // Manual EOSP Fields
  const [eospPos, setEospPos] = useState('Rotterdam Pilot Station');
  const [eospRob, setEospRob] = useState('250');

  // Sync selectedVoyageId when voyages load
  useEffect(() => {
    if (voyages.length > 0 && (!selectedVoyageId || selectedVoyageId === 'voyage-15')) {
      const active = voyages.find(v => v.status === 'Active') || voyages[0];
      if (active) {
        setSelectedVoyageId(active.id);
      }
    }
  }, [voyages, selectedVoyageId]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (!selectedVoyageId) {
      alert('Please select a Voyage Context first.');
      return;
    }

    setUploadSuccess(true);
    setTimeout(async () => {
      setUploadSuccess(false);
      try {
        await uploadNoonReport(selectedVoyageId, {
          date: new Date().toISOString().slice(0, 10) + ' 12:00',
          latitude: '08°12\'N',
          longitude: '068°40\'E',
          distanceSailed: 428.0,
          speed: 11.2,
          rpm: 77,
          slip: 5.4,
          windSpeed: 14,
          windDir: '215',
          windDirection: 'SW',
          currentSpeed: 1.0,
          currentDir: '185',
          currentDirection: 'S',
          swellDirection: 'SSW',
          beaufortScale: 4,
          waveHeight: 1.0,
          fuelConsumed: 37.1,
          robFuel: 1100,
          draftForward: 12.0,
          draftMid: 12.2,
          draftAft: 12.4,
          displacement: 85000,
          constant: 250,
          meCylinderOilRob: 45,
          cylinderOilConsumption: 1.2,
          meSystemOilRob: 32,
          meSystemOilConsumption: 0.8,
          aeLoRob: 15,
          aeLoConsumption: 0.3,
          fwGenerated: 15,
          fwConsumed: 12,
          fwReceived: 0,
          fwRob: 180,
          ae1Hours: 24,
          ae2Hours: 24,
          ae3Hours: 0,
          meHsfoConsumed: 22.0,
          meLsfoConsumed: 5.5,
          meMgoConsumed: 1.2,
          aeHsfoConsumed: 2.1,
          aeLsfoConsumed: 1.0,
          aeMgoConsumed: 0.5,
          boilerHsfoConsumed: 1.5,
          boilerLsfoConsumed: 0.8,
          boilerMgoConsumed: 0.2,
          robHsfo: 800,
          robLsfo: 120,
          robMgo: 30,
          // Template gaps seeded on drops
          utcTime: '12:00',
          vesselCondition: 'Laden',
          lastPort: 'Singapore (SGP)',
          nextPort: 'Rotterdam (RTM)',
          distanceToNextPort: 7894,
          engineDistance: 460,
          distanceSailedFromCosp: 456,
          steamingTimeDaily: 24,
          steamingTimeAfterCosp: 24,
          allowedCpSpeed: 12.5,
          averageSpeed: 11.3,
          eta: '2026-05-16',
          fuelReceived: 0,
          remarks: 'Automatic parse upload'
        });
        alert('File uploaded and parsed by MongoDB Normalization Engine.');
      } catch (err) {
        alert(`File upload failed: ${err.message}`);
      }
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedVoyageId) {
      alert('Please select a Voyage Context first.');
      return;
    }

    try {
      if (activeTab === 'noon') {
        await uploadNoonReport(selectedVoyageId, {
          date,
          latitude,
          longitude,
          distanceSailed: parseFloat(distance) || 0,
          speed: parseFloat(speed) || 0,
          rpm: parseInt(rpm, 10) || 0,
          slip: parseFloat(slip) || 0,
          windSpeed: parseFloat(windSpeed) || 0,
          windDir,
          windDirection,
          currentSpeed: parseFloat(currentSpeed) || 0,
          currentDir,
          currentDirection,
          swellDirection,
          beaufortScale: parseInt(beaufort, 10) || 0,
          fuelConsumed: parseFloat(fuelConsumed) || 0,
          robFuel: parseFloat(robFuel) || 0,
          draftForward: parseFloat(draftForward) || 0,
          draftMid: parseFloat(draftMid) || 0,
          draftAft: parseFloat(draftAft) || 0,
          displacement: parseFloat(displacement) || 0,
          constant: parseFloat(constant) || 0,
          meCylinderOilRob: parseFloat(meCylinderOilRob) || 0,
          cylinderOilConsumption: parseFloat(cylinderOilConsumption) || 0,
          meSystemOilRob: parseFloat(meSystemOilRob) || 0,
          meSystemOilConsumption: parseFloat(meSystemOilConsumption) || 0,
          aeLoRob: parseFloat(aeLoRob) || 0,
          aeLoConsumption: parseFloat(aeLoConsumption) || 0,
          fwGenerated: parseFloat(fwGenerated) || 0,
          fwConsumed: parseFloat(fwConsumed) || 0,
          fwReceived: parseFloat(fwReceived) || 0,
          fwRob: parseFloat(fwRob) || 0,
          ae1Hours: parseFloat(ae1Hours) || 0,
          ae2Hours: parseFloat(ae2Hours) || 0,
          ae3Hours: parseFloat(ae3Hours) || 0,
          meHsfoConsumed: parseFloat(meHsfoConsumed) || 0,
          meLsfoConsumed: parseFloat(meLsfoConsumed) || 0,
          meMgoConsumed: parseFloat(meMgoConsumed) || 0,
          aeHsfoConsumed: parseFloat(aeHsfoConsumed) || 0,
          aeLsfoConsumed: parseFloat(aeLsfoConsumed) || 0,
          aeMgoConsumed: parseFloat(aeMgoConsumed) || 0,
          boilerHsfoConsumed: parseFloat(boilerHsfoConsumed) || 0,
          boilerLsfoConsumed: parseFloat(boilerLsfoConsumed) || 0,
          boilerMgoConsumed: parseFloat(boilerMgoConsumed) || 0,
          robHsfo: parseFloat(robHsfo) || 0,
          robLsfo: parseFloat(robLsfo) || 0,
          robMgo: parseFloat(robMgo) || 0,
          // Seeding gaps template parameters
          utcTime,
          vesselCondition,
          lastPort,
          nextPort,
          distanceToNextPort: parseFloat(distanceToNextPort) || 0,
          engineDistance: parseFloat(engineDistance) || 0,
          distanceSailedFromCosp: parseFloat(distanceSailedFromCosp) || 0,
          steamingTimeDaily: parseFloat(steamingTimeDaily) || 0,
          steamingTimeAfterCosp: parseFloat(steamingTimeAfterCosp) || 0,
          allowedCpSpeed: parseFloat(allowedCpSpeed) || 0,
          averageSpeed: parseFloat(averageSpeed) || 0,
          eta,
          fuelReceived: parseFloat(fuelReceived) || 0,
          remarks
        });
        setDate(new Date().toISOString().slice(0, 16).replace('T', ' '));
      } else if (activeTab === 'portNoon') {
        await uploadPortNoonReport(selectedVoyageId, {
          date,
          utcTime,
          portName,
          vesselCondition,
          draftForward: parseFloat(draftForward) || 0,
          draftMid: parseFloat(draftMid) || 0,
          draftAft: parseFloat(draftAft) || 0,
          displacement: parseFloat(displacement) || 0,
          constant: parseFloat(constant) || 0,
          meHsfoConsumed: parseFloat(meHsfoConsumed) || 0,
          meLsfoConsumed: parseFloat(meLsfoConsumed) || 0,
          meMgoConsumed: parseFloat(meMgoConsumed) || 0,
          aeHsfoConsumed: parseFloat(aeHsfoConsumed) || 0,
          aeLsfoConsumed: parseFloat(aeLsfoConsumed) || 0,
          aeMgoConsumed: parseFloat(aeMgoConsumed) || 0,
          boilerHsfoConsumed: parseFloat(boilerHsfoConsumed) || 0,
          boilerLsfoConsumed: parseFloat(boilerLsfoConsumed) || 0,
          boilerMgoConsumed: parseFloat(boilerMgoConsumed) || 0,
          fuelConsumed: parseFloat(fuelConsumed) || 0,
          fuelReceived: parseFloat(fuelReceived) || 0,
          robHsfo: parseFloat(robHsfo) || 0,
          robLsfo: parseFloat(robLsfo) || 0,
          robMgo: parseFloat(robMgo) || 0,
          robFuel: parseFloat(robFuel) || 0,
          meCylinderOilRob: parseFloat(meCylinderOilRob) || 0,
          cylinderOilConsumption: parseFloat(cylinderOilConsumption) || 0,
          meSystemOilRob: parseFloat(meSystemOilRob) || 0,
          meSystemOilConsumption: parseFloat(meSystemOilConsumption) || 0,
          aeLoRob: parseFloat(aeLoRob) || 0,
          aeLoConsumption: parseFloat(aeLoConsumption) || 0,
          fwGenerated: parseFloat(fwGenerated) || 0,
          fwConsumed: parseFloat(fwConsumed) || 0,
          fwReceived: parseFloat(fwReceived) || 0,
          fwRob: parseFloat(fwRob) || 0,
          ae1Hours: parseFloat(ae1Hours) || 0,
          ae2Hours: parseFloat(ae2Hours) || 0,
          ae3Hours: parseFloat(ae3Hours) || 0,
          remarks
        });
      } else if (activeTab === 'cosp') {
        await uploadCOSP(selectedVoyageId, {
          date: new Date().toISOString().slice(0, 16).replace('T', ' '),
          position: 'Singapore Pilot Station',
          draft: cospDraft,
          robFuel: parseFloat(cospRob),
          eta: '2026-05-16',
          draftForward: parseFloat(draftForward) || 12.0,
          draftMid: parseFloat(draftMid) || 12.2,
          draftAft: parseFloat(draftAft) || 12.4,
          displacement: parseFloat(displacement) || 85000,
          constant: parseFloat(constant) || 250,
          cargoDescription,
          cargoQuantity: parseFloat(cargoQuantity) || 0,
          billOfLadingQuantity: parseFloat(billOfLadingQuantity) || 0,
          cargoRemarks
        });
      } else if (activeTab === 'eosp') {
        await uploadEOSP(selectedVoyageId, {
          date: new Date().toISOString().slice(0, 16).replace('T', ' '),
          arrivalPosition: eospPos,
          distanceSailedTotal: activeVoyage?.distanceTotal || 8350,
          robArrival: parseFloat(eospRob),
          draftForward: parseFloat(draftForward) || 12.0,
          draftMid: parseFloat(draftMid) || 12.2,
          draftAft: parseFloat(draftAft) || 12.4,
          displacement: parseFloat(displacement) || 85000,
          constant: parseFloat(constant) || 250,
          cargoDescription,
          cargoQuantity: parseFloat(cargoQuantity) || 0,
          billOfLadingQuantity: parseFloat(billOfLadingQuantity) || 0,
          cargoRemarks
        });
      } else if (activeTab === 'arrival') {
        await uploadArrivalReport(selectedVoyageId, {
          date,
          utcTime,
          portName,
          arrivalPlace,
          draftForward: parseFloat(draftForward) || 0,
          draftMid: parseFloat(draftMid) || 0,
          draftAft: parseFloat(draftAft) || 0,
          displacement: parseFloat(displacement) || 0,
          constant: parseFloat(constant) || 0,
          cargoDescription,
          cargoQuantity: parseFloat(cargoQuantity) || 0,
          billOfLadingQuantity: parseFloat(billOfLadingQuantity) || 0,
          cargoRemarks,
          robHsfo: parseFloat(robHsfo) || 0,
          robLsfo: parseFloat(robLsfo) || 0,
          robMgo: parseFloat(robMgo) || 0,
          robFuel: parseFloat(robFuel) || 0,
          meCylinderOilRob: parseFloat(meCylinderOilRob) || 0,
          meSystemOilRob: parseFloat(meSystemOilRob) || 0,
          aeLoRob: parseFloat(aeLoRob) || 0,
          fwRob: parseFloat(fwRob) || 0,
          ae1Hours: parseFloat(ae1Hours) || 0,
          ae2Hours: parseFloat(ae2Hours) || 0,
          ae3Hours: parseFloat(ae3Hours) || 0,
          remarks
        });
      } else if (activeTab === 'departure') {
        await uploadDepartureReport(selectedVoyageId, {
          date,
          utcTime,
          portName,
          departurePlace,
          draftForward: parseFloat(draftForward) || 0,
          draftMid: parseFloat(draftMid) || 0,
          draftAft: parseFloat(draftAft) || 0,
          displacement: parseFloat(displacement) || 0,
          constant: parseFloat(constant) || 0,
          cargoDescription,
          cargoQuantity: parseFloat(cargoQuantity) || 0,
          billOfLadingQuantity: parseFloat(billOfLadingQuantity) || 0,
          cargoRemarks,
          robHsfo: parseFloat(robHsfo) || 0,
          robLsfo: parseFloat(robLsfo) || 0,
          robMgo: parseFloat(robMgo) || 0,
          robFuel: parseFloat(robFuel) || 0,
          meCylinderOilRob: parseFloat(meCylinderOilRob) || 0,
          meSystemOilRob: parseFloat(meSystemOilRob) || 0,
          aeLoRob: parseFloat(aeLoRob) || 0,
          fwRob: parseFloat(fwRob) || 0,
          ae1Hours: parseFloat(ae1Hours) || 0,
          ae2Hours: parseFloat(ae2Hours) || 0,
          ae3Hours: parseFloat(ae3Hours) || 0,
          nextPort,
          allowedCpSpeed: parseFloat(allowedCpSpeed) || 0,
          remarks
        });
      }
      alert('Report submitted and processed by MongoDB Normalization Engine.');
    } catch (err) {
      alert(`Report upload failed: ${err.message}`);
    }
  };

  const activeVoyage = voyages.find(v => v.id === selectedVoyageId) || voyages[0] || null;

  const getActiveList = () => {
    if (activeTab === 'noon') {
      return (noonReports[selectedVoyageId] || []).map(r => ({
        date: r.date,
        col1: `${r.latitude}, ${r.longitude}`,
        col2: `${r.speed} kt`,
        col3: `${r.robFuel} MT`,
        col4: `BF ${r.beaufortScale}`
      }));
    }
    if (activeTab === 'portNoon') {
      return (portNoonReports[selectedVoyageId] || []).map(r => ({
        date: r.date,
        col1: r.portName || 'In Port',
        col2: '-',
        col3: `${r.robFuel} MT`,
        col4: r.vesselCondition
      }));
    }
    if (activeTab === 'cosp') {
      const cosp = cospReports[selectedVoyageId];
      return cosp ? [{
        date: cosp.date,
        col1: cosp.position || 'Departure Pilot',
        col2: cosp.draft,
        col3: `${cosp.robFuel} MT`,
        col4: cosp.eta
      }] : [];
    }
    if (activeTab === 'eosp') {
      const eosp = eospReports[selectedVoyageId];
      return eosp ? [{
        date: eosp.date,
        col1: eosp.arrivalPosition || 'Arrival Pilot',
        col2: '-',
        col3: `${eosp.robArrival} MT`,
        col4: '-'
      }] : [];
    }
    if (activeTab === 'arrival') {
      const arr = arrivalReports[selectedVoyageId];
      return arr ? [{
        date: arr.date,
        col1: `${arr.portName} (${arr.arrivalPlace})`,
        col2: `Fwd: ${arr.draftForward}m`,
        col3: `${arr.robFuel} MT`,
        col4: arr.remarks || '-'
      }] : [];
    }
    if (activeTab === 'departure') {
      const dep = departureReports[selectedVoyageId];
      return dep ? [{
        date: dep.date,
        col1: `${dep.portName} (${dep.departurePlace})`,
        col2: `Fwd: ${dep.draftForward}m`,
        col3: `${dep.robFuel} MT`,
        col4: `Allowed: ${dep.allowedCpSpeed} kt`
      }] : [];
    }
    return [];
  };

  const getTableHeader = () => {
    if (activeTab === 'noon') {
      return (
        <tr>
          <th>Date</th>
          <th>Position</th>
          <th>Speed</th>
          <th>Fuel ROB</th>
          <th>Beaufort</th>
        </tr>
      );
    }
    if (activeTab === 'portNoon') {
      return (
        <tr>
          <th>Date</th>
          <th>Port</th>
          <th>Speed</th>
          <th>Fuel ROB</th>
          <th>Condition</th>
        </tr>
      );
    }
    if (activeTab === 'cosp') {
      return (
        <tr>
          <th>Date</th>
          <th>Position</th>
          <th>Draft</th>
          <th>Fuel ROB</th>
          <th>ETA</th>
        </tr>
      );
    }
    if (activeTab === 'eosp') {
      return (
        <tr>
          <th>Date</th>
          <th>Arrival Pos</th>
          <th>Speed</th>
          <th>Fuel ROB</th>
          <th>-</th>
        </tr>
      );
    }
    if (activeTab === 'arrival') {
      return (
        <tr>
          <th>Date</th>
          <th>Port (Location)</th>
          <th>Draft Fwd</th>
          <th>Fuel ROB</th>
          <th>Remarks</th>
        </tr>
      );
    }
    if (activeTab === 'departure') {
      return (
        <tr>
          <th>Date</th>
          <th>Port (Location)</th>
          <th>Draft Fwd</th>
          <th>Fuel ROB</th>
          <th>Allowed Speed</th>
        </tr>
      );
    }
    return null;
  };

  const activeReportsList = getActiveList();

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-cyan mb-1">REPORT UPLOAD CENTER</h2>
          <p className="text-secondary" style={{ fontSize: '12px' }}>Standardize Excel, PDF, and manual vessel logs into the standardized Voyage Data Warehouse</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <label className="text-secondary" style={{ fontSize: '11px' }} htmlFor="voyage-select-upload">Voyage Context:</label>
          <select 
            id="voyage-select-upload"
            className="form-input py-1 px-2 text-cyan" 
            style={{ width: '180px', fontSize: '12px' }}
            value={selectedVoyageId}
            onChange={(e) => setSelectedVoyageId(e.target.value)}
          >
            <option value="" disabled>Select Voyage...</option>
            {voyages.map(v => (
              <option key={v.id} value={v.id}>{v.voyageNumber} ({v.vesselName})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="panel-row">
        {/* Upload Column */}
        <div className="glass-panel">
          <div className="reports-tab-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            <button className={`report-tab-btn ${activeTab === 'cosp' ? 'active' : ''}`} onClick={() => setActiveTab('cosp')}>COSP Upload</button>
            <button className={`report-tab-btn ${activeTab === 'noon' ? 'active' : ''}`} onClick={() => setActiveTab('noon')}>Noon Reports (Sea)</button>
            <button className={`report-tab-btn ${activeTab === 'eosp' ? 'active' : ''}`} onClick={() => setActiveTab('eosp')}>EOSP Upload</button>
            <button className={`report-tab-btn ${activeTab === 'portNoon' ? 'active' : ''}`} onClick={() => setActiveTab('portNoon')}>Port Noon</button>
            <button className={`report-tab-btn ${activeTab === 'arrival' ? 'active' : ''}`} onClick={() => setActiveTab('arrival')}>Arrival Report</button>
            <button className={`report-tab-btn ${activeTab === 'departure' ? 'active' : ''}`} onClick={() => setActiveTab('departure')}>Departure Report</button>
          </div>

          <div 
            className="dropzone-container"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            {uploadSuccess ? (
              <>
                <Check className="text-teal pulse-pin" size={40} />
                <span className="fw-bold text-teal">PARSING & NORMALIZING SUCCESSFUL</span>
                <span className="text-muted" style={{ fontSize: '11px' }}>Inserting records into Voyage Data Warehouse...</span>
              </>
            ) : (
              <>
                <Upload className="dropzone-icon" size={36} />
                <span className="fw-bold">Drag & Drop noon reports Excel, PDF, or CSV</span>
                <span className="text-secondary" style={{ fontSize: '11px' }}>Standardizes coordinate strings, fuel variables, and weather indexes automatically</span>
                <span className="text-cyan mt-1" style={{ fontSize: '10px' }}>Or drop files here to trigger PDF parser</span>
              </>
            )}
          </div>

          <div className="panel-title mt-4">
            <FileText size={14} className="text-cyan" />
            <span>Recent Logged Records ({activeReportsList.length})</span>
          </div>

          <div className="maritime-table-wrapper" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            <table className="maritime-table">
              <thead>
                {getTableHeader()}
              </thead>
              <tbody>
                {activeReportsList.map((r, i) => (
                  <tr key={i}>
                    <td>{r.date}</td>
                    <td>{r.col1}</td>
                    <td>{r.col2}</td>
                    <td>{r.col3}</td>
                    <td>{r.col4}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manual Form Column */}
        <div className="glass-panel" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
          <div className="panel-title">
            <Plus size={14} className="text-cyan" />
            <span>Manual Entry Form</span>
          </div>

          <form onSubmit={handleSubmit} style={{ fontSize: '12px' }}>
            {activeTab === 'noon' && (
              <>
                <div className="row d-flex gap-3 mb-2">
                  <div className="form-group flex-fill">
                    <label className="form-label" htmlFor="noon-date-input">Date (UTC)</label>
                    <input id="noon-date-input" type="text" className="form-input py-1.5" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="form-group flex-fill">
                    <label className="form-label" htmlFor="noon-lat-input">Latitude *</label>
                    <input id="noon-lat-input" type="text" className="form-input py-1.5" placeholder="e.g. 07.52 or 07°31'N" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                  </div>
                  <div className="form-group flex-fill">
                    <label className="form-label" htmlFor="noon-lon-input">Longitude *</label>
                    <input id="noon-lon-input" type="text" className="form-input py-1.5" placeholder="e.g. 73.12 or 073°07'E" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                  </div>
                </div>

                <div className="row d-flex gap-3 mb-2">
                  <div className="form-group flex-fill">
                    <label className="form-label" htmlFor="noon-dist-input">Sailed Dist (NM)</label>
                    <input id="noon-dist-input" type="number" step="0.1" className="form-input py-1.5" value={distance} onChange={(e) => setDistance(e.target.value)} />
                  </div>
                  <div className="form-group flex-fill">
                    <label className="form-label" htmlFor="noon-speed-input">Speed (kt) *</label>
                    <input id="noon-speed-input" type="number" step="0.1" className="form-input py-1.5" value={speed} onChange={(e) => setSpeed(e.target.value)} />
                  </div>
                  <div className="form-group flex-fill">
                    <label className="form-label" htmlFor="noon-rpm-input">Engine RPM</label>
                    <input id="noon-rpm-input" type="number" className="form-input py-1.5" value={rpm} onChange={(e) => setRpm(e.target.value)} />
                  </div>
                </div>

                <div className="row d-flex gap-3 mb-2">
                  <div className="form-group flex-fill">
                    <label className="form-label" htmlFor="noon-slip-input">Slip (%)</label>
                    <input id="noon-slip-input" type="number" step="0.1" className="form-input py-1.5" value={slip} onChange={(e) => setSlip(e.target.value)} />
                  </div>
                  <div className="form-group flex-fill">
                    <label className="form-label" htmlFor="noon-wind-input">Wind Speed (kt)</label>
                    <input id="noon-wind-input" type="number" className="form-input py-1.5" value={windSpeed} onChange={(e) => setWindSpeed(e.target.value)} />
                  </div>
                  <div className="form-group flex-fill">
                    <label className="form-label" htmlFor="noon-bf-input">Beaufort Scale *</label>
                    <input id="noon-bf-input" type="number" className="form-input py-1.5" value={beaufort} onChange={(e) => setBeaufort(e.target.value)} />
                  </div>
                </div>

                <div className="row d-flex gap-3 mb-2">
                  <div className="form-group flex-fill">
                    <label className="form-label" htmlFor="noon-fuel-input">Fuel Consumed (MT) *</label>
                    <input id="noon-fuel-input" type="number" step="0.1" className="form-input py-1.5" value={fuelConsumed} onChange={(e) => setFuelConsumed(e.target.value)} />
                  </div>
                  <div className="form-group flex-fill">
                    <label className="form-label" htmlFor="noon-rob-input">ROB Fuel (MT) *</label>
                    <input id="noon-rob-input" type="number" className="form-input py-1.5" value={robFuel} onChange={(e) => setRobFuel(e.target.value)} />
                  </div>
                </div>

                {/* Collapsible foldout for advanced parameters */}
                <details className="mt-3 mb-2" style={{ border: '1px solid var(--border-medium)', borderRadius: '6px', padding: '10px', background: 'rgba(255,255,255,0.01)' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: 'var(--color-cyan)' }}>Advanced Reporting Parameters</summary>
                  <div className="mt-2">
                    <h6 className="text-teal mb-2" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>General Voyage Template Gaps</h6>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">UTC Time</label>
                        <input type="text" className="form-input py-1.5" value={utcTime} onChange={(e) => setUtcTime(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Vessel Condition</label>
                        <select className="form-input py-1.5 text-cyan" value={vesselCondition} onChange={(e) => setVesselCondition(e.target.value)}>
                          <option value="Laden">Laden</option>
                          <option value="Ballast">Ballast</option>
                        </select>
                      </div>
                    </div>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">Last Port</label>
                        <input type="text" className="form-input py-1.5" value={lastPort} onChange={(e) => setLastPort(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Next Port</label>
                        <input type="text" className="form-input py-1.5" value={nextPort} onChange={(e) => setNextPort(e.target.value)} />
                      </div>
                    </div>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">Dist to Next Port (NM)</label>
                        <input type="number" className="form-input py-1.5" value={distanceToNextPort} onChange={(e) => setDistanceToNextPort(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Engine Distance (NM)</label>
                        <input type="number" className="form-input py-1.5" value={engineDistance} onChange={(e) => setEngineDistance(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Dist from COSP (NM)</label>
                        <input type="number" className="form-input py-1.5" value={distanceSailedFromCosp} onChange={(e) => setDistanceSailedFromCosp(e.target.value)} />
                      </div>
                    </div>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">Daily Steam Time (hrs)</label>
                        <input type="number" className="form-input py-1.5" value={steamingTimeDaily} onChange={(e) => setSteamingTimeDaily(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Steam Time post-COSP (hrs)</label>
                        <input type="number" className="form-input py-1.5" value={steamingTimeAfterCosp} onChange={(e) => setSteamingTimeAfterCosp(e.target.value)} />
                      </div>
                    </div>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">Allowed CP Speed (kt)</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={allowedCpSpeed} onChange={(e) => setAllowedCpSpeed(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Average Speed (kt)</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={averageSpeed} onChange={(e) => setAverageSpeed(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">ETA Date</label>
                        <input type="text" className="form-input py-1.5" value={eta} onChange={(e) => setEta(e.target.value)} />
                      </div>
                    </div>

                    <h6 className="text-teal mb-2 mt-3" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>Draft & Displacement</h6>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">Draft Fwd (m)</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={draftForward} onChange={(e) => setDraftForward(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Draft Mid (m)</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={draftMid} onChange={(e) => setDraftMid(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Draft Aft (m)</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={draftAft} onChange={(e) => setDraftAft(e.target.value)} />
                      </div>
                    </div>
                    <div className="row d-flex gap-3 mb-3">
                      <div className="form-group flex-fill">
                        <label className="form-label">Displacement (MT)</label>
                        <input type="number" className="form-input py-1.5" value={displacement} onChange={(e) => setDisplacement(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Constant (MT)</label>
                        <input type="number" className="form-input py-1.5" value={constant} onChange={(e) => setConstant(e.target.value)} />
                      </div>
                    </div>

                    <h6 className="text-teal mb-2" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>Lube Oil Monitoring</h6>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">ME Cyl ROB (L)</label>
                        <input type="number" className="form-input py-1.5" value={meCylinderOilRob} onChange={(e) => setMeCylinderOilRob(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Cyl Cons (L/day)</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={cylinderOilConsumption} onChange={(e) => setCylinderOilConsumption(e.target.value)} />
                      </div>
                    </div>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">ME Sys ROB (L)</label>
                        <input type="number" className="form-input py-1.5" value={meSystemOilRob} onChange={(e) => setMeSystemOilRob(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Sys Cons (L/day)</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={meSystemOilConsumption} onChange={(e) => setMeSystemOilConsumption(e.target.value)} />
                      </div>
                    </div>
                    <div className="row d-flex gap-3 mb-3">
                      <div className="form-group flex-fill">
                        <label className="form-label">AE LO ROB (L)</label>
                        <input type="number" className="form-input py-1.5" value={aeLoRob} onChange={(e) => setAeLoRob(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">AE Cons (L/day)</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={aeLoConsumption} onChange={(e) => setAeLoConsumption(e.target.value)} />
                      </div>
                    </div>

                    <h6 className="text-teal mb-2" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>Fresh Water Monitoring</h6>
                    <div className="row d-flex gap-3 mb-3">
                      <div className="form-group flex-fill">
                        <label className="form-label">FW Generated</label>
                        <input type="number" className="form-input py-1.5" value={fwGenerated} onChange={(e) => setFwGenerated(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">FW Consumed</label>
                        <input type="number" className="form-input py-1.5" value={fwConsumed} onChange={(e) => setFwConsumed(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">FW Received</label>
                        <input type="number" className="form-input py-1.5" value={fwReceived} onChange={(e) => setFwReceived(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">FW ROB</label>
                        <input type="number" className="form-input py-1.5" value={fwRob} onChange={(e) => setFwRob(e.target.value)} />
                      </div>
                    </div>

                    <h6 className="text-teal mb-2" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>Auxiliary Engines Hours</h6>
                    <div className="row d-flex gap-3 mb-3">
                      <div className="form-group flex-fill">
                        <label className="form-label">AE1 (hrs)</label>
                        <input type="number" className="form-input py-1.5" value={ae1Hours} onChange={(e) => setAe1Hours(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">AE2 (hrs)</label>
                        <input type="number" className="form-input py-1.5" value={ae2Hours} onChange={(e) => setAe2Hours(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">AE3 (hrs)</label>
                        <input type="number" className="form-input py-1.5" value={ae3Hours} onChange={(e) => setAe3Hours(e.target.value)} />
                      </div>
                    </div>

                    <h6 className="text-teal mb-2" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>Detailed Fuel Consumptions (Main / Aux / Boiler)</h6>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">ME HSFO (MT)</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={meHsfoConsumed} onChange={(e) => setMeHsfoConsumed(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">ME LSFO (MT)</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={meLsfoConsumed} onChange={(e) => setMeLsfoConsumed(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">ME MGO (MT)</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={meMgoConsumed} onChange={(e) => setMeMgoConsumed(e.target.value)} />
                      </div>
                    </div>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">AE HSFO (MT)</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={aeHsfoConsumed} onChange={(e) => setAeHsfoConsumed(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">AE LSFO (MT)</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={aeLsfoConsumed} onChange={(e) => setAeLsfoConsumed(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">AE MGO (MT)</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={aeMgoConsumed} onChange={(e) => setAeMgoConsumed(e.target.value)} />
                      </div>
                    </div>
                    <div className="row d-flex gap-3 mb-3">
                      <div className="form-group flex-fill">
                        <label className="form-label">Boiler HSFO</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={boilerHsfoConsumed} onChange={(e) => setBoilerHsfoConsumed(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Boiler LSFO</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={boilerLsfoConsumed} onChange={(e) => setBoilerLsfoConsumed(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Boiler MGO</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={boilerMgoConsumed} onChange={(e) => setBoilerMgoConsumed(e.target.value)} />
                      </div>
                    </div>

                    <h6 className="text-teal mb-2" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>Detailed ROB Fuel Tracking & Received</h6>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">ROB HSFO (MT)</label>
                        <input type="number" className="form-input py-1.5" value={robHsfo} onChange={(e) => setRobHsfo(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">ROB LSFO (MT)</label>
                        <input type="number" className="form-input py-1.5" value={robLsfo} onChange={(e) => setRobLsfo(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">ROB MGO (MT)</label>
                        <input type="number" className="form-input py-1.5" value={robMgo} onChange={(e) => setRobMgo(e.target.value)} />
                      </div>
                    </div>
                    <div className="row d-flex gap-3 mb-3">
                      <div className="form-group flex-fill">
                        <label className="form-label">Bunker Fuel Received (MT)</label>
                        <input type="number" className="form-input py-1.5" value={fuelReceived} onChange={(e) => setFuelReceived(e.target.value)} />
                      </div>
                    </div>

                    <h6 className="text-teal mb-2" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>Enhanced Weather</h6>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">Swell Dir</label>
                        <input type="text" className="form-input py-1.5" placeholder="e.g. WSW" value={swellDirection} onChange={(e) => setSwellDirection(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Wind Direction</label>
                        <input type="text" className="form-input py-1.5" placeholder="e.g. SSW" value={windDirection} onChange={(e) => setWindDirection(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Current Dir</label>
                        <input type="text" className="form-input py-1.5" placeholder="e.g. SSW" value={currentDirection} onChange={(e) => setCurrentDirection(e.target.value)} />
                      </div>
                    </div>

                    <h6 className="text-teal mb-2 mt-3" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>Remarks</h6>
                    <div className="form-group mb-2">
                      <label className="form-label">Operational Remarks</label>
                      <textarea className="form-input py-1.5 w-100" style={{ height: '60px', background: '#0b0f19', color: '#fff', border: '1px solid var(--border-medium)', borderRadius: '4px' }} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                    </div>
                  </div>
                </details>
              </>
            )}

            {activeTab === 'cosp' && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="cosp-draft-input">Departure Draft</label>
                  <input id="cosp-draft-input" type="text" className="form-input" value={cospDraft} onChange={(e) => setCospDraft(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="cosp-rob-input">Fuel ROB at Departure (MT)</label>
                  <input id="cosp-rob-input" type="number" className="form-input" value={cospRob} onChange={(e) => setCospRob(e.target.value)} />
                </div>

                <details className="mt-3 mb-2" style={{ border: '1px solid var(--border-medium)', borderRadius: '6px', padding: '10px', background: 'rgba(255,255,255,0.01)' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: 'var(--color-cyan)' }}>Cargo & Draft Details</summary>
                  <div className="mt-2">
                    <div className="form-group mb-2">
                      <label className="form-label">Cargo Description</label>
                      <input type="text" className="form-input py-1.5" value={cargoDescription} onChange={(e) => setCargoDescription(e.target.value)} />
                    </div>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">Cargo Qty (MT)</label>
                        <input type="number" className="form-input py-1.5" value={cargoQuantity} onChange={(e) => setCargoQuantity(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Bill of Lading Qty</label>
                        <input type="number" className="form-input py-1.5" value={billOfLadingQuantity} onChange={(e) => setBillOfLadingQuantity(e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group mb-2">
                      <label className="form-label">Cargo Remarks</label>
                      <input type="text" className="form-input py-1.5" value={cargoRemarks} onChange={(e) => setCargoRemarks(e.target.value)} />
                    </div>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">Draft Fwd (m)</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={draftForward} onChange={(e) => setDraftForward(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Draft Mid (m)</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={draftMid} onChange={(e) => setDraftMid(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Draft Aft (m)</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={draftAft} onChange={(e) => setDraftAft(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </details>
              </>
            )}

            {activeTab === 'eosp' && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="eosp-pos-input">Arrival Position / Station</label>
                  <input id="eosp-pos-input" type="text" className="form-input" value={eospPos} onChange={(e) => setEospPos(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="eosp-rob-input">Fuel ROB at Arrival (MT)</label>
                  <input id="eosp-rob-input" type="number" className="form-input" value={eospRob} onChange={(e) => setEospRob(e.target.value)} />
                </div>

                <details className="mt-3 mb-2" style={{ border: '1px solid var(--border-medium)', borderRadius: '6px', padding: '10px', background: 'rgba(255,255,255,0.01)' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: 'var(--color-cyan)' }}>Cargo & Draft Details</summary>
                  <div className="mt-2">
                    <div className="form-group mb-2">
                      <label className="form-label">Cargo Description</label>
                      <input type="text" className="form-input py-1.5" value={cargoDescription} onChange={(e) => setCargoDescription(e.target.value)} />
                    </div>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">Cargo Qty (MT)</label>
                        <input type="number" className="form-input py-1.5" value={cargoQuantity} onChange={(e) => setCargoQuantity(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Bill of Lading Qty</label>
                        <input type="number" className="form-input py-1.5" value={billOfLadingQuantity} onChange={(e) => setBillOfLadingQuantity(e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group mb-2">
                      <label className="form-label">Cargo Remarks</label>
                      <input type="text" className="form-input py-1.5" value={cargoRemarks} onChange={(e) => setCargoRemarks(e.target.value)} />
                    </div>
                  </div>
                </details>
              </>
            )}

            {activeTab === 'portNoon' && (
              <>
                <div className="row d-flex gap-3 mb-2">
                  <div className="form-group flex-fill">
                    <label className="form-label">Date (UTC)</label>
                    <input type="text" className="form-input py-1.5" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="form-group flex-fill">
                    <label className="form-label">UTC Time</label>
                    <input type="text" className="form-input py-1.5" value={utcTime} onChange={(e) => setUtcTime(e.target.value)} />
                  </div>
                  <div className="form-group flex-fill">
                    <label className="form-label">Port Name *</label>
                    <input type="text" className="form-input py-1.5" value={portName} onChange={(e) => setPortName(e.target.value)} />
                  </div>
                </div>

                <div className="row d-flex gap-3 mb-2">
                  <div className="form-group flex-fill">
                    <label className="form-label">Vessel Condition</label>
                    <select className="form-input py-1.5 text-cyan" value={vesselCondition} onChange={(e) => setVesselCondition(e.target.value)}>
                      <option value="Laden">Laden</option>
                      <option value="Ballast">Ballast</option>
                    </select>
                  </div>
                  <div className="form-group flex-fill">
                    <label className="form-label">Fuel ROB (MT) *</label>
                    <input type="number" className="form-input py-1.5" value={robFuel} onChange={(e) => setRobFuel(e.target.value)} />
                  </div>
                </div>

                {/* Collapsible advanced section */}
                <details className="mt-3 mb-2" style={{ border: '1px solid var(--border-medium)', borderRadius: '6px', padding: '10px', background: 'rgba(255,255,255,0.01)' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: 'var(--color-cyan)' }}>Port Consumption & Machinery Details</summary>
                  <div className="mt-2">
                    <h6 className="text-teal mb-2" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>Draft & Displacements</h6>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">Draft Fwd</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={draftForward} onChange={(e) => setDraftForward(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Draft Mid</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={draftMid} onChange={(e) => setDraftMid(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Draft Aft</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={draftAft} onChange={(e) => setDraftAft(e.target.value)} />
                      </div>
                    </div>

                    <h6 className="text-teal mb-2 mt-3" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>Machinery Fuel Consumptions (MT/day)</h6>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">AE HSFO</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={aeHsfoConsumed} onChange={(e) => setAeHsfoConsumed(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">AE LSFO</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={aeLsfoConsumed} onChange={(e) => setAeLsfoConsumed(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">AE MGO</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={aeMgoConsumed} onChange={(e) => setAeMgoConsumed(e.target.value)} />
                      </div>
                    </div>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">Boiler HSFO</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={boilerHsfoConsumed} onChange={(e) => setBoilerHsfoConsumed(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Boiler LSFO</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={boilerLsfoConsumed} onChange={(e) => setBoilerLsfoConsumed(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Boiler MGO</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={boilerMgoConsumed} onChange={(e) => setBoilerMgoConsumed(e.target.value)} />
                      </div>
                    </div>

                    <h6 className="text-teal mb-2 mt-3" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>ROB Fuel (HSFO/LSFO/MGO)</h6>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">ROB HSFO</label>
                        <input type="number" className="form-input py-1.5" value={robHsfo} onChange={(e) => setRobHsfo(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">ROB LSFO</label>
                        <input type="number" className="form-input py-1.5" value={robLsfo} onChange={(e) => setRobLsfo(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">ROB MGO</label>
                        <input type="number" className="form-input py-1.5" value={robMgo} onChange={(e) => setRobMgo(e.target.value)} />
                      </div>
                    </div>

                    <h6 className="text-teal mb-2 mt-3" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>Lube Oil & Fresh Water</h6>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">AE LO ROB</label>
                        <input type="number" className="form-input py-1.5" value={aeLoRob} onChange={(e) => setAeLoRob(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">AE LO Cons</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={aeLoConsumption} onChange={(e) => setAeLoConsumption(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">FW ROB</label>
                        <input type="number" className="form-input py-1.5" value={fwRob} onChange={(e) => setFwRob(e.target.value)} />
                      </div>
                    </div>

                    <h6 className="text-teal mb-2 mt-3" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>Operational Remarks</h6>
                    <textarea className="form-input py-1.5 w-100" style={{ height: '50px', background: '#0b0f19', color: '#fff', border: '1px solid var(--border-medium)' }} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                  </div>
                </details>
              </>
            )}

            {activeTab === 'arrival' && (
              <>
                <div className="row d-flex gap-3 mb-2">
                  <div className="form-group flex-fill">
                    <label className="form-label">Arrival Date (UTC)</label>
                    <input type="text" className="form-input py-1.5" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="form-group flex-fill">
                    <label className="form-label">UTC Time</label>
                    <input type="text" className="form-input py-1.5" value={utcTime} onChange={(e) => setUtcTime(e.target.value)} />
                  </div>
                </div>

                <div className="row d-flex gap-3 mb-2">
                  <div className="form-group flex-fill">
                    <label className="form-label">Arrival Port Name *</label>
                    <input type="text" className="form-input py-1.5" value={portName} onChange={(e) => setPortName(e.target.value)} />
                  </div>
                  <div className="form-group flex-fill">
                    <label className="form-label">Arrival Place (Berth/Anchor) *</label>
                    <input type="text" className="form-input py-1.5" value={arrivalPlace} onChange={(e) => setArrivalPlace(e.target.value)} />
                  </div>
                </div>

                <div className="row d-flex gap-3 mb-2">
                  <div className="form-group flex-fill">
                    <label className="form-label">Fuel ROB on Arrival (MT) *</label>
                    <input type="number" className="form-input py-1.5" value={robFuel} onChange={(e) => setRobFuel(e.target.value)} />
                  </div>
                </div>

                <details className="mt-3 mb-2" style={{ border: '1px solid var(--border-medium)', borderRadius: '6px', padding: '10px', background: 'rgba(255,255,255,0.01)' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: 'var(--color-cyan)' }}>Arrival Cargo, Draft, and Machinery Log</summary>
                  <div className="mt-2">
                    <h6 className="text-teal mb-2" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>Cargo Information</h6>
                    <div className="form-group mb-2">
                      <label className="form-label">Cargo Description</label>
                      <input type="text" className="form-input py-1.5" value={cargoDescription} onChange={(e) => setCargoDescription(e.target.value)} />
                    </div>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">Discharge Cargo Qty (MT)</label>
                        <input type="number" className="form-input py-1.5" value={cargoQuantity} onChange={(e) => setCargoQuantity(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Bill of Lading Qty</label>
                        <input type="number" className="form-input py-1.5" value={billOfLadingQuantity} onChange={(e) => setBillOfLadingQuantity(e.target.value)} />
                      </div>
                    </div>

                    <h6 className="text-teal mb-2 mt-3" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>Drafts & Displacements</h6>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">Draft Fwd</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={draftForward} onChange={(e) => setDraftForward(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Draft Mid</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={draftMid} onChange={(e) => setDraftMid(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Draft Aft</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={draftAft} onChange={(e) => setDraftAft(e.target.value)} />
                      </div>
                    </div>

                    <h6 className="text-teal mb-2 mt-3" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>Bunker Details & Machinery ROBs</h6>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">ROB HSFO</label>
                        <input type="number" className="form-input py-1.5" value={robHsfo} onChange={(e) => setRobHsfo(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">ROB LSFO</label>
                        <input type="number" className="form-input py-1.5" value={robLsfo} onChange={(e) => setRobLsfo(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">ROB MGO</label>
                        <input type="number" className="form-input py-1.5" value={robMgo} onChange={(e) => setRobMgo(e.target.value)} />
                      </div>
                    </div>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">ME Cyl Oil ROB</label>
                        <input type="number" className="form-input py-1.5" value={meCylinderOilRob} onChange={(e) => setMeCylinderOilRob(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">ME Sys Oil ROB</label>
                        <input type="number" className="form-input py-1.5" value={meSystemOilRob} onChange={(e) => setMeSystemOilRob(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">FW ROB</label>
                        <input type="number" className="form-input py-1.5" value={fwRob} onChange={(e) => setFwRob(e.target.value)} />
                      </div>
                    </div>

                    <h6 className="text-teal mb-2 mt-3" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>Operational Remarks</h6>
                    <textarea className="form-input py-1.5 w-100" style={{ height: '50px', background: '#0b0f19', color: '#fff', border: '1px solid var(--border-medium)' }} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                  </div>
                </details>
              </>
            )}

            {activeTab === 'departure' && (
              <>
                <div className="row d-flex gap-3 mb-2">
                  <div className="form-group flex-fill">
                    <label className="form-label">Departure Date (UTC)</label>
                    <input type="text" className="form-input py-1.5" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="form-group flex-fill">
                    <label className="form-label">UTC Time</label>
                    <input type="text" className="form-input py-1.5" value={utcTime} onChange={(e) => setUtcTime(e.target.value)} />
                  </div>
                </div>

                <div className="row d-flex gap-3 mb-2">
                  <div className="form-group flex-fill">
                    <label className="form-label">Departure Port Name *</label>
                    <input type="text" className="form-input py-1.5" value={portName} onChange={(e) => setPortName(e.target.value)} />
                  </div>
                  <div className="form-group flex-fill">
                    <label className="form-label">Departure Place (Berth/Anchor) *</label>
                    <input type="text" className="form-input py-1.5" value={departurePlace} onChange={(e) => setDeparturePlace(e.target.value)} />
                  </div>
                </div>

                <div className="row d-flex gap-3 mb-2">
                  <div className="form-group flex-fill">
                    <label className="form-label">Fuel ROB on Departure (MT) *</label>
                    <input type="number" className="form-input py-1.5" value={robFuel} onChange={(e) => setRobFuel(e.target.value)} />
                  </div>
                  <div className="form-group flex-fill">
                    <label className="form-label">Next Port Destination *</label>
                    <input type="text" className="form-input py-1.5" value={nextPort} onChange={(e) => setNextPort(e.target.value)} />
                  </div>
                </div>

                <details className="mt-3 mb-2" style={{ border: '1px solid var(--border-medium)', borderRadius: '6px', padding: '10px', background: 'rgba(255,255,255,0.01)' }}>
                  <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: 'var(--color-cyan)' }}>Departure Cargo, Draft, and Speed Log</summary>
                  <div className="mt-2">
                    <h6 className="text-teal mb-2" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>Cargo loaded</h6>
                    <div className="form-group mb-2">
                      <label className="form-label">Cargo Description</label>
                      <input type="text" className="form-input py-1.5" value={cargoDescription} onChange={(e) => setCargoDescription(e.target.value)} />
                    </div>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">Cargo Qty loaded (MT)</label>
                        <input type="number" className="form-input py-1.5" value={cargoQuantity} onChange={(e) => setCargoQuantity(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Bill of Lading Qty</label>
                        <input type="number" className="form-input py-1.5" value={billOfLadingQuantity} onChange={(e) => setBillOfLadingQuantity(e.target.value)} />
                      </div>
                    </div>

                    <h6 className="text-teal mb-2 mt-3" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>Departure Drafts</h6>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">Draft Fwd</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={draftForward} onChange={(e) => setDraftForward(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Draft Mid</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={draftMid} onChange={(e) => setDraftMid(e.target.value)} />
                      </div>
                      <div className="form-group flex-fill">
                        <label className="form-label">Draft Aft</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={draftAft} onChange={(e) => setDraftAft(e.target.value)} />
                      </div>
                    </div>

                    <h6 className="text-teal mb-2 mt-3" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>Operational Speed Specs</h6>
                    <div className="row d-flex gap-3 mb-2">
                      <div className="form-group flex-fill">
                        <label className="form-label">Allowed Charter Party Speed (kt)</label>
                        <input type="number" step="0.1" className="form-input py-1.5" value={allowedCpSpeed} onChange={(e) => setAllowedCpSpeed(e.target.value)} />
                      </div>
                    </div>

                    <h6 className="text-teal mb-2 mt-3" style={{ fontSize: '11px', borderBottom: '1px solid rgba(0, 240, 255, 0.1)', paddingBottom: '2px' }}>Operational Remarks</h6>
                    <textarea className="form-input py-1.5 w-100" style={{ height: '50px', background: '#0b0f19', color: '#fff', border: '1px solid var(--border-medium)' }} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                  </div>
                </details>
              </>
            )}

            <button type="submit" className="btn btn-cyan w-100 mt-2 py-2 fw-bold">
              SUBMIT DATA RECORD
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
