# Justice Gap Map — kickoff prompt

You're starting a new Claude Code project to build **justicegap.com** (or similar). It's a polemic + data-visualization site about the gap between the constitutional right to counsel and the reality of public-defender caseloads, indigent-defense funding, and access to civil legal aid in America.

The architecture pattern is proven — I built **fostercrisis.com** with it. Below is everything you need to replicate the pattern, the lessons I learned the hard way, and a starting outline for the Justice Gap chapter set.

---

## 1. The argument shape

fostercrisis.com is structured around **five top-level views**:

| Pill   | Content                                                                                    |
|--------|--------------------------------------------------------------------------------------------|
| Map    | 12 county/state choropleth chapters, scrolling sidebar narrative, click-to-drill          |
| Essay  | Long-form written argument in ~10 sections, each with a meditation prayer at the end       |
| Stories| Featured human story (Mohammad Bzeek) + curated YouTube feed of waiting-children videos     |
| News   | Independent-press RSS feed (The Imprint, NCCPR, Casey Family Programs, etc.)               |
| Solution | State-by-state directory of orgs already doing the work; the call to action               |

Each is a **separate hash route** (`#map`, `#essay`, `#stories`, `#news`, `#solution`). Landing page is an epigraph with five "choose your view" cards.

For Justice Gap, the analogous five views might be:

- **Map** — public-defender caseloads, indigent-defense spending per capita, civil legal aid funding, % felony cases without counsel, conviction rates by representation type, incarceration rate.
- **Essay** — the constitutional promise (Gideon v. Wainwright, 1963) vs. the reality (most public defenders carry 4–8× the ABA-recommended caseload).
- **Stories** — exoneree testimony, Innocence Project case files, public-defender first-person accounts.
- **News** — The Marshall Project, ProPublica criminal-justice desk, Vera Institute, NACDL.
- **Solution** — state-by-state directory: public-defender offices that take volunteers, civil legal aid clinics, Innocence Project chapters, pro bono coordinators.

---

## 2. Tech stack

```
React 18 + Vite 5 + TypeScript
Mapbox GL JS (not MapLibre — Albers projection + cooperative gestures matter)
TopoJSON for state/county geometry (us-atlas 10m, ~1MB total)
html-to-image for share-card capture
GitHub Pages deploy via GitHub Actions
```

`package.json` core deps to copy:
- `mapbox-gl` (you need a token; `VITE_MAPBOX_TOKEN` env var)
- `topojson-client`
- `html-to-image`

---

## 3. Repo layout

```
public/
  data/
    states-10m.json          # us-atlas TopoJSON, commit to repo (offline-capable)
    counties-10m.json        # us-atlas TopoJSON
    <your-metric>-counties.json  # one per chapter that needs county-level
    feeds.json               # CI-generated; gitignore
  pledge.ics                 # CI-generated calendar artifact
src/
  components/
    Landing.tsx              # epigraph + 5 cards
    ModeSwitcher.tsx         # top nav pill rail
    MapExperience.tsx        # orchestrates map + sidebar
    CrisisMap.tsx            # MapLibre/Mapbox component (the heart)
    ChapterPanel.tsx         # sidebar narrative per chapter
    EssayExperience.tsx      # the long-form sections
    <Chapter>Section.tsx     # one per essay section, with <Prayer/>
    Prayer.tsx               # meditation block at end of each section
    FeedSection.tsx          # Stories + News feeds (shared component, view prop)
    PledgeCalendar.tsx       # ICS subscription signup
    SolutionExperience.tsx   # state directory
  data/
    chapters.ts              # the chapter list — title, metric, ramp, body
    states.ts                # per-state statistics (foster care, poverty, etc.)
    geo.ts                   # data bundle assembly + GeoJSON join
    prayers.ts               # per-section meditation prayers
    feeds.ts                 # feed loading types
scripts/
  fetch-feeds.mjs            # YouTube + RSS → public/data/feeds.json
  feeds.config.json          # source list (UC channel IDs, playlist IDs, RSS URLs)
  build-pledge-ics.mjs       # weekly reminder calendar generator
  lib.mjs                    # shared HTTP/fs helpers
.github/workflows/deploy.yml # build + data:* + deploy to gh-pages
```

---

## 4. Map architecture — THE PATTERN THAT WORKS

This took several iterations to get right. **Do these in order.**

### 4a. Data flow

