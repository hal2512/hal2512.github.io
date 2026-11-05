import { motion } from "framer-motion";
import { useState } from "react";
import { personalInfo } from "@/data/portfolio-data";
import { toast } from "sonner";
import { Nav } from "@/components/Nav";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("Message sent! I'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
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
            <span className="inline-flex items-center justify-center flex-wrap gap-x-4 gap-y-2">
              <span className="opacity-60">"</span>Let's
              <motion.span
                initial={{ scale: 0.8, opacity: 0, y: 0 }}
                animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
                transition={{
                  scale: { delay: 0.3, duration: 0.5 },
                  opacity: { delay: 0.3, duration: 0.5 },
                  y: { delay: 0.8, duration: 3, repeat: Infinity, ease: "easeInOut" },
                }}
                className="inline-block w-14 h-14 md:w-18 md:h-18 rounded-xl overflow-hidden align-middle mx-1"
              >
                <img
                  src={personalInfo.avatar}
                  alt="Elena"
                  className="w-full h-full object-cover"
                />
              </motion.span>
              <span className="text-[hsl(42,70%,50%)] italic">talk</span>
              <span className="opacity-60">"</span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-[hsl(30,10%,40%)] font-sans text-lg mb-12 max-w-md mx-auto"
          >
            Have a project in mind? I'd love to hear about it.
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
                htmlFor="email"
                className="block text-xs uppercase tracking-wider text-[hsl(30,10%,40%)] mb-2 font-sans"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                maxLength={255}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-0 py-3 bg-transparent border-b-2 border-[hsl(30,15%,80%)] focus:border-[hsl(42,70%,50%)] outline-none font-serif text-xl text-[hsl(30,10%,15%)] placeholder:text-[hsl(30,10%,60%)] transition-colors"
                placeholder="your@email.com"
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
                placeholder="Tell me about your project..."
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-8 px-8 py-4 bg-[hsl(30,10%,15%)] text-[hsl(30,25%,95%)] rounded-full font-sans text-sm tracking-wide hover:bg-[hsl(30,10%,25%)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Message →"}
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
              <p className="mt-1">{personalInfo.email}</p>
            </div>
            <div>
              <span className="uppercase tracking-wider text-xs opacity-60">Phone</span>
              <p className="mt-1">{personalInfo.phone}</p>
            </div>
            <div>
              <span className="uppercase tracking-wider text-xs opacity-60">Location</span>
              <p className="mt-1">{personalInfo.location.city}</p>
            </div>
          </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
