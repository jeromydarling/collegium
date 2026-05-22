/**
 * Perplexity client for Auxilium's live legal-information panels.
 *
 * Goal: surface jurisdiction-specific, currently-true information (notice
 * periods, answer deadlines, rental-assistance program status, local
 * legal-aid orgs) with citations the user can verify. Information, not
 * advice. The citations are the shield.
 *
 * Today this client is a mock: it returns realistic shapes for the
 * eviction guide so we can ship the UX immediately. In production it
 * proxies through one of two backends:
 *
 *   1. A tiny Cloudflare Worker on api.collegium.app that holds the
 *      Perplexity API key and forwards the request to
 *      https://api.perplexity.ai/chat/completions with
 *      model: "sonar" or "sonar-pro" and return_citations: true.
 *
 *   2. The Lovable Perplexity connector when this codebase is re-imported
 *      into Lovable. The connector handles auth server-side and exposes
 *      a fetch-style call from the client.
 *
 * The swap point is `runPerplexityQuery` below. Replace its body with the
 * real fetch and the rest of the app needs no change.
 */

export type PerplexityCitation = {
  url: string;
  title?: string;
  /** Optional snippet excerpted from the source. */
  excerpt?: string;
};

export type PerplexityAnswer = {
  /** The synthesized answer text. */
  answer: string;
  /** Citations Perplexity returned — always shown alongside the answer. */
  citations: PerplexityCitation[];
  /** Source mode for transparency in the UI. */
  source: "mock" | "live";
  /** When this result was fetched — used to age out stale info. */
  fetchedAt: string;
  /** Echo of the prompt that produced this result. */
  prompt: string;
};

const MOCK = import.meta.env.VITE_PERPLEXITY_API_KEY ? false : true;

/**
 * Run a single Perplexity query. Caller passes the prompt with any
 * {state} / {city} substitutions already resolved.
 */
export async function runPerplexityQuery(
  prompt: string,
  signal?: AbortSignal
): Promise<PerplexityAnswer> {
  if (MOCK) return mockFor(prompt);

  // Real path. The fetch goes to a proxy we control — the Perplexity
  // API key never touches the client. Replace VITE_PERPLEXITY_PROXY_URL
  // with the Cloudflare Worker URL or Lovable connector endpoint.
  const proxy =
    import.meta.env.VITE_PERPLEXITY_PROXY_URL ||
    "https://api.collegium.app/perplexity";
  const res = await fetch(proxy, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        {
          role: "system",
          content:
            "You are a legal information assistant for Auxilium, a Christian-founded legal-help platform. " +
            "You provide INFORMATION, never legal advice. You cite primary sources (statutes, court rules, " +
            "government agency websites, established legal-aid organizations) wherever possible. If a " +
            "question cannot be answered from current public sources, say so plainly.",
        },
        { role: "user", content: prompt },
      ],
      return_citations: true,
      temperature: 0.2,
    }),
    signal,
  });
  if (!res.ok) throw new Error(`Perplexity proxy returned ${res.status}`);
  const data = await res.json();

  // Standard Perplexity response shape — see api.perplexity.ai docs.
  const answer = data.choices?.[0]?.message?.content ?? "";
  const citations: PerplexityCitation[] = (data.citations || []).map(
    (c: string | { url: string; title?: string }) =>
      typeof c === "string" ? { url: c } : c
  );
  return {
    answer,
    citations,
    source: "live",
    fetchedAt: new Date().toISOString(),
    prompt,
  };
}

/** Fill {state} / {city} placeholders before running. */
export function fillJurisdiction(
  template: string,
  loc: { city?: string; state?: string }
): string {
  return template
    .replace(/\{state\}/g, loc.state ?? "your state")
    .replace(/\{city\}/g, loc.city ?? "your area");
}

// ────────────────────────────────────────────────────────────────────
// Mocked responses — keyed by prompt fragment. Realistic enough that the
// UI feels real today, with citations to public domains. When we wire
// the real API these will only be used as a fallback / dev-mode default.
// ────────────────────────────────────────────────────────────────────

