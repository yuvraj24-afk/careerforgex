import Link from "next/link";
import { db } from "@/lib/db";
import { ArrowRight, BookOpen, Clock, Tag } from "lucide-react";

export const metadata = {
  title: "Engineering Blog & Technical Insights",
  description: "Deep-dives into AI agent orchestration, deterministic workflows, RAG architecture, and human-in-the-loop systems design.",
};

export default async function BlogIndexPage() {
  let posts: any[] = [];
  try {
    posts = await db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // db fallback
  }

  return (
    <div className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-400 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" />
          <span>ENGINEERING DISPATCHES</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          AI Architecture & Automation Insights.
        </h1>
        <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
          Architectural deep-dives, benchmark comparisons, and practical engineering guides on deploying
          autonomous systems inside modern businesses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="rounded-2xl bg-dark-card border border-dark-border p-7 hover:border-brand-500/50 hover:bg-dark-elevated transition-all flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-3 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-brand-950/70 border border-brand-800/40 text-brand-400 uppercase">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-3 h-3" />
                  {post.readingTime}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors mt-2 leading-snug">
                {post.title}
              </h2>

              <p className="text-xs text-gray-400 mt-3 leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-dark-border/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {!post.published && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40 text-amber-300">
                    Draft Preview
                  </span>
                )}
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                <span>Read Article</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
