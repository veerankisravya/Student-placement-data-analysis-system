import React, { useState } from 'react';

// 1. Doughnut Chart: Placed vs Unplaced vs In-Process
interface DoughnutChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
  centerLabel?: string;
  centerSub?: string;
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  size = 220,
  centerLabel,
  centerSub,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-800"
          />
          {total > 0 &&
            data.map((item, index) => {
              const itemPercent = item.value / total;
              const strokeDasharray = `${itemPercent * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += itemPercent;
              const isHovered = hoveredIndex === index;

              return (
                <circle
                  key={item.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
            {hoveredIndex !== null ? `${data[hoveredIndex].value}` : centerLabel || `${total}`}
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {hoveredIndex !== null ? data[hoveredIndex].label : centerSub || 'Total Students'}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs font-medium text-slate-600 dark:text-slate-300">
        {data.map((item, index) => {
          const percent = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
          return (
            <div
              key={item.label}
              className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${
                hoveredIndex !== null && hoveredIndex !== index ? 'opacity-40' : 'opacity-100'
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
              <span className="text-slate-400 dark:text-slate-500 tabular-nums">
                ({item.value} · {percent}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 2. Bar Chart: Branch-wise or Categorical Comparison
interface BarChartProps {
  categories: string[];
  series: {
    name: string;
    color: string;
    data: number[];
  }[];
  height?: number;
  unit?: string;
}

export const GroupedBarChart: React.FC<BarChartProps> = ({
  categories,
  series,
  height = 240,
  unit = '',
}) => {
  const [hoveredBar, setHoveredBar] = useState<{ catIndex: number; seriesIndex: number } | null>(null);

  // Find max value across all series
  const allValues = series.flatMap((s) => s.data);
  const maxValue = Math.max(...allValues, 10);
  const yTicks = [0, Math.round(maxValue * 0.25), Math.round(maxValue * 0.5), Math.round(maxValue * 0.75), maxValue];

  return (
    <div className="w-full">
      <div className="relative w-full" style={{ height }}>
        {/* Y-axis gridlines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
          {yTicks.slice().reverse().map((tick, idx) => (
            <div key={idx} className="flex items-center w-full">
              <span className="w-8 text-[11px] font-mono text-slate-400 tabular-nums text-right pr-2 shrink-0">
                {tick}
              </span>
              <div className="flex-1 border-b border-slate-100 dark:border-slate-800" />
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="absolute inset-0 flex items-end pl-10 pr-2 pb-6 pt-2 gap-2">
          {categories.map((cat, catIdx) => (
            <div key={cat} className="flex-1 flex flex-col items-center h-full justify-end group">
              <div className="flex items-end justify-center w-full gap-1.5 h-full">
                {series.map((s, sIdx) => {
                  const val = s.data[catIdx] || 0;
                  const barHeightPct = maxValue > 0 ? (val / maxValue) * 100 : 0;
                  const isHovered = hoveredBar?.catIndex === catIdx && hoveredBar?.seriesIndex === sIdx;

                  return (
                    <div
                      key={s.name}
                      className="relative flex-1 max-w-[28px] rounded-t-sm transition-all duration-200 cursor-pointer"
                      style={{
                        height: `${Math.max(barHeightPct, 2)}%`,
                        backgroundColor: s.color,
                        filter: isHovered ? 'brightness(1.15)' : 'none',
                      }}
                      onMouseEnter={() => setHoveredBar({ catIndex: catIdx, seriesIndex: sIdx })}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {isHovered && (
                        <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-20 px-2 py-1 bg-slate-900 text-white text-[11px] font-medium rounded shadow whitespace-nowrap pointer-events-none">
                          {s.name}: {val} {unit}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-full text-center mt-2.5">
                {cat}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 text-xs font-medium text-slate-600 dark:text-slate-300">
        {series.map((s) => (
          <div key={s.name} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
            <span>{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. Line Trend Chart: Placement Trends Over Academic Years
interface LineChartProps {
  years: number[];
  rates: number[]; // e.g. 75.6, 80.0, 85.0
  salaries: number[]; // e.g. 7.4, 8.2, 9.6 LPA
  height?: number;
}

export const TrendLineChart: React.FC<LineChartProps> = ({
  years,
  rates,
  salaries,
  height = 240,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const minRate = 60;
  const maxRate = 100;
  const svgWidth = 500;
  const svgHeight = height - 40;
  const paddingX = 40;
  const paddingY = 20;

  const pointsRate = years.map((yr, idx) => {
    const x = paddingX + (idx / (years.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - ((rates[idx] - minRate) / (maxRate - minRate)) * (svgHeight - paddingY * 2);
    return { x, y, year: yr, rate: rates[idx], salary: salaries[idx] };
  });

  const ratePath = pointsRate.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaPath = `${ratePath} L ${pointsRate[pointsRate.length - 1].x} ${svgHeight - paddingY} L ${pointsRate[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div className="w-full">
      <div className="relative w-full" style={{ height }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[60, 70, 80, 90, 100].map((rateVal) => {
            const y = svgHeight - paddingY - ((rateVal - minRate) / (maxRate - minRate)) * (svgHeight - paddingY * 2);
            return (
              <g key={rateVal}>
                <line x1={paddingX} y1={y} x2={svgWidth - paddingX} y2={y} stroke="currentColor" strokeDasharray="3 3" className="text-slate-100 dark:text-slate-800" />
                <text x={paddingX - 8} y={y + 3} textAnchor="end" className="text-[10px] font-mono fill-slate-400">
                  {rateVal}%
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#rateGradient)" />

          {/* Line Path */}
          <path d={ratePath} fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Points */}
          {pointsRate.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g key={pt.year} className="cursor-pointer" onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)}>
                <circle cx={pt.x} cy={pt.y} r={isHovered ? 6 : 4} fill="#ffffff" stroke="#0d9488" strokeWidth="2.5" className="transition-all" />
                <text x={pt.x} y={svgHeight - 4} textAnchor="middle" className="text-[11px] font-medium fill-slate-500 dark:fill-slate-400">
                  {pt.year}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredIndex !== null && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 bg-slate-900 text-white rounded shadow text-xs flex items-center gap-3 tabular-nums pointer-events-none"
          >
            <span className="font-semibold">{pointsRate[hoveredIndex].year}</span>
            <span>Placement Rate: <strong>{pointsRate[hoveredIndex].rate}%</strong></span>
            <span>Avg Package: <strong>{pointsRate[hoveredIndex].salary} LPA</strong></span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400 px-2">
        <span>Yearly Campus Cohort</span>
        <span className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-medium">
          <span className="w-2.5 h-0.5 bg-teal-600 dark:bg-teal-400 inline-block" /> Placement Success Rate (%)
        </span>
      </div>
    </div>
  );
};

// 4. Horizontal Distribution / Progress Bars
interface HorizontalBarsProps {
  items: {
    label: string;
    sub?: string;
    value: number;
    maxValue: number;
    valueDisplay: string;
    color?: string;
  }[];
}

export const HorizontalBars: React.FC<HorizontalBarsProps> = ({ items }) => {
  return (
    <div className="space-y-3.5 w-full">
      {items.map((item) => {
        const pct = item.maxValue > 0 ? (item.value / item.maxValue) * 100 : 0;
        return (
          <div key={item.label} className="w-full">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-slate-800 dark:text-slate-200 truncate pr-2">
                {item.label}
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums shrink-0">
                {item.valueDisplay}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(Math.max(pct, 2), 100)}%`,
                  backgroundColor: item.color || '#0d9488',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
