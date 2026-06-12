import React from 'react';
import { Target, BookOpen, ExternalLink, RefreshCw, Crosshair } from 'lucide-react';
import type { OncologyNode } from '../data/mockOncologyData';

interface SidebarRightProps {
  selectedNode: OncologyNode | null;
  onFocusNode: (nodeId: string) => void;
  onClearSelection: () => void;
}

const nodeTypeColors: Record<string, string> = {
  patient: '#00f0ff',
  gene: '#ff7b00',
  variant: '#b624ff',
  cancer: '#ff2a85',
  drug: '#00ff66',
  trial: '#0084ff',
  biomarker: '#ffe600',
};

const formatTypeName = (type: string) => {
  if (type === 'cancer') return 'Cancer Type';
  if (type === 'trial') return 'Clinical Trial';
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export const SidebarRight: React.FC<SidebarRightProps> = ({
  selectedNode,
  onFocusNode,
  onClearSelection,
}) => {
  if (!selectedNode) {
    return (
      <div 
        className="w-80 h-full flex flex-col border-l border-[rgba(0,240,255,0.15)] select-none shrink-0"
        style={{
          background: 'rgba(2, 4, 9, 0.85)',
          backdropFilter: 'blur(16px)',
          padding: '24px 28px',
        }}
      >
        <div className="flex-1 flex flex-col items-center justify-center text-center font-mono">
          <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center mb-4 text-gray-500">
            <Target className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-1.5">No Entity Selected</h3>
          <p className="text-[10px] text-gray-500 leading-normal font-sans px-2">
            Click on a node in the 3D network workspace to inspect clinical profiles, variant actions, target therapies, and trials.
          </p>
        </div>

        {/* Database Quick links in footer */}
        <div className="border-t border-white/5 pt-4 font-mono text-[8.5px] text-gray-500">
          <span className="font-bold text-[7.5px] text-gray-400 uppercase tracking-wider block mb-2">Oncology Databases</span>
          <div className="flex flex-col gap-2">
            <a href="https://www.ncbi.nlm.nih.gov/clinvar/" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-[#00f0ff] transition-colors">
              <span>CLINVAR GENOMICS</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <a href="https://www.ebi.ac.uk/chembl/" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-[#00f0ff] transition-colors">
              <span>CHEMBL BIOACTIVITY</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <a href="https://clinicaltrials.gov/" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-[#00f0ff] transition-colors">
              <span>CLINICALTRIALS.GOV</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  const { title, subtitle, description, meta, stats } = selectedNode.details;
  const color = nodeTypeColors[selectedNode.type];

  return (
    <div 
      className="w-80 h-full flex flex-col border-l border-[rgba(0,240,255,0.15)] select-none shrink-0"
      style={{
        background: 'rgba(2, 4, 9, 0.85)',
        backdropFilter: 'blur(16px)',
        overflowY: 'auto',
        padding: '20px 28px',
      }}
    >
      {/* Title Header */}
      <div className="font-mono mb-4">
        <div className="flex justify-between items-center border-b border-[#00f0ff]/15 pb-1 mb-2.5">
          <span className="text-[10px] font-black tracking-wider text-gray-300">CLINICAL_INSPECTOR</span>
          <button 
            onClick={onClearSelection}
            className="text-[9px] text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-2.5 h-2.5" /> RESET
          </button>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <span 
            className="text-[8px] font-bold px-2 py-0.5 rounded uppercase font-mono tracking-wider"
            style={{
              color,
              background: `${color}15`,
              border: `1px solid ${color}35`
            }}
          >
            {formatTypeName(selectedNode.type)}
          </span>
          <span className="text-[9px] text-gray-500 font-bold uppercase">ID: {selectedNode.id}</span>
        </div>
        
        <h2 className="text-sm font-black text-white font-heading tracking-wide uppercase leading-tight mb-0.5">
          {title}
        </h2>
        {subtitle && (
          <span className="text-[9px] font-bold block" style={{ color }}>
            {subtitle}
          </span>
        )}
      </div>

      {/* Description Panel */}
      <div className="bg-[#020409]/60 border border-white/5 rounded p-3 mb-4 text-[10px] font-sans text-gray-300 leading-relaxed">
        {description}
      </div>

      {/* Stats Cards */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4 font-mono text-[9px]">
          {stats.map((stat, i) => (
            <div key={i} className="p-2 bg-white/5 border border-white/5 rounded">
              <span className="text-gray-500 block leading-none mb-1 text-[8px] uppercase">{stat.label}</span>
              <span className="text-white font-extrabold text-[10px]">{stat.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Metadata Grid */}
      {meta && Object.keys(meta).length > 0 && (
        <div className="flex flex-col gap-2.5 mb-6 border-t border-white/5 pt-3 font-sans text-[10px]">
          {Object.entries(meta).map(([key, val]) => (
            <div key={key} className="flex flex-col gap-0.5">
              <span className="font-mono text-[8px] text-gray-500 uppercase font-bold tracking-wider">{key}</span>
              <span className="text-gray-200 leading-normal">{val}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action panel */}
      <div className="mt-auto flex flex-col gap-2 pt-3 border-t border-white/5 font-mono">
        <button
          onClick={() => onFocusNode(selectedNode.id)}
          className="w-full bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/40 text-[#00f0ff] font-bold py-2 rounded text-xs tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Crosshair className="w-3.5 h-3.5" /> FOCUS CAMERA
        </button>

        {selectedNode.type === 'variant' && (
          <a
            href={`https://www.ncbi.nlm.nih.gov/clinvar/?term=${selectedNode.label}`}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-[#b624ff]/5 hover:bg-[#b624ff]/10 border border-[#b624ff]/30 text-white/90 font-bold py-2 rounded text-[10px] tracking-wider flex items-center justify-center gap-1.5 transition-colors text-center"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#b624ff]" /> RESEARCH CLINVAR
          </a>
        )}

        {selectedNode.type === 'drug' && (
          <a
            href={`https://pubchem.ncbi.nlm.nih.gov/#query=${selectedNode.label}`}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-[#00ff66]/5 hover:bg-[#00ff66]/10 border border-[#00ff66]/30 text-white/90 font-bold py-2 rounded text-[10px] tracking-wider flex items-center justify-center gap-1.5 transition-colors text-center"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#00ff66]" /> RESEARCH PUBCHEM
          </a>
        )}

        {selectedNode.type === 'trial' && (
          <a
            href={`https://clinicaltrials.gov/search?term=${selectedNode.id.split(' ')[0]}`}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-[#0084ff]/5 hover:bg-[#0084ff]/10 border border-[#0084ff]/30 text-white/90 font-bold py-2 rounded text-[10px] tracking-wider flex items-center justify-center gap-1.5 transition-colors text-center"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#0084ff]" /> VISIT TRIAL REGISTRY
          </a>
        )}
      </div>
    </div>
  );
};
