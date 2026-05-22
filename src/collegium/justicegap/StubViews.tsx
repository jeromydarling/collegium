import { Link } from "react-router-dom";
import {
  Mic,
  Newspaper,
  Compass,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { ModeSwitcher } from "./components/ModeSwitcher";

/**
 * Tonight's starter views for Stories, News, Solution. Each is real —
 * not empty placeholders — but the full feed-ingestion pipeline
 * (YouTube channels, RSS) the kickoff doc describes ships next.
 */

const STORY_LINKS = [
  {
    name: "Innocence Project — Exoneration Cases",
    url: "https://innocenceproject.org/cases/",
    blurb:
      "First-person accounts and case files from 250+ people exonerated by DNA evidence — and the wrongful convictions that put them in prison.",
  },
  {
    name: "National Registry of Exonerations",
    url: "https://www.law.umich.edu/special/exoneration/Pages/about.aspx",
    blurb:
      "The full catalogue: 3,600+ documented exonerations since 1989, by state, by cause, by the official misconduct that produced each.",
  },
  {
    name: "Marshall Project — Life Inside",
    url: "https://www.themarshallproject.org/tag/life-inside",
    blurb:
      "First-person essays from people in prison, on parole, on death row, and from defense attorneys, judges, and corrections officers.",
  },
  {
    name: "Equal Justice Initiative — Stories",
    url: "https://eji.org/stories/",
    blurb:
      "EJI's case work — Bryan Stevenson's organization — telling the story of who actually fills American prisons.",
  },
  {
    name: "Public Defender, the Podcast",
    url: "https://www.gideonsarmy.org/",
    blurb:
      "Public defenders talking, in their own words, about what 800 felonies a year actually means in the office and the courtroom.",
  },
  {
    name: "The Sentencing Project — Voices",
    url: "https://www.sentencingproject.org/research/",
    blurb:
      "First-person accounts of disproportionate sentencing, particularly youth and life-without-parole cases.",
  },
];

const NEWS_LINKS = [
  {
    name: "The Marshall Project",
    url: "https://www.themarshallproject.org/",
    blurb:
      "Nonprofit criminal-justice newsroom. Pulitzer winners. The closest thing to a beat reporter on Gideon and indigent defense.",
  },
  {
    name: "ProPublica — Criminal Justice",
    url: "https://www.propublica.org/topics/criminal-justice",
    blurb:
      "Investigative work on prosecutors, public defenders, prisons, sentencing, fines and fees.",
  },
  {
    name: "Vera Institute of Justice",
    url: "https://www.vera.org/news",
    blurb:
      "Research and reporting on incarceration, jails, immigration detention, and reentry.",
  },
  {
    name: "NACDL — National Association of Criminal Defense Lawyers",
    url: "https://www.nacdl.org/",
    blurb:
      "Defense-bar advocacy and research, including the Trial Penalty studies and Right to Counsel reports.",
  },
  {
    name: "Sixth Amendment Center",
    url: "https://sixthamendment.org/",
    blurb:
      "The closest thing to a watchdog of the Gideon promise. State-by-state evaluations of indigent defense systems.",
  },
  {
    name: "Prison Policy Initiative",
    url: "https://www.prisonpolicy.org/news/",
    blurb:
      "Data-first reporting on mass incarceration, pretrial detention, and the bail gap.",
  },
  {
    name: "The Appeal",
    url: "https://theappeal.org/",
    blurb:
      "Criminal-justice journalism focused on local prosecutor accountability.",
  },
  {
    name: "Bolts Magazine",
    url: "https://boltsmag.org/",
    blurb:
      "Reporting on the local elections — DAs, sheriffs, judges — that shape American criminal justice.",
  },
];

const SOLUTION_LINKS = [
  {
    name: "National Right to Counsel for Tenants Coalition",
    url: "https://civilrighttocounsel.org/major_developments/right-to-counsel-tenant",
    blurb:
      "Find or start a Right to Counsel campaign in your city. Tracker of which states and cities have already enacted one.",
  },
  {
    name: "Innocence Network — Find a Project",
    url: "https://innocencenetwork.org/innocence-network-members/",
    blurb:
      "70+ independent Innocence Project chapters in the U.S. + abroad. Many accept volunteer law students and case investigators.",
  },
  {
    name: "Legal Services Corporation — Find Legal Aid",
    url: "https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help",
    blurb:
      "Find the LSC-funded civil legal-aid program serving your state. Most accept pro bono attorneys, paralegals, and volunteers.",
  },
  {
    name: "Gideon's Promise",
    url: "https://gideonspromise.org/",
    blurb:
      "Trains and supports public defenders in the South — the region with the most under-funded indigent defense systems.",
  },
  {
    name: "National Coalition for a Civil Right to Counsel",
    url: "https://civilrighttocounsel.org/",
    blurb:
      "State-by-state advocacy for civil right to counsel. Active campaigns to join in 20+ states.",
  },
  {
    name: "Bail Project",
    url: "https://bailproject.org/",
    blurb:
      "Posts bail for people who can't afford it. The data on what happens when pretrial detention is removed.",
  },
  {
    name: "Christian Legal Society — Christian Legal Aid",
    url: "https://christianlegalsociety.org/cla/clinic-directory/",
    blurb:
      "65+ church-attached Christian legal aid clinics; most actively recruit volunteer attorneys and law students.",
  },
  {
    name: "CLINIC — Catholic Legal Immigration Network",
    url: "https://www.cliniclegal.org/get-involved",
    blurb:
      "420+ Catholic and faith-based immigration legal-services affiliates, many EOIR-accredited and recruiting volunteers.",
  },
  {
    name: "Administer Justice",
    url: "https://www.administerjustice.org/find-your-role/",
    blurb:
      "Trains church members in five roles for Gospel Justice Centers — attorney, advocate, intake specialist, justice champion, community connector.",
  },
  {
    name: "Equal Justice Initiative",
    url: "https://eji.org/get-involved/",
    blurb:
      "Bryan Stevenson's organization. Volunteer, intern, attend the Legacy Museum.",
  },
];

export function StoriesView() {
  return (
    <ViewShell
      icon={Mic}
      eyebrow="Voices from the gap"
      title="Who actually walks through these courtrooms."
      intro={
        "Every public-defender caseload is a person who answered the door. " +
        "Every exoneration is a family who waited. These are the curated " +
        "sources to read and watch — first-person accounts from people who " +
        "spent years in the gap, and from the lawyers who tried to stand in it with them."
      }
    >
      {STORY_LINKS.map((s) => (
        <Card key={s.url} item={s} />
      ))}
    </ViewShell>
  );
}

export function NewsView() {
  return (
    <ViewShell
      icon={Newspaper}
      eyebrow="The press that covers this"
      title="Independent journalism on the Gideon gap."
      intro={
        "Cable-news crime coverage is not journalism on the criminal-legal " +
        "system. These outlets are. None of them are perfect; all of them " +
        "are reporting on the gap with seriousness and time. The next build " +
        "wires this view into a live RSS feed; tonight, the curated list."
      }
    >
      {NEWS_LINKS.map((n) => (
        <Card key={n.url} item={n} />
      ))}
    </ViewShell>
  );
}

export function SolutionView() {
  return (
    <ViewShell
      icon={Compass}
      eyebrow="Where to put your hands"
      title="The work is already being done. Find one. Join."
      intro={
        "Reading about a crisis is not the same as moving toward it. " +
        "Below is the short list of organizations actively closing the " +
        "Gideon gap and the civil-justice gap. Most of them need lawyers, " +
        "law students, paralegals, and ordinary volunteers. Some of them " +
        "need ten dollars a month. None of them need another op-ed."
      }
    >
      {SOLUTION_LINKS.map((s) => (
        <Card key={s.url} item={s} />
      ))}
    </ViewShell>
  );
}

function ViewShell({
  icon: Icon,
  eyebrow,
  title,
  intro,
  children,
}: {
  icon: typeof Mic;
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[hsl(220_30%_8%)] text-[hsl(40_35%_92%)] min-h-screen">
      <ModeSwitcher />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex items-center gap-2 text-[hsl(38_60%_70%)] text-[10px] uppercase tracking-widest mb-3">
          <Icon size={13} />
          {eyebrow}
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl md:text-5xl text-[hsl(40_40%_94%)] mb-5 leading-tight">
          {title}
        </h1>
        <p className="text-base sm:text-lg text-[hsl(40_30%_82%)] leading-relaxed mb-10 sm:mb-12">
          {intro}
        </p>
        <ul className="space-y-3 sm:space-y-4">{children}</ul>

        <div className="mt-12 sm:mt-14 pt-8 border-t border-[hsl(220_20%_22%)] text-center">
          <Link
            to="/justicegap/map"
            className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(38_60%_70%)] hover:text-[hsl(38_60%_85%)]"
          >
            See the map <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Card({ item }: { item: { name: string; url: string; blurb: string } }) {
  return (
    <li>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-[hsl(220_30%_12%)] border border-[hsl(220_20%_22%)] rounded-lg p-5 hover:border-[hsl(38_60%_60%)] transition-colors group"
      >
        <div className="flex items-start gap-3">
          <ExternalLink
            size={14}
            className="text-[hsl(38_60%_70%)] mt-1 shrink-0"
          />
          <div>
            <h3 className="collegium-display text-lg text-[hsl(40_40%_94%)] mb-1 leading-tight group-hover:text-[hsl(38_60%_85%)]">
              {item.name}
            </h3>
            <p className="text-sm text-[hsl(40_30%_82%)] leading-relaxed">
              {item.blurb}
            </p>
          </div>
        </div>
      </a>
    </li>
  );
}
