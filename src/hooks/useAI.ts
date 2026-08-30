import { useState, useCallback } from 'react';
import { AIMessage } from '../types/network';
import { askNexusAI } from '../lib/ai';
import { playSound } from '../lib/sound';

export function useAI(
  domain: string,
  sourceCity: string,
  destCity: string,
  routeNames: string[],
  latency: number,
  packetLoss: number,
  failedNodes: string[],
  trafficVolume: string
) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'init-1',
      sender: 'nexus',
      text: 'NEXUS ONLINE // Your guide to the invisible network. You clicked a website. Before your browser could retrieve the page, it needed to discover where the destination server was located. Your request is now traveling through several global network nodes.',
      timestamp: Date.now()
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const ask = useCallback(
    async (questionText: string) => {
      if (!questionText.trim() || isThinking) return;

      playSound.click();

      const userMsg: AIMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: questionText,
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsThinking(true);

      const context = {
        domain,
        sourceCity,
        destCity,
        routeNames,
        latency,
        packetLoss,
        failedNodes,
        trafficVolume
      };

      try {
        const response = await askNexusAI(questionText, context);
        playSound.aiChime();

        const aiMsg: AIMessage = {
          id: `nexus-${Date.now()}`,
          sender: 'nexus',
          text: response.text,
          timestamp: Date.now(),
          highlightedNodeId: response.highlightedNodeId
        };

        setMessages((prev) => [...prev, aiMsg]);
      } catch {
        const fallbackMsg: AIMessage = {
          id: `nexus-${Date.now()}`,
          sender: 'nexus',
          text: 'NEXUS: Local telemetry stream active. Your packets are navigating global undersea optical cables with automated error correction and dynamic BGP routing.',
          timestamp: Date.now()
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      } finally {
        setIsThinking(false);
      }
    },
    [domain, sourceCity, destCity, routeNames, latency, packetLoss, failedNodes, trafficVolume, isThinking]
  );

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'nexus',
        text: 'NEXUS // Chat stream reinitialized. Select a quick query or ask anything about current packet propagation.',
        timestamp: Date.now()
      }
    ]);
  }, []);

  return {
    messages,
    isThinking,
    ask,
    clearChat
  };
}
