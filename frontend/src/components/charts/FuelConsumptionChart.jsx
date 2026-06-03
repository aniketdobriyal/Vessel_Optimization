import React from 'react';

export default function FuelConsumptionChart({ reports = [], cpLimit = 25.0 }) {
  const data = reports || [];

  const width = 500;
  const height = 180;
  const padding = 30;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const minFuel = 0;
  const maxFuel = 50;

  const getX = (index) => padding + (index * chartWidth) / (data.length || 1) + (chartWidth / ((data.length || 1) * 2)) - 10;
  const getY = (fuel) => {
    return height - padding - ((fuel - minFuel) * chartHeight) / (maxFuel - minFuel);
  };

  const limitY = getY(cpLimit);
  const limitLine = `M ${padding},${limitY} L ${width - padding},${limitY}`;

  return (
    <div className="fuel-chart-wrapper">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        {/* Grid lines */}
        {[0, 15, 30, 45].map((gridVal, i) => (
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
        {data.map((r, idx) => {
          const fuel = parseFloat(r.fuelConsumed) || 0;
          const x = getX(idx);
          const y = getY(fuel);
          const barHeight = height - padding - y;
          const isOver = fuel > cpLimit;

          return (
            <g key={idx}>
              <rect 
                x={x} 
                y={y} 
                width="20" 
                height={barHeight > 0 ? barHeight : 0} 
                fill={isOver ? "rgba(244, 63, 94, 0.6)" : "rgba(20, 184, 166, 0.6)"}
                stroke={isOver ? "var(--color-status-alert)" : "var(--color-teal)"}
                strokeWidth="1"
                rx="2"
              />
              <text 
                x={x + 10} 
                y={height - padding + 12} 
                fill="var(--text-muted)" 
                fontSize="8" 
                textAnchor="middle"
              >
                {r.date ? r.date.split(' ')[0] : `D${idx+1}`}
              </text>
              <text 
                x={x + 10} 
                y={y - 6} 
                fill={isOver ? "var(--color-status-alert)" : "var(--text-primary)"} 
                fontSize="8" 
                textAnchor="middle"
                fontWeight="bold"
              >
                {fuel.toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* CP Warranted Fuel Limit */}
        <path 
          d={limitLine} 
          stroke="#f59e0b" 
          strokeWidth="1.5" 
          strokeDasharray="4,4"
        />

        {data.length === 0 && (
          <text 
            x={width / 2} 
            y={height / 2 + 10} 
            fill="var(--text-secondary)" 
            fontSize="10" 
            textAnchor="middle"
            letterSpacing="0.05em"
          >
            NO FUEL REPORTS LOGGED
          </text>
        )}

        {/* Chart Legend */}
        <text x={padding} y={15} fill="var(--color-teal)" fontSize="9" fontWeight="600">
          ■ Actual Fuel
        </text>
        <text x={padding + 90} y={15} fill="#f59e0b" fontSize="9" fontWeight="600">
          - - Allowed CP Limit ({cpLimit} MT)
        </text>
      </svg>
    </div>
  );
}
