import { useState, useEffect } from "react";
import { 
  Shield, 
  Terminal, 
  Activity, 
  FileText, 
  Search, 
  RefreshCcw, 
  AlertTriangle, 
  Zap,
  ChevronRight,
  Database,
  Award,
  Globe,
  Network,
  Clock,
  Plus,
  Check,
  Server
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import { AnalystReport, ReportType, ClusterContext, AuditEvent, GraphVisualResponse } from "./types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CLUSTERS: ClusterContext[] = [
  { id: "CX-0912", name: "Lazarus Nexus", riskLevel: "CRITICAL", assets: ["ETH", "USDT"], lastActive: "2m ago", connections: 1240 },
  { id: "CX-8821", name: "High Yield Whale", riskLevel: "LOW", assets: ["ETH", "USDC"], lastActive: "1h ago", connections: 45 },
  { id: "CX-4402", name: "Mixer Proxy", riskLevel: "HIGH", assets: ["XMR", "ETH"], lastActive: "12s ago", connections: 890 }
];

const StabilityVisualizer = ({ energy = 0.5 }: { energy?: number }) => (
  <div className="relative w-full h-32 bg-neutral-900/50 rounded-lg overflow-hidden border border-neutral-800">
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          rotate: energy * 360
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="w-24 h-24 border border-indigo-500/30 rounded-full"
      />
      <motion.div
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute w-16 h-16 border border-indigo-400/20 rounded-full"
      />
    </div>
    <div className="absolute bottom-2 left-3 flex items-center gap-2">
      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
      <span className="text-[8px] font-black uppercase text-neutral-500 tracking-[0.2em]">Lyapunov Phase Space</span>
    </div>
    <div className="absolute top-2 right-3">
      <span className="text-[10px] font-black text-white italic">E: {(energy * 100).toFixed(2)}</span>
    </div>
  </div>
);

