import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { ArrowLeft, Clock, ArrowRight, User } from "lucide-react";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await db.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: "Article Not Found" };
  return {
    title: `${post.title} — CareerForgeX Engineering`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await db.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) notFound();

  return (
    <article className="py-16 lg:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Articles</span>
      </Link>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-2.5 py-0.5 rounded bg-brand-950/80 border border-brand-800/40 text-brand-400 uppercase">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-gray-400">
            <Clock className="w-3.5 h-3.5" />
            {post.readingTime}
          </span>
          {!post.published && (
            <span className="px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800/50 text-amber-300">
              Draft Mode
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="pt-2 flex items-center gap-2 text-xs text-gray-400 font-mono">
          <User className="w-3.5 h-3.5 text-brand-400" />
          <span>By {post.author}</span>
        </div>
      </div>

      {/* Article Markdown Body */}
      <div className="p-8 sm:p-10 rounded-2xl bg-dark-card border border-dark-border leading-relaxed text-sm text-gray-300 space-y-6 prose prose-invert max-w-none">
        {post.content.split("\n\n").map((block: string, idx: number) => {
          if (block.startsWith("## ")) {
            return (
              <h2 key={idx} className="text-xl sm:text-2xl font-bold text-white pt-4 pb-1 border-b border-dark-border">
                {block.replace("## ", "")}
              </h2>
            );
          }
          if (block.startsWith("### ")) {
            return (
              <h3 key={idx} className="text-lg font-bold text-white pt-2">
                {block.replace("### ", "")}
              </h3>
            );
          }
          return (
            <p key={idx} className="leading-relaxed text-gray-300">
              {block}
            </p>
          );
        })}
      </div>

      {/* Author & Audit Callout */}
      <div className="p-8 rounded-2xl bg-dark-card border border-dark-border flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-white">Want to apply these architectural patterns?</h3>
          <p className="text-xs text-gray-400 mt-1">
            Book a 30-minute discovery session with our Lead AI Architects to review your business pipelines.
          </p>
        </div>
        <Link
          href="/book"
          className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-brand-600/30 shrink-0"
        >
          <span>Schedule Systems Audit</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
