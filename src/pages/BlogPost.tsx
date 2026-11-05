import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams, Navigate } from "react-router-dom";
import { personalInfo } from "@/data/portfolio-data";
import { blogPosts, Comment } from "@/data/blog-data";
import { useToast } from "@/hooks/use-toast";
import { Nav } from "@/components/Nav";

export default function BlogPost() {
  const { slug } = useParams();
  const { toast } = useToast();
  const post = blogPosts.find(p => p.slug === slug);
  
  const [comments, setComments] = useState<Comment[]>(post?.comments || []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !comment.trim()) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newComment: Comment = {
      id: `c${Date.now()}`,
      author: name.trim(),
      email: email.trim(),
      content: comment.trim(),
      date: new Date().toISOString().split('T')[0]
    };
    
    setComments(prev => [...prev, newComment]);
    setName("");
    setEmail("");
    setComment("");
    setIsSubmitting(false);
    
    toast({
      title: "Comment posted!",
      description: "Thank you for sharing your thoughts."
    });
  };

  return (
    <div className="min-h-screen bg-[hsl(30,25%,95%)]">
      <Nav />
      
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          {/* Breadcrumb */}
          <nav className="flex items-center gap-3 mb-8 font-sans text-sm">
            <Link 
              to="/hero-11" 
              className="text-[hsl(30,10%,50%)] hover:text-[hsl(42,70%,50%)] transition-colors"
            >
              Home
            </Link>
            <span className="text-[hsl(42,70%,50%)]">✦</span>
            <Link 
              to="/blog" 
              className="text-[hsl(30,10%,50%)] hover:text-[hsl(42,70%,50%)] transition-colors"
            >
              Blog
            </Link>
            <span className="text-[hsl(42,70%,50%)]">✦</span>
            <span className="text-[hsl(30,10%,30%)] truncate max-w-[200px]">{post.title}</span>
          </nav>

          {/* Post Header */}
          <div className="flex items-center gap-3 text-sm text-[hsl(30,10%,50%)] font-sans mb-4">
            <time>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
            <span className="text-[hsl(42,70%,50%)]">✦</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[hsl(30,10%,15%)] tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Author */}
          <div className="mt-8 flex items-center gap-4">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 rounded-full overflow-hidden"
            >
              <img
                src={personalInfo.avatar}
                alt={personalInfo.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="font-sans">
              <p className="text-[hsl(30,10%,15%)] font-medium">{personalInfo.name}</p>
              <p className="text-sm text-[hsl(30,10%,50%)]">{personalInfo.title}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Featured Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="container mx-auto px-4"
      >
        <div className="max-w-4xl mx-auto h-64 md:h-96 rounded-2xl overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* Content */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="max-w-2xl mx-auto">
          <div className="prose prose-lg font-sans text-[hsl(30,10%,30%)] leading-relaxed">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-6">{paragraph}</p>
            ))}
          </div>
          
          {/* End of article */}
          <div className="mt-12 text-center text-[hsl(42,70%,50%)]">
            ✦ ✦ ✦
          </div>
        </div>
      </motion.article>

      {/* Comments Section */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <div className="border-t border-[hsl(30,15%,85%)] pt-12">
            <h2 className="font-serif text-2xl text-[hsl(30,10%,15%)]">
              {comments.length > 0 ? `${comments.length} Comment${comments.length !== 1 ? 's' : ''}` : 'Leave a Comment'}
            </h2>

            {/* Existing Comments */}
            {comments.length > 0 && (
              <div className="mt-8 space-y-6">
                {comments.map((c, index) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[hsl(30,20%,92%)] rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-sans font-medium text-[hsl(30,10%,15%)]">{c.author}</span>
                      <time className="text-sm text-[hsl(30,10%,50%)] font-sans">
                        {new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </time>
                    </div>
                    <p className="font-sans text-[hsl(30,10%,35%)] leading-relaxed">{c.content}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-sans text-[hsl(30,10%,40%)] mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-[hsl(30,15%,80%)] py-3 font-sans text-[hsl(30,10%,15%)] focus:border-[hsl(42,70%,50%)] focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-sans text-[hsl(30,10%,40%)] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-[hsl(30,15%,80%)] py-3 font-sans text-[hsl(30,10%,15%)] focus:border-[hsl(42,70%,50%)] focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-sans text-[hsl(30,10%,40%)] mb-2">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full bg-transparent border-b-2 border-[hsl(30,15%,80%)] py-3 font-sans text-[hsl(30,10%,15%)] focus:border-[hsl(42,70%,50%)] focus:outline-none transition-colors resize-none"
                  placeholder="Share your thoughts..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-4 bg-[hsl(30,10%,15%)] text-[hsl(30,25%,95%)] rounded-full font-sans text-sm tracking-wide hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
