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
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import { AnalystReport, ReportType, ClusterContext } from "./types";
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

export default function App() {
  const [selectedCluster, setSelectedCluster] = useState<ClusterContext>(CLUSTERS[0]);
  const [report, setReport] = useState<AnalystReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reportType, setReportType] = useState<ReportType>("narrative");

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
    } catch (err) {
      console.error("Report generation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-400 font-mono selection:bg-indigo-500/30 selection:text-white">
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

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-neutral-800/50 rounded-full border border-neutral-700/50">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Node Live: 127.0.0.1:3000</span>
          </div>
          <button className="p-2 hover:bg-neutral-800 rounded transition-colors text-neutral-500 hover:text-white">
            <RefreshCcw size={18} />
          </button>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-64px)] overflow-hidden">
        
        {/* Left Column: Explorer */}
        <aside className="lg:col-span-3 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
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
              <div>
                <p className="text-[9px] text-neutral-600 uppercase font-bold">Graph Vertices</p>
                <p className="text-xs text-neutral-300 font-bold mt-1">{selectedCluster.connections.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Middle Column: Analyst Agent */}
        <main className="lg:col-span-6 flex flex-col h-full bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl relative">
          {/* Dashboard Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/20 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Terminal className="text-orange-500" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight leading-none italic">Intelligence Terminal</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase">Ready for cluster</span>
                  <span className="text-[10px] text-indigo-400 font-bold px-1.5 py-0.5 bg-indigo-500/10 rounded">{selectedCluster.id}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => generateReport("brief")}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg border border-neutral-700 transition-all group"
              >
                <Zap size={16} className="text-yellow-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-wider">Brief</span>
              </button>
            </div>
          </div>

          {/* Report Area */}
          <div className="flex-1 overflow-y-auto p-8 relative custom-scrollbar">
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
        <aside className="lg:col-span-3 space-y-6">
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
