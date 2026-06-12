import React, { useState } from 'react';
import { Search, Settings, Filter, Layers, Users, User, ChevronDown, CheckSquare, Square } from 'lucide-react';
import { oncologyData } from '../data/mockOncologyData';

interface SidebarLeftProps {
  selectedPatientId: string | null;   // null = All Patients
  onSelectPatient: (id: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSelect: (nodeId: string) => void;
  filterTypes: string[];
  onToggleFilterType: (type: string) => void;

  // Physics & Display
  linkDistance: number;
  onLinkDistanceChange: (val: number) => void;
  chargeStrength: number;
  onChargeStrengthChange: (val: number) => void;
  particleRate: number;
  onParticleRateChange: (val: number) => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
}

const nodeTypeColors: Record<string, string> = {
  patient:   '#00f0ff',
  gene:      '#ff7b00',
  variant:   '#b624ff',
  cancer:    '#ff2a85',
  drug:      '#00ff66',
  trial:     '#0084ff',
  biomarker: '#ffe600',
};

const formatTypeName = (type: string) => {
  if (type === 'cancer') return 'Cancer Type';
  if (type === 'trial') return 'Clinical Trial';
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// Pull all patients from data
const patients = oncologyData.nodes.filter(n => n.type === 'patient');

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  selectedPatientId,
  onSelectPatient,
  searchQuery,
  onSearchChange,
  onSearchSelect,
  filterTypes,
  onToggleFilterType,
  linkDistance,
  onLinkDistanceChange,
  chargeStrength,
  onChargeStrengthChange,
  particleRate,
  onParticleRateChange,
  autoRotate,
  onToggleAutoRotate,
  showLabels,
  onToggleLabels,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showConfig, setShowConfig]   = useState(false);

  // Search suggestions
  const filteredSuggestions = searchQuery.trim()
    ? oncologyData.nodes
        .filter(n =>
          n.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !filterTypes.includes(n.type)
        )
        .slice(0, 5)
    : [];

