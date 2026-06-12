import React, { useEffect, useRef, useCallback, useState } from 'react';
import ForceGraph3DLib from 'react-force-graph-3d';
import * as THREE from 'three';
import { LayoutGrid, Zap, Circle, AlignVerticalDistributeCenter, GitBranch } from 'lucide-react';
import type { OncologyData, OncologyNode } from '../data/mockOncologyData';

// ── Layout definitions ────────────────────────────────────────────────────────
type LayoutMode = 'force' | 'radial' | 'clustered' | 'hierarchical';

const TYPE_ORDER: Record<string, number> = {
  patient: 0, cancer: 1, gene: 2, variant: 3, biomarker: 4, drug: 5, trial: 6,
};

// Radii for each type in RADIAL mode
const RADIAL_R: Record<string, number> = {
  patient: 0,    // center
  cancer: 60,
  gene: 120,
  variant: 160,
  biomarker: 155,
  drug: 200,
  trial: 230,
};

// Y-layer for HIERARCHICAL mode (higher = more "root")
const HIER_Y: Record<string, number> = {
  patient: 120,
  cancer: 60,
  gene: 0,
  variant: -60,
  biomarker: -60,
  drug: -130,
  trial: -190,
};

// Cluster centres for CLUSTERED mode
const CLUSTER_CENTER: Record<string, [number, number, number]> = {
  patient:   [0,    80, 0],
  cancer:    [-120, 20, -40],
  gene:      [120,  20, -40],
  variant:   [80,  -80, 60],
  biomarker: [-80, -80, 60],
  drug:      [0,  -120, -80],
  trial:     [0,   120, 80],
};

function positionNodes(nodes: any[], mode: LayoutMode) {
  const byType: Record<string, any[]> = {};
  for (const n of nodes) {
    const t = n.type ?? 'gene';
    (byType[t] = byType[t] || []).push(n);
  }

  if (mode === 'force') {
    // Release all pins
    for (const n of nodes) { delete n.fx; delete n.fy; delete n.fz; }
    return;
  }

  if (mode === 'radial') {
    for (const [type, group] of Object.entries(byType)) {
      const r = RADIAL_R[type] ?? 150;
      if (r === 0) {
        // patient at exact centre
        group.forEach(n => { n.fx = 0; n.fy = 0; n.fz = 0; });
      } else {
        group.forEach((n, i) => {
          const theta = (2 * Math.PI * i) / group.length;
          const phi   = Math.PI * 0.45; // slight tilt so not flat
          n.fx = r * Math.sin(phi) * Math.cos(theta);
          n.fy = r * Math.cos(phi) * (Math.random() < 0.5 ? 1 : -1) * 0.4;
          n.fz = r * Math.sin(phi) * Math.sin(theta);
        });
      }
    }
    return;
  }

  if (mode === 'clustered') {
    const SPREAD = 55;
    for (const [type, group] of Object.entries(byType)) {
      const [cx, cy, cz] = CLUSTER_CENTER[type] ?? [0, 0, 0];
      group.forEach((n, i) => {
        const angle = (2 * Math.PI * i) / group.length;
        const r = group.length > 1 ? SPREAD * 0.5 : 0;
        n.fx = cx + r * Math.cos(angle);
        n.fy = cy + (Math.random() - 0.5) * 20;
        n.fz = cz + r * Math.sin(angle);
      });
    }
    return;
  }

  if (mode === 'hierarchical') {
    for (const [type, group] of Object.entries(byType)) {
      const y = HIER_Y[type] ?? 0;
      const span = 90;
      group.forEach((n, i) => {
        const offset = group.length > 1 ? (i / (group.length - 1) - 0.5) * span * 2 : 0;
        n.fx = offset;
        n.fy = y;
        n.fz = (Math.random() - 0.5) * 40;
      });
    }
  }
}

