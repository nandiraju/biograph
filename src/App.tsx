import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { ForceGraph3D } from './components/ForceGraph3D';
import type { LayoutMode } from './components/ForceGraph3D';
import { oncologyData } from './data/mockOncologyData';
import type { OncologyNode, OncologyLink } from './data/mockOncologyData';
import {
  Maximize2, Minimize2,
  PanelLeftClose, PanelLeftOpen,
  PanelRightClose, PanelRightOpen,
  LayoutGrid, Zap, Circle, GitBranch, AlignVerticalDistributeCenter,
} from 'lucide-react';
import './App.css';

// ── Subgraph helper ────────────────────────────────────────────────────────
function buildPatientSubgraph(patientId: string) {


  const linkId = (l: OncologyLink) => ({
    s: typeof l.source === 'object' ? (l.source as any).id : l.source,
    t: typeof l.target === 'object' ? (l.target as any).id : l.target,
  });

  const visited = new Set<string>([patientId]);
  const queue = [patientId];

  while (queue.length) {
    const curr = queue.shift()!;
    for (const link of oncologyData.links) {
      const { s, t } = linkId(link);
      if (s === curr && !visited.has(t)) { visited.add(t); queue.push(t); }
      if (t === curr && !visited.has(s)) { visited.add(s); queue.push(s); }
    }
  }

  const nodes = oncologyData.nodes.filter(n => visited.has(n.id));
  const links = oncologyData.links.filter(l => {
    const { s, t } = linkId(l);
    return visited.has(s) && visited.has(t);
  });

  return { nodes, links };
}

// ── Layout metadata ────────────────────────────────────────────────────────
const LAYOUTS: { id: LayoutMode; label: string; desc: string; icon: any }[] = [
  { id: 'force',        label: 'Free Force',   desc: 'Physics-driven',     icon: Zap },
  { id: 'radial',       label: 'Radial',       desc: 'Rings by type',      icon: Circle },
  { id: 'clustered',    label: 'Clustered',    desc: 'Groups by category', icon: LayoutGrid },
  { id: 'hierarchical', label: 'Hierarchical', desc: 'Layer by depth',     icon: GitBranch },
];

