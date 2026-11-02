import React from 'react';

interface WayOraLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const WayOraLogo: React.FC<WayOraLogoProps> = ({
  variant = 'light',
  size = 'md',
  showSubtitle = true,
  className = ''
}) => {
  const isLight = variant === 'light'; // Light text on dark bg

  // Dimensions based on size
  const iconHeight = size === 'sm' ? 32 : size === 'lg' ? 56 : 42;
  const iconWidth = Math.round(iconHeight * 1.05);

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Precision SVG Brand Mark: Stylized W Road Path with Red Map Pin */}
      <svg
        width={iconWidth}
        height={iconHeight}
        viewBox="0 0 120 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform group-hover:scale-105"
      >
        {/* Shadow / Base */}
        <defs>
          <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLight ? "#ffffff" : "#1e293b"} />
            <stop offset="100%" stopColor={isLight ? "#e2e8f0" : "#0f172a"} />
          </linearGradient>
          <filter id="glowPin" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#dc2626" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Outer W Road Path */}
        {/* Left wing */}
        <path
          d="M 12 18 L 38 88 L 52 88 L 34 18 Z"
          fill="url(#roadGrad)"
        />
        {/* Center-left ascent */}
        <path
          d="M 40 88 L 62 38 L 74 38 L 50 88 Z"
          fill="url(#roadGrad)"
        />
        {/* Center-right descent */}
        <path
          d="M 64 38 L 84 88 L 96 88 L 76 38 Z"
          fill="url(#roadGrad)"
        />
        {/* Right wing ascending to destination marker */}
        <path
          d="M 86 88 L 106 24 L 94 24 L 74 88 Z"
          fill="url(#roadGrad)"
        />

        {/* Red Road Centerlines / Stripes on the W path */}
        <path
          d="M 23 28 L 44 80"
          stroke="#ef4444"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
        <path
          d="M 46 80 L 67 44"
          stroke="#ef4444"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
        <path
          d="M 70 44 L 90 80"
          stroke="#ef4444"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
        <path
          d="M 91 80 L 102 32"
          stroke="#ef4444"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
        />

        {/* Location Map Pin on the Destination Vertex (Top-Right) */}
        <g filter="url(#glowPin)">
          {/* Pin body */}
          <path
            d="M 106 6 C 99.5 6 94 11.5 94 18 C 94 26 106 36 106 36 C 106 36 118 26 118 18 C 118 11.5 112.5 6 106 6 Z"
            fill="#dc2626"
          />
          {/* Inner white circle dot */}
          <circle cx="106" cy="17" r="4.5" fill="#ffffff" />
        </g>
      </svg>

      {/* Brand Typography */}
      <div className="flex flex-col">
        {/* WAY ORA */}
        <div
          className={`font-black tracking-tight font-display uppercase leading-none ${
            size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl'
          } ${isLight ? 'text-white' : 'text-slate-900'}`}
        >
          WAY ORA
        </div>

        {/* — JOURNEYS — */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="h-[2px] w-3 bg-red-600 rounded-full" />
          <span
            className={`font-bold tracking-[0.22em] uppercase font-display leading-none text-red-500 ${
              size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-xs' : 'text-[10px]'
            }`}
          >
            JOURNEYS
          </span>
          <span className="h-[2px] w-3 bg-red-600 rounded-full" />
        </div>

        {/* Subtitle Slogan */}
        {showSubtitle && (
          <span
            className={`text-[9px] tracking-tight mt-0.5 font-medium leading-none ${
              isLight ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Reliable Travel. Professional Service.
          </span>
        )}
      </div>
    </div>
  );
};