1. Geometry: ship `us-atlas` 10m TopoJSON in `/public/data/` so it works offline.
2. Metrics: per-state stats live in `src/data/states.ts` as a typed array. County-level metrics get fetched into `public/data/<metric>-counties.json` by build scripts.
3. **`geo.ts::loadAll()`** does the join: it fetches geometry + metric JSONs in parallel, hydrates feature properties with `metric_${chapterId}` keys (for state) and per-prop keys (for county), and returns a `GeoBundle`.
4. Map paint expressions read **directly from feature properties** — `['get', metricKey]`. Do NOT route metric values through `feature-state` — see §4c.

### 4b. Chapter definition

```ts
export interface Chapter {
  id: string;
  number: string;
  title: string;
  eyebrow: string;
  metric: Metric;
  geography: 'state' | 'county';
  countyProp?: 'poverty' | 'overdose' | ...; // county-only chapters
  ramp: string[];      // gradient colors, low → bleak
  unit: string;        // legend label
  headline: string;    // big number in sidebar
  subline: string;     // unit context
  body: string;        // the argument
  source: string;      // inline citation under the legend
}
```

Chapters are an ordered array. Side panel has `← Back / 1 / 12 / Next →`. URL hash carries `#map/3` so each chapter is shareable.

### 4c. The first-load gotcha

**Do not use `setFeatureState` to push the choropleth value.** It races the source's async feature indexing on first load. A handful of states will paint as the dark fallback color until the user changes chapters and comes back.

The fix: bake every metric into feature `properties` at bundle-assembly time, and write paint expressions that read directly:

```ts
function buildFillPaint(propKey: string, ramp: string[], domain: [number, number]) {
  return [
    'case',
    ['==', ['coalesce', ['get', propKey], null], null],
    '#1a1f2b',  // unfilled fallback
    ['interpolate', ['linear'], ['get', propKey], ...stops.flat()],
  ];
}
```

`feature-state` is correct for **hover** and **selected** flags only — runtime-changing transient state.

### 4d. Persistent overlay

Add a points layer at state centroids that **stays visible across every chapter**. For fostercrisis this is the count of children in foster care; for Justice Gap it could be:

- Public-defender count per state
- Or percent of felony defendants represented by a public defender
- Or incarceration rate per 100k

Pattern: compute bbox-center per state at load, build a points FeatureCollection with the metric + a formatted short label (`5.9K`), add a `circle` layer sized 4 → 36px by metric value, plus a `symbol` layer with the label in bold. Cream fill `#ffe9b3` with a dark stroke reads on both warm and cool chapter ramps.

### 4e. State drill-down

Click a state → fitBounds to that feature, switch the active chapter from state-choropleth to its county-equivalent (e.g., poverty → child-poverty-by-county). Sidebar swaps from national framing to state-specific framing (`framing[stateRow.fips]` lookup in chapter data).

---

## 5. Data ingestion pipeline

`scripts/fetch-feeds.mjs` takes a `feeds.config.json` that lists sources by kind:

```json
{
  "kind": "youtube-channel",   // ?channel_id=UC...
  "kind": "youtube-playlist",  // ?playlist_id=PL...
  "kind": "youtube-user",      // ?user=<handle> — legacy /user/ URLs only
  "kind": "rss"
}
```

**Lessons:**

- YouTube's `/user/USERNAME` RSS only works for pre-2012 accounts. For everything else, use `channel_id=UC...` Verify the UC against `https://www.youtube.com/channel/UC...` returning a 200, not a guess from the @ handle.
- For TV-affiliate "Wednesday's Child" / "Forever Families" segments, use the **playlist** form — the station's main channel is noisy.
- For news RSS, the feed often has no usable image. Fetch the article HTML, parse `og:image` from `<head>`. Adds 1 HTTP per article but gives you 1200×630 hero art instead of grainy thumbnails.
- YouTube thumbnails: probe `maxresdefault.jpg → sddefault.jpg → hqdefault.jpg` via HEAD. Older uploads only have hqdefault; modern ones have maxres.

---

## 6. UI patterns that work

- **Landing chooser**: epigraph + 5 cards. Each card is a button with eyebrow, title, sub-paragraph, CTA. Grid responds 5 → 3 → 2 → 1 across breakpoints.
- **ModeSwitcher**: top pill rail, 5 pills. On mobile under 560px, tighten padding so they fit on one line down to 320px wide.
- **ChapterPanel sidebar**: 440px on desktop, full-width on mobile. Legend (gradient ramp + source citation) at top, scroll-locked. Chapter body in the middle. `← Back / N of M / Next →` controls at the bottom.
- **FeedSection** Load More: don't show all items at once. Slice to 24, show a Load More button that adds 24 per click with a count of remaining items.
- **Shareable**: any DOM node can be made shareable by wrapping with `<Shareable label="...">`. The component captures the node as PNG (via `html-to-image`), composites a branded footer canvas with the URL + attribution, and downloads. **Capture the live node in place** — off-screen-clone approaches fail silently on mobile because browsers skip layout for `position:fixed; left:-99999px` elements.

