import { motion } from "framer-motion";
import { Nav } from "@/components/Nav";

export default function EditorialStyleGuide() {
  return (
    <div className="min-h-screen bg-[hsl(30,25%,95%)]">
      <Nav />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <h1 className="font-serif text-5xl md:text-6xl text-[hsl(30,10%,15%)] tracking-tight">
            Editorial <span className="italic text-[hsl(42,70%,50%)]">Style Guide</span>
          </h1>
          <p className="mt-6 font-sans text-lg text-[hsl(30,10%,40%)] max-w-2xl">
            A warm, typography-focused design system built for writers, creatives, and personal brands.
          </p>
        </motion.div>

        {/* Colors */}
        <Section title="Colors">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorSwatch 
              name="Background" 
              color="hsl(30,25%,95%)" 
              textColor="hsl(30,10%,15%)"
              code="hsl(30,25%,95%)"
            />
            <ColorSwatch 
              name="Primary Text" 
              color="hsl(30,10%,15%)" 
              textColor="hsl(30,25%,95%)"
              code="hsl(30,10%,15%)"
            />
            <ColorSwatch 
              name="Accent Gold" 
              color="hsl(42,70%,50%)" 
              textColor="hsl(30,10%,15%)"
              code="hsl(42,70%,50%)"
            />
            <ColorSwatch 
              name="Muted Text" 
              color="hsl(30,10%,50%)" 
              textColor="hsl(30,25%,95%)"
              code="hsl(30,10%,50%)"
            />
            <ColorSwatch 
              name="Border" 
              color="hsl(30,15%,88%)" 
              textColor="hsl(30,10%,15%)"
              code="hsl(30,15%,88%)"
            />
            <ColorSwatch 
              name="Card BG" 
              color="hsl(30,20%,92%)" 
              textColor="hsl(30,10%,15%)"
              code="hsl(30,20%,92%)"
            />
            <ColorSwatch 
              name="Input Border" 
              color="hsl(30,15%,80%)" 
              textColor="hsl(30,10%,15%)"
              code="hsl(30,15%,80%)"
            />
            <ColorSwatch 
              name="Hover Gold" 
              color="hsl(42,70%,45%)" 
              textColor="hsl(30,25%,95%)"
              code="hsl(42,70%,45%)"
            />
          </div>
        </Section>

        {/* Typography */}
        <Section title="Typography">
          <div className="space-y-8">
            <div>
              <Label>Display / Hero — Serif</Label>
              <p className="font-serif text-5xl md:text-7xl text-[hsl(30,10%,15%)] tracking-tight mt-2">
                I'm <span className="italic text-[hsl(42,70%,50%)]">Elena</span>
              </p>
            </div>
            <div>
              <Label>Headline — Serif</Label>
              <p className="font-serif text-4xl md:text-5xl text-[hsl(30,10%,15%)] tracking-tight mt-2">
                The Art of Storytelling
              </p>
            </div>
            <div>
              <Label>Subheadline — Serif Italic</Label>
              <p className="font-serif text-2xl md:text-3xl text-[hsl(30,10%,50%)] italic mt-2">
                Crafting narratives that resonate
              </p>
            </div>
            <div>
              <Label>Body — Sans Serif</Label>
              <p className="font-sans text-base text-[hsl(30,10%,40%)] leading-relaxed mt-2 max-w-xl">
                Stories have been the backbone of human communication since the dawn of civilization. From cave paintings to digital screens, our need to share narratives remains unchanged.
              </p>
            </div>
            <div>
              <Label>Small / Meta — Sans Serif</Label>
              <p className="font-sans text-sm text-[hsl(30,10%,50%)] mt-2">
                January 15, 2024 · 5 min read · 3 comments
              </p>
            </div>
            <div>
              <Label>Label — Sans Uppercase</Label>
              <p className="font-sans text-xs uppercase tracking-wider text-[hsl(30,10%,40%)] mt-2">
                Location · Email · Phone
              </p>
            </div>
          </div>
        </Section>

        {/* Inline Images */}
        <Section title="Floating Inline Images">
          <p className="font-sans text-[hsl(30,10%,40%)] mb-6">
            Images float gently with staggered timing for a delightful, organic feel.
          </p>
          <div className="flex items-center gap-6 flex-wrap">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 rounded-2xl overflow-hidden"
            >
              <img
                src="https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop"
                alt="Sample"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="w-16 h-16 rounded-xl overflow-hidden"
            >
              <img
                src="https://images.pexels.com/photos/1766604/pexels-photo-1766604.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop"
                alt="Sample"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="w-14 h-14 rounded-lg overflow-hidden"
            >
              <img
                src="https://images.pexels.com/photos/1172018/pexels-photo-1172018.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop"
                alt="Sample"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
          <div className="mt-6 font-sans text-sm text-[hsl(30,10%,50%)]">
            <code className="bg-[hsl(30,20%,90%)] px-2 py-1 rounded">y: [0, -6, 0]</code> with <code className="bg-[hsl(30,20%,90%)] px-2 py-1 rounded">duration: 3s</code>, <code className="bg-[hsl(30,20%,90%)] px-2 py-1 rounded">ease: easeInOut</code>
          </div>
        </Section>

        {/* Links */}
        <Section title="Links">
          <div className="space-y-6">
            <div>
              <Label>Editorial Links — Serif</Label>
              <div className="flex flex-wrap gap-8 mt-3">
                <a href="#" className="font-serif text-2xl text-[hsl(30,10%,50%)] hover:text-[hsl(42,70%,45%)] transition-colors italic">
                  New York
                </a>
                <a href="#" className="font-serif text-2xl text-[hsl(30,10%,50%)] hover:text-[hsl(42,70%,45%)] transition-colors">
                  hello@elena.com
                </a>
                <a href="#" className="font-serif text-2xl text-[hsl(30,10%,50%)] hover:text-[hsl(42,70%,45%)] transition-colors italic">
                  +1 555 0123
                </a>
              </div>
            </div>
            <div>
              <Label>Text Links — Sans</Label>
              <div className="flex flex-wrap gap-6 mt-3">
                <a href="#" className="font-sans text-sm text-[hsl(30,10%,50%)] hover:text-[hsl(30,10%,15%)] transition-colors">
                  ← Back to Blog
                </a>
                <a href="#" className="font-sans text-sm text-[hsl(42,70%,45%)] hover:text-[hsl(42,70%,40%)] transition-colors">
                  Read more →
                </a>
              </div>
            </div>
          </div>
        </Section>

        {/* Buttons */}
        <Section title="Buttons">
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-[hsl(30,10%,15%)] text-[hsl(30,25%,95%)] rounded-full font-sans text-sm tracking-wide hover:scale-105 transition-transform">
              Primary Button
            </button>
            <button className="px-8 py-4 border-2 border-[hsl(30,10%,15%)] text-[hsl(30,10%,15%)] rounded-full font-sans text-sm tracking-wide hover:bg-[hsl(30,10%,15%)] hover:text-[hsl(30,25%,95%)] transition-all">
              Secondary Button
            </button>
          </div>
        </Section>

        {/* Form Elements */}
        <Section title="Form Elements">
          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[hsl(30,10%,40%)] mb-2 font-sans">
                Text Input
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-0 py-3 bg-transparent border-b-2 border-[hsl(30,15%,80%)] focus:border-[hsl(42,70%,50%)] outline-none font-serif text-xl text-[hsl(30,10%,15%)] placeholder:text-[hsl(30,10%,60%)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-sans text-[hsl(30,10%,40%)] mb-2">
                Alternative Label Style
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-transparent border-b-2 border-[hsl(30,15%,80%)] py-3 font-sans text-[hsl(30,10%,15%)] focus:border-[hsl(42,70%,50%)] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[hsl(30,10%,40%)] mb-2 font-sans">
                Textarea
              </label>
              <textarea
                rows={3}
                placeholder="Tell me about your project..."
                className="w-full px-0 py-3 bg-transparent border-b-2 border-[hsl(30,15%,80%)] focus:border-[hsl(42,70%,50%)] outline-none font-serif text-xl text-[hsl(30,10%,15%)] placeholder:text-[hsl(30,10%,60%)] transition-colors resize-none"
              />
            </div>
          </div>
        </Section>

        {/* Cards */}
        <Section title="Cards">
          <div className="space-y-6">
            <div className="bg-[hsl(30,20%,92%)] rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-sans font-medium text-[hsl(30,10%,15%)]">Comment Author</span>
                <time className="text-sm text-[hsl(30,10%,50%)] font-sans">Jan 15, 2024</time>
              </div>
              <p className="font-sans text-[hsl(30,10%,35%)] leading-relaxed">
                This is a comment card style used in the blog post comments section.
              </p>
            </div>
          </div>
        </Section>

        {/* Navigation */}
        <Section title="Navigation">
          <div className="h-[44px] flex items-center justify-center bg-[hsl(30,25%,95%)] border border-[hsl(30,15%,88%)] rounded-lg">
            <div className="flex items-center gap-8">
              <span className="font-sans text-sm tracking-wide text-[hsl(30,10%,15%)]">Resume</span>
              <span className="font-sans text-sm tracking-wide text-[hsl(30,10%,50%)]">Blog</span>
              <span className="font-sans text-sm tracking-wide text-[hsl(30,10%,50%)]">Contact</span>
            </div>
          </div>
          <p className="mt-3 font-sans text-sm text-[hsl(30,10%,50%)]">
            44px height, centered, minimal styling
          </p>
        </Section>

        {/* Spacing */}
        <Section title="Spacing Scale">
          <div className="space-y-3 font-sans text-sm text-[hsl(30,10%,40%)]">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-[hsl(42,70%,50%)]" />
              <span>4px — gap-1</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-4 bg-[hsl(42,70%,50%)]" />
              <span>8px — gap-2</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-4 bg-[hsl(42,70%,50%)]" />
              <span>16px — gap-4, py-4</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 h-4 bg-[hsl(42,70%,50%)]" />
              <span>24px — gap-6</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 h-4 bg-[hsl(42,70%,50%)]" />
              <span>32px — gap-8</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-48 h-4 bg-[hsl(42,70%,50%)]" />
              <span>48px — gap-12</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-64 h-4 bg-[hsl(42,70%,50%)]" />
              <span>64px — mt-16</span>
            </div>
          </div>
        </Section>

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-20"
    >
      <h2 className="font-serif text-3xl text-[hsl(30,10%,15%)] mb-8 pb-4 border-b border-[hsl(30,15%,85%)]">
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-sans text-xs uppercase tracking-wider text-[hsl(30,10%,50%)]">
      {children}
    </span>
  );
}

function ColorSwatch({ name, color, textColor, code }: { name: string; color: string; textColor: string; code: string }) {
  return (
    <div 
      className="rounded-xl p-4 h-28 flex flex-col justify-between"
      style={{ backgroundColor: color, color: textColor }}
    >
      <span className="font-sans text-sm font-medium">{name}</span>
      <span className="font-mono text-xs opacity-80">{code}</span>
    </div>
  );
}
