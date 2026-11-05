/**
 * Runs after `vite build`.
 *
 * GitHub Pages only has a real file for "/", so every other address was served from 404.html
 * with a "404 Not Found" status, and search engines may skip those pages. This script writes a
 * real copy of the app for each route (e.g. dist/projects/cashsplit.html, which GitHub Pages
 * serves at /projects/cashsplit with a normal 200 status). Each copy gets its own title,
 * description and canonical URL, and a sitemap.xml lists them all.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://hal2512.github.io";
const NAME = "Htet Aung Lin";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

// Read the projects list from src/data/portfolio-data.ts (id, name, description of each entry)
const data = readFileSync(join(root, "src/data/portfolio-data.ts"), "utf8");
const block = data.match(/export const projects[^=]*=\s*\[([\s\S]*?)\n\];/);
if (!block) throw new Error("prerender-routes: could not find `projects` in portfolio-data.ts");

const field = (entry, key) => {
  const m = entry.match(new RegExp(`\\b${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  return m ? m[1].replace(/\\(.)/g, "$1") : undefined;
};
const projects = block[1]
  .split(/\n  \{/)
  .map((entry) => ({ id: field(entry, "id"), name: field(entry, "name"), description: field(entry, "description") }))
  .filter((p) => p.id && p.name);
if (projects.length === 0) throw new Error("prerender-routes: no projects found");

const routes = [
  {
    path: "/contact",
    title: `Contact – ${NAME}`,
    description: `Get in touch with ${NAME} about AI, machine learning or data science internships and working-student roles.`,
  },
  ...projects.map((p) => ({
    path: `/projects/${p.id}`,
    title: `${p.name} – ${NAME}`,
    description: p.description,
  })),
];

const escapeAttr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeText = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const template = readFileSync(join(dist, "index.html"), "utf8");

function replaceOnce(html, pattern, replacement, what) {
  if (!pattern.test(html)) throw new Error(`prerender-routes: index.html has no ${what}`);
  return html.replace(pattern, replacement);
}

for (const route of routes) {
  const url = SITE + route.path;
  const title = escapeText(route.title);
  const titleAttr = escapeAttr(route.title);
  const desc = escapeAttr(route.description);

  let html = template;
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`, "<title>");
  html = replaceOnce(html, /(<meta name="description" content=")[^"]*(")/, `$1${desc}$2`, "description");
  html = replaceOnce(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`, "og:url");
  html = replaceOnce(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${titleAttr}$2`, "og:title");
  html = replaceOnce(html, /(<meta property="og:description" content=")[^"]*(")/, `$1${desc}$2`, "og:description");
  html = replaceOnce(html, /(<meta name="twitter:url" content=")[^"]*(")/, `$1${url}$2`, "twitter:url");
  html = replaceOnce(html, /(<meta name="twitter:title" content=")[^"]*(")/, `$1${titleAttr}$2`, "twitter:title");
  html = replaceOnce(html, /(<meta name="twitter:description" content=")[^"]*(")/, `$1${desc}$2`, "twitter:description");
  html = replaceOnce(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`, "canonical link");

  const file = join(dist, `${route.path}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

const urls = ["/", ...routes.map((r) => r.path)];
writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${SITE}${u === "/" ? "/" : u}</loc></url>`)
    .join("\n")}\n</urlset>\n`,
);

console.log(`prerender-routes: wrote ${routes.length} pages and sitemap.xml (${urls.length} URLs)`);
