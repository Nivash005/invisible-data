export type NodeStatus = 'ONLINE' | 'DEGRADED' | 'OFFLINE';

export type PacketType = 'HTTPS' | 'TCP SYN' | 'DNS QUERY' | 'TLS HANDSHAKE' | 'HTTP/3 UDP' | 'ACK';

export type PacketStatus = 'IN_TRANSIT' | 'DELIVERED' | 'DROPPED' | 'REROUTING';

export interface NetworkNode {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  status: NodeStatus;
  load: number; // 0 - 100 percentage
  avgLatency: number; // ms
  packetsProcessed: number;
  description: string;
  type: 'ORIGIN' | 'RELAY' | 'EXCHANGE' | 'DESTINATION';
  color?: string;
}

export interface Packet {
  id: string;
  number: number;
  source: string;
  destination: string;
  currentRoute: string[];
  currentNodeIndex: number;
  progress: number; // 0 to 1 between current node and next node
  type: PacketType;
  size: number; // in KB
  latency: number; // ms
  status: PacketStatus;
  timestamp: number;
  payloadPreview: string;
  headerData: {
    srcIp: string;
    dstIp: string;
    protocol: string;
    ttl: number;
    seqNumber: number;
    flags: string;
  };
  checksum: string;
  isRetransmission?: boolean;
}

export interface NetworkRoute {
  id: string;
  domain: string;
  ip: string;
  nodes: NetworkNode[];
  totalDistanceKm: number;
  estimatedLatencyMs: number;
  alternativeRoute?: NetworkNode[];
}

export interface NetworkStats {
  latency: number; // ms
  speed: number; // Mbps
  packetsSent: number;
  packetsDelivered: number;
  packetsDropped: number;
  distanceKm: number;
  nodesCount: number;
  activePacketsCount: number;
  packetLossRate: number; // percentage
  trafficLevel: 'LOW' | 'OPTIMAL' | 'HIGH' | 'EXTREME' | 'NORMAL';
}

export interface SimulationControlState {
  latencyMultiplier: number; // 0 to 500ms added
  packetLossPercent: number; // 0 to 30%
  trafficVolume: 'LOW' | 'NORMAL' | 'HIGH' | 'EXTREME';
  failedNodeIds: string[];
  isPaused: boolean;
  selectedPacket: Packet | null;
  selectedNode: NetworkNode | null;
  activeDomain: string;
  isSimulating: boolean;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'nexus' | 'system';
  text: string;
  timestamp: number;
  highlightedNodeId?: string;
  highlightedRoute?: string[];
  suggestedActions?: string[];
}

export interface RoutingGameOption {
  id: string;
  name: string;
  nodes: string[];
  pathDescription: string;
  cableType: string;
  baseLatency: number;
  congestionPenalty: number;
  distanceKm: number;
  pros: string;
  cons: string;
}
