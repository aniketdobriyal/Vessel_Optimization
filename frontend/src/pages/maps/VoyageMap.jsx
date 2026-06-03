import React from 'react';

export default function VoyageMap({ voyage }) {
  // Map dimensions
  const width = 600;
  const height = 280;

  // Let's draw shipping coordinates focused on Europe-Asia passage:
  // Singapore (SGP): (540, 210)
  // Indian Ocean Waypoint: (420, 220)
  // Cape of Good Hope (Bypass): (280, 260) -- if bypass
  // Gulf of Aden / Red Sea: (340, 175)
  // Suez Canal (Suez): (320, 135)
  // Gibraltar Strait: (170, 125)
  // Rotterdam (RTM): (190, 75)
  
  const sgp = { x: 540, y: 210, label: "Singapore" };
  const rtm = { x: 190, y: 75, label: "Rotterdam" };

  // Planned route nodes via Suez
  const plannedPathPoints = [
    `${sgp.x},${sgp.y}`,
    "440,215", // Indian Ocean
    "350,185", // Gulf of Aden
    "322,145", // Red Sea
    "318,125", // Suez Canal
    "260,122", // Mediterranean
    "180,123", // Gibraltar
    "165,100", // Portugal
    `${rtm.x},${rtm.y}`
  ];

  // Actual route sailed so far (currently past Indian Ocean)
  const actualPathPoints = [
    `${sgp.x},${sgp.y}`,
    "440,215",
    "395,202" // Current position
  ];

  // Weather risk zones
  const risks = [
    { x: 440, y: 215, r: 25, color: "rgba(245, 158, 11, 0.25)", border: "var(--color-status-anchor)", label: "Moderate swells (BF 5)" },
    { x: 165, y: 100, r: 20, color: "rgba(244, 63, 94, 0.25)", border: "var(--color-status-alert)", label: "Severe Gale expected (BF 7-8)" }
  ];

  return (
    <div className="map-container" style={{ height: '280px' }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        {/* Draw ocean coordinates grid grid */}
        <line x1="0" y1="140" x2="600" y2="140" stroke="rgba(0, 240, 255, 0.02)" />
        <line x1="300" y1="0" x2="300" y2="280" stroke="rgba(0, 240, 255, 0.02)" />

        {/* Port markers */}
        <circle cx={sgp.x} cy={sgp.y} r="5" fill="var(--color-cyan)" />
        <text x={sgp.x - 10} y={sgp.y + 15} fill="var(--text-primary)" fontSize="9" fontWeight="bold" textAnchor="end">
          {sgp.label}
        </text>

        <circle cx={rtm.x} cy={rtm.y} r="5" fill="var(--color-cyan)" />
        <text x={rtm.x + 10} y={rtm.y + 12} fill="var(--text-primary)" fontSize="9" fontWeight="bold">
          {rtm.label}
        </text>

        {/* Weather Risk Zone Rings */}
        {risks.map((risk, idx) => (
          <g key={idx}>
            <circle 
              cx={risk.x} 
              cy={risk.y} 
              r={risk.r} 
              fill={risk.color} 
              stroke={risk.border} 
              strokeWidth="1" 
              strokeDasharray="2,2"
            />
            <text x={risk.x} y={risk.y - risk.r - 4} fill="var(--text-secondary)" fontSize="7" textAnchor="middle">
              {risk.label}
            </text>
          </g>
        ))}

        {/* Planned Route Line (Dashed) */}
        <path 
          d={`M ${plannedPathPoints.join(' L ')}`} 
          fill="none" 
          stroke="rgba(255, 255, 255, 0.25)" 
          strokeWidth="2" 
          className="track-planned"
        />

        {/* Actual Route Line (Solid Cyan) */}
        <path 
          d={`M ${actualPathPoints.join(' L ')}`} 
          fill="none" 
          stroke="var(--color-cyan)" 
          strokeWidth="3" 
          filter="drop-shadow(0 0 4px rgba(0, 240, 255, 0.6))"
        />

        {/* Current Position Pin */}
        <circle cx="395" cy="202" r="5" fill="var(--color-status-sea)" stroke="#fff" strokeWidth="1" className="pulse-pin" />
        <text x="395" y="194" fill="var(--color-status-sea)" fontSize="8" fontWeight="bold" textAnchor="middle">
          M/T DE XI (At Sea)
        </text>
      </svg>

      {/* Map Legend overlay */}
      <div className="map-legend" style={{ right: '12px', left: 'auto', bottom: '12px' }}>
        <div className="legend-item">
          <span style={{ display: 'inline-block', width: '20px', height: '0px', borderTop: '2px dashed rgba(255,255,255,0.4)' }}></span>
          <span>Planned CP Route</span>
        </div>
        <div className="legend-item">
          <span style={{ display: 'inline-block', width: '20px', height: '0px', borderTop: '2px solid var(--color-cyan)' }}></span>
          <span>Actual Sailed Path</span>
        </div>
      </div>
    </div>
  );
}
