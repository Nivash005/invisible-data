import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { NetworkNode, Packet } from '../types/network';
import { GLOBAL_NODES } from '../lib/networkData';
import { latLngToVector3 } from '../lib/routing';
import { playSound } from '../lib/sound';
import { RotateCw, ZoomIn, ZoomOut, Compass, Info, AlertOctagon } from 'lucide-react';

interface GlobeProps {
  currentRouteIds: string[];
  failedNodeIds: string[];
  packets: Packet[];
  onSelectNode: (node: NetworkNode) => void;
  selectedNode: NetworkNode | null;
}

export const Globe: React.FC<GlobeProps> = ({
  currentRouteIds,
  failedNodeIds,
  packets,
  onSelectNode,
  selectedNode
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  // References for three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const routeLinesGroupRef = useRef<THREE.Group | null>(null);
  const packetParticlesGroupRef = useRef<THREE.Group | null>(null);
  const nodeMarkersGroupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 550;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.8);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Globe Master Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // Initial rotation to showcase Asia / Europe / Middle East
    globeGroup.rotation.y = -1.2;
    globeGroup.rotation.x = 0.2;

    // Core dark sphere
    const sphereRadius = 2.0;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 48, 48);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x050b18,
      emissive: 0x020612,
      specular: 0x1e293b,
      shininess: 25,
      transparent: true,
      opacity: 0.95
    });
    const globeSphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(globeSphere);

    // Inner wireframe grid
    const wireGeo = new THREE.SphereGeometry(sphereRadius * 1.002, 36, 18);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      wireframe: true,
      transparent: true,
      opacity: 0.08
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireMesh);

    // Atmosphere halo
    const glowGeo = new THREE.SphereGeometry(sphereRadius * 1.15, 32, 32);
    const glowMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
          gl_FragColor = vec4(0.0, 0.8, 1.0, 1.0) * intensity * 0.45;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    globeGroup.add(glowMesh);

    // Starfield / Particle Background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 600;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 30;
      starPositions[i + 1] = (Math.random() - 0.5) * 30;
      starPositions[i + 2] = (Math.random() - 0.5) * 30;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.035,
      transparent: true,
      opacity: 0.6
    });
    const starField = new THREE.Points(starsGeo, starMat);
    scene.add(starField);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 1.5);
    dirLight1.position.set(5, 3, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 1.0);
    dirLight2.position.set(-5, -2, -3);
    scene.add(dirLight2);

    // Groups for routes, nodes, and packets
    const routeLinesGroup = new THREE.Group();
    globeGroup.add(routeLinesGroup);
    routeLinesGroupRef.current = routeLinesGroup;

    const nodeMarkersGroup = new THREE.Group();
    globeGroup.add(nodeMarkersGroup);
    nodeMarkersGroupRef.current = nodeMarkersGroup;

    const packetParticlesGroup = new THREE.Group();
    globeGroup.add(packetParticlesGroup);
    packetParticlesGroupRef.current = packetParticlesGroup;

    // Mouse Interaction for Drag Rotation
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !globeGroupRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      globeGroupRef.current.rotation.y += deltaX * 0.005;
      globeGroupRef.current.rotation.x += deltaY * 0.005;

      // Clamp X rotation
      globeGroupRef.current.rotation.x = Math.max(-1.2, Math.min(1.2, globeGroupRef.current.rotation.x));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !globeGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      globeGroupRef.current.rotation.y += deltaX * 0.006;
      globeGroupRef.current.rotation.x += deltaY * 0.006;

      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight || 550;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Auto rotation when not dragging
      if (autoRotate && !isDraggingRef.current && globeGroupRef.current) {
        globeGroupRef.current.rotation.y += 0.0012;
      }

      // Pulse starfield slowly
      starField.rotation.y = elapsedTime * 0.01;

      // Animate node rings
      nodeMarkersGroup.children.forEach((child, index) => {
        const ring = child.children[1] as THREE.Mesh;
        if (ring) {
          const scale = 1 + Math.sin(elapsedTime * 3 + index) * 0.25;
          ring.scale.set(scale, scale, scale);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update Nodes in 3D scene
  useEffect(() => {
    if (!nodeMarkersGroupRef.current) return;
    const group = nodeMarkersGroupRef.current;
    
    // Clear old children
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
    }

    const failedSet = new Set(failedNodeIds);

    Object.values(GLOBAL_NODES).forEach((node) => {
      const isFailed = failedSet.has(node.id);
      const isSelected = selectedNode?.id === node.id;
      const isInRoute = currentRouteIds.includes(node.id);

      const [x, y, z] = latLngToVector3(node.lat, node.lng, 2.02);

      const nodeSubgroup = new THREE.Group();
      nodeSubgroup.position.set(x, y, z);
      nodeSubgroup.lookAt(0, 0, 0);

      const colorHex = isFailed ? 0xf43f5e : isSelected ? 0x00f0ff : isInRoute ? 0x38bdf8 : 0x475569;

      // Core marker sphere
      const markerGeo = new THREE.SphereGeometry(0.045, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({
        color: colorHex
      });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      nodeSubgroup.add(markerMesh);

      // Outer glowing pulse ring
      const ringGeo = new THREE.RingGeometry(0.06, 0.085, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isFailed ? 0.9 : isInRoute ? 0.6 : 0.25
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      nodeSubgroup.add(ringMesh);

      // Vertical beacon if active in route
      if (isInRoute || isFailed) {
        const beaconGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.35, 8);
        const beaconMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          transparent: true,
          opacity: 0.7
        });
        const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
        beaconMesh.position.z = 0.175;
        beaconMesh.rotation.x = Math.PI / 2;
        nodeSubgroup.add(beaconMesh);
      }

      // Store node metadata on user data for raycasting or reference
      nodeSubgroup.userData = { node };
      group.add(nodeSubgroup);
    });
  }, [currentRouteIds, failedNodeIds, selectedNode]);

  // Update Route Arcs in 3D Scene
  useEffect(() => {
    if (!routeLinesGroupRef.current) return;
    const group = routeLinesGroupRef.current;

    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    const failedSet = new Set(failedNodeIds);

    for (let i = 0; i < currentRouteIds.length - 1; i++) {
      const fromNode = GLOBAL_NODES[currentRouteIds[i]];
      const toNode = GLOBAL_NODES[currentRouteIds[i + 1]];

      if (!fromNode || !toNode) continue;

      const isSegmentBroken = failedSet.has(fromNode.id) || failedSet.has(toNode.id);

      const v1 = new THREE.Vector3(...latLngToVector3(fromNode.lat, fromNode.lng, 2.0));
      const v2 = new THREE.Vector3(...latLngToVector3(toNode.lat, toNode.lng, 2.0));

      // Calculate middle point elevated above sphere surface for arc curve
      const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
      const distance = v1.distanceTo(v2);
      const elevation = 2.0 + Math.min(0.8, distance * 0.28);
      mid.normalize().multiplyScalar(elevation);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const material = new THREE.LineBasicMaterial({
        color: isSegmentBroken ? 0xf43f5e : 0x00f0ff,
        transparent: true,
        opacity: isSegmentBroken ? 0.35 : 0.85,
        linewidth: 2
      });

      const line = new THREE.Line(geometry, material);
      group.add(line);
    }
  }, [currentRouteIds, failedNodeIds]);

  // Update Animated Packets onto Arcs in 3D Scene
  useEffect(() => {
    if (!packetParticlesGroupRef.current) return;
    const group = packetParticlesGroupRef.current;

    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    packets.forEach((pkt) => {
      if (pkt.status !== 'IN_TRANSIT') return;

      const fromId = pkt.currentRoute[pkt.currentNodeIndex];
      const toId = pkt.currentRoute[pkt.currentNodeIndex + 1];
      const fromNode = GLOBAL_NODES[fromId];
      const toNode = GLOBAL_NODES[toId];

      if (!fromNode || !toNode) return;

      const v1 = new THREE.Vector3(...latLngToVector3(fromNode.lat, fromNode.lng, 2.0));
      const v2 = new THREE.Vector3(...latLngToVector3(toNode.lat, toNode.lng, 2.0));
      const mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
      const distance = v1.distanceTo(v2);
      const elevation = 2.0 + Math.min(0.8, distance * 0.28);
      mid.normalize().multiplyScalar(elevation);

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const point = curve.getPoint(Math.max(0, Math.min(1, pkt.progress)));

      const pGeo = new THREE.SphereGeometry(0.04, 12, 12);
      const pMat = new THREE.MeshBasicMaterial({
        color: pkt.isRetransmission ? 0xf43f5e : 0x34d399
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.copy(point);
      group.add(pMesh);
    });
  }, [packets]);

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    playSound.click();
    const currentZ = cameraRef.current.position.z;
    const targetZ = direction === 'in' ? Math.max(3.8, currentZ - 0.7) : Math.min(8.0, currentZ + 0.7);
    cameraRef.current.position.z = targetZ;
  };

  const handleResetRotation = () => {
    if (!globeGroupRef.current) return;
    playSound.click();
    globeGroupRef.current.rotation.set(0.2, -1.2, 0);
  };

  return (
    <div className="relative w-full h-[450px] lg:h-[580px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-[#060b18] to-slate-950 border border-cyan-500/20 shadow-[0_0_50px_rgba(0,240,255,0.08)]">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Atmospheric Grid Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

      {/* Top Left Status Badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
          <span>SIMULATED 3D OPTICAL MESH</span>
        </div>
        <div className="text-[11px] font-mono text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800 backdrop-blur-sm">
          Origin: <span className="text-cyan-300">Chennai, India</span> → Hops: <span className="text-purple-300">{currentRouteIds.length} Nodes</span>
        </div>
      </div>

      {/* Top Right Legend / Quick Info */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span>Active Route</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span>In-flight Packets</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Failed Node (Offline)</span>
        </div>
      </div>

      {/* Bottom Floating Interactive Node List */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
          {Object.values(GLOBAL_NODES).map((node) => {
            const isFailed = failedNodeIds.includes(node.id);
            const isInRoute = currentRouteIds.includes(node.id);
            const isSelected = selectedNode?.id === node.id;

            return (
              <button
                key={node.id}
                onClick={() => {
                  playSound.nodePulse();
                  onSelectNode(node);
                }}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isFailed
                    ? 'bg-rose-950/60 border-rose-500/60 text-rose-300'
                    : isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                    : isInRoute
                    ? 'bg-slate-900 border-cyan-500/30 text-slate-200 hover:border-cyan-400'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isFailed && <AlertOctagon className="w-3 h-3 text-rose-400 animate-pulse" />}
                <span>{node.city}</span>
              </button>
            );
          })}
        </div>

        {/* View Controls Toolbar */}
        <div className="flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => handleZoom('in')}
            title="Zoom In"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            title="Zoom Out"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetRotation}
            title="Reset Angle"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title="Toggle Auto Rotation"
            className={`px-2 py-1 rounded-lg text-xs font-mono border transition-all ${
              autoRotate
                ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            {autoRotate ? 'Auto: ON' : 'Auto: OFF'}
          </button>
        </div>
      </div>

      {/* Hover Node Tooltip */}
      {hoveredNode && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-slate-950/95 backdrop-blur-md border border-cyan-400/50 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-mono max-w-sm text-center animate-fade-in">
          <div className="flex items-center justify-center gap-2 text-cyan-300 font-bold mb-1">
            <Info className="w-3.5 h-3.5" />
            <span>{hoveredNode.name} ({hoveredNode.city}, {hoveredNode.country})</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            {hoveredNode.description}
          </p>
          <div className="mt-1 text-[10px] text-purple-300 flex items-center justify-center gap-3">
            <span>Avg Hop Latency: {hoveredNode.avgLatency}ms</span>
            <span>Packets Processed: {hoveredNode.packetsProcessed.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};
