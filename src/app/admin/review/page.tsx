import { prisma } from "@/lib/db";
import { ReviewQueueClient } from "./review-client";

export const dynamic = "force-dynamic";

export default async function AdminReviewPage() {
  const items = await prisma.reviewQueueItem.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: { opportunity: true },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">
          Opportunity Review Queue
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review extractions with confidence scores below auto-publish thresholds or flagged as potential duplicates.
        </p>
      </div>

      <ReviewQueueClient initialItems={items} />
    </div>
  );
}
