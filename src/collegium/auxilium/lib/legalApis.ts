/**
 * Legal-resource API integration layer.
 *
 * We don't reinvent any of the wheels below. These functions wrap
 * established, well-maintained APIs so Auxilium can surface their
 * data in a Christian-rooted, mobile-first, plain-English shell.
 *
 * Status legend:
 *   ✅ wired today                     — implemented, gated on env var
 *   🟡 wired with mock                 — abstraction in place; mock returns
 *      plausible data; flip env to go live
 *   ⬜ not wired                       — surface reserved, slot here later
 *
 * Roster:
 *   ✅ Mapbox Geocoding                  src/auxilium/lib/maps.ts
 *   ✅ Mapbox Directions                 src/auxilium/lib/maps.ts
 *   ✅ Mapbox Isochrone                  src/auxilium/lib/maps.ts
 *   🟡 Perplexity Sonar (citations)     src/auxilium/lib/perplexity.ts
 *   🟡 Lovable AI (Gemini intake)       src/auxilium/lib/aiClient.ts
 *   ⬜ Open211 community resources       open211ResourceLookup() below
 *   ⬜ CourtListener (Free Law Project)  courtListenerLookup()
 *   ⬜ Open States legislative API       openStatesStatutes()
 *   ⬜ Justia case-law search            (URL-based; no formal API)
 *   ⬜ CFPB consumer-complaint database  cfpbConsumerComplaints()
 *   ⬜ LegalShield affiliate feed        partner program — manual today
 *
 * The integration philosophy:
 *   – Public APIs only. No scraping anyone's site.
 *   – Cite every fact we surface. Source URL alongside every answer.
 *   – Cache aggressively (per-session, in localStorage) — most users
 *     don't need real-time, and we shouldn't be running up someone
 *     else's bill if we can help it.
 *   – Gracefully degrade. If an API key is missing or the network
 *     blocks the call, render a useful fallback. Never blank.
 */

export type Open211Resource = {
  id: string;
  name: string;
  description: string;
  phone?: string;
  url?: string;
  address?: string;
  categories: string[];
};

/**
 * Open211 — community resource lookup.
 *
 * United Way's 211 service runs a federated API at
 * https://211.org/. There is no single national endpoint; each region
 * has its own URL. The best aggregator is the AIRS Open211 standard.
 * For demo, this returns a small hand-shaped result. To go live, point
 * the function at the regional 211 endpoint matching the user's zip.
 */
export async function open211ResourceLookup(args: {
  zip?: string;
  category?: string;
}): Promise<Open211Resource[]> {
  // TODO: replace with regional Open211 endpoint when partnership lands.
  return [
    {
      id: "211-helpline",
      name: "Call 2-1-1",
      description:
        "Free, confidential, 24/7. Connects to local legal aid, rental assistance, food, shelter. Search by zip is supported by the operator.",
      phone: "211",
      url: "https://www.211.org/",
      categories: ["general", "legal-aid", "rental-assistance"],
    },
  ];
}

/**
 * CourtListener — Free Law Project's case-law and court-filings API.
 * https://www.courtlistener.com/api/
 * No key required for many endpoints; key recommended for higher
 * rate limits. We will use this for citation lookups when a user's
 * matter file references a specific case.
 */
export async function courtListenerLookup(_query: string): Promise<null> {
  return null;
}

/**
 * Open States — state legislatures and bills.
 * https://openstates.org/
 * Used to look up the actual statute text when Perplexity returns a
 * citation. Free API key with reasonable limits.
 */
export async function openStatesStatutes(_args: {
  state: string;
  statute: string;
}): Promise<null> {
  return null;
}

/**
 * CFPB Consumer Complaint Database — federal complaints against
 * lenders, debt collectors, and credit bureaus.
 * https://www.consumerfinance.gov/data-research/consumer-complaints/
 * Used in debt-matter file to surface whether the collector has a
 * pattern of complaints.
 */
export async function cfpbConsumerComplaints(_collector: string): Promise<null> {
  return null;
}