---

## 7. Prayers / meditation pattern

Each essay section ends with a `<Prayer/>` block — a cream parchment card with theme eyebrow, title, body paragraphs. Originally I had attributions to Catholic source URLs (Vatican News, USCCB) — this caused Protestant readers to balk. **Strip all attribution fields.** Keep prayer bodies verbatim from real published sources (so they're not synthesized AI text), but don't display the source.

Single-newline in a body string preserves a verse-style line break within a paragraph; double-newline starts a new paragraph.

For Justice Gap, the analogous meditation blocks could be:
- Bible passages on justice (Amos 5, Micah 6:8, Isaiah 1, Matthew 25)
- Excerpts from MLK's *Letter from Birmingham Jail*
- The text of the Sixth Amendment

---

## 8. Deployment

GitHub Actions on push to main:
1. `npm ci`
2. Run `npm run data:*` scripts (feeds, lectionary, sunday-gospels, ejscreen, churches, saipe, cdc-overdose, misery)
3. `npm run build`
4. Upload `dist/` to `gh-pages` branch

Custom domain via `public/CNAME` (one line, the domain name).

---

## 9. Justice Gap chapter starter set

12 chapter ideas, ranked by data availability:

1. **The constitutional promise vs. the bench.** Public-defender caseloads per attorney by state — county where possible. ABA recommends ≤150 felonies/year; the median real number is 400–800.
2. **The money.** Indigent-defense spending per capita, state-by-state. (Bureau of Justice Statistics / Sixth Amendment Center reports.)
3. **The pipeline to incarceration.** Incarceration rate per 100k by county. (Vera Institute, PrisonPolicy.org.)
4. **Civil legal aid deserts.** LSC-funded legal aid attorneys per 10,000 people in poverty.
5. **Wrongful conviction.** Exoneree count by state (Innocence Project + National Registry of Exonerations).
6. **The plea bargain.** % of felony cases resolved by plea (96%+ nationally). State variation.
7. **The juvenile bench.** Juvenile justice contact rate per 1,000 children, with race overlay.
8. **The fines and fees.** Court-debt revenue as % of local government revenue (Ferguson Report follow-ups).
9. **The bail gap.** Pretrial detention rate, % unable to make bail under $500.
10. **The death penalty geography.** Capital sentences per murder, narrowing to the 2% of US counties that produce most of them.
11. **Reentry.** Recidivism by state, with overlay of state-level reentry-funding per release.
12. **The composite "Justice Gap Index"** — composite of caseload, funding, civil-aid, and exoneration.

Persistent overlay candidate: **public defenders per state** (a stark count — a handful of states have under 200 statewide).

---

## 10. What NOT to do

- **Don't use feature-state for choropleth values.** See §4c.
- **Don't synthesize prayer or quoted source text.** Find real verbatim sources, even if you trim to the part that fits your context.
- **Don't ship attribution URLs for content that will alienate part of your audience.** Strip them.
- **Don't trust auto-generated YouTube handles** (`/user/myorg`). Verify against the canonical `/channel/UC...` URL.
- **Don't let `npm run build` warn-block on the 500 KB chunk size.** Mapbox + the data bundle is large; ship it. Code-splitting fights the simple deploy.
- **Don't try to capture share images via off-screen clones on mobile.** Capture the live node in place.
- **Don't push to main without explicitly being told to.** The user develops on a feature branch.

---

## 11. Code I'd copy verbatim from fostercrisis

If you can get access to the fostercrisis repo (or paste the file contents into the new Claude session), these files are worth copying near-verbatim and editing:

- `src/components/CrisisMap.tsx` — the full Mapbox setup, persistent overlay, hover/click, drill-in
- `src/components/Shareable.tsx` + `src/utils/captureShareImage.ts` — share PNG generator
- `src/components/PledgeCalendar.tsx` + `scripts/build-pledge-ics.mjs` — calendar subscription pattern
- `scripts/fetch-feeds.mjs` + `scripts/lib.mjs` — feed ingestion
- `src/data/geo.ts` — the GeoJSON join pattern
- The CSS variables and shareable / chapter / prayer / feed sections of `src/styles.css`

---

## 12. Tone

The site reads as polemic, not just dashboard. Every chapter has a sting at the end. Every essay section ends in a meditation. The sidebar copy is written like an indictment, not a caption. Justice Gap should carry the same posture: this isn't a research summary; it's a public reckoning.

> "The gap between the constitutional promise and the lived experience of an indigent defendant is not a policy failure. It is a moral choice we keep making."
