import React from 'react';

export default function SpeedPerformanceChart({ reports = [], cpSpeed = 12.5 }) {
  const data = reports || [];

  const width = 500;
  const height = 180;
  const padding = 30;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Chart ranges
  const minSpeed = 8;
  const maxSpeed = 15;

  const getX = (index) => padding + (index * chartWidth) / (data.length - 1 || 1);
  const getY = (speed) => {
    const val = Math.max(minSpeed, Math.min(maxSpeed, speed));
    return height - padding - ((val - minSpeed) * chartHeight) / (maxSpeed - minSpeed);
  };

  // Generate paths
  let actualPath = '';
  if (data.length > 0) {
    let actualPathPoints = [];
    data.forEach((r, idx) => {
      const speed = parseFloat(r.speed) || r.speed || 0;
      actualPathPoints.push(`${getX(idx)},${getY(speed)}`);
    });
    actualPath = `M ${actualPathPoints.join(' L ')}`;
  }
  const warrantedY = getY(cpSpeed);
  const warrantedPath = `M ${padding},${warrantedY} L ${width - padding},${warrantedY}`;

  return (
    <div className="speed-chart-wrapper">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        {/* Grid lines */}
        {[8, 10, 12, 14].map((gridVal, i) => (
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
              {gridVal} kt
            </text>
          </g>
        ))}

        {/* Warranted limit path */}
        <path 
          d={warrantedPath} 
          stroke="var(--color-cyan-dim)" 
          strokeWidth="1.5" 
          strokeDasharray="4,4"
        />
        
        {/* Actual speed path */}
        {data.length > 0 && (
          <path 
            d={actualPath} 
            stroke="var(--color-cyan)" 
            strokeWidth="2.5" 
            fill="none"
            filter="drop-shadow(0 0 4px rgba(0, 240, 255, 0.4))"
          />
        )}

        {/* Data points */}
        {data.map((r, idx) => {
          const speed = parseFloat(r.speed) || r.speed || 0;
          const x = getX(idx);
          const y = getY(speed);
          return (
            <g key={idx}>
              <circle 
                cx={x} 
                cy={y} 
                r="4" 
                fill="var(--bg-maritime-deep)" 
                stroke="var(--color-cyan)" 
                strokeWidth="2"
              />
              <text 
                x={x} 
                y={height - padding + 12} 
                fill="var(--text-muted)" 
                fontSize="8" 
                textAnchor="middle"
              >
                {r.date ? r.date.split(' ')[0] : `D${idx+1}`}
              </text>
              <text 
                x={x} 
                y={y - 8} 
                fill="var(--text-primary)" 
                fontSize="8" 
                textAnchor="middle"
                fontWeight="bold"
              >
                {speed.toFixed(1)}
              </text>
            </g>
          )})}

        {data.length === 0 && (
          <text 
            x={width / 2} 
            y={height / 2 + 10} 
            fill="var(--text-secondary)" 
            fontSize="10" 
            textAnchor="middle"
            letterSpacing="0.05em"
          >
            NO NOON POSITION REPORTS LOGGED
          </text>
        )}

        {/* Chart Legend */}
        <text x={padding} y={15} fill="var(--color-cyan)" fontSize="9" fontWeight="600">
          ● Actual Speed
        </text>
        <text x={padding + 90} y={15} fill="var(--color-cyan-dim)" fontSize="9" fontWeight="600">
          - - Warranted Speed ({cpSpeed} kt)
        </text>
      </svg>
    </div>
  );
}