interface ForceGraph3DProps {
  data: OncologyData;
  selectedNode: OncologyNode | null;
  onSelectNode: (node: OncologyNode | null) => void;
  linkDistance: number;
  chargeStrength: number;
  particleRate: number;
  autoRotate: boolean;
  showLabels: boolean;
}

export const ForceGraph3D: React.FC<ForceGraph3DProps> = ({
  data,
  selectedNode,
  onSelectNode,
  linkDistance,
  chargeStrength,
  particleRate,
  autoRotate,
  showLabels,
}) => {
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoverNode, setHoverNode] = useState<OncologyNode | null>(null);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('force');
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [isOrganizing, setIsOrganizing] = useState(false);

  // Track container size via ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        setDimensions({ width: e.contentRect.width, height: e.contentRect.height || 600 });
      }
    });
    ro.observe(el);
    setDimensions({ width: el.clientWidth, height: el.clientHeight || 600 });
    return () => ro.disconnect();
  }, []);

  // Auto-rotate via OrbitControls
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    const controls = fg.controls();
    if (controls) {
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = 0.8;
    }
  }, [autoRotate]);

  // Update D3 forces when sliders change
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    try {
      fg.d3Force('link')?.distance(linkDistance);
      fg.d3Force('charge')?.strength(-chargeStrength);
      fg.d3ReheatSimulation();
    } catch (_) {}
  }, [linkDistance, chargeStrength]);

  // Apply layout mode whenever it changes or data changes
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    // Use live graph data (has x/y/z already set by d3)
    // react-force-graph-3d mutates the node objects from data.nodes in-place
    // so we can set fx/fy/fz directly on them after a short init delay
    const t = setTimeout(() => {
      positionNodes(data.nodes as any[], layoutMode);
      try { fg.d3ReheatSimulation(); } catch (_) {}
    }, 100);
    return () => clearTimeout(t);
  }, [layoutMode, data]);

  // Apply layout on re-organize click (animate)
  const handleOrganize = useCallback((mode: LayoutMode) => {
    setIsOrganizing(true);
    setLayoutMode(mode);
    setLayoutOpen(false);
    setTimeout(() => setIsOrganizing(false), 1200);
  }, []);

  // Camera: focus on selected node
  // Uses a small delay to allow force layout to settle on new data before reading node positions
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;

    const doFocus = () => {
      if (!selectedNode) {
        fg.cameraPosition({ x: 0, y: 0, z: 320 }, { x: 0, y: 0, z: 0 }, 1200);
        return;
      }
      // Read live node position from the graph's internal data (mutated by d3)
      // react-force-graph-3d mutates the node objects in the graphData prop with x/y/z
      const liveNode = data.nodes.find(n => n.id === selectedNode.id);
      if (!liveNode) return;
      const nx = (liveNode as any).x || 0;
      const ny = (liveNode as any).y || 0;
      const nz = (liveNode as any).z || 0;
      const dist = 100;
      const magnitude = Math.hypot(nx, ny, nz) || 1;
      const ratio = 1 + dist / magnitude;
      fg.cameraPosition(
        { x: nx * ratio, y: ny * ratio, z: nz * ratio },
        { x: nx, y: ny, z: nz },
        1500
      );
    };

    // Small delay so positions are populated after warmup
    const t = setTimeout(doFocus, 300);
    return () => clearTimeout(t);
  }, [selectedNode, data]);

  // Helper: check if two nodes share a link
  const isNeighbor = useCallback((a: string, b: string) => {
    return data.links.some(l => {
      const s = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const t = typeof l.target === 'object' ? (l.target as any).id : l.target;
      return (s === a && t === b) || (t === a && s === b);
    });
  }, [data]);

  const activeNode = selectedNode || hoverNode;

  // ── Visual callbacks — stable refs via useCallback ──────────────────────

  const nodeColor = useCallback((node: any) => {
    if (!activeNode) return node.color;
    if (node.id === activeNode.id || isNeighbor(node.id, activeNode.id)) return node.color;
    return 'rgba(60,64,75,0.12)';
  }, [activeNode, isNeighbor]);

  const linkColor = useCallback((link: any) => {
    if (!activeNode) return link.color ?? 'rgba(255,255,255,0.15)';
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    return (s === activeNode.id || t === activeNode.id)
      ? link.color ?? 'rgba(255,255,255,0.5)'
      : 'rgba(40,44,55,0.04)';
  }, [activeNode]);

  const linkWidth = useCallback((link: any) => {
    if (!activeNode) return link.width ?? 1;
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    return (s === activeNode.id || t === activeNode.id) ? 3 : 0.4;
  }, [activeNode]);

  const linkParticles = useCallback((link: any) => {
    if (particleRate === 0) return 0;
    if (!activeNode) return (link.type === 'targets' || link.type === 'evaluated_in') ? 1 : 0;
    const s = typeof link.source === 'object' ? link.source.id : link.source;
    const t = typeof link.target === 'object' ? link.target.id : link.target;
    return (s === activeNode.id || t === activeNode.id) ? particleRate : 0;
  }, [activeNode, particleRate]);

  // Helper: make a canvas label sprite
  const makeLabelSprite = useCallback((node: any, color: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'rgba(2,4,9,0.75)';
    ctx.beginPath();
    ctx.roundRect(14, 8, 228, 48, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.font = 'bold 17px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#020409';
    ctx.lineWidth = 3;
    ctx.strokeText(node.label, 128, 32);
    ctx.fillStyle = color;
    ctx.fillText(node.label, 128, 32);
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(28, 7, 1);
    return sprite;
  }, []);

  // Helper: gender icon sprite
  const makeGenderSprite = useCallback((isFemale: boolean, faded: boolean) => {
    const symbol = isFemale ? '♀' : '♂';
    const genderColor = isFemale ? '#ff6eb4' : '#4fc3f7';
    const c = document.createElement('canvas');
    c.width = 80; c.height = 80;
    const ctx = c.getContext('2d')!;
    // Glowing circle background
    const alpha = faded ? 0.15 : 0.85;
    ctx.fillStyle = faded
      ? 'rgba(80,80,80,0.15)'
      : (isFemale ? 'rgba(255,110,180,0.18)' : 'rgba(79,195,247,0.18)');
    ctx.beginPath(); ctx.arc(40, 40, 36, 0, Math.PI * 2); ctx.fill();
    // Border ring
    ctx.strokeStyle = faded ? 'rgba(120,120,120,0.2)' : genderColor;
    ctx.globalAlpha = faded ? 0.2 : 0.9;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    // Symbol
    ctx.globalAlpha = alpha;
    ctx.fillStyle = faded ? '#555' : genderColor;
    ctx.font = 'bold 42px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = faded ? 'transparent' : genderColor;
    ctx.shadowBlur = 12;
    ctx.fillText(symbol, 40, 42);
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(8, 8, 1);
    return sprite;
  }, []);

  // 3D node objects: patient = diamond + gender icon, others = label sprite only
  const nodeThreeObject = useCallback((node: any) => {
    const isFaded = !!(activeNode && node.id !== activeNode.id && !isNeighbor(node.id, activeNode.id));
    const color = isFaded ? 'rgba(100,100,100,0.3)' : (node.color ?? '#ffffff');

    if (node.type === 'patient') {
      const subtitle: string = node.details?.subtitle ?? '';
      const isFemale = subtitle.toLowerCase().includes('female');
      const group = new THREE.Group();

      // ── Octahedron body (diamond shape) ──
      const radius = Math.cbrt(node.val ?? 5) * 5.0;
      const geo = new THREE.OctahedronGeometry(radius, 0);
      const matColor = isFaded ? '#1e2332' : node.color;
      const meshMat = new THREE.MeshLambertMaterial({
        color: matColor,
        emissive: isFaded ? '#000000' : node.color,
        emissiveIntensity: isFaded ? 0 : 0.35,
        transparent: true,
        opacity: isFaded ? 0.15 : 0.92,
        wireframe: false,
      });
      const mesh = new THREE.Mesh(geo, meshMat);
      // Tilt slightly so the diamond stands upright
      mesh.rotation.y = Math.PI / 4;
      group.add(mesh);

      // ── Wireframe outline ──
      if (!isFaded) {
        const wireMat = new THREE.MeshBasicMaterial({
          color: node.color,
          wireframe: true,
          transparent: true,
          opacity: 0.25,
        });
        group.add(new THREE.Mesh(geo, wireMat));
      }

      // ── Gender icon sprite above the shape ──
      const genderSprite = makeGenderSprite(isFemale, isFaded);
      genderSprite.position.set(0, radius + 5, 0);
      group.add(genderSprite);

      // ── Label sprite (if labels on) ──
      if (showLabels) {
        const label = makeLabelSprite(node, color);
        label.position.set(0, radius + 12, 0);
        group.add(label);
      }

      return group;
    }

    // Non-patient: just label sprite
    if (!showLabels) return null;
    const label = makeLabelSprite(node, color);
    label.position.y = (node.val ?? 4) + 7;
    return label;
  }, [showLabels, activeNode, isNeighbor, makeLabelSprite, makeGenderSprite]);

  // HTML tooltip
  const nodeLabel = useCallback((node: any) => `
    <div style="background:rgba(2,4,9,0.92);border:1px solid ${node.color ?? 'rgba(0,240,255,0.3)'};border-radius:6px;padding:8px 12px;font-family:monospace;max-width:230px;pointer-events:none">
      <div style="color:${node.color ?? '#00f0ff'};font-weight:bold;font-size:13px;margin-bottom:3px">${node.label}</div>
      <div style="color:#aaa;font-size:11px">${node.details?.subtitle ?? ''}</div>
      <div style="color:#555;font-size:10px;margin-top:4px;line-height:1.4">${node.details?.description ?? ''}</div>
    </div>
  `, []);

  return (
    <div ref={containerRef} className="graph-container" style={{ position: 'relative' }}>
      {/* Renderer HUD */}
      <div style={{
        position: 'absolute', top: 12, left: 12, zIndex: 10,
        fontFamily: 'monospace', fontSize: 8, color: 'rgba(0,240,255,0.35)',
        pointerEvents: 'none', textTransform: 'uppercase', lineHeight: 1.7,
        letterSpacing: '0.05em',
      }}>
        RENDERER: WEBGL 3D // ENGINE: THREE.JS<br />
        PHYSICS FORCE: EULER D3-3D<br />
        STATUS: ACTIVE
      </div>

      {/* Controls hint */}
      <div style={{
        position: 'absolute', bottom: 12, right: 12, zIndex: 10,
        fontFamily: 'monospace', fontSize: 8.5,
        background: 'rgba(2,4,9,0.8)',
        border: '1px solid rgba(0,240,255,0.12)',
        padding: '5px 10px', borderRadius: 4, color: '#9ca3af',
        pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff66', display: 'inline-block', boxShadow: '0 0 6px #00ff66' }} />
          Active Evidence Flow
        </div>
        <div style={{ fontSize: 7.5, color: '#6b7280' }}>
          Left-click + Drag to rotate&nbsp;•&nbsp;Right-click to pan&nbsp;•&nbsp;Scroll to zoom
        </div>
      </div>

      {/* ── Layout Organizer Button ─────────────────────────────────────── */}
      <div style={{ position: 'absolute', bottom: 44, left: 12, zIndex: 20 }}>
        {/* Popup panel */}
        {layoutOpen && (
          <div style={{
            position: 'absolute', bottom: '100%', left: 0, marginBottom: 8,
            background: 'rgba(2,6,14,0.96)',
            border: '1px solid rgba(0,240,255,0.25)',
            borderRadius: 10,
            boxShadow: '0 0 24px rgba(0,240,255,0.10), 0 8px 32px rgba(0,0,0,0.8)',
            padding: '8px',
            width: 210,
            fontFamily: 'monospace',
          }}>
            {/* Title row */}
            <div style={{ fontSize: 9, color: 'rgba(0,240,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 6px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 6 }}>
              Organize Layout
            </div>

            {([
              { id: 'force',        label: 'Free Force',    desc: 'Physics-driven',       icon: Zap },
              { id: 'radial',       label: 'Radial',        desc: 'Rings by type',        icon: Circle },
              { id: 'clustered',    label: 'Clustered',     desc: 'Groups by category',   icon: LayoutGrid },
              { id: 'hierarchical', label: 'Hierarchical',  desc: 'Layer by depth',       icon: GitBranch },
            ] as const).map(({ id, label, desc, icon: Icon }) => {
              const active = layoutMode === id;
              return (
                <button
                  key={id}
                  onClick={() => handleOrganize(id as LayoutMode)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', textAlign: 'left',
                    background: active ? 'rgba(0,240,255,0.08)' : 'transparent',
                    border: active ? '1px solid rgba(0,240,255,0.30)' : '1px solid transparent',
                    borderRadius: 7, padding: '7px 9px', cursor: 'pointer',
                    marginBottom: 3, transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <Icon size={14} style={{ color: active ? '#00f0ff' : 'rgba(255,255,255,0.35)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: active ? '#00f0ff' : 'rgba(255,255,255,0.8)', lineHeight: 1.2 }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>
                      {desc}
                    </div>
                  </div>
                  {active && (
                    <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#00f0ff', boxShadow: '0 0 6px #00f0ff' }} />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Trigger button */}
        <button
          onClick={() => setLayoutOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: layoutOpen ? 'rgba(0,240,255,0.12)' : 'rgba(2,6,14,0.88)',
            border: `1px solid ${layoutOpen ? 'rgba(0,240,255,0.5)' : 'rgba(0,240,255,0.22)'}`,
            borderRadius: 8,
            padding: '6px 12px',
            color: layoutOpen ? '#00f0ff' : 'rgba(0,240,255,0.75)',
            fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: layoutOpen
              ? '0 0 16px rgba(0,240,255,0.18)'
              : '0 0 8px rgba(0,240,255,0.06)',
            transition: 'all 0.2s',
          }}
        >
          <AlignVerticalDistributeCenter
            size={13}
            style={{
              animation: isOrganizing ? 'spin 0.8s linear infinite' : 'none',
              color: 'inherit',
            }}
          />
          Organize Layout
          {layoutMode !== 'force' && (
            <span style={{
              fontSize: 8, padding: '1px 5px', borderRadius: 4,
              background: 'rgba(0,240,255,0.15)', color: '#00f0ff',
              border: '1px solid rgba(0,240,255,0.3)', marginLeft: 2,
            }}>
              {layoutMode === 'radial' ? 'RADIAL' : layoutMode === 'clustered' ? 'CLUSTER' : 'HIER'}
            </span>
          )}
        </button>
      </div>

      <ForceGraph3DLib
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#020409"
        showNavInfo={false}
        graphData={data}
        nodeId="id"
        nodeVal="val"
        nodeLabel={nodeLabel}
        nodeColor={nodeColor}
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={(node: any) => node.type !== 'patient'}
        linkColor={linkColor}
        linkWidth={linkWidth}
        linkDirectionalParticles={linkParticles}
        linkDirectionalParticleWidth={1.8}
        linkDirectionalParticleSpeed={0.005}
        linkDirectionalParticleColor={(link: any) => link.color ?? '#ffffff'}
        onNodeHover={(node: any) => setHoverNode(node ?? null)}
        onNodeClick={(node: any) => onSelectNode(node as OncologyNode)}
        onBackgroundClick={() => onSelectNode(null)}
        controlType="orbit"
        warmupTicks={50}
        cooldownTime={8000}
      />
    </div>
  );
};
