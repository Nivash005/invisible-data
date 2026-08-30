// Vercel Serverless Function: /api/ai
// Secure serverless handler for NEXUS AI assistant queries

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, context } = req.body || {};
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Return fallback guidance so the frontend seamlessly uses its rich local knowledge engine
    return res.status(200).json({
      fallback: true,
      message: 'No OPENAI_API_KEY configured. Running in high-performance local cognition fallback mode.'
    });
  }

  try {
    const systemPrompt = `You are NEXUS, an advanced, highly knowledgeable AI guide specializing in global internet architecture, packet routing, DNS, subsea optical fiber, TCP/IP, and BGP routing.
Current network simulation context:
- Target Domain: ${context?.domain || 'youtube.com'}
- Origin: ${context?.sourceCity || 'Chennai, India'}
- Destination: ${context?.destCity || 'San Francisco, USA'}
- Active Route: ${context?.routeNames?.join(' -> ') || 'Chennai -> Mumbai -> Dubai -> Frankfurt -> London -> New York -> San Francisco'}
- Latency: ${context?.latency || 42} ms
- Packet Loss: ${context?.packetLoss || 0}%
- Offline/Failed Nodes: ${context?.failedNodes?.join(', ') || 'None'}

Provide concise, scientifically accurate, engaging explanations (2-3 sentences max) matching the futuristic cyberpunk tone of INVISIBLE // DATA.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API responded with status ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || '';

    return res.status(200).json({ answer });
  } catch (error: any) {
    return res.status(200).json({
      fallback: true,
      error: error.message
    });
  }
}
