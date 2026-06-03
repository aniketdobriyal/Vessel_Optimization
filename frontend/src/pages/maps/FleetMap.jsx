import React, { useState } from 'react';
import { useVessels } from '../../context/VesselContext';
import { parseLatitude, parseLongitude } from '../../utils/vesselCalculations';

export default function FleetMap({ onSelectVessel }) {
  const { vessels } = useVessels();
  const [hoveredVessel, setHoveredVessel] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Map dimensions
  const width = 800;
  const height = 400;

  // Convert Lat/Lon to XY coordinates (Equirectangular Projection)
  const getXY = (latStr, lonStr) => {
    const lat = parseLatitude(latStr);
    const lon = parseLongitude(lonStr);
    
    // x: maps -180...180 to 20...780
    const x = 400 + (lon * 360) / 180;
    // y: maps 90...-90 to 20...380
    const y = 200 - (lat * 170) / 90;
    
    return { x, y };
  };

  // Simplified continental vector outlines for maritime radar cockpit aesthetic
  const continents = [
    // North America
    "M 120,80 L 150,75 L 210,90 L 250,85 L 240,130 L 210,140 L 180,180 L 190,210 L 175,225 L 170,210 L 160,160 L 110,130 Z",
    // South America
    "M 175,225 L 210,240 L 230,260 L 250,290 L 240,360 L 215,380 L 210,360 L 195,290 L 170,260 Z",
    // Eurasia / Africa
    "M 360,60 L 400,65 L 480,50 L 580,55 L 680,60 L 720,80 L 700,120 L 680,150 L 630,170 L 600,150 L 530,150 L 515,175 L 485,175 L 460,200 L 450,230 L 485,250 L 460,340 L 440,360 L 430,350 L 405,300 L 370,240 L 330,170 L 320,130 L 310,100 Z",
    // Australia
    "M 650,280 L 690,290 L 710,320 L 680,340 L 640,320 Z"
  ];

  // Shipping Hubs
  const hubs = [
    { name: "Singapore (SGP)", lat: "01°17'N", lon: "103°50'E" },
    { name: "Rotterdam (RTM)", lat: "51°55'N", lon: "004°24'E" },
    { name: "Shanghai (PVG)", lat: "31°12'N", lon: "121°30'E" },
    { name: "Los Angeles (LAX)", lat: "33°44'N", lon: "118°15'W" },
    { name: "Suez Canal", lat: "29°56'N", lon: "032°34'E" }
  ];

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left + 15,
      y: e.clientY - rect.top - 15
    });
  };

  const getStatusColor = (status) => {
    if (status === 'At Sea') return 'var(--color-status-sea)';
    if (status === 'In Port') return 'var(--color-status-port)';
    return 'var(--color-status-anchor)';
  };

  return (
    <div className="map-container" onMouseMove={handleMouseMove}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        {/* Radar grid lines */}
        <circle cx="400" cy="200" r="180" fill="none" stroke="rgba(0, 240, 255, 0.03)" strokeWidth="1" />
        <circle cx="400" cy="200" r="90" fill="none" stroke="rgba(0, 240, 255, 0.03)" strokeWidth="1" />
        <line x1="220" y1="200" x2="580" y2="200" stroke="rgba(0, 240, 255, 0.02)" strokeWidth="1" />
        <line x1="400" y1="20" x2="400" y2="380" stroke="rgba(0, 240, 255, 0.02)" strokeWidth="1" />

        {/* Continents outlines */}
        {continents.map((cPath, i) => (
          <path 
            key={i} 
            d={cPath} 
            fill="rgba(12, 19, 41, 0.55)" 
            stroke="rgba(0, 240, 255, 0.06)" 
            strokeWidth="1.5"
          />
        ))}

        {/* Shipping Hub Pins */}
        {hubs.map((hub, i) => {
          const { x, y } = getXY(hub.lat, hub.lon);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="2.5" fill="rgba(255, 255, 255, 0.25)" />
              <text x={x + 4} y={y + 3} fill="var(--text-muted)" fontSize="7" fontWeight="bold">
                {hub.name.split(' ')[0]}
              </text>
            </g>
          );
        })}

        {/* Vessel Radar Pins */}
        {vessels.map((vessel) => {
          const { x, y } = getXY(vessel.lat, vessel.lon);
          const color = getStatusColor(vessel.status);
          const isHovered = hoveredVessel?.id === vessel.id;

          return (
            <g 
              key={vessel.id}
              className="vessel-pin"
              onClick={() => onSelectVessel && onSelectVessel(vessel)}
              onMouseEnter={() => setHoveredVessel(vessel)}
              onMouseLeave={() => setHoveredVessel(null)}
            >
              {/* Radar pulse effect */}
              <circle 
                cx={x} 
                cy={y} 
                r={isHovered ? 12 : 7} 
                fill="none" 
                stroke={color} 
                strokeWidth="1" 
                className="pulse-pin"
                style={{ opacity: 0.4 }}
              />
              <circle 
                cx={x} 
                cy={y} 
                r="4.5" 
                fill={color} 
                stroke="#fff" 
                strokeWidth="1"
              />
              {/* Short name indicator */}
              {!hoveredVessel && (
                <text x={x + 7} y={y + 3} fill="var(--text-secondary)" fontSize="8" fontWeight="600">
                  {vessel.name.replace('M/T ', '').replace('M/V ', '')}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip center overlay */}
      {hoveredVessel && (
        <div 
          className="map-tooltip"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="fw-bold text-cyan" style={{ fontSize: '12px' }}>{hoveredVessel.name}</div>
          <div>IMO: {hoveredVessel.imo} | {hoveredVessel.type}</div>
          <div className="d-flex align-items-center gap-1.5 mt-0.5">
            <span className="legend-color" style={{ backgroundColor: getStatusColor(hoveredVessel.status), width: '6px', height: '6px' }}></span>
            <span>{hoveredVessel.status} at {hoveredVessel.lat}, {hoveredVessel.lon}</span>
          </div>
          <div>ROB Fuel: <strong className="text-cyan">{hoveredVessel.fuelRob} MT</strong></div>
          <div>Perf Score: <strong className="text-teal">{hoveredVessel.overallScore}%</strong></div>
        </div>
      )}

      {/* Map Legends */}
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: 'var(--color-status-sea)' }}></span>
          <span>At Sea</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: 'var(--color-status-port)' }}></span>
          <span>In Port</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: 'var(--color-status-anchor)' }}></span>
          <span>Anchored</span>
        </div>
      </div>
    </div>
  );
}
