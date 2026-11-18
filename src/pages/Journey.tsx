import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Nav } from "@/components/Nav";
import { journeyPosts, formatDate } from "@/lib/journey";

type Filter = "all" | "story" | "tutorial";

export default function Journey() {
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "My AI Agent Journey – Htet Aung Lin";
    return () => {
      document.title = "Htet Aung Lin – AI & Machine Learning Portfolio";
    };
  }, []);

  const posts = journeyPosts.filter((p) => filter === "all" || p.type === filter);
  const counts = {
    all: journeyPosts.length,
    story: journeyPosts.filter((p) => p.type === "story").length,
    tutorial: journeyPosts.filter((p) => p.type === "tutorial").length,
  };

  return (
    <div className="min-h-screen bg-[hsl(30,25%,95%)]">
      <Nav />
      <main className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-[hsl(42,70%,40%)]">Blog &amp; tutorials</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl leading-tight text-[hsl(30,10%,15%)] tracking-tight">
            My AI Agent Journey
          </h1>
          <p className="mt-6 font-serif text-xl md:text-2xl text-[hsl(30,10%,35%)] leading-relaxed">
            Notes from building a personal AI agent on my MacBook: what I set up, what broke, how I fixed it, and
            step-by-step tutorials so you can build the same thing.
          </p>

          <div className="mt-10 flex flex-wrap gap-2 font-sans text-sm" role="tablist" aria-label="Filter posts">
            {(["all", "story", "tutorial"] as Filter[]).map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full border transition-colors ${
                  filter === f
                    ? "bg-[hsl(30,10%,15%)] text-[hsl(30,25%,95%)] border-[hsl(30,10%,15%)]"
                    : "border-[hsl(30,15%,82%)] text-[hsl(30,10%,40%)] hover:border-[hsl(30,10%,40%)]"
                }`}
              >
                {f === "all" ? "All" : f === "story" ? "Stories" : "Tutorials"} · {counts[f]}
              </button>
            ))}
          </div>

          {posts.length === 0 ? (
            <p className="mt-16 font-sans text-[hsl(30,10%,50%)]">First posts coming soon.</p>
          ) : (
            <ol className="mt-12 divide-y divide-[hsl(30,15%,85%)] border-t border-[hsl(30,15%,85%)]">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link to={`/journey/${post.slug}`} className="group block py-8">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs uppercase tracking-wider text-[hsl(30,10%,50%)]">
                      <span className="text-[hsl(42,70%,40%)]">Part {post.order}</span>
                      <span aria-hidden>·</span>
                      <span>{post.type === "tutorial" ? "Tutorial" : "Story"}</span>
                      {post.date && !post.comingSoon && (
                        <>
                          <span aria-hidden>·</span>
                          <time dateTime={post.date}>{formatDate(post.date)}</time>
                        </>
                      )}
                      <span aria-hidden>·</span>
                      {post.comingSoon ? (
                        <span className="px-2 py-0.5 rounded-full bg-[hsl(42,70%,90%)] text-[hsl(42,70%,30%)]">Coming soon</span>
                      ) : (
                        <span>{post.readingMinutes} min read</span>
                      )}
                    </div>
                    <h2 className="mt-3 font-serif text-2xl md:text-3xl text-[hsl(30,10%,15%)] group-hover:text-[hsl(42,70%,40%)] transition-colors">
                      {post.title}
                    </h2>
                    {post.summary && (
                      <p className="mt-3 font-sans text-base text-[hsl(30,10%,35%)] leading-relaxed">{post.summary}</p>
                    )}
                    {post.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-sans text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[hsl(30,15%,82%)] text-[hsl(30,10%,45%)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </motion.div>
      </main>
    </div>
  );
}
