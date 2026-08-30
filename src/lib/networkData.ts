import { NetworkNode } from '../types/network';

export const GLOBAL_NODES: Record<string, NetworkNode> = {
  chennai: {
    id: 'chennai',
    name: 'Chennai Gateway',
    city: 'Chennai',
    country: 'India',
    lat: 13.0827,
    lng: 80.2707,
    status: 'ONLINE',
    load: 42,
    avgLatency: 8,
    packetsProcessed: 28490,
    description: 'Submarine cable landing station connecting South Asia to Southeast Asia and Middle East (SMW-4, SEA-ME-WE 3, BBG).',
    type: 'ORIGIN',
    color: '#00f0ff'
  },
  mumbai: {
    id: 'mumbai',
    name: 'Mumbai Central IX',
    city: 'Mumbai',
    country: 'India',
    lat: 19.0760,
    lng: 72.8777,
    status: 'ONLINE',
    load: 68,
    avgLatency: 18,
    packetsProcessed: 89420,
    description: 'Major Tier-1 Internet Exchange Point handling over 60% of Western India cross-continental optical traffic.',
    type: 'RELAY',
    color: '#38bdf8'
  },
  singapore: {
    id: 'singapore',
    name: 'Singapore Equinix SG1',
    city: 'Singapore',
    country: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    status: 'ONLINE',
    load: 54,
    avgLatency: 32,
    packetsProcessed: 142090,
    description: 'Premier Asia-Pacific super-hub connecting trans-pacific and Indian Ocean fiber backbones.',
    type: 'EXCHANGE',
    color: '#a855f7'
  },
  dubai: {
    id: 'dubai',
    name: 'Dubai Datamena IX',
    city: 'Dubai',
    country: 'United Arab Emirates',
    lat: 25.2048,
    lng: 55.2708,
    status: 'ONLINE',
    load: 46,
    avgLatency: 45,
    packetsProcessed: 67100,
    description: 'Middle East international transit hub bridging Asian undersea cables with Mediterranean landing points.',
    type: 'RELAY',
    color: '#38bdf8'
  },
  frankfurt: {
    id: 'frankfurt',
    name: 'Frankfurt DE-CIX',
    city: 'Frankfurt',
    country: 'Germany',
    lat: 50.1109,
    lng: 8.6821,
    status: 'ONLINE',
    load: 78,
    avgLatency: 68,
    packetsProcessed: 320140,
    description: 'The world’s largest Internet Exchange Point by peak traffic throughput, processing over 14 Terabits/sec.',
    type: 'EXCHANGE',
    color: '#a855f7'
  },
  london: {
    id: 'london',
    name: 'London LINX Redbus',
    city: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    status: 'ONLINE',
    load: 62,
    avgLatency: 74,
    packetsProcessed: 210800,
    description: 'Key North Atlantic gateway and primary European peering interconnection point.',
    type: 'RELAY',
    color: '#38bdf8'
  },
  tokyo: {
    id: 'tokyo',
    name: 'Tokyo JPIX Otemachi',
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
    status: 'ONLINE',
    load: 58,
    avgLatency: 88,
    packetsProcessed: 184500,
    description: 'North-East Asia ultra-high speed optical switching exchange connecting Pacific subsea fiber to US West Coast.',
    type: 'EXCHANGE',
    color: '#a855f7'
  },
  newyork: {
    id: 'newyork',
    name: 'New York 60 Hudson',
    city: 'New York',
    country: 'United States',
    lat: 40.7128,
    lng: -74.0060,
    status: 'ONLINE',
    load: 71,
    avgLatency: 112,
    packetsProcessed: 410290,
    description: 'Iconic carrier-hotel building housing transatlantic fiber cable terminations and major cloud region backbones.',
    type: 'EXCHANGE',
    color: '#a855f7'
  },
  sanfrancisco: {
    id: 'sanfrancisco',
    name: 'Silicon Valley SJC Core',
    city: 'San Francisco',
    country: 'United States',
    lat: 37.7749,
    lng: -122.4194,
    status: 'ONLINE',
    load: 65,
    avgLatency: 135,
    packetsProcessed: 380400,
    description: 'West Coast cloud compute nexus hosting global service edge clusters and hyper-scale data centers.',
    type: 'DESTINATION',
    color: '#34d399'
  }
};

