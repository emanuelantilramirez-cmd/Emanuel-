import React from "react";

interface AssetChartProps {
  history: number[];
  color?: string;
  height?: number;
}

export const AssetChart: React.FC<AssetChartProps> = ({
  history,
  color = "rgb(16, 185, 129)", // emerald-500
  height = 120
}) => {
  if (history.length === 0) return null;

  const min = Math.min(...history);
  const max = Math.max(...history);
  const priceRange = max - min === 0 ? 1 : max - min;
  
  // Padding around the min/max to look neat
  const padMin = min - priceRange * 0.15;
  const padMax = max + priceRange * 0.15;
  const range = padMax - padMin;

  const points = history.map((val, index) => {
    const x = (index / (history.length - 1)) * 100; // percent 0 to 100
    const y = 100 - ((val - padMin) / range) * 100; // invert because SVG y goes down
    return `${x},${y}`;
  }).join(" ");

  // Create the closed area under the curve
  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-slate-950/40 p-2" id={`chart-${Math.random().toString(36).substr(2, 9)}`}>
      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
        <span>Máx: CLP {max.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        <span>Mín: CLP {min.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
      </div>
      
      <div className="relative" style={{ height: `${height}px` }}>
        {/* Render gridlines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
          <div className="w-full border-t border-dashed border-white"></div>
          <div className="w-full border-t border-dashed border-white"></div>
          <div className="w-full border-t border-dashed border-white"></div>
        </div>

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id={`gradient-${color.replace(/[^a-zA-Z0-9]/g, "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <polygon
            points={areaPoints}
            fill={`url(#gradient-${color.replace(/[^a-zA-Z0-9]/g, "")})`}
          />

          {/* Line */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>

        {/* Real-time pulse dot on the last price point */}
        {history.length > 0 && (
          <div
            className="absolute h-2 w-2 rounded-full pointer-events-none animate-ping"
            style={{
              right: "0%",
              bottom: `${((history[history.length - 1] - padMin) / range) * 100}%`,
              transform: "translate(50%, 50%)",
              backgroundColor: color,
            }}
          />
        )}
      </div>

      <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-2">
        <span>Hace {history.length * 2}s</span>
        <span>Último valor: CLP {history[history.length - 1]?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        <span>Tiempo real</span>
      </div>
    </div>
  );
};
