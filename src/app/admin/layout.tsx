import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Layers,
  CheckSquare,
  FileEdit,
  Bot,
  Settings,
  LogOut,
  ExternalLink,
  Cpu,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-dark-border bg-dark-card/95 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo / Header */}
          <div className="flex items-center justify-between pb-4 border-b border-dark-border">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">CareerForgeX</span>
                <span className="text-[9px] font-mono uppercase text-brand-400">Backoffice</span>
              </div>
            </Link>

            <Link
              href="/"
              target="_blank"
              title="Open Public Website"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-dark-elevated transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-dark-elevated transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-brand-400" />
              <span>Overview</span>
            </Link>

            <Link
              href="/admin/leads"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-dark-elevated transition-colors"
            >
              <Users className="w-4 h-4 text-accent-cyan" />
              <span>Leads CRM</span>
            </Link>

            <Link
              href="/admin/bookings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-dark-elevated transition-colors"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Bookings Manager</span>
            </Link>

            <Link
              href="/admin/projects"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-dark-elevated transition-colors"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Active Projects</span>
            </Link>

            <Link
              href="/admin/executions"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-dark-elevated transition-colors"
            >
              <CheckSquare className="w-4 h-4 text-rose-400" />
              <span>Approvals Queue</span>
            </Link>

            <Link
              href="/admin/cms"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-dark-elevated transition-colors"
            >
              <FileEdit className="w-4 h-4 text-purple-400" />
              <span>Content CMS</span>
            </Link>

            <Link
              href="/admin/copilot"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-brand-300 hover:text-white hover:bg-dark-elevated transition-colors"
            >
              <Bot className="w-4 h-4 text-brand-400 animate-pulse" />
              <span>Admin AI Copilot</span>
            </Link>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="pt-4 border-t border-dark-border space-y-3">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-7 h-7 rounded-full bg-brand-600/30 border border-brand-500/50 flex items-center justify-center text-xs text-brand-300 font-bold">
              AS
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-white truncate">Alex Sterling</span>
              <span className="text-[10px] font-mono text-gray-400">admin@careerforgex.com</span>
            </div>
          </div>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