function mockFor(prompt: string): Promise<PerplexityAnswer> {
  const lower = prompt.toLowerCase();

  const stateMatch = prompt.match(/in ([A-Za-z .]+?),?\s+what is the legally|In ([A-Za-z .]+?), after a tenant/);
  const state = (stateMatch?.[1] || stateMatch?.[2] || "your state").trim();
  const cityMatch = prompt.match(/in ([A-Z][\w .]+?),\s*([A-Z][\w. ]+?)\b/);
  const city = cityMatch?.[1] || "your city";

  let body: PerplexityAnswer;

  if (lower.includes("notice period") && lower.includes("nonpayment")) {
    body = {
      answer:
        `In ${state}, a landlord generally must serve a written demand for rent before filing an eviction action. ` +
        `The notice period varies by state — 14 days is common in MA and IL, 5 days in NY, 3 days in CA, and 30+ days under some local protections. ` +
        `Some cities (e.g., Boston, Chicago, NYC) require longer notice during certain periods or for tenants in subsidized housing. ` +
        `Check the cited statute for the exact notice period in your state and any local ordinances that lengthen it.`,
      citations: [
        {
          url: "https://malegislature.gov/Laws/GeneralLaws/PartII/TitleIII/Chapter186/Section11",
          title: "Mass. Gen. Laws ch. 186, § 11 — Notice to Quit",
        },
        {
          url: "https://www.ilga.gov/legislation/ilcs/ilcs5.asp?ActID=2096",
          title: "735 ILCS 5/9 — Forcible Entry and Detainer (Illinois)",
        },
        {
          url: "https://www.lawhelp.org/find-help/topic/8/housing",
          title: "LawHelp.org — Housing topic landing page",
        },
      ],
      source: "mock",
      fetchedAt: new Date().toISOString(),
      prompt,
    };
  } else if (lower.includes("answer") && lower.includes("summons")) {
    body = {
      answer:
        `In ${state}, after being served with an eviction summons, a tenant typically has between 5 and 20 days to file a written Answer with the court. ` +
        `Massachusetts uses a "First Tier" date roughly 10 days after service. Illinois "Forcible Entry and Detainer" cases set a return date 7–40 days after filing and require the Answer at or before that date. New York gives 10 days to answer a holdover petition. ` +
        `Missing this deadline is the leading cause of default judgments in eviction cases.`,
      citations: [
        {
          url: "https://www.mass.gov/info-details/the-summary-process-summons-and-complaint",
          title: "Mass.gov — Summary Process Summons & Complaint",
        },
        {
          url: "https://www.illinoiscourts.gov/Resources/c5f0e2c1-e2f9-4f3e-a3a1-5b6b4e7b1c4d/Eviction.pdf",
          title: "Illinois Courts — Eviction Self-Help Resources",
        },
        {
          url: "https://www.nycourts.gov/courthelp/Homes/index.shtml",
          title: "NY Courts — Housing Help",
        },
      ],
      source: "mock",
      fetchedAt: new Date().toISOString(),
      prompt,
    };
  } else if (lower.includes("rental-assistance") || lower.includes("rental assistance")) {
    body = {
      answer:
        `Rental-assistance program availability shifts often — check today's status. ` +
        `Federal ERA1/ERA2 funds have largely been spent down, but many states and cities run replacement programs: ` +
        `${state} typically has at least one program administered by a state housing agency or community-action partnership. ` +
        `${city} may also have a city-level fund. Most programs require: a notice or court filing, proof of income, and proof of hardship.`,
      citations: [
        {
          url: "https://nlihc.org/era-dashboard",
          title: "NLIHC Emergency Rental Assistance Dashboard",
        },
        {
          url: "https://www.consumerfinance.gov/coronavirus/mortgage-and-housing-assistance/renter-protections/find-help-with-rent-and-utilities/",
          title: "CFPB — Find help with rent and utilities",
        },
        {
          url: "https://www.211.org/",
          title: "211.org — Local assistance directory",
        },
      ],
      source: "mock",
      fetchedAt: new Date().toISOString(),
      prompt,
    };
  } else if (lower.includes("right to counsel")) {
    body = {
      answer:
        `As of 2026, a growing number of cities have Right-to-Counsel programs guaranteeing free counsel to low-income tenants in eviction cases: ` +
        `New York City, San Francisco, Cleveland, Detroit, Philadelphia, Newark, Toledo, Boulder, Kansas City (MO), Louisville, and Connecticut and Washington at the state level. ` +
        `Eligibility usually requires household income at or below 200% of the Federal Poverty Level. ` +
        `Programs are administered through legal-aid nonprofits selected by the city. ` +
        `${city} — confirm with the cited national tracker.`,
      citations: [
        {
          url: "https://civilrighttocounsel.org/major_developments/right-to-counsel-tenant",
          title: "National Coalition for a Civil Right to Counsel — RTC tenant tracker",
        },
        {
          url: "https://www.nlrjp.org/right-to-counsel",
          title: "National Right to Counsel for Tenants Coalition",
        },
      ],
      source: "mock",
      fetchedAt: new Date().toISOString(),
      prompt,
    };
  } else if (lower.includes("legal-aid") || lower.includes("legal aid")) {
    body = {
      answer:
        `Major legal-aid organizations serving low-income tenants in ${city} typically include the LSC-funded statewide program plus one or more city-level nonprofits. ` +
        `For a search-quality list, the cited national directory will show currently-active orgs with intake phone numbers and income limits.`,
      citations: [
        {
          url: "https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help",
          title: "LSC — Get Legal Help (national locator)",
        },
        {
          url: "https://www.lawhelp.org/",
          title: "LawHelp.org — find legal aid by zip code",
        },
        {
          url: "https://www.americanbar.org/groups/legal_services/flh-home/",
          title: "ABA — Free Legal Answers and pro bono directory",
        },
      ],
      source: "mock",
      fetchedAt: new Date().toISOString(),
      prompt,
    };
  } else {
    body = {
      answer:
        `Live legal-information lookup is on its way. When the Perplexity proxy is wired up, this panel will return ` +
        `a current, source-grounded answer with citations to court websites, statutes, and legal-aid organizations.`,
      citations: [],
      source: "mock",
      fetchedAt: new Date().toISOString(),
      prompt,
    };
  }

  // Simulate a small fetch delay so the "loading" state is visible.
  return new Promise((resolve) => setTimeout(() => resolve(body), 600));
}
