# INVISIBLE // DATA (v2 — Scroll Edition)

> *"See what happens after you click."*

**INVISIBLE // DATA** is a creative technology experience and interactive data-visualization platform that makes the invisible journey of internet data visible. 

From the microsecond kernel socket syscall in your browser to DNS resolution, MTU packet slicing, BGP routing heuristics, oceanic subsea fiber cables, and edge server responses — this website turns global network mechanics into an interactive visual story.

---

## 🌟 Key Features

1. **Cinematic Scrollytelling Journey (Framer Motion useScroll & useSpring)**
   - **Chapter 01: The Click** — Kernel socket creation and user intent pulse.
   - **Chapter 02: DNS** — Real-time domain to IP transformation matrix (`youtube.com` → `142.250.190.46`).
   - **Chapter 03: Packetization** — MTU data segmentation into discrete sequenced packets with CRC checksums.
   - **Chapter 04: Routing** — Dynamic pathfinding across global exchange nodes.
   - **Chapter 05: Transmission** — Laser light propagation through deep-sea armored fiber cables at 200,000 km/s.
   - **Chapter 06: Response** — Server reassembly, HTTP 200 payload generation, and return vector.

2. **Interactive 3D Global Network (Three.js WebGL)**
   - Procedural dark sphere with glowing wireframe atmospheric halo and starfield.
   - Global Tier-1 IXP Nodes: Chennai, Mumbai, Singapore, Dubai, Frankfurt, London, Tokyo, New York, San Francisco.
   - Quadratic Bezier 3D route arcs with traveling light packet particles and real-time failure indicators.
   - Mouse drag rotation, zoom controls, and interactive node selection HUD.

3. **Live Packet Inspector**
   - Dissect any in-flight or delivered packet (`PKT-#0042`).
   - Interactive breakdown of **HEADER** (Source/Dest IP, TTL, TCP flags), **PAYLOAD** (TLS 1.3 encrypted data stream), and **CHECKSUM** (CRC32 polynomial validation).

4. **NEXUS AI Assistant ("Your Guide to the Invisible Network")**
   - Real-time conversational AI contextually aware of active domain, hop count, current latency, and network failures.
   - Seamless **Demo Fallback Mode** with built-in knowledge base (works 100% offline without API key).
   - Secure serverless route (`/api/ai`) supporting `OPENAI_API_KEY` for live GPT-4o-mini generation.

5. **"WHAT IF?" Network Chaos Lab**
   - **FAIL NODE** — Take nodes like Mumbai offline and watch dynamic BGP rerouting automatically redirect packets (e.g. Chennai → Singapore → Tokyo → London).
   - **SLOW NETWORK** — Inject artificial fiber delay up to 500 ms.
   - **PACKET LOSS** — Simulate link degradation (0-30%) with TCP SACK retransmission animations.
   - **RESTORE NORMAL** — Instant recovery to optimal conditions.

6. **"Can You Beat the Router?" Mini-Game**
   - Choose between 3 path vectors (Trans-Arabian, Pacific Ring, Red Sea detour) and compare your route latency against autonomous BGP optimal paths.

7. **"Inside the Invisible" Multi-Scale Zoom View**
   - 5-level microscopic dive: Planetary Scale (10,000 km) → IXP Node (50 km) → Glass Fiber (125 µm) → DSP Transceiver (5 nm) → Atomic Bitstream (1 Byte).

8. **Real-Time Telemetry Spectrum**
   - High-performance HTML5 Canvas graphing live latency, throughput (Mbps), and packet loss events.

9. **Subtle Web Audio API Sound Synthesizer**
   - Sci-fi user interface audio cues with instant mute/sound on toggle.

---

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS & Vanilla CSS Design System (Glassmorphism, Neon Cyberpunk Palette)
- **3D Graphics**: Three.js WebGL
- **Animation**: Framer Motion (`useScroll`, `useTransform`, `useSpring`, `whileInView`)
- **Icons**: Lucide React
- **Sound**: Web Audio API Procedural Synthesizer
- **Deployment**: Vercel Serverless Ready

---

## 🚀 Local Development

1. **Clone & Navigate:**
   ```bash
   cd PROJECT
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 🔑 AI Configuration (Optional)

To enable live OpenAI responses in NEXUS AI:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Add your key:
   ```env
   OPENAI_API_KEY=sk-...
   ```
3. *Note: If no key is provided, NEXUS runs in built-in **Demo Mode** with instant answers.*

---

## 🌐 Deploy to Vercel

1. Push to GitHub.
2. Import repository into [Vercel](https://vercel.com).
3. Set Build Command: `npm run build` and Output Directory: `dist`.
4. (Optional) Add `OPENAI_API_KEY` under Environment Variables.
5. Deploy!
