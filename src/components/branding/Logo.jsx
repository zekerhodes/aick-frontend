import React from 'react';
import { Cross } from 'lucide-react';

export const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    sm: { box: 'h-8 w-8', icon: 14, title: 'text-sm', sub: 'text-[10px]' },
    md: { box: 'h-10 w-10', icon: 18, title: 'text-base', sub: 'text-[11px]' },
    lg: { box: 'h-14 w-14', icon: 26, title: 'text-xl', sub: 'text-xs' },
  };
  const s = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${s.box} rounded-lg flex items-center justify-center shadow-sm relative overflow-hidden`}
        style={{ background: 'linear-gradient(135deg, #D9501E 0%, #B8400F 100%)' }}
      >
        <Cross size={s.icon} strokeWidth={2.5} className="text-white" />
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 60%)' }} />
      </div>
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`${s.title} font-bold text-slate-900 tracking-tight`}>AIC Kapsowar</span>
          <span className={`${s.sub} text-slate-500 font-medium`}>Hospital Asset Mgmt</span>
        </div>
      )}
    </div>
  );
};
