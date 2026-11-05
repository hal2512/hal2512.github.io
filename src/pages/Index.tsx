import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { personalInfo, experience, skillCategories, education, languages, projects, certificates, socialLinks } from "@/data/portfolio-data";
import { Nav } from "@/components/Nav";
import { ProjectMeta } from "@/components/ProjectMeta";

const sections = [
  { id: "intro", label: "Intro" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "certificates", label: "Certificates" },
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
  const { hash } = useLocation();

  // Coming back from a project page ("/#projects"): jump to that section
  useEffect(() => {
    if (!hash) return;
    const element = document.getElementById(hash.slice(1));
    if (element) element.scrollIntoView();
  }, [hash]);

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
      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden xl:block">
        <ul className="space-y-5">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className="flex items-center gap-4 group"
              >
                <Star active={activeSection === section.id} className="group-hover:text-[hsl(30,10%,50%)]" />
                <span className={`font-serif transition-all duration-300 ${activeSection === section.id
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
            className="max-w-5xl mx-auto"
          >
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.1] text-[hsl(30,10%,15%)] tracking-tight text-balance">
              <span className="opacity-60">"</span>I'm{" "}
              <span className="italic text-[hsl(42,70%,50%)] whitespace-nowrap">{personalInfo.name}</span>,
              an AI student who turns messy data into{" "}
              <span className="italic text-[hsl(42,70%,50%)]">models</span> that actually work.<span className="opacity-60">"</span>
            </h1>

            {/* Availability */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-10 inline-flex items-center gap-3 font-sans text-base md:text-lg text-[hsl(30,10%,40%)]"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[hsl(42,70%,50%)] shrink-0" aria-hidden="true" />
              Open to internships &amp; working-student roles
            </motion.p>

            {/* Contact Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-12 flex flex-wrap justify-center gap-x-12 gap-y-6"
            >
              <EditorialLink href={`mailto:${personalInfo.email}`}>
                {personalInfo.email}
              </EditorialLink>
              {socialLinks.map((link) => (
                <EditorialLink key={link.platform} href={link.url} external>
                  <span className="italic">{link.platform}</span>
                </EditorialLink>
              ))}
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

      {/* Projects Section */}
      <section id="projects" className="py-24 md:py-32 border-t border-[hsl(30,15%,88%)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[hsl(30,10%,15%)] tracking-tight mb-16 flex items-center gap-4">
              <Star active /> What I've <span className="italic text-[hsl(42,70%,50%)]">built</span>
            </h2>

            <div className="space-y-16">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: Math.min(index, 2) * 0.1 }}
                >
                  <h3 className="font-serif text-3xl md:text-4xl text-[hsl(30,10%,15%)] mb-2 flex items-start gap-3">
                    <Star active className="hidden md:block text-xl mt-2" />
                    <Link to={`/projects/${project.id}`} className="hover:text-[hsl(42,70%,45%)] transition-colors">
                      {project.name}
                    </Link>
                  </h3>
                  <ProjectMeta project={project} className="mb-4 md:pl-8" />
                  <p className="font-sans text-[hsl(30,10%,40%)] leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="font-sans text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-[hsl(30,15%,82%)] text-[hsl(30,10%,40%)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-6 font-sans text-sm">
                    <Link
                      to={`/projects/${project.id}`}
                      aria-label={`Read more about ${project.name}`}
                      className="inline-flex items-center px-6 py-3 rounded-full bg-[hsl(30,10%,15%)] text-[hsl(30,25%,95%)] tracking-wide hover:bg-[hsl(42,70%,45%)] transition-colors"
                    >
                      Read more →
                    </Link>
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[hsl(42,70%,45%)] hover:underline">Code</a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-[hsl(42,70%,45%)] hover:underline">Live</a>
                    )}
                  </div>
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
                          {edu.startYear === edu.endYear ? edu.startYear : `${edu.startYear} — ${edu.endYear}`}
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

      {/* Certificates Section */}
      <section id="certificates" className="py-24 md:py-32 border-t border-[hsl(30,15%,88%)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[hsl(30,10%,15%)] tracking-tight mb-16 flex items-center gap-4">
              <Star active /> What I've <span className="italic text-[hsl(42,70%,50%)]">certified</span>
            </h2>

            <div className="space-y-8">
              {certificates.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <Star active className="mt-1" />
                  <div>
                    <p className="font-serif text-2xl md:text-3xl text-[hsl(30,10%,15%)]">{cert.name}</p>
                    {cert.details && (
                      <p className="font-sans text-[hsl(30,10%,40%)] mt-2">{cert.details}</p>
                    )}
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
              <Star active /> Get in <span className="italic text-[hsl(42,70%,50%)]">touch</span>
            </h2>
            <EditorialLink href="/contact">
              {personalInfo.email}
            </EditorialLink>

            <div className="mt-16 flex justify-center gap-4">
              <Star active />
              <Star />
              <Star active />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
