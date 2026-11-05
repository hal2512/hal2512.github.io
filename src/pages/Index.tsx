import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { personalInfo, experience, skillCategories, education, languages } from "@/data/portfolio-data";
import { Nav } from "@/components/Nav";

const sections = [
  { id: "intro", label: "Intro" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "languages", label: "Languages" },
];

// Reusable decorative star component
const Star = ({ active = false, className = "" }: { active?: boolean; className?: string }) => (
  <span className={`transition-all duration-300 ${active ? "text-[hsl(42,70%,50%)]" : "text-[hsl(30,15%,75%)]"} ${className}`}>
    ✦
  </span>
);

// Reusable link with yellow underline
const EditorialLink = ({ href, children, className = "", external = false }: { 
  href: string; 
  children: React.ReactNode; 
  className?: string;
  external?: boolean;
}) => (
  <a 
    href={href} 
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    className={`relative inline-block group ${className}`}
  >
    <span className="font-serif text-2xl md:text-3xl text-[hsl(30,10%,50%)] group-hover:text-[hsl(42,70%,50%)] transition-colors">
      {children}
    </span>
    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[hsl(42,70%,50%)] transform origin-left transition-transform duration-300" />
  </a>
);

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("intro");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(30,25%,95%)]">
      <Nav />
      
      {/* Editorial Side Nav */}
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
        <ul className="space-y-5">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className="flex items-center gap-4 group"
              >
                <Star active={activeSection === section.id} className="group-hover:text-[hsl(30,10%,50%)]" />
                <span className={`font-serif transition-all duration-300 ${
                  activeSection === section.id 
                    ? "text-[hsl(30,10%,15%)] italic" 
                    : "text-[hsl(30,10%,50%)] group-hover:text-[hsl(42,70%,50%)]"
                }`}>
                  {section.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Hero Section */}
      <section id="intro" className="flex items-center justify-center min-h-[calc(100vh-44px)]">
        <div className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            {/* Editorial Typography with Inline Images */}
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight text-[hsl(30,10%,15%)] tracking-tight">
              <span className="inline-flex items-center justify-center flex-wrap gap-x-4 gap-y-2">
                <span className="opacity-60">"</span>I'm
                <motion.span
                  initial={{ scale: 0.8, opacity: 0, y: 0 }}
                  animate={{ scale: 1, opacity: 1, y: [0, -6, 0] }}
                  transition={{ 
                    scale: { delay: 0.3, duration: 0.5 },
                    opacity: { delay: 0.3, duration: 0.5 },
                    y: { delay: 0.8, duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="inline-block w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden align-middle mx-1"
                >
                  <img
                    src={personalInfo.avatar}
                    alt="Elena portrait"
                    className="w-full h-full object-cover"
                  />
                </motion.span>
                <span className="text-[hsl(42,70%,50%)] italic">{personalInfo.name.split(' ')[0]}</span>
              </span>
              <br />
              <span className="inline-flex items-center justify-center flex-wrap gap-x-4 gap-y-2">
                a
                <motion.span
                  initial={{ scale: 0.8, opacity: 0, y: 0 }}
                  animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
                  transition={{ 
                    scale: { delay: 0.5, duration: 0.5 },
                    opacity: { delay: 0.5, duration: 0.5 },
                    y: { delay: 1.2, duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="inline-block w-14 h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-xl overflow-hidden align-middle mx-1"
                >
                  <img
                    src="https://images.pexels.com/photos/1766604/pexels-photo-1766604.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop"
                    alt="Writing"
                    className="w-full h-full object-cover"
                  />
                </motion.span>
                <span className="text-[hsl(42,70%,50%)]">writer</span>
                who
              </span>
              <br />
              <span className="inline-flex items-center justify-center flex-wrap gap-x-4 gap-y-2">
                crafts
                <motion.span
                  initial={{ scale: 0.8, opacity: 0, y: 0 }}
                  animate={{ scale: 1, opacity: 1, y: [0, -4, 0] }}
                  transition={{ 
                    scale: { delay: 0.7, duration: 0.5 },
                    opacity: { delay: 0.7, duration: 0.5 },
                    y: { delay: 1.5, duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="inline-block w-12 h-12 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-lg overflow-hidden align-middle mx-1"
                >
                  <img
                    src="https://images.pexels.com/photos/1172018/pexels-photo-1172018.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop"
                    alt="Stories"
                    className="w-full h-full object-cover"
                  />
                </motion.span>
                <span className="italic text-[hsl(42,70%,50%)]">stories</span>
                <span className="opacity-60">"</span>
              </span>
            </h1>

            {/* Contact Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-16 flex flex-wrap justify-center gap-12"
            >
              <EditorialLink href={`https://maps.google.com/?q=${encodeURIComponent(personalInfo.location.city)}`} external>
                <span className="italic">{personalInfo.location.city}</span>
              </EditorialLink>
              <EditorialLink href={`mailto:${personalInfo.email}`}>
                {personalInfo.email}
              </EditorialLink>
              <EditorialLink href={`tel:${personalInfo.phone.replace(/\s/g, '')}`}>
                <span className="italic">{personalInfo.phone}</span>
              </EditorialLink>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[hsl(30,10%,15%)] tracking-tight mb-12 flex items-center gap-4">
              <Star active /> About <span className="italic text-[hsl(42,70%,50%)]">me</span>
            </h2>
            <p className="font-serif text-2xl md:text-3xl text-[hsl(30,10%,35%)] leading-relaxed">
              {personalInfo.bio}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 md:py-32 border-t border-[hsl(30,15%,88%)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[hsl(30,10%,15%)] tracking-tight mb-16 flex items-center gap-4">
              <Star active /> What I <span className="italic text-[hsl(42,70%,50%)]">do</span>
            </h2>
            
            <div className="space-y-12">
              {skillCategories.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="font-sans text-xs uppercase tracking-wider text-[hsl(30,10%,50%)] mb-4 flex items-center gap-2">
                    <Star className="text-xs" /> {category.category}
                  </h3>
                  <p className="font-serif text-2xl md:text-3xl text-[hsl(30,10%,30%)] leading-relaxed">
                    {category.skills.split(', ').map((skill, i, arr) => (
                      <span key={skill}>
                        <span className={i % 2 === 0 ? 'italic' : ''}>{skill}</span>
                        {i < arr.length - 1 && <span className="text-[hsl(42,70%,50%)]"> · </span>}
                      </span>
                    ))}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section id="experience" className="py-24 md:py-32 border-t border-[hsl(30,15%,88%)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[hsl(30,10%,15%)] tracking-tight mb-16 flex items-center gap-4">
              <Star active /> Where I've <span className="italic text-[hsl(42,70%,50%)]">been</span>
            </h2>
            
            <div className="space-y-16">
              {experience.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Timeline line */}
                  {index < experience.length - 1 && (
                    <div className="absolute left-[5px] top-8 bottom-0 w-px bg-[hsl(30,15%,85%)] -mb-16 hidden md:block" />
                  )}
                  
                  <div className="flex flex-col md:flex-row md:gap-12">
                    {/* Date */}
                    <div className="md:w-48 flex-shrink-0 mb-4 md:mb-0">
                      <div className="flex items-center gap-3">
                        <Star active className="hidden md:block" />
                        <span className="font-sans text-sm text-[hsl(30,10%,50%)]">
                          {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate!)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-serif text-3xl md:text-4xl text-[hsl(30,10%,15%)] mb-2">
                        {exp.role}
                      </h3>
                      <p className="font-serif text-xl md:text-2xl text-[hsl(42,70%,50%)] italic mb-4">
                        {exp.company}
                      </p>
                      <p className="font-sans text-[hsl(30,10%,40%)] leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-24 md:py-32 border-t border-[hsl(30,15%,88%)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[hsl(30,10%,15%)] tracking-tight mb-16 flex items-center gap-4">
              <Star active /> What I <span className="italic text-[hsl(42,70%,50%)]">studied</span>
            </h2>
            
            <div className="space-y-12">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex flex-col md:flex-row md:gap-12">
                    <div className="md:w-48 flex-shrink-0 mb-4 md:mb-0">
                      <div className="flex items-center gap-3">
                        <Star active className="hidden md:block" />
                        <span className="font-sans text-sm text-[hsl(30,10%,50%)]">
                          {edu.startYear} — {edu.endYear}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-serif text-3xl md:text-4xl text-[hsl(30,10%,15%)] mb-2">
                        {edu.degree} in {edu.field}
                      </h3>
                      <p className="font-serif text-xl md:text-2xl text-[hsl(42,70%,50%)] italic mb-2">
                        {edu.institution}
                      </p>
                      {edu.details && (
                        <p className="font-sans text-[hsl(30,10%,40%)]">
                          {edu.details}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Languages Section */}
      <section id="languages" className="py-24 md:py-32 border-t border-[hsl(30,15%,88%)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[hsl(30,10%,15%)] tracking-tight mb-16 flex items-center gap-4">
              <Star active /> What I <span className="italic text-[hsl(42,70%,50%)]">speak</span>
            </h2>
            
            <div className="flex flex-wrap gap-x-16 gap-y-8">
              {languages.map((lang, index) => (
                <motion.div
                  key={lang.language}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <Star active />
                  <div>
                    <span className="font-serif text-2xl md:text-3xl text-[hsl(30,10%,15%)]">{lang.language}</span>
                    <span className="font-serif text-lg md:text-xl text-[hsl(30,10%,50%)] italic ml-3">{lang.proficiency}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section id="contact" className="py-24 md:py-32 border-t border-[hsl(30,15%,88%)]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[hsl(30,10%,15%)] tracking-tight mb-8 flex items-center justify-center gap-4">
              <Star active /> Let's <span className="italic text-[hsl(42,70%,50%)]">talk</span>
            </h2>
            <EditorialLink href="/contact">
              {personalInfo.email}
            </EditorialLink>
            
            {/* Footer with Style Guide link */}
            <div className="mt-16 flex flex-col items-center gap-4">
              <div className="flex justify-center gap-4">
                <Star active />
                <Star />
                <Star active />
              </div>
              <Link to="/style-guide" className="font-sans text-xs text-[hsl(30,10%,60%)] hover:text-[hsl(42,70%,50%)] transition-colors">
                Style Guide
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
