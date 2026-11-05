import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { projects } from "@/data/portfolio-data";
import { Nav } from "@/components/Nav";
import { ProjectMeta } from "@/components/ProjectMeta";
import NotFound from "./NotFound";

// Each project's write-up lives in src/content/projects/<project id>.md
const writeUps = import.meta.glob("../content/projects/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.id === slug);
  const markdown = writeUps[`../content/projects/${slug}.md`];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (project) document.title = `${project.name} – Htet Aung Lin`;
    return () => {
      document.title = "Htet Aung Lin – AI & Machine Learning Portfolio";
    };
  }, [project]);

  if (!project) return <NotFound />;

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
            to="/#projects"
            className="font-sans text-sm text-[hsl(30,10%,50%)] hover:text-[hsl(42,70%,45%)] transition-colors"
          >
            ← All projects
          </Link>

          <h1 className="mt-8 font-serif text-4xl md:text-6xl leading-tight text-[hsl(30,10%,15%)] tracking-tight">
            {project.name}
          </h1>
          <ProjectMeta project={project} className="mt-4" />
          <p className="mt-6 font-serif text-xl md:text-2xl text-[hsl(30,10%,35%)] leading-relaxed">
            {project.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="font-sans text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-[hsl(30,15%,82%)] text-[hsl(30,10%,40%)]"
              >
                {tech}
              </span>
            ))}
          </div>
          {(project.githubUrl || project.liveUrl) && (
            <div className="mt-6 flex gap-6 font-sans text-sm">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[hsl(42,70%,45%)] hover:underline">View code →</a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[hsl(42,70%,45%)] hover:underline">Live demo →</a>
              )}
            </div>
          )}

          {markdown && (
            <div
              className="mt-16 pt-12 border-t border-[hsl(30,15%,85%)] prose prose-stone md:prose-lg max-w-none
                prose-headings:font-serif prose-headings:font-normal prose-headings:text-[hsl(30,10%,15%)]
                prose-a:text-[hsl(42,70%,40%)] prose-strong:text-[hsl(30,10%,15%)]
                prose-blockquote:border-l-[hsl(42,70%,50%)] prose-blockquote:not-italic
                prose-code:before:content-none prose-code:after:content-none
                prose-pre:text-sm
                prose-figure:my-10 prose-img:w-full prose-img:rounded-xl prose-img:border prose-img:border-[hsl(30,15%,85%)] prose-img:bg-white prose-img:p-2
                prose-figcaption:text-center prose-figcaption:text-[hsl(30,10%,45%)]"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  // Wide tables scroll sideways on phones instead of overflowing the page
                  table: ({ node: _node, ...props }) => (
                    <div className="overflow-x-auto">
                      <table {...props} />
                    </div>
                  ),
                  a: ({ node: _node, href, ...props }) =>
                    href?.startsWith("http") ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
                    ) : (
                      <a href={href} {...props} />
                    ),
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          )}

          <div className="mt-20 pt-8 border-t border-[hsl(30,15%,85%)] flex justify-between font-sans text-sm">
            <Link to="/#projects" className="text-[hsl(30,10%,50%)] hover:text-[hsl(42,70%,45%)] transition-colors">
              ← All projects
            </Link>
            <Link to="/contact" className="text-[hsl(30,10%,50%)] hover:text-[hsl(42,70%,45%)] transition-colors">
              Get in touch →
            </Link>
          </div>
        </motion.div>
      </article>
    </div>
  );
}
