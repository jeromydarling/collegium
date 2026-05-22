import { Link } from "react-router-dom";
import { Map, FileText, Mic, Newspaper, Compass, ArrowRight } from "lucide-react";

/**
 * Justice Gap — landing chooser.
 *
 * Following the fostercrisis pattern: epigraph + 5 cards. Each card
 * has eyebrow, title, sub-paragraph, CTA. Grid responds 5 → 3 → 2 → 1.
 *
 * Tone: polemic. The gap is not a policy failure. It is a moral choice
 * we keep making.
 */
export function JusticeGapLanding() {
  const cards = [
    {
      to: "/justicegap/map",
      eyebrow: "Seventeen chapters",
      title: "The map",
      icon: Map,
      body:
        "Public-defender caseloads. Indigent-defense spending per resident. Incarceration rate. Civil legal aid deserts. Wrongful convictions. The plea bargain. The bail gap. Each state, colored by what it actually does.",
      cta: "Open the map",
    },
    {
      to: "/justicegap/essay",
      eyebrow: "The argument",
      title: "The essay",
      icon: FileText,
      body:
        "Gideon v. Wainwright was 1963. Sixty years on, the constitutional promise of counsel is funded as charity, delivered as triage, and met with a system that runs on 30-second pleas. The case for what we owe each other.",
      cta: "Read the essay",
    },
    {
      to: "/justicegap/stories",
      eyebrow: "Human voices",
      title: "The stories",
      icon: Mic,
      body:
        "Exoneree testimony. Public-defender first-person accounts. The Innocence Project case files. The people who lost years to the gap, in their own words.",
      cta: "Hear the stories",
    },
    {
      to: "/justicegap/news",
      eyebrow: "Independent press",
      title: "The news",
      icon: Newspaper,
      body:
        "The Marshall Project. ProPublica's criminal-justice desk. Vera Institute. NACDL. A curated feed of the journalism that actually covers the gap, without the cop-show framing.",
      cta: "Read the news",
    },
    {
      to: "/justicegap/solution",
      eyebrow: "What to do",
      title: "The solution",
      icon: Compass,
      body:
        "State-by-state directory of the organizations already doing the work — public-defender offices that take volunteers, civil legal aid clinics, Innocence Project chapters, pro bono coordinators. Find one. Join.",
      cta: "Find the work",
    },
  ];

  return (
    <div className="bg-[hsl(220_30%_8%)] text-[hsl(40_35%_92%)] min-h-screen flex flex-col">
      <header className="border-b border-[hsl(220_20%_18%)] bg-[hsl(220_30%_6%)] collegium-safe-top">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="text-[10px] uppercase tracking-widest text-[hsl(40_20%_60%)] hover:text-[hsl(38_60%_70%)]"
          >
            ← Collegium
          </Link>
          <div className="collegium-latin text-sm text-[hsl(38_60%_70%)]">
            Iustitia rapta
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-10 sm:pb-14 text-center">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[hsl(38_60%_70%)] mb-4">
            Justice Gap
          </p>
          <h1 className="collegium-display-xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[hsl(40_40%_94%)] leading-[1.05] mb-6 sm:mb-8">
            The promise was made in <span className="collegium-mark">1963.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[hsl(40_30%_85%)] leading-relaxed max-w-3xl mx-auto mb-6">
            In <em>Gideon v. Wainwright</em>, the Supreme Court held that no
            American facing serious criminal charges shall stand trial
            without a lawyer. Every state agreed. Almost none of them paid
            for it.
          </p>
          <p className="text-base sm:text-lg text-[hsl(40_30%_85%)] leading-relaxed max-w-2xl mx-auto italic mb-8 sm:mb-10">
            The gap between the constitutional promise and the lived
            experience of an indigent defendant is not a policy failure.
            It is a moral choice we keep making.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-[hsl(38_60%_70%)]">
            <span className="block h-px w-12 bg-[hsl(38_60%_60%/0.4)]" />
            Choose your view
            <span className="block h-px w-12 bg-[hsl(38_60%_60%/0.4)]" />
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
          <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="group bg-[hsl(220_30%_12%)] border border-[hsl(220_20%_22%)] rounded-xl p-5 sm:p-6 hover:border-[hsl(38_60%_60%)] transition-colors flex flex-col"
              >
                <div className="flex items-center gap-2 text-[hsl(38_60%_70%)] text-[10px] uppercase tracking-widest mb-3">
                  <c.icon size={12} />
                  {c.eyebrow}
                </div>
                <h2 className="collegium-display text-2xl text-[hsl(40_40%_94%)] mb-3 leading-tight">
                  {c.title}
                </h2>
                <p className="text-sm text-[hsl(40_30%_82%)] leading-relaxed mb-5 flex-1">
                  {c.body}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(38_60%_70%)] group-hover:text-[hsl(38_60%_85%)]">
                  {c.cta} <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-[hsl(220_30%_6%)] border-t border-[hsl(220_20%_18%)] py-10 sm:py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-[hsl(40_20%_75%)] italic text-base sm:text-lg leading-relaxed mb-2"
               style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              "Let justice roll down as waters,<br />
              and righteousness as a mighty stream."
            </p>
            <p className="text-xs text-[hsl(40_20%_55%)]">Amos 5:24</p>
          </div>
        </section>
      </main>
    </div>
  );
}
