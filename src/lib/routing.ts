import { GLOBAL_NODES, DOMAIN_PRESETS, NETWORK_LINKS } from './networkData';

// Haversine formula to compute great-circle distance between coordinates in km
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Convert Lat/Lng to 3D Cartesian Vector on a Sphere of radius R
export function latLngToVector3(lat: number, lng: number, radius: number = 2): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

// Build adjacency graph from NETWORK_LINKS
export function buildNetworkGraph(failedNodeIds: string[] = []): Map<string, { target: string; weight: number }[]> {
  const graph = new Map<string, { target: string; weight: number }[]>();
  const failedSet = new Set(failedNodeIds);

  Object.keys(GLOBAL_NODES).forEach((nodeId) => {
    graph.set(nodeId, []);
  });

  NETWORK_LINKS.forEach(([u, v]) => {
    const uOffline = failedSet.has(u);
    const vOffline = failedSet.has(v);

    if (!uOffline && !vOffline) {
      const nodeU = GLOBAL_NODES[u];
      const nodeV = GLOBAL_NODES[v];
      const dist = calculateHaversineDistance(nodeU.lat, nodeU.lng, nodeV.lat, nodeV.lng);
      
      const weightU = dist + (nodeV.load * 15) + (nodeV.avgLatency * 10);
      const weightV = dist + (nodeU.load * 15) + (nodeU.avgLatency * 10);

      graph.get(u)?.push({ target: v, weight: weightU });
      graph.get(v)?.push({ target: u, weight: weightV });
    }
  });

  return graph;
}

// Dijkstra shortest path
export function findOptimalRoute(
  startId: string = 'chennai',
  destinationId: string = 'sanfrancisco',
  failedNodeIds: string[] = []
): string[] {
  if (failedNodeIds.includes(startId)) return [startId];
  if (failedNodeIds.includes(destinationId)) {
    const operationalNodes = Object.keys(GLOBAL_NODES).filter(n => !failedNodeIds.includes(n));
    if (operationalNodes.length > 0) {
      destinationId = operationalNodes[operationalNodes.length - 1];
    }
  }

  const graph = buildNetworkGraph(failedNodeIds);
  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const unvisited = new Set<string>();

  Object.keys(GLOBAL_NODES).forEach((nodeId) => {
    distances.set(nodeId, nodeId === startId ? 0 : Infinity);
    previous.set(nodeId, null);
    unvisited.add(nodeId);
  });

  while (unvisited.size > 0) {
    let closestNode: string | null = null;
    let minDistance = Infinity;

    unvisited.forEach((nodeId) => {
      const dist = distances.get(nodeId) ?? Infinity;
      if (dist < minDistance) {
        minDistance = dist;
        closestNode = nodeId;
      }
    });

    if (!closestNode || minDistance === Infinity) break;
    if (closestNode === destinationId) break;

    unvisited.delete(closestNode);

    const neighbors = graph.get(closestNode) || [];
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.target)) continue;

      const alt = (distances.get(closestNode) ?? Infinity) + neighbor.weight;
      if (alt < (distances.get(neighbor.target) ?? Infinity)) {
        distances.set(neighbor.target, alt);
        previous.set(neighbor.target, closestNode);
      }
    }
  }

  const path: string[] = [];
  let curr: string | null = destinationId;

  while (curr) {
    path.unshift(curr);
    curr = previous.get(curr) || null;
    if (curr === startId) {
      path.unshift(startId);
      break;
    }
  }

  if (path.length <= 1) {
    const allAvailable = Object.keys(GLOBAL_NODES).filter(n => !failedNodeIds.includes(n));
    return allAvailable.slice(0, 4);
  }

  return Array.from(new Set(path));
}

// Calculate total route distance and simulated base latency
export function getRouteMetrics(nodeIds: string[], latencyMultiplier: number = 0) {
  let totalDistanceKm = 0;
  let totalLatencyMs = 0;

  for (let i = 0; i < nodeIds.length - 1; i++) {
    const a = GLOBAL_NODES[nodeIds[i]];
    const b = GLOBAL_NODES[nodeIds[i + 1]];
    if (a && b) {
      const segDist = calculateHaversineDistance(a.lat, a.lng, b.lat, b.lng);
      totalDistanceKm += segDist;
      
      const opticalLatency = (segDist / 200) * 1.5;
      const switchHopDelay = b.avgLatency * 0.4;
      totalLatencyMs += opticalLatency + switchHopDelay;
    }
  }

  const finalLatency = Math.round(totalLatencyMs + latencyMultiplier);
  return {
    totalDistanceKm,
    estimatedLatencyMs: Math.max(12, finalLatency)
  };
}

export function matchDomainPreset(domainOrUrl: string) {
  const clean = domainOrUrl.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].trim();
  const match = DOMAIN_PRESETS.find(p => p.domain.toLowerCase().includes(clean) || clean.includes(p.domain.toLowerCase()));
  if (match) return match;

  const hash = clean.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const destKeys = ['sanfrancisco', 'newyork', 'london', 'tokyo', 'frankfurt'];
  const destId = destKeys[hash % destKeys.length];

  return {
    domain: clean || 'example.com',
    name: `${clean || 'Custom'} Edge Node`,
    ip: `198.51.${(hash % 200) + 10}.${(hash % 240) + 1}`,
    destinationNodeId: destId,
    primaryPath: ['chennai', 'mumbai', 'dubai', 'frankfurt', 'london', destId],
    failoverPath: ['chennai', 'singapore', 'tokyo', destId],
    description: `Dynamic simulated routing endpoint for ${clean || 'custom destination'}.`,
    category: 'Dynamic Query',
    icon: 'Globe'
  };
}
