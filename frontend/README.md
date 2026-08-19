# ARCH in LAND

Website for ARCH in LAND, an architecture & land development studio. Built with React, Vite and TypeScript.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Structure

```
src/
  components/     Header, MenuOverlay, Hero, ImageGrid, About,
                   Projects, ProjectCard, Process, Manifesto,
                   Contact, Footer (each with its own .css file)
  data/
    projects.ts   Fictional project data — swap in real projects/images here
  hooks/
    useReveal.ts  Scroll-reveal IntersectionObserver hook
  pages/
    Home.tsx      Assembles the homepage from the sections above
  styles/
    globals.css   Design tokens (colors, radius, type, spacing) + resets
```

## Notes

- All imagery currently points to Unsplash placeholder photography — replace the
  URLs in `src/data/projects.ts` and the individual section components with real
  project photography when available.
- Colors, spacing and typography are controlled via CSS custom properties in
  `src/styles/globals.css` (`--bg`, `--orange`, `--black`, `--radius`, etc.).
- Motion respects `prefers-reduced-motion`.
