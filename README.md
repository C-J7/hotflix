# Hotflix

A film discovery app: trending picks, a daily Top 10, curated collections, trailers and a personal watchlist.

**Live:** [hotflix-chi.vercel.app](https://hotflix-chi.vercel.app/)

![Hotflix](public/og-image.png)

## What it does

- **Tonight's Pick** — an auto-advancing editorial hero drawn from the week's most-watched films
- **Top 10 today** — a daily ranking with oversized numerals, refreshed hourly
- **Collections** — 18 genre collections, each with Popular / Top rated / Newest views and infinite scroll
- **Trailers** — official YouTube trailers in a focused player, fetched on demand rather than upfront
- **My List** — a watchlist stored in `localStorage`, no account required
- **Search** — instant, debounced search from anywhere on the site (press `/`)

## Stack

Next.js 16 (Pages Router) · React 19 · TypeScript · CSS Modules · [TMDB API](https://www.themoviedb.org/documentation/api)

No UI framework, no client-side data-fetching library, no CSS framework — plain `fetch`, `getStaticProps`/ISR, and hand-written CSS. The whole app is four runtime dependencies.

## Architecture

- **TMDB calls stay server-side.** `lib/tmdb.ts` is imported only by `getStaticProps` and the three `pages/api/*` routes, so the API key never reaches the browser. Client-side data (search, paginated collections, on-demand trailers) goes through those routes, which set `Cache-Control` headers so Vercel's CDN — not TMDB — serves repeat requests.
- **Pages are prerendered with ISR.** The homepage, `/browse`, `/collections/*` and individual `/movie/[id]` pages are static HTML regenerated on a schedule (1 hour to 1 day depending on how often the data actually changes), so first paint is instant and the app stays indexable.
- **Motion respects `prefers-reduced-motion`** globally, and the auto-advancing hero and background carousels both check it explicitly before animating.

## Getting started

```bash
npm install
cp .env.example .env.local   # add your TMDB API key
npm run dev
```

Get a free TMDB v3 API key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).

```bash
npm run build       # production build
npm run lint         # eslint
npm run typecheck   # tsc --noEmit
```

## Credit

Film data and images from [TMDB](https://www.themoviedb.org). This product uses the TMDB API but is not endorsed or certified by TMDB.

Built by [Bamgbose Christian](https://bamgbosechristian.me).
