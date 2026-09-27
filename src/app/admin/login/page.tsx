"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Key, ArrowRight, Loader2, AlertCircle, Cpu } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const destination = params?.get("from") || "/admin/automation";
      router.push(destination);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full rounded-2xl bg-dark-card border border-dark-border p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-brand-950/80 border border-brand-800/60 mx-auto flex items-center justify-center text-brand-400">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">CareerForgeX Backoffice</h1>
          <p className="text-xs text-gray-400">
            Sign in to access CRM leads, bookings, project milestones, and approval queues.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-dark-elevated border border-dark-border text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-brand-600/30 transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            <span>{loading ? "Authenticating Session..." : "Sign In to Backoffice"}</span>
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div className="p-3.5 rounded-xl bg-dark-elevated/70 border border-dark-border text-[11px] font-mono text-gray-400 space-y-1">
          <div className="text-gray-300 font-semibold">Demo Access Credentials:</div>
          <div>User: <code className="text-brand-300">admin@careerforgex.com</code></div>
          <div>Pass: <code className="text-brand-300">admin</code></div>
        </div>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors">
            &larr; Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
