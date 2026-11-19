import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import { lazy, Suspense } from "react";
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
import NotFound from "./pages/NotFound";
const Journey = lazy(() => import("./pages/Journey"));
const JourneyPost = lazy(() => import("./pages/JourneyPost"));
const SmartHouse = lazy(() => import("./pages/SmartHouse"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" storageKey="portfolio-ui-theme" disableTransitionOnChange>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/projects/:slug" element={<Suspense fallback={<div className="min-h-screen bg-[hsl(30,25%,95%)]" />}><ProjectDetail /></Suspense>} />
              <Route path="/journey" element={<Suspense fallback={<div className="min-h-screen bg-[hsl(30,25%,95%)]" />}><Journey /></Suspense>} />
              <Route path="/journey/:slug" element={<Suspense fallback={<div className="min-h-screen bg-[hsl(30,25%,95%)]" />}><JourneyPost /></Suspense>} />
              <Route path="/smart-house" element={<Suspense fallback={<div className="min-h-screen bg-[hsl(30,25%,95%)]" />}><SmartHouse /></Suspense>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