export interface TargetDomainPreset {
  domain: string;
  name: string;
  ip: string;
  destinationNodeId: string;
  primaryPath: string[];
  failoverPath: string[];
  description: string;
  category: string;
  icon: string;
}

export const DOMAIN_PRESETS: TargetDomainPreset[] = [
  {
    domain: 'youtube.com',
    name: 'YouTube CDN Edge',
    ip: '142.250.190.46',
    destinationNodeId: 'sanfrancisco',
    primaryPath: ['chennai', 'mumbai', 'dubai', 'frankfurt', 'london', 'newyork', 'sanfrancisco'],
    failoverPath: ['chennai', 'singapore', 'tokyo', 'sanfrancisco'],
    description: 'Global video streaming hyper-network requiring low-jitter high-bandwidth UDP/QUIC streams.',
    category: 'Streaming Media',
    icon: 'Video'
  },
  {
    domain: 'google.com',
    name: 'Google Global Cache',
    ip: '172.217.16.206',
    destinationNodeId: 'sanfrancisco',
    primaryPath: ['chennai', 'mumbai', 'singapore', 'tokyo', 'sanfrancisco'],
    failoverPath: ['chennai', 'mumbai', 'dubai', 'frankfurt', 'newyork', 'sanfrancisco'],
    description: 'Ultra-redundant BGP Anycast search cluster distributed across multi-continental optical rings.',
    category: 'Search & Cloud',
    icon: 'Search'
  },
  {
    domain: 'github.com',
    name: 'GitHub Fastly Edge',
    ip: '140.82.114.4',
    destinationNodeId: 'newyork',
    primaryPath: ['chennai', 'mumbai', 'dubai', 'frankfurt', 'london', 'newyork'],
    failoverPath: ['chennai', 'singapore', 'tokyo', 'sanfrancisco', 'newyork'],
    description: 'Developer code repository secured with mutual TLS 1.3 over global Anycast CDN endpoints.',
    category: 'Developer Platform',
    icon: 'GitBranch'
  },
  {
    domain: 'wikipedia.org',
    name: 'Wikimedia Foundation',
    ip: '208.80.154.224',
    destinationNodeId: 'frankfurt',
    primaryPath: ['chennai', 'mumbai', 'dubai', 'frankfurt'],
    failoverPath: ['chennai', 'singapore', 'tokyo', 'london', 'frankfurt'],
    description: 'Public knowledge repository hosted on open-source caching layers with European primary data clusters.',
    category: 'Knowledge Base',
    icon: 'BookOpen'
  },
  {
    domain: 'cloudflare.com',
    name: 'Cloudflare 1.1.1.1 Edge',
    ip: '104.16.132.229',
    destinationNodeId: 'london',
    primaryPath: ['chennai', 'mumbai', 'dubai', 'london'],
    failoverPath: ['chennai', 'singapore', 'frankfurt', 'london'],
    description: 'DDoS mitigation and global reverse-proxy edge network defending 20%+ of web requests.',
    category: 'Cybersecurity & CDN',
    icon: 'ShieldCheck'
  }
];

// All possible network adjacency links for drawing background mesh
export const NETWORK_LINKS: [string, string][] = [
  ['chennai', 'mumbai'],
  ['chennai', 'singapore'],
  ['mumbai', 'dubai'],
  ['mumbai', 'singapore'],
  ['dubai', 'frankfurt'],
  ['singapore', 'tokyo'],
  ['frankfurt', 'london'],
  ['frankfurt', 'tokyo'],
  ['london', 'newyork'],
  ['tokyo', 'sanfrancisco'],
  ['newyork', 'sanfrancisco'],
  ['singapore', 'dubai']
];
