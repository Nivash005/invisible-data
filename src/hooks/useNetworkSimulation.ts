import { useState, useEffect, useRef, useCallback } from 'react';
import { NetworkNode, Packet, NetworkStats, SimulationControlState } from '../types/network';
import { GLOBAL_NODES } from '../lib/networkData';
import { findOptimalRoute, getRouteMetrics, matchDomainPreset } from '../lib/routing';
import { generateSinglePacket, advancePackets } from '../lib/simulation';
import { playSound } from '../lib/sound';

export function useNetworkSimulation(initialDomain: string = 'youtube.com') {
  const [activeDomain, setActiveDomain] = useState(initialDomain);
  const [activePreset, setActivePreset] = useState(() => matchDomainPreset(initialDomain));
  const [failedNodeIds, setFailedNodeIds] = useState<string[]>([]);
  const [latencyMultiplier, setLatencyMultiplier] = useState(0); // 0 to 500ms
  const [packetLossPercent, setPacketLossPercent] = useState(0); // 0 to 30%
  const [trafficVolume, setTrafficVolume] = useState<'LOW' | 'NORMAL' | 'HIGH' | 'EXTREME'>('NORMAL');
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [packets, setPackets] = useState<Packet[]>([]);
  
  // Computed route node IDs
  const [currentRouteIds, setCurrentRouteIds] = useState<string[]>(() => {
    return findOptimalRoute('chennai', matchDomainPreset(initialDomain).destinationNodeId, []);
  });

  const [stats, setStats] = useState<NetworkStats>({
    latency: 42,
    speed: 87,
    packetsSent: 0,
    packetsDelivered: 0,
    packetsDropped: 0,
    distanceKm: 14200,
    nodesCount: 6,
    activePacketsCount: 0,
    packetLossRate: 0,
    trafficLevel: 'NORMAL'
  });

  // Calculate route whenever domain or failed nodes change
  useEffect(() => {
    const preset = matchDomainPreset(activeDomain);
    setActivePreset(preset);
    const newRoute = findOptimalRoute('chennai', preset.destinationNodeId, failedNodeIds);
    setCurrentRouteIds(newRoute);

    const metrics = getRouteMetrics(newRoute, latencyMultiplier);
    setStats((prev) => ({
      ...prev,
      distanceKm: metrics.totalDistanceKm,
      latency: metrics.estimatedLatencyMs,
      nodesCount: newRoute.length
    }));
  }, [activeDomain, failedNodeIds, latencyMultiplier]);

  // Handle packet generation interval based on traffic volume
  const packetsRef = useRef<Packet[]>([]);
  packetsRef.current = packets;

  useEffect(() => {
    if (isPaused || currentRouteIds.length <= 1) return;

    const intervalMap = {
      LOW: 1200,
      NORMAL: 650,
      HIGH: 350,
      EXTREME: 180
    };

    const intervalTime = intervalMap[trafficVolume];

    const generator = setInterval(() => {
      const newPkt = generateSinglePacket(currentRouteIds, activePreset.domain, activePreset.ip);
      if (packetLossPercent > 0 && Math.random() * 100 < packetLossPercent) {
        newPkt.isRetransmission = true;
      }

      playSound.packetLaunch();

      setPackets((prev) => [...prev.slice(-30), newPkt]);
      setStats((prev) => ({
        ...prev,
        packetsSent: prev.packetsSent + 1
      }));
    }, intervalTime);

    return () => clearInterval(generator);
  }, [trafficVolume, isPaused, currentRouteIds, activePreset, packetLossPercent]);

  // Frame tick animation for packet advancement
  useEffect(() => {
    let animFrameId: number;
    let lastTime = performance.now();

    const tick = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!isPaused && delta < 0.5) {
        const speedMult = 1 + (latencyMultiplier / 80);
        const { updatedPackets, deliveredCount, droppedCount } = advancePackets(
          packetsRef.current,
          speedMult,
          packetLossPercent,
          failedNodeIds
        );

        setPackets(updatedPackets);

        if (deliveredCount > 0 || droppedCount > 0) {
          setStats((prev) => {
            const delivered = prev.packetsDelivered + deliveredCount;
            const dropped = prev.packetsDropped + droppedCount;
            const total = delivered + dropped;
            const lossRate = total > 0 ? +((dropped / total) * 100).toFixed(1) : 0;

            const baseSpeed = trafficVolume === 'EXTREME' ? 320 : trafficVolume === 'HIGH' ? 180 : trafficVolume === 'NORMAL' ? 88 : 34;
            const speedPenalty = (latencyMultiplier * 0.2) + (lossRate * 2);
            const liveSpeed = Math.max(8, Math.round(baseSpeed - speedPenalty + (Math.random() * 6 - 3)));

            return {
              ...prev,
              packetsDelivered: delivered,
              packetsDropped: dropped,
              packetLossRate: lossRate,
              speed: liveSpeed,
              activePacketsCount: updatedPackets.filter(p => p.status === 'IN_TRANSIT').length
            };
          });
        }
      }

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [isPaused, latencyMultiplier, packetLossPercent, failedNodeIds, trafficVolume]);

  // Actions
  const traceDomain = useCallback((domain: string) => {
    playSound.click();
    setActiveDomain(domain);
  }, []);

  const failNode = useCallback((nodeId: string) => {
    playSound.failWarning();
    setFailedNodeIds((prev) => {
      if (prev.includes(nodeId)) return prev;
      return [...prev, nodeId];
    });
  }, []);

  const restoreNode = useCallback((nodeId: string) => {
    playSound.nodePulse();
    setFailedNodeIds((prev) => prev.filter((id) => id !== nodeId));
  }, []);

  const restoreAllNodes = useCallback(() => {
    playSound.nodePulse();
    setFailedNodeIds([]);
    setLatencyMultiplier(0);
    setPacketLossPercent(0);
    setTrafficVolume('NORMAL');
  }, []);

  const slowNetwork = useCallback(() => {
    playSound.failWarning();
    setLatencyMultiplier(240);
  }, []);

  const triggerPacketLoss = useCallback(() => {
    playSound.failWarning();
    setPacketLossPercent(18);
  }, []);

  // Compute node objects for current route
  const currentRouteNodes: NetworkNode[] = currentRouteIds
    .map((id) => GLOBAL_NODES[id])
    .filter(Boolean)
    .map((node) => ({
      ...node,
      status: failedNodeIds.includes(node.id) ? 'OFFLINE' : node.status
    }));

  const controlState: SimulationControlState = {
    latencyMultiplier,
    packetLossPercent,
    trafficVolume,
    failedNodeIds,
    isPaused,
    selectedPacket,
    selectedNode,
    activeDomain,
    isSimulating: !isPaused
  };

  return {
    activeDomain,
    activePreset,
    currentRouteIds,
    currentRouteNodes,
    packets,
    stats,
    failedNodeIds,
    controlState,
    selectedPacket,
    selectedNode,
    setSelectedPacket,
    setSelectedNode,
    traceDomain,
    failNode,
    restoreNode,
    restoreAllNodes,
    slowNetwork,
    triggerPacketLoss,
    setLatencyMultiplier,
    setPacketLossPercent,
    setTrafficVolume,
    setIsPaused
  };
}