  return (
    <div
      className="w-72 h-full flex flex-col border-r border-[rgba(0,240,255,0.15)] select-none shrink-0"
      style={{
        background: 'rgba(2, 4, 9, 0.88)',
        backdropFilter: 'blur(16px)',
        overflow: 'hidden',
      }}
    >
    {/* Scrollable wrapper for everything */}
    <div className="flex flex-col gap-3 flex-1 overflow-y-auto" style={{ padding: '20px 24px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,240,255,0.2) transparent' }}>
      {/* ── SEARCH ─────────────────────────────────────────────── */}
      <div className="relative font-mono mb-1">
        {/* Glowing card wrapper */}
        <div
          style={{
            padding: '12px',
            borderRadius: '10px',
            background: 'rgba(0,240,255,0.04)',
            border: '1px solid rgba(0,240,255,0.22)',
            boxShadow: '0 0 18px rgba(0,240,255,0.09), inset 0 0 14px rgba(0,240,255,0.04)',
            marginBottom: '4px',
          }}
        >
          {/* Label row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Search className="w-3.5 h-3.5 text-[#00f0ff]/70" />
            <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '0.12em', color: 'rgba(0,240,255,0.82)', textTransform: 'uppercase' }}>
              Search Database
            </span>
          </div>

          {/* Input with inner icon + glow on focus */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#00f0ff]/40 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="gene, patient, drug..."
              className="search-glow-input w-full bg-black/50 border border-[#00f0ff]/25 rounded-md pl-8 pr-8 text-[13px] font-sans text-white placeholder-gray-600 focus:outline-none transition-all"
              style={{ padding: '9px 32px 9px 32px' }}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white text-[12px] transition-colors cursor-pointer"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Suggestion dropdown */}
        {filteredSuggestions.length > 0 && (
          <div className="absolute left-0 w-full bg-[#050c14] border border-[#00f0ff]/30 rounded-b-lg shadow-xl shadow-black/80 z-50 font-sans overflow-hidden"
            style={{ top: 'calc(100% - 4px)', boxShadow: '0 8px 24px rgba(0,240,255,0.08)' }}
          >
            {filteredSuggestions.map((node) => (
              <button
                key={node.id}
                onClick={() => { onSearchSelect(node.id); onSearchChange(''); }}
                className="w-full text-left px-3 py-2.5 text-xs hover:bg-[#00f0ff]/10 flex items-center justify-between border-b border-white/5 last:border-b-0 cursor-pointer transition-colors"
              >
                <span className="text-white font-medium">{node.label}</span>
                <span
                  className="text-[11px] px-1.5 py-0.5 rounded font-mono uppercase"
                  style={{ color: node.color, background: `${node.color}15`, border: `1px solid ${node.color}35` }}
                >
                  {formatTypeName(node.type)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── PATIENTS ───────────────────────────────────────────── */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-[#00f0ff]/15 pb-1.5 mb-2 font-mono">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#00f0ff]/70" />
            <span className="text-[12px] font-black tracking-wider text-gray-300">PATIENTS</span>
          </div>
          <span
            className="text-[10px] font-mono px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(0,240,255,0.1)', color: '#00f0ff', border: '1px solid rgba(0,240,255,0.25)' }}
          >{patients.length}</span>
        </div>

        {/* Scrollable patient list */}
        <div
          className="flex flex-col gap-1 overflow-y-auto pr-0.5"
          style={{ maxHeight: '340px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,240,255,0.18) transparent' }}
        >
          {/* ALL PATIENTS row */}
          <button
            onClick={() => onSelectPatient(null)}
            className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded border text-left transition-all cursor-pointer ${
              selectedPatientId === null
                ? 'bg-[#00f0ff]/12 border-[#00f0ff]/70 shadow-[0_0_8px_rgba(0,240,255,0.15)]'
                : 'bg-transparent border-white/8 hover:border-[#00f0ff]/30 hover:bg-white/4'
            }`}
          >
            <div
              className="flex items-center justify-center w-6 h-6 rounded-full shrink-0"
              style={{
                background: selectedPatientId === null ? 'rgba(0,240,255,0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${selectedPatientId === null ? '#00f0ff' : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              <Users className="w-3 h-3" style={{ color: selectedPatientId === null ? '#00f0ff' : '#9ca3af' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="font-mono text-[12px] font-bold"
                style={{ color: selectedPatientId === null ? '#00f0ff' : '#d1d5db' }}
              >
                All Patients
              </div>
              <div className="text-[10.5px] text-gray-500 font-sans">{patients.length} patients • full cohort</div>
            </div>
            {selectedPatientId === null && (
              <span className="text-[#00ff66] text-[9px] font-mono animate-pulse shrink-0">● ACTIVE</span>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 py-1 px-1">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">Individual</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Individual patient rows */}
          {patients.map((pt) => {
            const isActive = selectedPatientId === pt.id;
            const cancerLink = oncologyData.links.find(l =>
              (l.source === pt.id || (l.source as any)?.id === pt.id) && l.type === 'diagnosed_with'
            );
            const cancerNode = cancerLink
              ? oncologyData.nodes.find(n =>
                  n.id === (typeof cancerLink.target === 'object' ? (cancerLink.target as any).id : cancerLink.target)
                )
              : null;

            const mutationCount = oncologyData.links.filter(l =>
              (l.source === pt.id || (l.source as any)?.id === pt.id) && l.type === 'has_mutation'
            ).length;

            return (
              <button
                key={pt.id}
                onClick={() => onSelectPatient(pt.id)}
                className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#00f0ff]/60 shadow-[0_0_8px_rgba(0,240,255,0.1)]'
                    : 'bg-transparent border-white/8 hover:border-[#00f0ff]/25 hover:bg-white/4'
                }`}
                style={isActive ? { background: 'rgba(0,240,255,0.08)' } : {}}
              >
                {/* Avatar circle */}
                <div
                  className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 font-mono text-[10px] font-bold"
                  style={{
                    background: isActive ? 'rgba(0,240,255,0.18)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isActive ? '#00f0ff' : 'rgba(255,255,255,0.1)'}`,
                    color: isActive ? '#00f0ff' : '#9ca3af',
                  }}
                >
                  <User className="w-3 h-3" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className="font-mono text-[12px] font-bold truncate"
                      style={{ color: isActive ? '#00f0ff' : '#e5e7eb' }}
                    >
                      {pt.id}
                    </span>
                    {isActive && (
                      <span className="text-[#00ff66] text-[9px] font-mono animate-pulse shrink-0">● ACTIVE</span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-500 font-sans truncate">
                    {cancerNode
                      ? <span style={{ color: '#ff2a85' }}>{cancerNode.label}</span>
                      : <span>Unknown</span>
                    }
                    <span className="text-gray-600"> • {mutationCount} mutation{mutationCount !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="text-[9.5px] text-gray-600 font-sans truncate">{pt.details.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── ENTITY FILTERS (collapsible) ──────────────────────── */}
      <div className="flex flex-col">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-between w-full border-b border-[#00f0ff]/15 pb-1.5 mb-2 font-mono text-[12px] text-left text-gray-300 hover:text-[#00f0ff] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#00f0ff]/70" />
            <span className="font-black tracking-wider">ENTITY_FILTERS</span>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${showFilters ? '' : '-rotate-90'}`} />
        </button>

        {showFilters && (
          <div className="grid grid-cols-2 gap-2 mt-1.5 font-mono text-[11px]">
            {Object.keys(nodeTypeColors).map((type) => {
              const isExcluded = filterTypes.includes(type);
              const color = nodeTypeColors[type];
              return (
                <button
                  key={type}
                  onClick={() => onToggleFilterType(type)}
                  className="flex items-center gap-2 p-1.5 rounded border border-white/5 bg-[#020409]/40 hover:bg-white/5 text-left transition-colors cursor-pointer"
                >
                  {isExcluded
                    ? <Square className="w-3.5 h-3.5 text-gray-600" />
                    : <CheckSquare className="w-3.5 h-3.5" style={{ color }} />
                  }
                  <span className={isExcluded ? 'text-gray-500 line-through' : 'text-gray-300'}>
                    {formatTypeName(type)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── GRAPH CONTROLLER (collapsible) ────────────────────── */}
      <div className="flex flex-col">
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="flex items-center justify-between w-full border-b border-[#00f0ff]/15 pb-1.5 mb-2 font-mono text-[12px] text-left text-gray-300 hover:text-[#00f0ff] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1">
            <Settings className="w-3.5 h-3.5 text-[#00f0ff]/70" />
            <span className="font-black tracking-wider">GRAPH_CONTROLLER</span>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${showConfig ? '' : '-rotate-90'}`} />
        </button>

        {showConfig && (
          <div className="flex flex-col gap-3.5 mt-1.5 font-mono text-[11px] text-gray-400">
            {/* Link Distance */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span>LINK_DISTANCE:</span>
                <span className="text-[#00f0ff]">{linkDistance}px</span>
              </div>
              <input type="range" min="40" max="250" value={linkDistance}
                onChange={(e) => onLinkDistanceChange(Number(e.target.value))}
                className="w-full accent-[#00f0ff] bg-black/40 h-1 rounded" />
            </div>

            {/* Charge Strength */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span>CHARGE_STRENGTH:</span>
                <span className="text-[#00f0ff]">-{chargeStrength}</span>
              </div>
              <input type="range" min="50" max="600" value={chargeStrength}
                onChange={(e) => onChargeStrengthChange(Number(e.target.value))}
                className="w-full accent-[#00f0ff] bg-black/40 h-1 rounded" />
            </div>

            {/* Particle Rate */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <span>FLOW_PARTICLES:</span>
                <span className="text-[#00f0ff]">{particleRate}</span>
              </div>
              <input type="range" min="0" max="5" value={particleRate}
                onChange={(e) => onParticleRateChange(Number(e.target.value))}
                className="w-full accent-[#00f0ff] bg-black/40 h-1 rounded" />
            </div>

            {/* Toggles */}
            <div className="flex justify-between items-center border-t border-white/5 pt-2">
              <span>AUTO_ROTATE_CAMERA:</span>
              <button
                onClick={onToggleAutoRotate}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${autoRotate ? 'bg-[#00f0ff]' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-black transition-transform ${autoRotate ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <span>RENDER_3D_LABELS:</span>
              <button
                onClick={onToggleLabels}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${showLabels ? 'bg-[#00f0ff]' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-black transition-transform ${showLabels ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── LEGEND ─────────────────────────────────────────────── */}
      <div className="mt-auto border-t border-white/5 pt-3 font-mono text-[10px] text-left text-gray-500 leading-tight">
        <div className="flex items-center gap-1.5 mb-1.5 text-gray-400 font-bold uppercase tracking-wider">
          <Layers className="w-3 h-3 text-[#00f0ff]/50" />
          <span>Clinical Legend</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.keys(nodeTypeColors).map(type => (
            <div key={type} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: nodeTypeColors[type] }} />
              <span className="capitalize">{formatTypeName(type)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};
