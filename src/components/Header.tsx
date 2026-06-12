import React, { useState, useEffect } from 'react';
import { Activity, Clock } from 'lucide-react';
import { oncologyData } from '../data/mockOncologyData';

interface HeaderProps {
  extraControls?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ extraControls }) => {
  const [currentTime, setCurrentTime] = useState('');

  // Clock effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const yr  = now.getFullYear();
      const mo  = String(now.getMonth() + 1).padStart(2, '0');
      const dy  = String(now.getDate()).padStart(2, '0');
      const hr  = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const sec = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${yr}-${mo}-${dy} | ${hr}:${min}:${sec}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute live metrics
  const patientCount = oncologyData.nodes.filter(n => n.type === 'patient').length;
  const geneCount    = oncologyData.nodes.filter(n => n.type === 'gene').length;
  const variantCount = oncologyData.nodes.filter(n => n.type === 'variant').length;
  const drugCount    = oncologyData.nodes.filter(n => n.type === 'drug').length;
  const linkCount    = oncologyData.links.length;

  return (
    <header
      className="w-full h-16 border-b border-[rgba(0,240,255,0.15)] px-6 flex items-center justify-between relative z-30 select-none"
      style={{
        background: 'rgba(2, 4, 9, 0.9)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <img
          src={`${import.meta.env.BASE_URL}onecell-logo.png`}
          alt="1Cell Precision Oncology"
          style={{
            height: '46px',
            width: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.20))',
          }}
        />
        <div className="text-left font-mono border-l border-[#00f0ff]/20 pl-3">
          <h1 className="text-[13px] font-black tracking-widest text-[#00f0ff] glow-cyan uppercase m-0 leading-none">
            Precision Oncology
          </h1>
          <span className="text-[9px] text-[#00f0ff]/50 font-bold uppercase tracking-wider mt-1 block">
            Interactive Knowledge Graph v2.4
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="hidden lg:flex items-center gap-6 font-mono text-[10px]">
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded border border-white/5">
          <span className="text-white/40">PATIENTS:</span>
          <span className="text-[#00f0ff] font-bold text-[11px]">{patientCount}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded border border-white/5">
          <span className="text-white/40">DRIVERS:</span>
          <span className="text-[#ff7b00] font-bold text-[11px]">{geneCount} Genes / {variantCount} Vars</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded border border-white/5">
          <span className="text-white/40">THERAPIES:</span>
          <span className="text-[#00ff66] font-bold text-[11px]">{drugCount} Drugs</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-[#00f0ff]/5 rounded border border-[#00f0ff]/10">
          <Activity className="w-3.5 h-3.5 text-[#00ff66] animate-pulse" />
          <span className="text-[#00f0ff]/60">CONNECTIONS:</span>
          <span className="text-[#00f0ff] font-bold text-[11px]">{linkCount} Edges</span>
        </div>
      </div>

      {/* Right side — extra controls + clock + status */}
      <div className="flex items-center gap-3 font-mono">
        {/* Extra controls injected from App (sidebar toggles, fullscreen) */}
        {extraControls && (
          <div className="flex items-center gap-2 border-r border-white/10 pr-3 mr-1">
            {extraControls}
          </div>
        )}

        {/* Clock */}
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <Clock className="w-3.5 h-3.5 text-[#00f0ff]/70" />
          <span>{currentTime}</span>
        </div>

      </div>
    </header>
  );
};