export default function App() {
  // ── Patient / filter / search state ──
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [filterTypes,       setFilterTypes]        = useState<string[]>([]);
  const [searchQuery,       setSearchQuery]         = useState('');
  const [selectedNode,      setSelectedNode]        = useState<OncologyNode | null>(null);
  const [patientLimit,      setPatientLimit]        = useState<number>(20);

  // ── Physics / display state ──
  const [linkDistance,   setLinkDistance]   = useState(90);
  const [chargeStrength, setChargeStrength] = useState(220);
  const [particleRate,   setParticleRate]   = useState(3);
  const [autoRotate,     setAutoRotate]     = useState(false);
  const [showLabels,     setShowLabels]     = useState(true);

  // ── UI shell state ──
  const [leftOpen,    setLeftOpen]    = useState(true);
  const [rightOpen,   setRightOpen]   = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ── Layout state ──
  const [layoutMode,    setLayoutMode]    = useState<LayoutMode>('force');
  const [layoutOpen,    setLayoutOpen]    = useState(false);
  const [isOrganizing,  setIsOrganizing]  = useState(false);
  const layoutPanelRef = useRef<HTMLDivElement>(null);

  // Close layout panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (layoutPanelRef.current && !layoutPanelRef.current.contains(e.target as Node)) {
        setLayoutOpen(false);
      }
    };
    if (layoutOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [layoutOpen]);

  // Fullscreen API — state is driven ONLY by fullscreenchange event
  // (never set eagerly, browser may reject the request silently)
  useEffect(() => {
    const sync = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', sync);
    document.addEventListener('webkitfullscreenchange', sync); // Safari
    sync(); // sync on mount in case already fullscreen
    return () => {
      document.removeEventListener('fullscreenchange', sync);
      document.removeEventListener('webkitfullscreenchange', sync);
    };
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      // Target the root app element for fullscreen
      const el = document.getElementById('root') ?? document.documentElement;
      el.requestFullscreen({ navigationUI: 'hide' }).catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn('Exit fullscreen failed:', err);
      });
    }
  }, []);

  // ── Patient selection ──
  const handleSelectPatient = (id: string | null) => {
    setSelectedPatientId(id);
    setSelectedNode(null);
    if (id) {
      const pt = oncologyData.nodes.find(n => n.id === id);
      if (pt) setSelectedNode(pt);
    }
  };

  const handleFocusNode = (nodeId: string) => {
    const node = oncologyData.nodes.find(n => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
      if (node.type === 'patient') setSelectedPatientId(node.id);
    }
  };

  const handleToggleFilterType = (type: string) => {
    setFilterTypes(prev => {
      const next = prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type];
      if (selectedNode && selectedNode.type === type) setSelectedNode(null);
      return next;
    });
  };

  // ── Layout handler ──
  const handleOrganize = useCallback((mode: LayoutMode) => {
    setIsOrganizing(true);
    setLayoutMode(mode);
    setLayoutOpen(false);
    setTimeout(() => setIsOrganizing(false), 1200);
  }, []);

  // ── Graph data ──
  const allPatients = oncologyData.nodes.filter(n => n.type === 'patient');
  const limitedPatientIds = new Set(allPatients.slice(0, patientLimit).map(n => n.id));

  const baseData = useMemo(() => {
    if (selectedPatientId) return buildPatientSubgraph(selectedPatientId);
    // Slice patients to the chosen limit, keep all non-patient nodes
    const nodes = oncologyData.nodes.filter(
      n => n.type !== 'patient' || limitedPatientIds.has(n.id)
    );
    const nodeIds = new Set(nodes.map(n => n.id));
    const links = oncologyData.links.filter(l => {
      const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
      return nodeIds.has(s) && nodeIds.has(t);
    });
    return { nodes, links };
  }, [selectedPatientId, patientLimit]);

  const filteredData = useMemo(() => {
    const nodes = baseData.nodes.filter(n => !filterTypes.includes(n.type));
    const nodeIds = new Set(nodes.map(n => n.id));
    const links = baseData.links.filter(l => {
      const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
      return nodeIds.has(s) && nodeIds.has(t);
    });
    return { nodes, links };
  }, [baseData, filterTypes]);

  const footerLabel = selectedPatientId
    ? `PATIENT: ${selectedPatientId}`
    : 'COHORT: ALL PATIENTS';

  // ── Shared icon button style ──
  const iconBtn = (active?: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 32, height: 32,
    background: active ? 'rgba(0,240,255,0.12)' : 'rgba(2,6,14,0.80)',
    border: `1px solid ${active ? 'rgba(0,240,255,0.45)' : 'rgba(0,240,255,0.20)'}`,
    borderRadius: 7,
    color: active ? '#00f0ff' : 'rgba(0,240,255,0.65)',
    cursor: 'pointer',
    transition: 'all 0.18s',
    flexShrink: 0,
  });

  return (
    <div className="h-screen w-screen bg-[#050811] text-white flex flex-col overflow-hidden relative">
      {/* Background radial overlays */}
      <div className="absolute top-[10%] left-[25%] w-[40%] h-[40%] bg-[#00f0ff]/2 rounded-full filter blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[25%] w-[40%] h-[40%] bg-[#b624ff]/2 rounded-full filter blur-[150px] pointer-events-none z-0" />

      {/* Header — fullscreen & sidebar toggles injected as extra controls */}
      <div className="relative z-30">
        <Header
          extraControls={
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {/* Left sidebar toggle */}
              <button
                style={iconBtn(!leftOpen)}
                title={leftOpen ? 'Collapse left panel' : 'Expand left panel'}
                onClick={() => setLeftOpen(o => !o)}
              >
                {leftOpen
                  ? <PanelLeftClose size={15} />
                  : <PanelLeftOpen  size={15} />}
              </button>

              {/* Right sidebar toggle */}
              <button
                style={iconBtn(!rightOpen)}
                title={rightOpen ? 'Collapse right panel' : 'Expand right panel'}
                onClick={() => setRightOpen(o => !o)}
              >
                {rightOpen
                  ? <PanelRightClose size={15} />
                  : <PanelRightOpen  size={15} />}
              </button>

              {/* Fullscreen toggle */}
              <button
                style={iconBtn(isFullscreen)}
                title={isFullscreen ? 'Exit full screen' : 'Full screen'}
                onClick={handleToggleFullscreen}
              >
                {isFullscreen
                  ? <Minimize2 size={15} />
                  : <Maximize2 size={15} />}
              </button>
            </div>
          }
        />
      </div>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden relative z-20">

        {/* Left Panel — collapsible */}
        <div
          style={{
            width: leftOpen ? 288 : 0,
            minWidth: leftOpen ? 288 : 0,
            overflow: 'hidden',
            transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1), min-width 0.28s cubic-bezier(0.4,0,0.2,1)',
            flexShrink: 0,
          }}
        >
          <SidebarLeft
            selectedPatientId={selectedPatientId}
            onSelectPatient={handleSelectPatient}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSelect={handleFocusNode}
            filterTypes={filterTypes}
            onToggleFilterType={handleToggleFilterType}
            linkDistance={linkDistance}
            onLinkDistanceChange={setLinkDistance}
            chargeStrength={chargeStrength}
            onChargeStrengthChange={setChargeStrength}
            particleRate={particleRate}
            onParticleRateChange={setParticleRate}
            autoRotate={autoRotate}
            onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
            showLabels={showLabels}
            onToggleLabels={() => setShowLabels(!showLabels)}
            patientLimit={patientLimit}
            onPatientLimitChange={(n) => { setPatientLimit(n); setSelectedPatientId(null); setSelectedNode(null); }}
          />
        </div>

        {/* 3D Canvas + Layout Button overlay */}
        <div className="flex-1 h-full relative overflow-hidden bg-[#020409]/60 flex items-center justify-center">
          <div className="absolute inset-0 hud-dots-bg opacity-20 pointer-events-none" />

          <ForceGraph3D
            data={filteredData}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
            linkDistance={linkDistance}
            chargeStrength={chargeStrength}
            particleRate={particleRate}
            autoRotate={autoRotate}
            showLabels={showLabels}
            layoutMode={layoutMode}
          />

          {/* ── Layout Organizer — centered bottom overlay ───────────────── */}
          <div
            ref={layoutPanelRef}
            style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 25,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              pointerEvents: 'auto',
            }}
          >
            {/* Popup panel — opens upward from button */}
            {layoutOpen && (
              <div style={{
                background: 'rgba(2,6,14,0.97)',
                border: '1px solid rgba(0,240,255,0.28)',
                borderRadius: 12,
                boxShadow: '0 0 30px rgba(0,240,255,0.12), 0 12px 40px rgba(0,0,0,0.85)',
                padding: '8px',
                display: 'flex',
                gap: 6,
                fontFamily: 'monospace',
              }}>
                {LAYOUTS.map(({ id, label, desc, icon: Icon }) => {
                  const active = layoutMode === id;
                  return (
                    <button
                      key={id}
                      onClick={() => handleOrganize(id)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                        background: active ? 'rgba(0,240,255,0.10)' : 'transparent',
                        border: active ? '1px solid rgba(0,240,255,0.35)' : '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 9, padding: '10px 14px', cursor: 'pointer',
                        minWidth: 80, transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,240,255,0.20)'; }}
                      onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; } }}
                    >
                      <Icon size={16} style={{ color: active ? '#00f0ff' : 'rgba(255,255,255,0.45)' }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: active ? '#00f0ff' : 'rgba(255,255,255,0.75)', lineHeight: 1.1 }}>{label}</span>
                      <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.30)' }}>{desc}</span>
                      {active && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#00f0ff', boxShadow: '0 0 5px #00f0ff', marginTop: 1 }} />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Trigger pill button */}
            <button
              onClick={() => setLayoutOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: layoutOpen ? 'rgba(0,240,255,0.14)' : 'rgba(2,6,14,0.90)',
                border: `1px solid ${layoutOpen ? 'rgba(0,240,255,0.55)' : 'rgba(0,240,255,0.25)'}`,
                borderRadius: 24,
                padding: '7px 18px',
                color: layoutOpen ? '#00f0ff' : 'rgba(0,240,255,0.80)',
                fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
                letterSpacing: '0.10em', textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: layoutOpen
                  ? '0 0 20px rgba(0,240,255,0.22), 0 4px 16px rgba(0,0,0,0.6)'
                  : '0 0 10px rgba(0,240,255,0.08), 0 4px 12px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              <AlignVerticalDistributeCenter
                size={13}
                style={{ animation: isOrganizing ? 'spin 0.8s linear infinite' : 'none', color: 'inherit' }}
              />
              Organize Layout
              {layoutMode !== 'force' && (
                <span style={{
                  fontSize: 8, padding: '1px 6px', borderRadius: 20,
                  background: 'rgba(0,240,255,0.18)', color: '#00f0ff',
                  border: '1px solid rgba(0,240,255,0.35)',
                }}>
                  {layoutMode === 'radial' ? 'RADIAL' : layoutMode === 'clustered' ? 'CLUSTER' : 'HIER'}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Right Inspector — collapsible */}
        <div
          style={{
            width: rightOpen ? 320 : 0,
            minWidth: rightOpen ? 320 : 0,
            overflow: 'hidden',
            transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1), min-width 0.28s cubic-bezier(0.4,0,0.2,1)',
            flexShrink: 0,
          }}
        >
          <SidebarRight
            selectedNode={selectedNode}
            onFocusNode={handleFocusNode}
            onClearSelection={() => setSelectedNode(null)}
          />
        </div>
      </main>

      {/* Footer */}
      <footer
        className="w-full h-8 border-t border-[rgba(0,240,255,0.15)] px-6 flex items-center justify-between font-mono text-[9px] text-gray-500 z-30"
        style={{ background: 'rgba(2, 4, 9, 0.95)' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
          <span>GRAPHICS_MODE: WEBGL_3D_ACCEL</span>
        </div>
        <div>
          <span>VIEWING: {footerLabel}</span>
        </div>
        <div className="flex gap-4">
          <span>COHORT: 1CELL_DIAGNOSTICS_IND</span>
          <span>SYSTEM_STABLE_100%</span>
        </div>
      </footer>
    </div>
  );
}
