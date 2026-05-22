import { Link } from "react-router-dom";
import { ChevronLeft, MapPin, Phone, ExternalLink } from "lucide-react";
import { chapters } from "../data/demo";
import { useJurisdiction } from "./components/JurisdictionPicker";

/**
 * Find Help — surfaces Collegium-network chapters that serve as legal-aid
 * sites in or near the user's jurisdiction, plus national directories.
 *
 * The network is small today (5 demo chapters) so this page is largely
 * directory-as-backstop. As real chapters onboard, this becomes the
 * primary referral surface — and the place where Auxilium hands the
 * client off to a human.
 */
export function FindHelp() {
  const { jurisdiction } = useJurisdiction();
  const state = jurisdiction.state;

  const networkLocal = state
    ? chapters.filter(
        (c) =>
          c.state === abbreviationOf(state) ||
          c.state === state ||
          c.city.toLowerCase().includes(jurisdiction.city.toLowerCase())
      )
    : [];

  return (
    <div className="collegium-theme bg-[hsl(var(--c-cream))] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 collegium-safe-bottom">
        <Link
          to="/auxilium"
          className="text-xs collegium-link mb-6 inline-flex items-center gap-1"
        >
          <ChevronLeft size={12} /> Back
        </Link>

        <h1 className="collegium-display text-3xl sm:text-4xl mb-3 leading-tight">
          Find help near you
        </h1>
        <p className="text-[hsl(var(--c-slate))] leading-relaxed mb-8 sm:mb-10">
          Bring everything you gathered — the documents, the questions, your
          consult packet. The clinics below give free or low-cost help to
          people who qualify. None of them require a referral.
        </p>

        {networkLocal.length > 0 && (
          <section className="mb-10">
            <h2 className="collegium-display text-xl mb-3">
              From the Collegium network
            </h2>
            <div className="space-y-3">
              {networkLocal.map((c) => (
                <article
                  key={c.id}
                  className="collegium-card p-4 sm:p-5"
                >
                  <h3 className="collegium-display text-lg leading-tight mb-1">
                    {c.name}
                  </h3>
                  <div className="text-xs text-[hsl(var(--c-slate-soft))] inline-flex items-center gap-1 mb-3">
                    <MapPin size={11} />
                    {c.city}, {c.state}
                  </div>
                  <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-3">
                    {c.blurb}
                  </p>
                  <Link
                    to={`/app/chapters/${c.slug}`}
                    className="text-xs collegium-link"
                  >
                    More about this chapter →
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="collegium-display text-xl mb-3">
            National directories
          </h2>
          <p className="text-sm text-[hsl(var(--c-slate-soft))] mb-5">
            These directories include legal-aid orgs across the country —
            faith-based and otherwise — with intake phone numbers and
            eligibility info.
          </p>
          <ul className="space-y-3">
            <Directory
              name="LSC — Legal Services Corporation"
              note="Find your local LSC-funded legal-aid program by zip code."
              url="https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help"
            />
            <Directory
              name="LawHelp.org"
              note="State-by-state directory of free legal help for low-income people."
              url="https://www.lawhelp.org/"
            />
            <Directory
              name="ABA Free Legal Answers"
              note="Ask a question online and get an answer from a volunteer attorney in your state."
              url="https://www.americanbar.org/groups/legal_services/flh-home/"
            />
            <Directory
              name="Christian Legal Aid Clinic Directory"
              note="65+ church-attached Christian legal aid clinics across the U.S. (CLS)."
              url="https://christianlegalsociety.org/cla/clinic-directory/"
            />
            <Directory
              name="CLINIC Affiliate Directory"
              note="420+ Catholic and faith-based immigration legal services nonprofits."
              url="https://www.cliniclegal.org/find-legal-help/affiliates/directory"
            />
            <Directory
              name="National Right to Counsel for Tenants"
              note="Tracks which cities and states guarantee free counsel in eviction cases."
              url="https://civilrighttocounsel.org/major_developments/right-to-counsel-tenant"
            />
          </ul>
        </section>
      </div>
    </div>
  );
}

function Directory({
  name,
  note,
  url,
}: {
  name: string;
  note: string;
  url: string;
}) {
  return (
    <li>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="collegium-card p-4 hover:shadow-md transition-shadow flex items-start gap-3 group"
      >
        <ExternalLink
          size={14}
          className="text-[hsl(var(--c-wine))] shrink-0 mt-1"
        />
        <div>
          <div className="font-medium text-[hsl(var(--c-ink))] leading-snug">
            {name}
          </div>
          <div className="text-xs text-[hsl(var(--c-slate-soft))] mt-0.5">
            {note}
          </div>
        </div>
      </a>
    </li>
  );
}

/** Loose US-state-name-to-abbreviation helper. */
function abbreviationOf(name: string): string {
  const map: Record<string, string> = {
    Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR",
    California: "CA", Colorado: "CO", Connecticut: "CT", Delaware: "DE",
    "District of Columbia": "DC", Florida: "FL", Georgia: "GA", Hawaii: "HI",
    Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS",
    Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD",
    Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS",
    Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV",
    "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM",
    "New York": "NY", "North Carolina": "NC", "North Dakota": "ND",
    Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA",
    "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD",
    Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT", Virginia: "VA",
    Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
  };
  return map[name] ?? name;
}
