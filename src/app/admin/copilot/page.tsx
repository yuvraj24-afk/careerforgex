"use client";

import { useState } from "react";
import { Bot, Send, Sparkles, User, Loader2, Terminal, Shield } from "lucide-react";

interface ChatMessage {
  role: "user" | "copilot";
  content: string;
}

export default function AdminCopilotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "copilot",
      content:
        "Hello Alex. I am your CareerForgeX Operational Copilot. I have tool-level access to recent CRM leads, pipeline stages, upcoming bookings, and draft generators. How can I assist you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userQuery = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userQuery }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userQuery }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "copilot", content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "copilot", content: "Error communicating with authorized server tools. Please check session permissions." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "copilot", content: "Network error contacting copilot engine." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (q: string) => {
    setInput(q);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono mb-2">
          <Terminal className="w-3.5 h-3.5" />
          <span>TOOL-CONSTRAINED ASSISTANT</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Admin Operations Copilot</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Ask questions against authorized pipeline metrics, summarize inbound requirements, or draft follow-up correspondence.
        </p>
      </div>

      {/* Suggested Quick Queries */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="text-gray-500 font-mono text-[11px] self-center">Quick Queries:</span>
        {[
          "Show me new leads from this week.",
          "Which leads requested sales automation?",
          "Summarize today's enquiries.",
          "Draft a follow-up email.",
        ].map((q) => (
          <button
            key={q}
            onClick={() => handleQuickPrompt(q)}
            className="px-2.5 py-1 rounded-lg bg-dark-card border border-dark-border text-gray-300 hover:text-white hover:border-brand-500 transition-colors text-[11px]"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="rounded-2xl bg-dark-card border border-dark-border p-6 min-h-[420px] max-h-[550px] overflow-y-auto space-y-4 shadow-xl">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 text-xs leading-relaxed ${
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                m.role === "user" ? "bg-brand-600 text-white" : "bg-dark-elevated text-brand-400 border border-dark-border"
              }`}
            >
              {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`p-4 rounded-2xl max-w-xl whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-brand-600 text-white"
                  : "bg-dark-elevated border border-dark-border text-gray-200"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-brand-400 font-mono">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Consulting authorized CRM tools & pipeline registers...</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          placeholder="Ask copilot to summarize leads, check bookings, or draft follow-up..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-dark-card border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-brand-600/30"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
