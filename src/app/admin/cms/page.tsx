import { db } from "@/lib/db";
import { FileEdit, Plus, BookOpen, HelpCircle, Workflow, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCmsPage() {
  const posts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  const caseStudies = await db.caseStudy.findMany({ orderBy: { createdAt: "desc" } });
  const faqs = await db.fAQItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white">Content & Knowledge CMS</h1>
        <p className="text-xs text-gray-400 mt-1">
          Manage database-backed engineering articles, example case study workflows, and FAQs.
        </p>
      </div>

      {/* Blog Articles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-400" />
            <span>Blog Articles ({posts.length})</span>
          </h2>
        </div>

        <div className="rounded-2xl bg-dark-card border border-dark-border overflow-hidden divide-y divide-dark-border/60">
          {posts.map((post) => (
            <div key={post.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-mono text-[10px] text-brand-400 uppercase">{post.category}</span>
                <div className="font-semibold text-white mt-0.5">{post.title}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{post.excerpt.slice(0, 100)}...</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                  post.published ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800/40" :
                  "bg-amber-950/70 text-amber-300 border border-amber-800/40"
                }`}>
                  {post.published ? "Published" : "Draft"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Studies */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Workflow className="w-4 h-4 text-accent-cyan" />
          <span>Case Studies & Workflows ({caseStudies.length})</span>
        </h2>

        <div className="rounded-2xl bg-dark-card border border-dark-border overflow-hidden divide-y divide-dark-border/60">
          {caseStudies.map((cs) => (
            <div key={cs.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-mono text-[10px] text-accent-cyan uppercase">{cs.industry}</span>
                <div className="font-semibold text-white mt-0.5">{cs.title}</div>
                <div className="text-[11px] text-gray-400 mt-0.5 font-mono">{cs.tools}</div>
              </div>
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-950/70 text-emerald-400 border border-emerald-800/40">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-purple-400" />
          <span>Searchable FAQs ({faqs.length})</span>
        </h2>

        <div className="rounded-2xl bg-dark-card border border-dark-border overflow-hidden divide-y divide-dark-border/60">
          {faqs.map((faq) => (
            <div key={faq.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-mono text-[10px] text-gray-500 uppercase">{faq.category}</span>
                <div className="font-semibold text-white mt-0.5">{faq.question}</div>
              </div>
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-dark-elevated text-gray-400 border border-dark-border">
                Order: #{faq.order}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
