import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Terminal, Trash2, Cpu } from 'lucide-react';
import { AIMessage } from '../types/network';
import { NEXUS_QUICK_QUESTIONS } from '../lib/ai';
import { playSound } from '../lib/sound';

interface NexusAIProps {
  messages: AIMessage[];
  isThinking: boolean;
  onAsk: (question: string) => void;
  onClear: () => void;
}

export const NexusAI: React.FC<NexusAIProps> = ({
  messages,
  isThinking,
  onAsk,
  onClear
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isThinking) {
      onAsk(input.trim());
      setInput('');
    }
  };

  const handleQuickClick = (q: string) => {
    playSound.click();
    onAsk(q);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  return (
    <div className="w-full bg-slate-950/85 backdrop-blur-xl border border-purple-500/25 rounded-2xl p-5 lg:p-6 shadow-2xl flex flex-col h-[520px] relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <Bot className="w-4 h-4 text-purple-300" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border-2 border-slate-950" />
          </div>
          <div>
            <h3 className="font-mono font-bold text-sm text-slate-100 flex items-center gap-2">
              NEXUS <span className="text-purple-400 font-mono">//</span> AI COMPANION
            </h3>
            <p className="text-[10px] font-mono text-slate-400">
              "Your guide to the invisible network."
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono uppercase bg-purple-950/60 text-purple-300 px-2 py-0.5 rounded border border-purple-800/40">
            DEMO + API READY
          </span>
          <button
            onClick={onClear}
            title="Clear Chat"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 font-mono text-xs scrollbar-thin">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
            >
              <div className="text-[9px] text-slate-500 mb-1 flex items-center gap-1">
                {isUser ? (
                  <span>YOU</span>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span className="text-purple-300 font-semibold">NEXUS COGNITION</span>
                  </>
                )}
                <span>• {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>

              <div
                className={`p-3.5 rounded-2xl max-w-[88%] leading-relaxed ${
                  isUser
                    ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/30 rounded-tr-none'
                    : 'bg-slate-900/90 text-slate-200 border border-purple-500/30 rounded-tl-none shadow-lg shadow-purple-950/20'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center gap-2 text-purple-300 font-mono text-xs p-3 bg-purple-950/30 border border-purple-500/20 rounded-xl animate-pulse">
            <Cpu className="w-4 h-4 animate-spin" />
            <span>NEXUS is analyzing packet propagation telemetry...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="pt-2 pb-2 shrink-0">
        <div className="text-[10px] font-mono text-slate-400 mb-1.5 flex items-center gap-1">
          <Terminal className="w-3 h-3 text-purple-400" />
          <span>SUGGESTED INQUIRIES:</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {NEXUS_QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickClick(q)}
              className="px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/40 text-[10px] font-mono text-slate-300 hover:text-purple-200 whitespace-nowrap transition-all flex-shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="pt-2 border-t border-slate-800 flex gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask NEXUS anything about this journey..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-400 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || isThinking}
          className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 text-purple-300 border border-purple-500/40 text-xs font-mono flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
        >
          <span className="hidden sm:inline">ASK</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
