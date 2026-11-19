# hal2512.github.io

Portfolio of **Htet Aung Lin**, a B.Sc. Artificial Intelligence student at TH Deggendorf. Live at **https://hal2512.github.io**.

It contains machine learning and software projects (industry project with BSH, IoT intrusion detection, diabetes risk prediction, hand-gesture Tetris, CashSplit), each with a write-up, plus a blog series on building a personal AI agent setup.

## Stack

- Vite, React and TypeScript
- Tailwind CSS with shadcn/ui components
- Markdown content rendered with react-markdown (GFM)
- GitHub Pages, deployed by GitHub Actions on every push to `main`

## Structure

| Path | What it holds |
|---|---|
| `src/data/portfolio-data.ts` | CV data: experience, education, skills and the project list |
| `src/content/projects/<id>.md` | One write-up per project |
| `src/content/journey/<slug>.md` | Blog posts (frontmatter: title, summary, date, type, order, tags) |
| `public/` | Images and diagrams used by the write-ups |
| `scripts/prerender-routes.mjs` | Runs after `vite build`: writes an HTML file per route with its own title, description and canonical URL, plus `sitemap.xml` |

## Run locally

```sh
npm install
npm run dev        # development server
npm run build      # production build into dist/, including prerendered routes
npm run preview    # serve the production build
```

## Licence

Code and content are © Htet Aung Lin. Project data comes from public datasets credited on each project page.
