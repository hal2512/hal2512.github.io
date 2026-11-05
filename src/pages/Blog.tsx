import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { personalInfo } from "@/data/portfolio-data";
import { blogPosts } from "@/data/blog-data";
import { Nav } from "@/components/Nav";

export default function Blog() {
  return (
    <div className="min-h-screen bg-[hsl(30,25%,95%)]">
      <Nav />
      
      {/* Hero Header */}
      <div className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[hsl(30,10%,15%)] tracking-tight">
            <span className="inline-flex items-center gap-4">
              <motion.span
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden"
              >
                <img
                  src={personalInfo.avatar}
                  alt="Elena"
                  className="w-full h-full object-cover"
                />
              </motion.span>
              <span className="italic text-[hsl(42,70%,50%)]">Thoughts</span>
            </span>
          </h1>
          <p className="mt-6 text-lg text-[hsl(30,10%,40%)] font-sans max-w-xl mx-auto">
            Essays on writing, creativity, and the craft of storytelling.
          </p>
        </motion.div>
      </div>

      {/* Blog Posts */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-3xl mx-auto space-y-12">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/blog/${post.slug}`} className="block">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 text-sm text-[hsl(30,10%,50%)] font-sans mb-2">
                      <time>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
                      <span className="text-[hsl(42,70%,50%)]">✦</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl text-[hsl(30,10%,15%)] group-hover:text-[hsl(42,70%,45%)] transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-[hsl(30,10%,40%)] font-sans leading-relaxed">
                      {post.excerpt}
                    </p>
                    <span className="inline-block mt-4 text-[hsl(42,70%,45%)] font-sans text-sm tracking-wide">
                      Read more →
                    </span>
                  </div>
                  <div className="w-full md:w-48 h-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0 order-first md:order-last">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
