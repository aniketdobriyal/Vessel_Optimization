import React from 'react';

export default function VoyageEfficiencyChart({ optData }) {
  const routes = optData ? [
    { name: optData.routeA || 'Route A', fuel: optData.fuelA || 0, time: optData.etaA || '--', color: 'var(--color-cyan)' },
    { name: optData.routeB || 'Route B', fuel: optData.fuelB || 0, time: optData.etaB || '--', color: 'var(--color-teal)' }
  ] : [];

  const width = 500;
  const height = 180;
  const padding = 30;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxFuel = routes.length > 0 ? Math.max(700, ...routes.map(r => r.fuel * 1.2)) : 700;

  const getX = (index) => padding + (index * chartWidth) / (routes.length || 1) + (chartWidth / ((routes.length || 1) * 2)) - 25;
  const getY = (fuel) => {
    return height - padding - ((fuel) * chartHeight) / (maxFuel);
  };

  return (
    <div className="efficiency-chart-wrapper">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        {/* Grid lines */}
        {[0, 175, 350, 525, 700].map((gridVal, i) => (
          <g key={i}>
            <line 
              x1={padding} 
              y1={getY(gridVal)} 
              x2={width - padding} 
              y2={getY(gridVal)} 
              stroke="rgba(0, 240, 255, 0.08)" 
              strokeWidth="1"
            />
            <text 
              x={padding - 8} 
              y={getY(gridVal) + 4} 
              fill="var(--text-secondary)" 
              fontSize="9" 
              textAnchor="end"
            >
              {gridVal} MT
            </text>
          </g>
        ))}

        {/* Bars */}
        {routes.map((r, idx) => {
          const x = getX(idx);
          const y = getY(r.fuel);
          const barHeight = height - padding - y;

          return (
            <g key={idx}>
              {/* Fuel Bar */}
              <rect 
                x={x} 
                y={y} 
                width="40" 
                height={barHeight > 0 ? barHeight : 0} 
                fill={r.color}
                opacity="0.65"
                stroke={r.color}
                strokeWidth="1"
                rx="2"
              />
              {/* Text labels */}
              <text 
                x={x + 20} 
                y={height - padding + 12} 
                fill="var(--text-muted)" 
                fontSize="8" 
                textAnchor="middle"
              >
                {r.name}
              </text>
              <text 
                x={x + 20} 
                y={y - 6} 
                fill="var(--text-primary)" 
                fontSize="8" 
                textAnchor="middle"
                fontWeight="bold"
              >
                {r.fuel} MT / {r.time}
              </text>
            </g>
          );
        })}

        {routes.length === 0 && (
          <text 
            x={width / 2} 
            y={height / 2 + 10} 
            fill="var(--text-secondary)" 
            fontSize="10" 
            textAnchor="middle"
            letterSpacing="0.05em"
          >
            NO COMPARATIVE OPTIMIZATION DATA AVAILABLE
          </text>
        )}

        <text x={padding} y={15} fill="var(--text-primary)" fontSize="9" fontWeight="600">
          Route Comparison - Total Fuel & Transit Duration
        </text>
      </svg>
    </div>
  );
}
