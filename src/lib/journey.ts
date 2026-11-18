// "My AI Agent Journey" posts live in src/content/journey/<slug>.md.
// Each file starts with a small frontmatter block:
//
// ---
// title: Giving my agent a phone number
// summary: One or two sentences shown on the index page.
// date: 2026-11-10
// type: tutorial            # "story" or "tutorial"
// order: 3                  # position in the series (1 = first)
// tags: [iMessage, Photon, Telegram]
// ---
//
// Files whose name starts with "_" are ignored (drafts, templates).

export type JourneyPost = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  type: "story" | "tutorial";
  order: number;
  tags: string[];
  readingMinutes: number;
  body: string;
};

const files = import.meta.glob("../content/journey/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: raw };
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z][\w-]*):\s*(.*?)\s*(#.*)?$/);
    if (m) data[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return { data, body: raw.slice(match[0].length) };
}

function parseTags(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((t) => t.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

export const journeyPosts: JourneyPost[] = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split("/").pop()!.replace(/\.md$/, "");
    const { data, body } = parseFrontmatter(raw);
    const words = body.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
    return {
      slug,
      title: data.title ?? slug,
      summary: data.summary ?? "",
      date: data.date ?? "",
      type: data.type === "tutorial" ? "tutorial" : "story",
      order: Number(data.order ?? 99),
      tags: parseTags(data.tags),
      readingMinutes: Math.max(1, Math.round(words / 220)),
      body,
    } satisfies JourneyPost;
  })
  .filter((p) => !p.slug.startsWith("_"))
  .sort((a, b) => a.order - b.order || a.date.localeCompare(b.date));

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
