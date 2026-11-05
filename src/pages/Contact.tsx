import { motion } from "framer-motion";
import { useState } from "react";
import { personalInfo, socialLinks } from "@/data/portfolio-data";
import { Nav } from "@/components/Nav";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });

  // No backend: open the visitor's own mail client with the message pre-filled.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact from ${formData.name}`);
    const body = encodeURIComponent(`${formData.message}\n\n— ${formData.name}`);
    window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-[hsl(30,25%,95%)]">
      <Nav />
      <div className="flex items-center justify-center min-h-[calc(100vh-44px)]">
        <div className="container mx-auto px-4 py-16">
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Editorial Header */}
          <h1 className="font-serif text-5xl md:text-7xl leading-tight text-[hsl(30,10%,15%)] tracking-tight mb-4">
            Get in <span className="text-[hsl(42,70%,50%)] italic">touch</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-[hsl(30,10%,40%)] font-sans text-lg mb-12 max-w-md mx-auto"
          >
            Hiring for an AI, ML or data science internship or working-student role? I'd love to hear from you.
          </motion.p>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-6 text-left"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-xs uppercase tracking-wider text-[hsl(30,10%,40%)] mb-2 font-sans"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                maxLength={100}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-0 py-3 bg-transparent border-b-2 border-[hsl(30,15%,80%)] focus:border-[hsl(42,70%,50%)] outline-none font-serif text-xl text-[hsl(30,10%,15%)] placeholder:text-[hsl(30,10%,60%)] transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-xs uppercase tracking-wider text-[hsl(30,10%,40%)] mb-2 font-sans"
              >
                Message
              </label>
              <textarea
                id="message"
                required
                maxLength={1000}
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-0 py-3 bg-transparent border-b-2 border-[hsl(30,15%,80%)] focus:border-[hsl(42,70%,50%)] outline-none font-serif text-xl text-[hsl(30,10%,15%)] placeholder:text-[hsl(30,10%,60%)] transition-colors resize-none"
                placeholder="Share a few details about the role, or paste a link to the job posting…"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-8 px-8 py-4 bg-[hsl(30,10%,15%)] text-[hsl(30,25%,95%)] rounded-full font-sans text-sm tracking-wide hover:bg-[hsl(30,10%,25%)] transition-colors"
            >
              Open in email app →
            </motion.button>
          </motion.form>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-[hsl(30,10%,40%)] font-sans"
          >
            <div>
              <span className="uppercase tracking-wider text-xs opacity-60">Email</span>
              <p className="mt-1">
                <a href={`mailto:${personalInfo.email}`} className="hover:text-[hsl(42,70%,45%)]">{personalInfo.email}</a>
              </p>
            </div>
            {socialLinks.map((link) => (
              <div key={link.platform}>
                <span className="uppercase tracking-wider text-xs opacity-60">{link.platform}</span>
                <p className="mt-1">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-[hsl(42,70%,45%)]">{link.username}</a>
                </p>
              </div>
            ))}
            <div>
              <span className="uppercase tracking-wider text-xs opacity-60">Location</span>
              <p className="mt-1">{personalInfo.location.city}, {personalInfo.location.country}</p>
            </div>
          </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
