import { ClusterContext } from "../src/types";

export const CLUSTER_RECORDS: ClusterContext[] = [
  {
    id: "CX-0912",
    name: "Lazarus Nexus",
    riskLevel: "CRITICAL",
    assets: ["ETH", "USDT", "BTC"],
    lastActive: "2 minutes ago",
    connections: 1240
  },
  {
    id: "CX-8821",
    name: "Yield Farming Whale",
    riskLevel: "LOW",
    assets: ["ETH", "USDC"],
    lastActive: "1 hour ago",
    connections: 45
  },
  {
    id: "CX-4402",
    name: "Obscure Mixer Proxy",
    riskLevel: "HIGH",
    assets: ["XMR", "ETH"],
    lastActive: "12 seconds ago",
    connections: 890
  }
];

export function getClusterContext(id: string) {
  return CLUSTER_RECORDS.find(c => c.id === id) || CLUSTER_RECORDS[0];
}
