import { db } from "@/lib/db";
import { Calendar, Clock, Video, Globe, CheckCircle2, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { lead: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Discovery Call Bookings</h1>
        <p className="text-xs text-gray-400 mt-1">
          Confirmed, completed, and requested technical systems architecture reviews.
        </p>
      </div>

      <div className="rounded-2xl bg-dark-card border border-dark-border overflow-hidden">
        <div className="p-4 border-b border-dark-border text-[11px] font-mono text-gray-400 uppercase tracking-wider flex justify-between">
          <span>Scheduled Session</span>
          <span>Status & Meeting Link</span>
        </div>

        <div className="divide-y divide-dark-border/60">
          {bookings.map((b) => (
            <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{b.name}</span>
                  <span className="text-gray-400">({b.company})</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-[11px] font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-400" />
                    {b.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-400" />
                    {b.time} ({b.timezone})
                  </span>
                </div>
                {b.notes && <p className="text-[11px] text-gray-400 italic">Notes: {b.notes}</p>}
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                {b.meetingLink && (
                  <a
                    href={b.meetingLink}
                    target="_blank"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-dark-elevated border border-dark-border text-xs text-brand-300 hover:text-white"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Room</span>
                  </a>
                )}
                <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] ${
                  b.status === "Confirmed" ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800/40" :
                  "bg-dark-elevated text-gray-400 border border-dark-border"
                }`}>
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
