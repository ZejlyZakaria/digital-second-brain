'use client';

import React from 'react';

interface HoverTooltipProps {
  text: string;
  className?: string;
}

const HoverTooltip: React.FC<HoverTooltipProps> = ({ text, className = '' }) => {
  return (
    <div
      className={`
        relative bg-slate-800 text-white text-xs px-3 py-2 rounded-md shadow-md 
        whitespace-normal wrap-break-word 
        min-w-50 max-w-100
        ${className}
      `}
    >
      {text}

      {/* Triangle du bas */}
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-800" />
    </div>
  );
};

export default HoverTooltip;
