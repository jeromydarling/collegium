/**
 * Find every reachable charitable + legal-aid network near a user.
 *
 * V1 mutual-aid is a *mass referral* — Auxilium queries Perplexity in
 * parallel for the closest contact in each of the established
 * help-networks within driving distance of the user, then renders a
 * packet the user can fire off as one email to all of them at once.
 * The premise the user named: "one mass 'help me' email to the people
 * who are SUPPOSED to help."
 *
 * Mocked today; the same Perplexity proxy lights this up live the
 * moment VITE_PERPLEXITY_PROXY_URL is set.
 */

import { runPerplexityQuery, type PerplexityCitation } from "./perplexity";

export type CharityKind =
  | "svdp" // Society of St. Vincent de Paul — parish conferences
  | "kofc" // Knights of Columbus — parish councils
  | "catholic-charities" // Catholic Charities — diocesan agencies
  | "lutheran" // Lutheran Social Services + ELCA / LCMS congregational aid
  | "cls" // Christian Legal Society — Christian Legal Aid clinic
  | "clinic" // CLINIC — Catholic Legal Immigration Network affiliates
  | "world-relief" // World Relief — evangelical immigration legal services
  | "administer-justice" // Administer Justice — Gospel Justice Centers
  | "salvation-army"; // Salvation Army — emergency assistance

export type CharityHit = {
  kind: CharityKind;
  /** Human-friendly label of this network. */
  network: string;
  /** Best-guess specific local org name from the Perplexity answer. */
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  /** Plain-English summary of how this org accepts referrals. */
  intake: string;
  /** Does this network typically run emergency-aid disbursement? */
  emergencyAid: boolean;
  /** Does this network typically offer legal services? */
  legalAid: boolean;
  citations: PerplexityCitation[];
  source: "mock" | "live";
  /** Raw Perplexity answer. */
  answer: string;
};

const NETWORK_LABEL: Record<CharityKind, string> = {
  svdp: "St. Vincent de Paul",
  kofc: "Knights of Columbus",
  "catholic-charities": "Catholic Charities",
  lutheran: "Lutheran Social Services",
  cls: "Christian Legal Aid (CLS)",
  clinic: "CLINIC (Catholic Legal Immigration Network)",
  "world-relief": "World Relief",
  "administer-justice": "Administer Justice — Gospel Justice Center",
  "salvation-army": "Salvation Army",
};

const PROMPTS: Record<CharityKind, (a: { city: string; state: string }) => string> = {
  svdp: (a) =>
    `Find the closest Society of St. Vincent de Paul (SVdP) parish conference to ${a.city}, ${a.state}. ` +
    `Provide the conference name, parish affiliation, intake phone, address, and whether it runs an emergency-aid program ($50–$500 typical). ` +
    `Cite the SVdP USA member directory and the diocesan SVdP council site. Information, not advice.`,
  kofc: (a) =>
    `Find the closest Knights of Columbus council to ${a.city}, ${a.state}. ` +
    `Provide council name and number, parish affiliation, Grand Knight contact, and any documented charitable program. ` +
    `Cite kofc.org/un/en/find-council and the state council website.`,
  "catholic-charities": (a) =>
    `Find the closest Catholic Charities diocesan agency serving ${a.city}, ${a.state}. ` +
    `Provide the agency name (which diocese), main phone, address, and the specific programs it runs for emergency financial aid, immigration legal services, and case management. ` +
    `Cite catholiccharitiesusa.org and the diocesan agency's website.`,
  lutheran: (a) =>
    `Find the closest Lutheran Social Services or Lutheran Family Services agency serving ${a.city}, ${a.state}. ` +
    `Provide the agency name, main phone, address, and programs for emergency aid, refugee resettlement, and immigration legal services (often as a Global Refuge / former LIRS affiliate). ` +
    `Also note whether nearby ELCA or LCMS congregations are known to operate congregational benevolence funds. ` +
    `Cite globalrefuge.org and lutheranservices.org as primary sources.`,
  cls: (a) =>
    `Find the closest Christian Legal Aid clinic (in the Christian Legal Society network) to ${a.city}, ${a.state}. ` +
    `Provide the clinic name, host parish or church, intake phone or webform, clinic schedule (most are monthly Saturday clinics), and the practice areas they handle (housing, family, expungement, estate planning, immigration). ` +
    `Cite the CLS clinic directory at christianlegalsociety.org/cla/clinic-directory.`,
  clinic: (a) =>
    `Find the closest CLINIC (Catholic Legal Immigration Network) affiliate serving ${a.city}, ${a.state}. ` +
    `Provide the affiliate name, intake phone, address, DOJ recognition status, and the immigration matters they handle. ` +
    `Cite cliniclegal.org/find-legal-help/affiliates/directory.`,
  "world-relief": (a) =>
    `Find the closest World Relief office serving ${a.city}, ${a.state}. ` +
    `Provide the office name, intake phone, address, and the Legal Support Network services it runs (immigration consultations, DOJ-accredited representation). ` +
    `Cite worldrelief.org/legal-support-network.`,
  "administer-justice": (a) =>
    `Find the closest Administer Justice "Gospel Justice Center" near ${a.city}, ${a.state}. ` +
    `Provide the host church name, clinic schedule (typically monthly Saturday), and the role-based volunteer structure (Justice Champion, Attorney, Intake Specialist, Community Advocate, Client Advocate). ` +
    `Cite administerjustice.org/gethelp.`,
  "salvation-army": (a) =>
    `Find the closest Salvation Army corps community center serving ${a.city}, ${a.state}. ` +
    `Provide the corps name, intake phone, address, and the emergency financial assistance / Pathway of Hope case-management program if available. ` +
    `Cite salvationarmyusa.org as primary source.`,
};

