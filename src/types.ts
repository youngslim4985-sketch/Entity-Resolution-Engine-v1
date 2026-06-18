import { StabilityState, IntelligenceCertificate } from "../server/stability/types";

export type ReportType = 'narrative' | 'risk' | 'investigation' | 'project' | 'brief';

export interface AuditEvent {
  event_id: string;
  timestamp: string;
  actor_id: string;
  action_type: string;
  target: string;
  status: string;
  confidence_threshold: string;
  lyapunov_energy_v: string;
  details?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  group: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: string;
  weight: number;
}

export interface GraphVisualResponse {
  entity_id: string;
  resolution_status: string;
  confidence_score: number;
  g_metrics: {
    nodes_count: number;
    edges_count: number;
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  };
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ClusterContext {
  id: string;
  name: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assets: string[];
  lastActive: string;
  connections: number;
}

export interface AnalystReport {
  id: string;
  type: ReportType;
  timestamp: string;
  summary: string;
  content: string;
  riskScore: number;
  tags: string[];
  metrics?: {
    volume24h: string;
    flowDirection: string;
    anomalyScore: number;
  };
  stability?: StabilityState;
  certificate?: IntelligenceCertificate;
}

export interface Message {
  role: "user" | "model";
  text: string;
}

export interface ChatHistoryItem {
  role: "user" | "model";
  parts: [{ text: string }];
}
