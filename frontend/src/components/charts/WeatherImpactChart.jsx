import React from 'react';

export default function WeatherImpactChart() {
  // Beaufort scale vs speed loss (knots)
  const data = [
    { beaufort: 'BF 1-3', loss: 0.1, color: 'var(--color-status-sea)' },
    { beaufort: 'BF 4', loss: 0.3, color: 'var(--color-status-sea)' },
    { beaufort: 'BF 5', loss: 0.7, color: 'var(--color-status-anchor)' },
    { beaufort: 'BF 6', loss: 1.4, color: 'var(--color-status-anchor)' },
    { beaufort: 'BF 7', loss: 2.3, color: 'var(--color-status-alert)' },
    { beaufort: 'BF 8+', loss: 3.8, color: 'var(--color-status-alert)' }
  ];

  const width = 500;
  const height = 180;
  const padding = 30;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const minLoss = 0;
  const maxLoss = 5.0;

  const getX = (index) => padding + (index * chartWidth) / data.length + (chartWidth / (data.length * 2)) - 12;
  const getY = (loss) => {
    return height - padding - ((loss - minLoss) * chartHeight) / (maxLoss - minLoss);
  };

  return (
    <div className="weather-impact-chart-wrapper">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        {/* Grid lines */}
        {[0, 1.25, 2.5, 3.75, 5.0].map((gridVal, i) => (
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
              -{gridVal.toFixed(1)} kt
            </text>
          </g>
        ))}

        {/* Bars */}
        {data.map((r, idx) => {
          const x = getX(idx);
          const y = getY(r.loss);
          const barHeight = height - padding - y;

          return (
            <g key={idx}>
              <rect 
                x={x} 
                y={y} 
                width="24" 
                height={barHeight > 0 ? barHeight : 0} 
                fill={r.color}
                opacity="0.65"
                stroke={r.color}
                strokeWidth="1"
                rx="2"
              />
              <text 
                x={x + 12} 
                y={height - padding + 12} 
                fill="var(--text-muted)" 
                fontSize="8" 
                textAnchor="middle"
              >
                {r.beaufort}
              </text>
              <text 
                x={x + 12} 
                y={y - 6} 
                fill="var(--text-primary)" 
                fontSize="8" 
                textAnchor="middle"
                fontWeight="bold"
              >
                -{r.loss.toFixed(1)}
              </text>
            </g>
          );
        })}

        <text x={padding} y={15} fill="var(--text-primary)" fontSize="9" fontWeight="600">
          Average Speed Loss due to Sea State Resistance
        </text>
      </svg>
    </div>
  );
}
