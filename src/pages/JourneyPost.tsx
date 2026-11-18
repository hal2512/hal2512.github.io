import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Nav } from "@/components/Nav";
import { MarkdownArticle } from "@/components/MarkdownArticle";
import { journeyPosts, formatDate } from "@/lib/journey";
import NotFound from "./NotFound";

export default function JourneyPost() {
  const { slug } = useParams();
  const index = journeyPosts.findIndex((p) => p.slug === slug);
  const post = index >= 0 ? journeyPosts[index] : undefined;
  const prev = index > 0 ? journeyPosts[index - 1] : undefined;
  const next = index >= 0 && index < journeyPosts.length - 1 ? journeyPosts[index + 1] : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (post) document.title = `${post.title} – Htet Aung Lin`;
    return () => {
      document.title = "Htet Aung Lin – AI & Machine Learning Portfolio";
    };
  }, [post]);

  if (!post) return <NotFound />;

  return (
    <div className="min-h-screen bg-[hsl(30,25%,95%)]">
      <Nav />
      <article className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <Link
            to="/journey"
            className="font-sans text-sm text-[hsl(30,10%,50%)] hover:text-[hsl(42,70%,45%)] transition-colors"
          >
            ← My AI Agent Journey
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs uppercase tracking-wider text-[hsl(30,10%,50%)]">
            <span className="text-[hsl(42,70%,40%)]">
              Part {post.order} of {journeyPosts.length}
            </span>
            <span aria-hidden>·</span>
            <span>{post.type === "tutorial" ? "Tutorial" : "Story"}</span>
            {post.date && (
              <>
                <span aria-hidden>·</span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </>
            )}
            <span aria-hidden>·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl leading-tight text-[hsl(30,10%,15%)] tracking-tight">
            {post.title}
          </h1>
          {post.summary && (
            <p className="mt-6 font-serif text-xl md:text-2xl text-[hsl(30,10%,35%)] leading-relaxed">{post.summary}</p>
          )}
          {post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-sans text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-[hsl(30,15%,82%)] text-[hsl(30,10%,40%)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <MarkdownArticle markdown={post.body} className="mt-16 pt-12 border-t border-[hsl(30,15%,85%)]" />

          <nav
            aria-label="More posts"
            className="mt-20 pt-8 border-t border-[hsl(30,15%,85%)] grid grid-cols-2 gap-6 font-sans text-sm"
          >
            <div>
              {prev && (
                <Link to={`/journey/${prev.slug}`} className="group block">
                  <span className="text-[hsl(30,10%,50%)]">← Previous</span>
                  <span className="mt-1 block font-serif text-lg text-[hsl(30,10%,15%)] group-hover:text-[hsl(42,70%,40%)] transition-colors">
                    {prev.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="text-right">
              {next && (
                <Link to={`/journey/${next.slug}`} className="group block">
                  <span className="text-[hsl(30,10%,50%)]">Next →</span>
                  <span className="mt-1 block font-serif text-lg text-[hsl(30,10%,15%)] group-hover:text-[hsl(42,70%,40%)] transition-colors">
                    {next.title}
                  </span>
                </Link>
              )}
            </div>
          </nav>
        </motion.div>
      </article>
    </div>
  );
}
