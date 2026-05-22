# Collegium

> A guild operating system for Christian and Catholic legal communities.
>
> _Lex caritas est — the law is love made just._

Collegium is built on the moral imagination of Aquinas and Catholic Social
Teaching. It is the recurring rhythms of guild life — **chapter, mentor,
service, formation, leadership** — supported by a Narrative Relational
Intelligence (NRI) layer that helps stewards notice who is drifting, who
is rising, and where the chapter is being formed.

## What's in the box

- **Marketing site** — `/`, `/manifesto`, `/about`, `/modules`,
  `/formation`, `/pricing`, `/contact`.
- **Working demo** — `/demo` gates an in-memory experience covering all
  five modules (Chapters, Mentorship, Service, Formation, Advancement)
  plus the **NRI Pulse** surface, a **Daily Office** for legal vocation,
  and an ecumenical legal-liturgical calendar.
- **Seed library** — public-domain readings from Aquinas, Augustine,
  _Rerum Novarum_, _Quadragesimo Anno_, Blackstone, Newman, Burke, Roman
  law, and More's _Utopia_ — every entry linked to its verified
  Gutenberg / Internet Archive / Vatican source.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn-ui (inherited from the CROS starter)
- React Router 6 (BrowserRouter with auto base-path)
- Demo state in localStorage; no backend dependency

## Local development

```sh
npm install
npm run dev   # serves on http://localhost:8080 (or 5173 if 8080 is taken)
```

## Build

```sh
npm run build            # local build, base = "/"
VITE_COLLEGIUM_BASE=/collegium/ npm run build   # GitHub Pages build
```

## Deploy

The repo ships with `.github/workflows/deploy-pages.yml`, which on every
push to `main` builds with `VITE_COLLEGIUM_BASE=/${repo-name}/` and
publishes via `actions/deploy-pages@v4`.

To enable the deploy:

1. **Settings → Pages → Source = GitHub Actions** (one-time).
2. Push to `main`.
3. The workflow takes ~1 minute. The site URL appears at the bottom of
   the workflow run.

The workflow also copies `index.html` to `404.html` so that GitHub
Pages's default 404 routes deep-link visits back through React Router.

## Layout

```
src/
├── collegium/              ← The Collegium app
│   ├── CollegiumApp.tsx    ← Top-level router
│   ├── brand.ts            ← Module catalogue, motto, principles
│   ├── styles.css          ← Collegium theme (wine / gold / cream)
│   ├── content/            ← Aquinas, CST, library, calendar, devotional
│   ├── data/demo.ts        ← Chapters, people, mentor pairs, NRI briefings
│   ├── lib/demoStore.ts    ← In-memory + localStorage demo state
│   ├── components/         ← PublicLayout, AppLayout, Logo
│   ├── pages/              ← Marketing pages
│   └── app/                ← Demo app pages
├── components/ui/          ← shadcn primitives (inherited)
└── main.tsx                ← Boots CollegiumApp
```

## Voice

We cite our sources. Latin appears as a discipline, not decoration. We
trust the reader. We do not condescend. The five modules are named in
Latin because the communities we serve already think this way.

## License

Source: TBD by the maintainer. Public-domain texts cited in the library
remain in the public domain in their original form; our excerpts and
plain-language summaries are © Collegium.
