import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import StyleGuide from "./pages/StyleGuide";
import Contact from "./pages/Contact";
import { lazy, Suspense } from "react";
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
import EditorialStyleGuide from "./pages/EditorialStyleGuide";
import NotFound from "./pages/NotFound";

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
              <Route path="/style-guide" element={<StyleGuide />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/projects/:slug" element={<Suspense fallback={<div className="min-h-screen bg-[hsl(30,25%,95%)]" />}><ProjectDetail /></Suspense>} />
              <Route path="/editorial-style-guide" element={<EditorialStyleGuide />} />
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
