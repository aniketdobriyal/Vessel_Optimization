import React from 'react';

export default function ROBTrendChart({ reports = [], initialROB = 1288 }) {
  const data = reports || [];

  const width = 500;
  const height = 180;
  const padding = 30;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Compute dynamic minRob and maxRob based on data
  const robValues = data.map(r => parseFloat(r.robFuel) || initialROB);
  const minRob = robValues.length > 0 ? Math.max(0, Math.min(...robValues) - 50) : 1000;
  const maxRob = robValues.length > 0 ? Math.max(...robValues) + 50 : 1400;

  const getX = (index) => padding + (index * chartWidth) / (data.length - 1 || 1);
  const getY = (rob) => {
    const val = Math.max(minRob, Math.min(maxRob, rob));
    const range = maxRob - minRob || 1;
    return height - padding - ((val - minRob) * chartHeight) / range;
  };

  let pathD = '';
  if (data.length > 0) {
    let points = [];
    data.forEach((r, idx) => {
      const rob = parseFloat(r.robFuel) || r.robFuel || initialROB;
      points.push(`${getX(idx)},${getY(rob)}`);
    });
    pathD = `M ${points.join(' L ')}`;
  }

  // Draw grid lines
  const gridVals = [];
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    gridVals.push(minRob + (i * (maxRob - minRob)) / steps);
  }

  return (
    <div className="rob-chart-wrapper">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        {/* Grid lines */}
        {gridVals.map((gridVal, i) => (
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
              {Math.round(gridVal)} MT
            </text>
          </g>
        ))}

        {/* ROB Trend Line */}
        {data.length > 0 && (
          <path 
            d={pathD} 
            stroke="#3b82f6" 
            strokeWidth="2.5" 
            fill="none"
            filter="drop-shadow(0 0 4px rgba(59, 130, 246, 0.4))"
          />
        )}

        {/* Dots */}
        {data.map((r, idx) => {
          const rob = parseFloat(r.robFuel) || r.robFuel || initialROB;
          const x = getX(idx);
          const y = getY(rob);
          return (
            <g key={idx}>
              <circle 
                cx={x} 
                cy={y} 
                r="4" 
                fill="var(--bg-maritime-deep)" 
                stroke="#3b82f6" 
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
                {Math.round(rob)}
              </text>
            </g>
          );
        })}

        {data.length === 0 && (
          <text 
            x={width / 2} 
            y={height / 2 + 10} 
            fill="var(--text-secondary)" 
            fontSize="10" 
            textAnchor="middle"
            letterSpacing="0.05em"
          >
            NO ROB TRACKS AVAILABLE
          </text>
        )}

        <text x={padding} y={15} fill="#3b82f6" fontSize="9" fontWeight="600">
          ● Fuel ROB (Remaining On Board)
        </text>
      </svg>
    </div>
  );
}
