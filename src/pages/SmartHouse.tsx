import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Nav } from "@/components/Nav";

export default function SmartHouse() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Smart House Project – Htet Aung Lin";
    return () => {
      document.title = "Htet Aung Lin – AI & Machine Learning Portfolio";
    };
  }, []);

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
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-[hsl(42,70%,40%)]">Project</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl leading-tight text-[hsl(30,10%,15%)] tracking-tight">
            Smart House Project
          </h1>
          <p className="mt-6 inline-block font-sans text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-[hsl(42,70%,90%)] text-[hsl(42,70%,30%)]">
            Coming soon
          </p>
          <p className="mt-8 font-serif text-xl md:text-2xl text-[hsl(30,10%,35%)] leading-relaxed">
            I&apos;m starting a smart house project. This page will document it as it takes shape: what I build, what
            breaks, and what I learn along the way.
          </p>
          <p className="mt-6 font-sans text-base text-[hsl(30,10%,40%)] leading-relaxed">
            Nothing to show yet. In the meantime, you can follow{" "}
            <Link to="/journey" className="text-[hsl(42,70%,40%)] hover:underline">
              my AI agent journey
            </Link>
            .
          </p>
        </motion.div>
      </main>
    </div>
  );
}