function parse(answer: string, citations: PerplexityCitation[], kind: CharityKind, source: "mock" | "live"): CharityHit {
  const phone = answer.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0];
  const email = answer.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/)?.[0];

  // Plain-English intake summary per kind (kept short for the packet).
  const intakeByKind: Record<CharityKind, string> = {
    svdp: "Most SVdP conferences screen by phone, then arrange a brief home visit before disbursing $50–$500 directly to vendors.",
    kofc: "Most KofC councils route requests through the Grand Knight or Faith-in-Action chair, who may convene the council to vote.",
    "catholic-charities": "Diocesan Catholic Charities agencies run intake by phone or web form and often coordinate multiple programs (immigration, family, emergency).",
    lutheran: "LSS / LFS agencies run intake by phone; many congregations also operate parish-level benevolence funds with same-week disbursement.",
    cls: "Most CLS clinics hold a monthly Saturday clinic; intake is typically by phone with a callback within 72 hours.",
    clinic: "CLINIC affiliates typically run intake by appointment, with DOJ-accredited representatives or attorneys.",
    "world-relief": "World Relief offices schedule immigration consultations by phone; DOJ-accredited representation is available at most sites.",
    "administer-justice": "Gospel Justice Centers hold a monthly Saturday clinic with brief consults; web intake available before the clinic date.",
    "salvation-army": "Salvation Army corps run walk-in or phone intake for emergency assistance; Pathway of Hope is the longer-term case-management program.",
  };

  return {
    kind,
    network: NETWORK_LABEL[kind],
    name: `${NETWORK_LABEL[kind]} (nearest)`,
    phone,
    email,
    intake: intakeByKind[kind],
    emergencyAid: ["svdp", "kofc", "catholic-charities", "lutheran", "salvation-army"].includes(kind),
    legalAid: ["cls", "clinic", "world-relief", "administer-justice", "catholic-charities", "lutheran"].includes(kind),
    citations,
    source,
    answer,
  };
}

/** Run ALL of them in parallel and return a Map<CharityKind, CharityHit>. */
export async function findAllCharitableHelp(args: {
  city: string;
  state: string;
  kinds?: CharityKind[];
}): Promise<Record<CharityKind, CharityHit>> {
  const kinds: CharityKind[] = args.kinds ?? (Object.keys(PROMPTS) as CharityKind[]);
  const entries = await Promise.all(
    kinds.map(async (k) => {
      const prompt = PROMPTS[k](args);
      const res = await runPerplexityQuery(prompt);
      return [k, parse(res.answer, res.citations, k, res.source)] as const;
    })
  );
  return Object.fromEntries(entries) as Record<CharityKind, CharityHit>;
}

// Legacy two-kind helper kept for callers that only want SVdP + KofC.
export async function findClosestCharities(args: {
  city: string;
  state: string;
}): Promise<{ svdp: CharityHit; kofc: CharityHit }> {
  const all = await findAllCharitableHelp({ ...args, kinds: ["svdp", "kofc"] });
  return { svdp: all.svdp, kofc: all.kofc };
}
