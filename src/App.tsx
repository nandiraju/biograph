import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { ForceGraph3D } from './components/ForceGraph3D';
import { oncologyData } from './data/mockOncologyData';
import type { OncologyNode, OncologyLink } from './data/mockOncologyData';
import './App.css';

// ── Subgraph helper ────────────────────────────────────────────────────────
// Given a root patient ID, do a full BFS through the graph so ALL connected
// nodes (cancer, genes, variants, biomarkers, drugs, trials) are included.
function buildPatientSubgraph(patientId: string) {
  const nodeMap = new Map(oncologyData.nodes.map(n => [n.id, n]));

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

export default function App() {
  // null = All Patients, string = specific patient ID
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [filterTypes,       setFilterTypes]        = useState<string[]>([]);
  const [searchQuery,       setSearchQuery]         = useState('');
  const [selectedNode,      setSelectedNode]        = useState<OncologyNode | null>(null);

  // Simulation & Display
  const [linkDistance,    setLinkDistance]    = useState(90);
  const [chargeStrength,  setChargeStrength]  = useState(220);
  const [particleRate,    setParticleRate]    = useState(3);
  const [autoRotate,      setAutoRotate]      = useState(false);
  const [showLabels,      setShowLabels]      = useState(true);

  // Handle patient selection
  const handleSelectPatient = (id: string | null) => {
    setSelectedPatientId(id);
    setSelectedNode(null); // clear inspector
    if (id) {
      // Auto-focus the patient node in the inspector
      const pt = oncologyData.nodes.find(n => n.id === id);
      if (pt) setSelectedNode(pt);
    }
  };

  // Focus a node by ID (from search or right-panel button)
  const handleFocusNode = (nodeId: string) => {
    const node = oncologyData.nodes.find(n => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
      // If this is a patient node, also switch the subgraph view
      if (node.type === 'patient') setSelectedPatientId(node.id);
    }
  };

  // Entity type visibility toggle
  const handleToggleFilterType = (type: string) => {
    setFilterTypes(prev => {
      const next = prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type];
      if (selectedNode && selectedNode.type === type) setSelectedNode(null);
      return next;
    });
  };

  // Build the graph data — either full cohort or single-patient subgraph
  const baseData = useMemo(() => {
    if (selectedPatientId) return buildPatientSubgraph(selectedPatientId);
    return { nodes: oncologyData.nodes, links: oncologyData.links };
  }, [selectedPatientId]);

  // Apply entity-type visibility filter on top
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

  return (
    <div className="h-screen w-screen bg-[#050811] text-white flex flex-col overflow-hidden relative">
      {/* Background radial overlays */}
      <div className="absolute top-[10%] left-[25%] w-[40%] h-[40%] bg-[#00f0ff]/2 rounded-full filter blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[25%] w-[40%] h-[40%] bg-[#b624ff]/2 rounded-full filter blur-[150px] pointer-events-none z-0" />

      {/* Header */}
      <Header />

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden relative z-20">

        {/* Left Control Panel */}
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
        />

        {/* 3D Visualizer Canvas */}
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
          />
        </div>

        {/* Right Inspector Panel */}
        <SidebarRight
          selectedNode={selectedNode}
          onFocusNode={handleFocusNode}
          onClearSelection={() => setSelectedNode(null)}
        />
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
