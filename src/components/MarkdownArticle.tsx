import { useRef, useState, type ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// Code blocks get a "Copy" button, so tutorial readers can paste commands straight into a terminal.
function CodeBlock(props: ComponentPropsWithoutRef<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const text = ref.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text.replace(/\n$/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: ignore */
    }
  };
  return (
    <div className="relative group">
      <pre ref={ref} {...props} />
      <button
        type="button"
        onClick={copy}
        className="absolute top-2 right-2 font-sans text-xs px-2 py-1 rounded-md bg-white/10 text-white/70 hover:bg-white/20 hover:text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

export function MarkdownArticle({ markdown, className = "" }: { markdown: string; className?: string }) {
  return (
    <div
      className={`prose prose-stone md:prose-lg max-w-none
        prose-headings:font-serif prose-headings:font-normal prose-headings:text-[hsl(30,10%,15%)]
        prose-a:text-[hsl(42,70%,40%)] prose-strong:text-[hsl(30,10%,15%)]
        prose-blockquote:border-l-[hsl(42,70%,50%)] prose-blockquote:not-italic
        prose-code:before:content-none prose-code:after:content-none
        prose-code:bg-[hsl(30,20%,90%)] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-normal
        prose-pre:text-sm prose-pre:bg-[hsl(30,10%,14%)] prose-pre:leading-relaxed
        prose-figure:my-10 prose-img:w-full prose-img:rounded-xl prose-img:border prose-img:border-[hsl(30,15%,85%)] prose-img:bg-white prose-img:p-2
        prose-figcaption:text-center prose-figcaption:text-[hsl(30,10%,45%)]
        [&_pre_code]:bg-transparent [&_pre_code]:p-0 ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          pre: ({ node: _node, ...props }) => <CodeBlock {...props} />,
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
  );
}
