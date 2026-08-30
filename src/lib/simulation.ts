import { Packet, PacketType, PacketStatus } from '../types/network';
import { GLOBAL_NODES } from './networkData';

const PACKET_TYPES: PacketType[] = ['HTTPS', 'TCP SYN', 'DNS QUERY', 'TLS HANDSHAKE', 'HTTP/3 UDP', 'ACK'];

let globalPacketCounter = 1;

export function generateSinglePacket(
  route: string[],
  domain: string,
  targetIp: string
): Packet {
  const number = globalPacketCounter++;
  const id = `PKT-${String(number).padStart(4, '0')}`;
  const type = PACKET_TYPES[Math.floor(Math.random() * PACKET_TYPES.length)];
  const size = +(Math.random() * 2.4 + 0.4).toFixed(2);
  const startNode = GLOBAL_NODES[route[0]] || GLOBAL_NODES['chennai'];
  const endNode = GLOBAL_NODES[route[route.length - 1]] || GLOBAL_NODES['sanfrancisco'];

  const hexHash = Math.random().toString(16).substring(2, 10).toUpperCase();
  const checksum = `0x${hexHash}`;

  const payloadSnippets: Record<PacketType, string> = {
    'HTTPS': `GET / HTTP/2\r\nHost: ${domain}\r\nUser-Agent: NexusBrowser/4.0\r\nAccept: text/html,application/xhtml+xml\r\nSec-Fetch-Mode: navigate`,
    'TCP SYN': `[SYN] Seq=0 Win=65535 Len=0 MSS=1460 WS=256 SACK_PERM=1`,
    'DNS QUERY': `Standard query 0x${hexHash.slice(0, 4)} A ${domain} OPT ` + `{"edns0": "client-subnet", "udp": 1232}`,
    'TLS HANDSHAKE': `Client Hello (SNI: ${domain}, Cipher: TLS_AES_256_GCM_SHA384, ALPN: h2,http/1.1)`,
    'HTTP/3 UDP': `QUIC Initial Packet (DCID: ${hexHash}, SCID: 0x889F, Token: NONE, Cryto Frame: ClientHello)`,
    'ACK': `[ACK] Seq=1 Ack=1 Win=131072 Len=0 TSval=1982348 TSecr=981247`
  };

  return {
    id,
    number,
    source: `${startNode.city}, ${startNode.country}`,
    destination: `${endNode.city}, ${endNode.country} (${domain})`,
    currentRoute: [...route],
    currentNodeIndex: 0,
    progress: 0,
    type,
    size,
    latency: Math.round(startNode.avgLatency + Math.random() * 10),
    status: 'IN_TRANSIT',
    timestamp: Date.now(),
    payloadPreview: payloadSnippets[type],
    headerData: {
      srcIp: '192.168.1.104',
      dstIp: targetIp,
      protocol: type.includes('UDP') || type.includes('HTTP/3') ? 'UDP (17)' : 'TCP (6)',
      ttl: 64,
      seqNumber: Math.floor(Math.random() * 900000000) + 100000000,
      flags: type.includes('SYN') ? '0x002 (SYN)' : type.includes('ACK') ? '0x010 (ACK)' : '0x018 (PSH, ACK)'
    },
    checksum
  };
}

export function advancePackets(
  packets: Packet[],
  speedMultiplier: number,
  packetLossPercent: number,
  failedNodeIds: string[]
): {
  updatedPackets: Packet[];
  deliveredCount: number;
  droppedCount: number;
} {
  let deliveredCount = 0;
  let droppedCount = 0;
  const failedSet = new Set(failedNodeIds);

  const updatedPackets = packets.map((p) => {
    if (p.status === 'DELIVERED' || p.status === 'DROPPED') {
      return p;
    }

    const nextHopId = p.currentRoute[p.currentNodeIndex + 1];

    if (nextHopId && failedSet.has(nextHopId)) {
      return {
        ...p,
        status: 'DROPPED' as PacketStatus
      };
    }

    if (p.progress > 0.4 && p.progress < 0.6 && !p.isRetransmission && Math.random() * 100 < packetLossPercent) {
      droppedCount++;
      return {
        ...p,
        status: 'DROPPED' as PacketStatus
      };
    }

    const delta = (0.025 / Math.max(1, speedMultiplier * 0.5));
    const newProgress = p.progress + delta;

    if (newProgress >= 1) {
      const nextIndex = p.currentNodeIndex + 1;
      if (nextIndex >= p.currentRoute.length - 1) {
        deliveredCount++;
        return {
          ...p,
          currentNodeIndex: nextIndex,
          progress: 1,
          status: 'DELIVERED' as PacketStatus
        };
      } else {
        return {
          ...p,
          currentNodeIndex: nextIndex,
          progress: 0,
          latency: p.latency + Math.round(15 + Math.random() * 12)
        };
      }
    }

    return {
      ...p,
      progress: newProgress
    };
  });

  const activeAndRecent = updatedPackets.filter(
    (p) => p.status === 'IN_TRANSIT' || Date.now() - p.timestamp < 3500
  );

  return {
    updatedPackets: activeAndRecent,
    deliveredCount,
    droppedCount
  };
}
