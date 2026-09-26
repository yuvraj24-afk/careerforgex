import Link from "next/link";
import { GitFork, ArrowLeft, ArrowRight, Bot } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-950/80 border border-brand-800/60 mx-auto flex items-center justify-center text-brand-400">
          <GitFork className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono text-brand-400 uppercase tracking-wider">
            ERROR 404 • ROUTE_EXECUTION_FAILURE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            This automation path doesn't exist.
          </h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            The requested workflow node or page has either been relocated, deprecated, or was typed incorrectly.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-dark-card border border-dark-border font-mono text-xs text-gray-500">
          STATUS: CONDITIONAL_BRANCH_NULL (404)
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-md shadow-brand-600/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg bg-dark-card hover:bg-dark-elevated text-gray-300 hover:text-white border border-dark-border font-medium text-xs transition-colors"
          >
            <span>Explore Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
