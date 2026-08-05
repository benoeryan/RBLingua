import React from 'react';
import { Wifi, Battery, Signal, Tablet, Smartphone, Monitor } from 'lucide-react';
import { DeviceViewMode } from '../types';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
  deviceView: DeviceViewMode;
  isLight?: boolean;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({ children, deviceView, isLight }) => {
  if (deviceView === 'desktop') {
    return <div className={`min-h-screen transition-colors ${isLight ? 'bg-slate-100 text-slate-900' : 'bg-neutral-950 text-neutral-100'}`}>{children}</div>;
  }

  const isTablet = deviceView === 'tablet';

  return (
    <div className={`min-h-screen py-6 px-2 flex flex-col items-center justify-center transition-colors ${
      isLight ? 'bg-slate-200' : 'bg-neutral-950'
    }`}>
      {/* Device Wrapper Frame */}
      <div className={`w-full transition-all duration-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-4 relative overflow-hidden ${
        isTablet
          ? 'max-w-[768px] rounded-[36px] p-4 bg-slate-800 border-slate-700'
          : 'max-w-[420px] rounded-[48px] p-3 bg-neutral-900 border-neutral-800'
      }`}>
        {/* Top Camera / Island */}
        <div className={`h-5 bg-black rounded-b-2xl absolute top-3 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center gap-2 ${
          isTablet ? 'w-24' : 'w-32'
        }`}>
          <div className="w-2.5 h-2.5 bg-neutral-800 rounded-full border border-neutral-700" />
          <div className="w-2 h-2 bg-indigo-950 rounded-full" />
        </div>

        {/* Device Status Bar */}
        <div className="pt-2 px-6 pb-1.5 flex items-center justify-between text-[11px] text-neutral-300 font-semibold select-none z-30 relative bg-neutral-900/90 rounded-t-xl">
          <div className="flex items-center gap-1.5">
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-[10px] text-indigo-400 font-mono">[{isTablet ? 'Tablet iPad View' : 'Smartphone View'}]</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3 text-emerald-400" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Inner Screen Canvas */}
        <div className={`rounded-[28px] overflow-hidden overflow-y-auto relative pb-6 border transition-colors ${
          isTablet ? 'min-h-[720px] max-h-[880px]' : 'min-h-[700px] max-h-[820px]'
        } ${isLight ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-neutral-950 text-neutral-100 border-neutral-800'}`}>
          {children}
        </div>

        {/* Bottom Home Bar */}
        <div className="w-32 h-1 bg-neutral-500 rounded-full mx-auto my-1.5" />
      </div>
    </div>
  );
};

