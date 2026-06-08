export type ReportType = 'narrative' | 'risk' | 'investigation' | 'project' | 'brief';

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
}

export interface Message {
  role: "user" | "model";
  text: string;
}

export interface ChatHistoryItem {
  role: "user" | "model";
  parts: [{ text: string }];
}
