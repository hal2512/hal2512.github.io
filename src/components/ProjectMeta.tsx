import type { Project } from "@/types/portfolio";

/** "Industry project with BSH · 03/2026 – 07/2026" plus an "In progress" badge for active projects */
export function ProjectMeta({ project, className = "" }: { project: Project; className?: string }) {
  const parts = [project.context, project.period].filter(Boolean);
  if (parts.length === 0 && project.status !== "active") return null;

  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-sm text-[hsl(30,10%,50%)] ${className}`}>
      {parts.length > 0 && <span>{parts.join(" · ")}</span>}
      {project.status === "active" && (
        <span className="text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[hsl(42,70%,50%)]/15 text-[hsl(42,70%,32%)]">
          In progress
        </span>
      )}
    </div>
  );
}
