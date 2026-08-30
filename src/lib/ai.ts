interface ContextState {
  domain: string;
  sourceCity: string;
  destCity: string;
  routeNames: string[];
  latency: number;
  packetLoss: number;
  failedNodes: string[];
  trafficVolume: string;
}

const LOCAL_KNOWLEDGE_BASE: { keywords: string[]; answer: (ctx: ContextState) => string; highlightedNode?: string }[] = [
  {
    keywords: ['route', 'why', 'path', 'routing', 'take this route'],
    answer: (ctx) =>
      `NEXUS: Autonomous Border Gateway Protocol (BGP) and optical fiber routing algorithms prioritize paths with the lowest latency, lowest packet collision, and highest peering capacity. Your data is routed from ${ctx.sourceCity} through ${ctx.routeNames.slice(1, -1).join(' → ')} to ${ctx.destCity} because this optical backbone represents the optimal peering path under current network conditions.`,
  },
  {
    keywords: ['dns', 'domain', 'translate', 'ip', 'name'],
    answer: (ctx) =>
      `NEXUS: DNS (Domain Name System) is the internet's decentralized phonebook. When you entered "${ctx.domain}", your local resolver queried Root DNS (.) → TLD Server (.com) → Authoritative Nameservers to resolve human text into a machine-routable IPv4/IPv6 destination address in ~14ms before any HTTP payload could be sent.`,
  },
  {
    keywords: ['latency', 'ping', 'distance', 'delay', 'ms', 'speed', 'slow'],
    answer: (ctx) =>
      `NEXUS: Current simulated round-trip latency is ${ctx.latency} ms. Latency is governed by three physical factors: 1) The speed of light in glass fiber (~200,000 km/s, or ~5µs per km), 2) Serialization & queuing delay at optical amplifiers and edge routers, and 3) Physical routing detours around continental landmasses and underwater trenches.`,
  },
  {
    keywords: ['fail', 'down', 'offline', 'mumbai', 'collapse', 'what happens if a node fails', 'failure'],
    answer: (ctx) => {
      if (ctx.failedNodes.length > 0) {
        return `NEXUS: Notice how node [${ctx.failedNodes.join(', ').toUpperCase()}] went offline! The dynamic routing tables immediately detected BGP route withdraw messages. Transit routers automatically converged onto an alternative optical path avoiding the dead link, keeping your connection to ${ctx.domain} alive without dropping the TCP session!`;
      }
      return `NEXUS: When an intermediate transit node or subsea cable cut occurs, routers immediately detect Keepalive timeouts. BGP routers withdraw the dead route and re-calculate alternative AS paths (e.g. redirecting via Singapore or Tokyo) in sub-second failover times to maintain unbroken end-to-end data delivery.`;
    }
  },
  {
    keywords: ['packet loss', 'dropped', 'loss', 'packet', 'inside a packet', 'structure', 'payload'],
    answer: (ctx) =>
      `NEXUS: A network packet consists of three fundamental parts: 1) The Header (IP source/destination, TTL, Sequence Number), 2) The Payload (actual encrypted TLS/HTTPS application bytes), and 3) The Checksum (CRC32/FCS to detect bit flips). At ${ctx.packetLoss}% packet loss, dropped packets trigger TCP Fast Retransmit (SACK) to restore lost fragments.`,
  },
  {
    keywords: ['https', 'tls', 'security', 'ssl', 'encrypt', 'crypto'],
    answer: () =>
      `NEXUS: HTTPS uses TLS 1.3 to create an encrypted tunnel. Before data is transmitted, an asymmetric Diffie-Hellman handshake exchanges ephemeral session keys. Even if malicious actors intercept packets on the undersea cables, payload contents look like pseudorandom high-entropy noise.`,
  },
  {
    keywords: ['mumbai', 'singapore', 'frankfurt', 'london', 'chennai', 'tokyo', 'new york', 'san francisco'],
    answer: () =>
      `NEXUS: Major Internet Exchange Points (IXPs) like Mumbai Central, Frankfurt DE-CIX, and Singapore Equinix house hundreds of switches and terabit transceivers that cross-connect international Tier-1 telecom providers, reducing latency and international transit costs.`,
  }
];

export async function askNexusAI(
  prompt: string,
  context: ContextState
): Promise<{ text: string; highlightedNodeId?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, context }),
      signal: controller.signal
    }).catch(() => null);

    clearTimeout(timeoutId);

    if (res && res.ok) {
      const data = await res.json();
      if (data.answer) {
        return { text: data.answer, highlightedNodeId: data.highlightedNodeId };
      }
    }
  } catch {
    // Silently fall back to local knowledge engine
  }

  const lower = prompt.toLowerCase();
  for (const item of LOCAL_KNOWLEDGE_BASE) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return {
        text: item.answer(context),
        highlightedNodeId: item.highlightedNode
      };
    }
  }

  return {
    text: `NEXUS // DEMO MODE: Your query regarding "${prompt}" relates to the current packet stream traveling to ${context.domain} (${context.destCity}). Across ${context.routeNames.length} routing hops and ${context.latency} ms of optical propagation delay, packets are encapsulated, modulated over fiber frequencies, and reassembled at the destination edge server.`,
  };
}

export const NEXUS_QUICK_QUESTIONS = [
  "Why did my data take this route?",
  "What is DNS and how was the IP resolved?",
  "Why is latency higher on longer routes?",
  "What happens if a major node fails?",
  "What is inside an individual packet?",
  "How does HTTPS encryption protect data?"
];