export default function App() {
  const [selectedCluster, setSelectedCluster] = useState<ClusterContext>(CLUSTERS[0]);
  const [report, setReport] = useState<AnalystReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reportType, setReportType] = useState<ReportType>("narrative");

  // Extended Demo States for Investor Pitch
  const [leftTab, setLeftTab] = useState<'clusters' | 'audit'>('clusters');
  const [centerPanel, setCenterPanel] = useState<'report' | 'topology'>('report');
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [graphVisual, setGraphVisual] = useState<GraphVisualResponse | null>(null);
  const [isLoadingGraph, setIsLoadingGraph] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [notification, setNotification] = useState<{ message: string; sub: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, sub: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, sub, type });
    setTimeout(() => {
      setNotification(null);
    }, 6000);
  };

  const fetchAuditEvents = async () => {
    try {
      const response = await fetch("/api/audit/events");
      const data = await response.json();
      setAuditEvents(data);
    } catch (err) {
      console.error("Failed to load audit history");
    }
  };

  const fetchGraphVisual = async (entityId: string) => {
    setIsLoadingGraph(true);
    try {
      // Look up with fallback if not matching
      const response = await fetch(`/api/entities/${entityId}/graph-visual`);
      const data = await response.json();
      setGraphVisual(data);
    } catch (err) {
      console.error("Failed to fetch graph visual");
    } finally {
      setIsLoadingGraph(false);
    }
  };

  const triggerSeedLedger = async () => {
    setIsSeeding(true);
    try {
      const response = await fetch("/api/demo/seed-ledger", { method: "POST" });
      const data = await response.json();
      showToast(
        "DEMO LEDGER SEEDED ONLINE",
        `Created 18 high-resolution tracking block nodes. Trace ID: ${data.audit_trace_id}`,
        "success"
      );
      fetchAuditEvents();
      fetchGraphVisual(selectedCluster.id);
    } catch (err) {
      console.error("Ledger seeding transaction failed");
      showToast("Ledger Seeding Failed", "Please check container runtime logs", "error");
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    fetchAuditEvents();
  }, []);

  useEffect(() => {
    fetchGraphVisual(selectedCluster.id);
    // Also reset center panel to report view when changing cluster
    setCenterPanel("report");
  }, [selectedCluster]);

  const generateReport = async (type: ReportType = reportType) => {
    setIsLoading(true);
    setReportType(type);
    try {
      const response = await fetch("/api/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clusterId: selectedCluster.id, type }),
      });
      const data = await response.json();
      setReport(data);
      // Bring up report panel
      setCenterPanel("report");
      // Fetch latest audit events
      fetchAuditEvents();
    } catch (err) {
      console.error("Report generation failed");
      showToast("Report Generation Error", "AI Studio build encountered a network retry", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-400 font-mono selection:bg-indigo-500/30 selection:text-white">
      {/* Toast Notification Container */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 border border-indigo-500/50 p-4 rounded-xl shadow-[0_4px_24px_rgba(79,70,229,0.3)] flex items-start gap-3 w-full max-w-sm"
          >
            <div className="bg-indigo-500/20 p-2 rounded text-indigo-400 flex-shrink-0 animate-pulse">
              <Zap size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-white uppercase tracking-wider">{notification.message}</p>
              <p className="text-[10px] text-neutral-400 font-mono mt-1 leading-snug">{notification.sub}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-neutral-600 hover:text-white text-xs select-none"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Sidebar / Nav */}
      <nav className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600/10 p-2 rounded border border-indigo-500/20">
            <Shield className="text-indigo-500" size={20} />
          </div>
          <div>
            <h1 className="text-white font-bold tracking-tighter text-lg leading-none">ALPHA TERMINAL</h1>
            <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-[0.2em]">Layer 8 Analyst Agent</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Seed Ledger Trigger Button */}
          <button 
            onClick={triggerSeedLedger}
            disabled={isSeeding}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all tracking-wider border",
              isSeeding 
                ? "bg-neutral-800 border-neutral-700 text-neutral-500 cursor-not-allowed"
                : "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30 text-indigo-400 hover:border-indigo-500/50"
            )}
          >
            <Server size={12} className={isSeeding ? "animate-spin text-indigo-400" : "text-indigo-400"} />
            {isSeeding ? "Seeding Network Ledger..." : "Seed Ledger"}
          </button>

          <div className="flex items-center gap-2 px-3 py-1 bg-neutral-800/50 rounded-lg border border-neutral-700/50">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Node Live: 127.0.0.1:3000</span>
          </div>
          
          <button 
            onClick={() => {
              fetchAuditEvents();
              fetchGraphVisual(selectedCluster.id);
              showToast("System Re-synchronizing", "Refreshing audit streams and Lyapunov metrics");
            }}
            className="p-2 hover:bg-neutral-800 rounded transition-colors text-neutral-500 hover:text-white"
            title="Force synchronization check"
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Left Column: Explorer */}
        <aside className="lg:col-span-3 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          {/* Left Column Tabs */}
          <div className="flex border border-neutral-800 p-1 rounded-xl bg-neutral-900/60 text-[10px] font-black uppercase tracking-wider">
            <button
              onClick={() => setLeftTab('clusters')}
              className={cn(
                "flex-1 py-2 rounded-lg text-center transition-all",
                leftTab === 'clusters' 
                  ? "bg-neutral-800 text-white font-black shadow-sm" 
                  : "text-neutral-500 hover:text-neutral-300"
              )}
            >
              Group Clusters
            </button>
            <button
              onClick={() => setLeftTab('audit')}
              className={cn(
                "flex-1 py-2 rounded-lg text-center transition-all",
                leftTab === 'audit' 
                  ? "bg-neutral-800 text-white font-black shadow-sm" 
                  : "text-neutral-500 hover:text-neutral-300"
              )}
            >
              Auditors Trail ({auditEvents.length})
            </button>
          </div>

          {leftTab === 'clusters' ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest px-2">Entity Clusters</label>
                <div className="space-y-1">
                  {CLUSTERS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCluster(c)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left",
                        selectedCluster.id === c.id 
                          ? "bg-indigo-500/10 border-indigo-500/50 text-white" 
                          : "bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 text-neutral-400"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          c.riskLevel === 'CRITICAL' ? "bg-red-500" : c.riskLevel === 'HIGH' ? "bg-orange-500" : "bg-emerald-500"
                        )} />
                        <div>
                          <p className="text-xs font-bold leading-none mb-1">{c.name}</p>
                          <p className="text-[10px] text-neutral-500 uppercase">{c.id} • {c.lastActive}</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className={cn(selectedCluster.id === c.id ? "text-indigo-500" : "text-neutral-700")} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-4 space-y-4">
                <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                  <Database size={12} /> Cluster Context
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] text-neutral-600 uppercase font-bold">Assets</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedCluster.assets.map(a => (
                        <span key={a} className="bg-neutral-800 text-neutral-300 text-[9px] px-1.5 py-0.5 rounded border border-neutral-700">{a}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] text-neutral-600 uppercase font-bold">Risk Level</p>
                    <p className={cn(
                      "text-xs font-black mt-1",
                      selectedCluster.riskLevel === 'CRITICAL' ? "text-red-500" : selectedCluster.riskLevel === 'HIGH' ? "text-orange-500" : "text-emerald-500"
                    )}>{selectedCluster.riskLevel}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[9px] text-neutral-600 uppercase font-bold">Graph Vertices</p>
                    <p className="text-xs text-neutral-300 font-bold mt-1">{selectedCluster.connections.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1 flex items-center gap-2">
                <Clock size={12} className="text-indigo-500" /> Layer 8 Audit Trail
              </label>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
                {auditEvents.map((evt) => (
                  <div 
                    key={evt.event_id} 
                    className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-xl space-y-2 hover:border-indigo-500/30 transition-colors"
                  >
                    <div className="flex justify-between items-center text-[8px] uppercase tracking-wider font-black">
                      <span className="text-indigo-400">{evt.event_id}</span>
                      <span className="text-neutral-600">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-[11px] text-white font-black uppercase tracking-tight leading-none">
                      {evt.action_type.replace(/_/g, ' ')}
                    </div>
                    <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">
                      {evt.details}
                    </p>
                    <div className="flex justify-between items-center pt-2 border-t border-neutral-900 text-[8px] font-mono text-neutral-500">
                      <span>Threshold: {evt.confidence_threshold}</span>
                      <span className="text-emerald-500 font-bold">V(x): {evt.lyapunov_energy_v}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Middle Column: Analyst Agent */}
        <main className="lg:col-span-6 flex flex-col h-full bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl relative">
          {/* Dashboard Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/30 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Terminal className="text-indigo-400 animate-pulse" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight leading-none italic flex items-center gap-1">
                  Agent Terminal
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase">Ready for cluster</span>
                  <span className="text-[10px] text-indigo-400 font-black px-1.5 py-0.5 bg-indigo-500/10 rounded">{selectedCluster.id}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {/* Topology / Narative Switcher Trigger */}
              <button 
                onClick={() => {
                  const target = centerPanel === 'report' ? 'topology' : 'report';
                  setCenterPanel(target);
                  showToast(
                    `Switching View Mode`,
                    `Now displaying ${target === 'topology' ? 'interactive graph topology schema' : 'narrative intelligence briefing'}`
                  );
                }}
                className="flex items-center gap-2 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-indigo-500/30 text-[10px] font-black text-neutral-300 transition-all uppercase"
                title="Toggle Graph Topology Visualizer"
              >
                <Network size={12} className={centerPanel === 'topology' ? "text-indigo-400" : "text-neutral-500"} />
                {centerPanel === 'report' ? "Topology View" : "Narrative View"}
              </button>

              <button 
                onClick={() => generateReport("brief")}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg border border-neutral-700 transition-all group"
              >
                <Zap size={15} className="text-yellow-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-wider">Brief</span>
              </button>
            </div>
          </div>

          {/* Render Main Analyst Pane or the Topology Map */}
          <div className="flex-1 overflow-y-auto p-8 relative custom-scrollbar">
            {centerPanel === 'topology' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {isLoadingGraph ? (
                  <div className="h-64 flex flex-col items-center justify-center space-y-4">
                    <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-black">Refining cluster geometry...</p>
                  </div>
                ) : graphVisual ? (
                  <div className="space-y-6">
                    {/* Topology Summary Header */}
                    <div className="p-4 bg-neutral-900/40 border border-neutral-800 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[8px] uppercase tracking-wider text-neutral-500 font-black">Entity Unification Network</span>
                        <h4 className="text-xs font-black text-white italic mt-0.5">{graphVisual.entity_id}</h4>
                      </div>
                      <div className="flex gap-4 text-right">
                        <div>
                          <p className="text-[8px] uppercase tracking-wider text-neutral-600 font-black">Confidence</p>
                          <p className="text-xs text-indigo-400 font-bold">{(graphVisual.confidence_score * 100).toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase tracking-wider text-neutral-600 font-black">Risk Score</p>
                          <p className={cn(
                            "text-xs font-bold leading-none mt-0.5 uppercase",
                            graphVisual.g_metrics.risk_level === 'CRITICAL' ? "text-red-500 animate-pulse" : graphVisual.g_metrics.risk_level === 'HIGH' ? "text-orange-500" : "text-emerald-500"
                          )}>
                            {graphVisual.g_metrics.risk_level}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CUSTOM ANIMATED INTERACTIVE GRAPH DIAGRAM */}
                    <div className="relative w-full h-[280px] bg-neutral-950/80 rounded-xl border border-neutral-800 overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:16px_16px]" />
                      
                      {/* Interactive SVG Connector Rays */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {graphVisual.nodes.map((node, i) => {
                          if (i === 0) return null;
                          const angle = ((i - 1) / (graphVisual.nodes.length - 1)) * Math.PI - (Math.PI / 2);
                          const xOffset = Math.cos(angle) * 110;
                          const yOffset = Math.sin(angle) * 80;
                          
                          // Convert relative calculations into coordinates based on container center
                          const centerX = 260; // Approximations for dynamic responsive mapping
                          const centerY = 140;
                          const xTarget = centerX + xOffset;
                          const yTarget = centerY + yOffset;
                          
                          return (
                            <g key={`rays-${node.id}`}>
                              {/* Connector Beam */}
                              <line 
                                x1={centerX} 
                                y1={centerY} 
                                x2={xTarget} 
                                y2={yTarget} 
                                className="stroke-indigo-500/30 stroke-[1.5]"
                              />
                              {/* Pulsing Money Flow Particle Tracer */}
                              <circle r="3" fill="#818cf8" className="animate-pulse">
                                <animateMotion 
                                  path={`M ${centerX} ${centerY} L ${xTarget} ${yTarget}`} 
                                  dur="3s" 
                                  repeatCount="indefinite" 
                                />
                              </circle>
                            </g>
                          );
                        })}
                      </svg>

                      {/* Prime Resolution Center Nucleus */}
                      <div className="absolute z-10 w-24 h-24 rounded-full bg-indigo-950/80 border border-indigo-500/60 flex flex-col items-center justify-center p-2 text-center shadow-[0_0_24px_rgba(99,102,241,0.2)]">
                        <Network className="text-indigo-400 mb-1" size={18} />
                        <span className="text-[7px] font-black tracking-widest text-indigo-300 uppercase leading-none">RESOLVER CORE</span>
                        <span className="text-[8px] text-white font-mono mt-1 font-bold italic truncate w-full">{graphVisual.entity_id}</span>
                      </div>

                      {/* Computed Neighbor Vertices */}
                      {graphVisual.nodes.map((node, i) => {
                        if (i === 0) return null;
                        const angle = ((i - 1) / (graphVisual.nodes.length - 1)) * Math.PI - (Math.PI / 2);
                        const xOffset = Math.cos(angle) * 110;
                        const yOffset = Math.sin(angle) * 80;
                        
                        return (
                          <div 
                            key={node.id}
                            style={{ transform: `translate(${xOffset}px, ${yOffset}px)` }}
                            className="absolute p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-center shadow-lg hover:border-indigo-500/40 hover:bg-neutral-950 transition-all z-20 group min-w-[90px] max-w-[125px]"
                          >
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mx-auto mb-1 group-hover:scale-125 transition-transform" />
                            <p className="text-[7px] font-black text-indigo-400 uppercase tracking-widest truncate mb-0.5">{node.label.replace(/_/g, ' ')}</p>
                            <p className="text-[8px] text-white font-mono font-bold truncate leading-none">{node.id}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Edge Interconnections Table */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Active Resolved Matrix</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {graphVisual.edges.map((edge, i) => (
                          <div key={i} className="p-3 bg-neutral-900/60 border border-neutral-850 rounded-xl flex items-center justify-between">
                            <div className="max-w-[70%]">
                              <p className="text-[7px] text-indigo-400 font-bold uppercase tracking-wider">{edge.type.replace(/_/g, ' ')}</p>
                              <p className="text-[9px] text-neutral-300 mt-1 font-mono truncate">{edge.source} → {edge.target}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[8px] text-neutral-500 font-bold uppercase">Closer Match</p>
                              <p className="text-xs text-white font-black italic">{(edge.weight * 100).toFixed(0)}%</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-neutral-500">
                    No graph resolution available. Seeding network first is recommended.
                  </div>
                )}
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                {!report && !isLoading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-6"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />
                      <Activity className="text-neutral-800 relative z-10" size={80} strokeWidth={1} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-neutral-500 text-sm max-w-xs mx-auto">Select a report signature to begin autonomous graph analysis.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                      {(['narrative', 'risk', 'investigation', 'project'] as ReportType[]).map(type => (
                        <button
                          key={type}
                          onClick={() => generateReport(type)}
                          className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-indigo-500/50 hover:bg-neutral-800 transition-all text-left group"
                        >
                          <FileText size={18} className="text-neutral-600 group-hover:text-indigo-500 mb-2" />
                          <p className="text-xs font-bold text-neutral-400 capitalize">{type}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : isLoading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center space-y-4"
                  >
                    <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Processing Intelligence</span>
                      <span className="text-xs text-neutral-600 mt-1">Executing Gemini Analyst signature...</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* Report Meta */}
                    <div className="flex items-start justify-between border-b border-neutral-800 pb-8">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 bg-indigo-600 text-[10px] font-black uppercase text-white rounded">Report {report.id}</span>
                          <span className="text-xs font-bold text-neutral-500">{new Date(report.timestamp).toLocaleString()}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">{report.summary}</h2>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Risk Score</p>
                        <div className={cn(
                          "text-3xl font-black italic tabular-nums leading-none",
                          report.riskScore > 70 ? "text-red-500" : "text-emerald-500"
                        )}>
                          {report.riskScore}<span className="text-lg opacity-50">%</span>
                        </div>
                      </div>
                    </div>

                    {/* Real Content */}
                    <div className="prose prose-invert prose-p:text-neutral-400 prose-headings:text-white prose-headings:italic prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800 max-w-none">
                      <Markdown>{report.content}</Markdown>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Quick Actions Footer */}
          {report && (
            <div className="p-4 bg-neutral-900/50 border-t border-neutral-800 flex items-center justify-between">
              <div className="flex gap-2">
                <button 
                  onClick={() => generateReport(reportType)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 border border-neutral-700 transition-colors"
                >
                  <RefreshCcw size={14} /> Re-run Analysis
                </button>
              </div>
              <p className="text-[10px] text-neutral-600 font-medium italic">Confidential High-Integrity Asset</p>
            </div>
          )}
        </main>

        {/* Right Column: Evidence & Metrics */}
        <aside className="lg:col-span-3 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Stability Layer */}
          <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-5 space-y-4">
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
              <Zap size={12} className="text-indigo-500" /> Stability Monitor
            </h3>
            
            <StabilityVisualizer energy={report?.stability?.energy} />

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2 bg-neutral-950 rounded border border-neutral-800">
                <p className="text-[8px] text-neutral-600 uppercase font-black">Entropy</p>
                <p className="text-xs text-white font-bold">{(report?.stability?.entropy || 0).toFixed(3)}</p>
              </div>
              <div className="p-2 bg-neutral-950 rounded border border-neutral-800">
                <p className="text-[8px] text-neutral-600 uppercase font-black">Drift</p>
                <p className="text-xs text-white font-bold">{(report?.stability?.drift || 0).toFixed(3)}</p>
              </div>
            </div>
          </div>

          {/* Certificate */}
          {report?.certificate && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-indigo-600 p-5 rounded-xl border border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.2)] space-y-4 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 opacity-10">
                <Award size={100} />
              </div>
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-[9px] font-black text-indigo-200 uppercase tracking-widest">Intelligence Certificate</p>
                  <h4 className="text-white font-black italic text-xl">{report.certificate.complianceRating} GRADE</h4>
                </div>
                <Award className="text-white" size={24} />
              </div>
              <div className="pt-2 border-t border-indigo-400/30 relative z-10">
                <p className="text-[8px] text-indigo-100 uppercase font-bold mb-2">Audit Trace</p>
                <div className="space-y-1">
                  {report.certificate.signatures.map(sig => (
                    <p key={sig} className="text-[8px] font-mono text-indigo-200 truncate">{sig}</p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl p-5 space-y-6">
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
              <Activity size={12} className="text-indigo-500" /> Evidence Logs
            </h3>
            
            <div className="space-y-4">
              <div className="p-3 bg-neutral-950 border-l-2 border-orange-500 rounded-r-lg space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-neutral-600">
                  <span>Anomalous Flow</span>
                  <span>14:22:01</span>
                </div>
                <p className="text-xs text-neutral-300">$4.5M rapid transfer to OFAC sanctioned mixer.</p>
              </div>

              <div className="p-3 bg-neutral-950 border-l-2 border-red-500 rounded-r-lg space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-neutral-600">
                  <span>Attack Vector</span>
                  <span>02:11:15</span>
                </div>
                <p className="text-xs text-neutral-300">Exploit contract identified at 0x4a...92bc</p>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-neutral-500 font-bold uppercase">System Confidence</span>
                <span className="text-xs font-bold text-white">99.4%</span>
              </div>
              <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "99.4%" }}
                  className="h-full bg-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/20 to-transparent border border-indigo-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
             <div className="absolute -right-4 -top-4 text-indigo-500/10 group-hover:rotate-12 transition-transform">
               <AlertTriangle size={120} />
             </div>
             <p className="text-white font-bold italic mb-2 relative z-10 uppercase tracking-tight">Security Protocol alpha</p>
             <p className="text-xs text-neutral-400 relative z-10 leading-relaxed">System is running in Read-Write state. All generated signatures are stored in the terminal engine for audit review.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
