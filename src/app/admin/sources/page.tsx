import { prisma } from "@/lib/db";
import { SourcesManagementClient } from "./sources-client";

export const dynamic = "force-dynamic";

export default async function AdminSourcesPage() {
  const [sources, discovered] = await Promise.all([
    prisma.source.findMany({
      orderBy: [{ priority: "asc" }, { name: "asc" }],
    }),
    prisma.discoveredSource.findMany({
      where: { status: "DISCOVERED" },
      orderBy: [{ trustTier: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">
          Source Registry & Discovery
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage actively monitored institutional portals and approve newly discovered sources.
        </p>
      </div>

      <SourcesManagementClient
        initialSources={sources}
        initialDiscovered={discovered}
      />
    </div>
  );
}
